import { escapeHTMLText } from "../base";
import { TableCellCoordinate, TableData } from "./tableData";

function getPreviewHTML(_o) {
    if ((_o === undefined) && (_o === null)) {
        return "";
    }
    let fn = Object(_o).toHTML;
    return ((typeof fn === "function") ? fn.call(_o) : escapeHTMLText(_o));
}

const SYM_ITERATOR = Symbol("action.result.iterator");

export function ActionResult(_rawData) {
    if (_rawData instanceof ActionResult) {
        return _rawData;
    }
    if (!(this instanceof ActionResult)) {
        return new ActionResult(...Array.from(arguments));
    }
    let iterateValue = undefined;
    let iterateIndex = -1;
    Object.defineProperties(this, (_rawData instanceof Iterator ? {
        rawData: {
            get() {
                return iterateValue;
            }
        },
        iterateIndex: {
            get() {
                return iterateIndex;
            },
            enumerable: true
        },
        iterateNext: {
            value: function () {
                let ret = _rawData.next.apply(_rawData, Array.from(arguments));
                if (ret.done) {
                    Object.defineProperties(this, { 
                        iterateDone: {
                            value: true
                        }
                    });
                } else {
                    iterateIndex++;
                    iterateValue = ret.value;
                }
            }
        },
        iterateTerminate: {
            value: function () {
                _rawData.return.apply(_rawData, Array.from(arguments));
            }
        }
    } : {
        rawData: {
            value: _rawData
        }
    }));
    Object.defineProperties(this, {
        rawType: {
            get () {
                return (_rawData instanceof Iterator) ? "Iterator" : (Object(this.rawData).constructor?.name || "unknown");
            }
        },
        hasPreview: {
            get() {
                return typeof _rawData?.preview === "function";
            }
        },
        previewHTML: {
            get() {
                let data = this.rawData;
                if ((data === undefined) && (data === null)) {
                    return "";
                }
                let fn = Object(data).toHTML;
                return ((typeof fn === "function") ? fn.call(data) : escapeHTMLText(this.toString()));
            }
        }
    });
}

ActionResult.prototype.toString = function () {
    if (this.rawData instanceof Array) {
        return ("[" + String(this.rawData) + "]");
    } else if (this.rawData?.toString === Object.prototype.toString) {
        return ("{" + String(Object.keys(this.rawData)) + "}");
    } else {
        return String(this.rawData);
    }
}

ActionResult.prototype.copy = function () {
    let copyFn = this.rawData?.copyToClipboard;
    (typeof copyFn === "function") ? copyFn.call(this.rawData) : navigator.clipboard.write([
        new ClipboardItem({
            "text/plain": new Blob([String(this.rawData||((this.rawData === 0) ? 0 : ""))], {type:"text/plain"})
        })
    ]);
}

ActionResult.prototype.preview = function (_title) {
    this.rawData?.preview?.call(this.rawData, _title);
}

const SYM_ERR_TYPE_CONVERT = Symbol("err.type.convert");

const typeMap = {
    any: {
        checker() {
            return true;
        }
    },
    text: {
        checker(_val) {
            return typeof _val === "string";
        },
        convert(_val) {
            return (_val === undefined || _val === null) ? "" : String(_val);
        }
    },
    number: {
        checker(_val) {
            return typeof _val === "number";
        },
        convert(_val) {
            let ret = Number(_val);
            if (isNaN(ret)) {
                throw SYM_ERR_TYPE_CONVERT;
            }
            return ret;
        }
    },
    boolean: {
        checker(_val) {
            return typeof _val === "boolean";
        },
        convert(_val) {
            if (typeof _val === "number") {
                return !!_val;
            } else if (typeof _val === "string") {
                _val = _val.toLowerCase();
                if (_val === "true") {
                    return true;
                } else if (_val === "false") {
                    return false;
                } else {
                    throw SYM_ERR_TYPE_CONVERT;
                }
            } else {
                throw SYM_ERR_TYPE_CONVERT;
            }
        }
    },
    object: {
        checker(_val) {
            return (typeof _val === "object") && !(_val instanceof Array);
        },
        convert(_val) {
            if (typeof _val === "string") {
                try {
                    return JSON.parse(_val);
                } catch {
                    throw SYM_ERR_TYPE_CONVERT;
                }
            } else {
                throw SYM_ERR_TYPE_CONVERT;
            }
        }
    },
    Table: {
        checker(_val) {
            return _val instanceof TableData;
        }
    }
};

typeMap.Any = typeMap.any;
typeMap["*"] = typeMap.any;
typeMap.Text = typeMap.text;
typeMap.string = typeMap.text;
typeMap.String = typeMap.text;
typeMap.Boolean = typeMap.boolean;
typeMap.Number = typeMap.number;
typeMap.Object = typeMap.object;

const DefaultSignatureType = ["any"];

ActionResult.prototype.getFixedData = function (_dataSignature) {
    let rawData = this.rawData;
    if (!_dataSignature) {
        return rawData;
    }
    let fixedType;
    (_dataSignature.type||DefaultSignatureType).find(type => {
        let typeItem = typeMap[type];
        let ret = ((Object(rawData).constructor?.name === type) || typeItem?.checker?.call(typeItem, rawData));
        if ((!ret) && (rawData !== undefined) && (rawData !== null)) {
            type = String(type);
            ret = Object(rawData)["to" + type[0].toUpperCase() + type.substring(1)];
            if (ret && (typeof ret !== "function")) {
                ret = false;
            }
        }
        fixedType = ret;
        return !!ret;
    });
    if (typeof fixedType === "function") {
        return fixedType.call(rawData);
    }
    if (fixedType) {
        return rawData;
    }
    let convertFn = _dataSignature.type?.at(0)?.convert;
    if (typeof convertFn !== "function") {
        throw SYM_ERR_TYPE_CONVERT;
    }
    return convertFn(rawData);
}

Array.prototype.toTableCellCoordinate = function() {
    return new TableCellCoordinate(this[0]||0, this[1]||0);
}

Array.prototype.toTableData = function() {
    return new TableData(this);
}