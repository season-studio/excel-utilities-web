import * as React from "react";
import * as ReactDOM from "react-dom";
import actionCollection from "../functions/actionCollection";
import confirm from "../../thirdpart/toolkits/src/tip/confirm";
import tip from "../../thirdpart/toolkits/src/tip/tip";
import dialog from "../../thirdpart/toolkits/src/tip/dialog";
import styles from "./functionEditor.module.css";
import { ActionResult } from "../functions/dataTypes/actionResult";
import { ActionSelectionDialog } from "./actionSelectionDialog";
import input from "../../thirdpart/toolkits/src/tip/input";

function normalizeArgumentDisplay(_oriValue, _signature, _matchDisplay, _convertBool) {
    _oriValue = ("value" in Object(_oriValue) ? _oriValue.value : "");
    let serializeFn = _oriValue?.serializeFn;
    let oriValueJSON = ((typeof serializeFn === "function") ? serializeFn.call(_oriValue) : JSON.stringify(_oriValue));
    if (_matchDisplay) {
        let displayAlternate = Object(_signature.options?.displayAlternate);
        if (oriValueJSON in displayAlternate) {
            _oriValue = displayAlternate[oriValueJSON];
        } else if (_oriValue in displayAlternate) {
            _oriValue = displayAlternate[_oriValue];
        } else {
            _matchDisplay = false;
        }
    }
    if ((!_matchDisplay) && _signature.options?.alternate) {
        let matched = Object.entries(_signature.options.alternate).find(e => JSON.stringify(e[1]) === oriValueJSON);
        if (matched) {
            _oriValue = matched[0];
        }
    }
    ((typeof _oriValue === "boolean") && _convertBool) && (_oriValue = _oriValue ? "是" : "否");
    return (typeof _oriValue === "object") ? oriValueJSON : _oriValue;
}

export const typeNames = {
    "boolean": "布尔值",
    "number": "数值",
    "text": "文本",
    "string": "文本",
    "array": "数组",
    "object": "复合数据",
    "any": "任意类型",
    "*": "任意类型",
    "table": "表格",
    "tabledata": "表格",
    "tablecellcoordinate": "单元格坐标"
};

class FuncArgUserInput extends React.Component {

    static input(_oriValue, _signature) {
        let dlgNode = document.createElement("div");
        dlgNode.setAttribute("class", styles.editPopupDialog);
        return dialog(dlgNode, {
            onInitialize(_dlg) {
                ReactDOM.render(
                    <FuncArgUserInput dialog={_dlg} oriValue={_oriValue} signature={_signature} />, 
                    dlgNode
                );
            },
            onclose() {
                ReactDOM.unmountComponentAtNode(dlgNode);
            }
        });
    }

    static CancelSymbol = Symbol();

    constructor(_props) {
        super(_props);
    }

    componentDidMount() {
        let parentNode = ReactDOM.findDOMNode(this)?.parentElement;
        if (parentNode) {
            let inputNode = parentNode.querySelector("[d-input-el]");
            if (inputNode) {
                let oriValue = normalizeArgumentDisplay(this.props.oriValue, this.props.signature);
                ("defaultValue" in inputNode) ? (inputNode.defaultValue = oriValue) : (inputNode.value = oriValue);
                (inputNode instanceof HTMLInputElement) && setImmediate(() => {
                    inputNode.select();
                    inputNode.focus();
                });
            }
            let helpDiv = parentNode.querySelector(".help-button");
            if (helpDiv) {
                let desc = String(this.props.signature.description||"");
                let extDecIndex = desc.indexOf("\r");
                desc = (extDecIndex > 0) ? desc.substring(extDecIndex + 1).trim() : "";
                let type = this.props.signature.type;
                if (type?.length > 0) {
                    type = `数据类型为：\n${type.map(e => typeNames[String(e).toLowerCase()]||e).join(", ")}`;
                } else {
                    type = "接受任意数据类型";
                }
                helpDiv.setAttribute("d-help-text", (type + "\r\n" + desc).trim());
            }
        }
    }

    async normalizeResult() {
        let parentNode = ReactDOM.findDOMNode(this)?.parentElement;
        if (parentNode) {
            let inputNode = parentNode.querySelector("[d-input-el]");
            if (inputNode) {
                let value = inputNode.value;
                let signature = this.props.signature;
                if (value in Object(signature.options?.alternate)) {
                    return signature.options.alternate[value];
                } else {
                    let worker;
                    let scriptURL;
                    try {
                        let script = new Blob([`try { if (\`${value}\` in this) { throw null; } } catch(e) { if(!e) throw e; }\nthis.postMessage(${value});`]);
                        scriptURL = URL.createObjectURL(script);
                        value = await new Promise(r => {
                            try {
                                worker = new Worker(scriptURL);
                                worker.addEventListener("message", e => r(e ? e.data : value));
                                worker.addEventListener("error", e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    r(value);
                                });
                            } catch (err) {
                                console.error(err);
                                r(value);
                            }
                        });
                        return new ActionResult(value).getFixedData(signature);
                    } finally {
                        worker?.terminate && worker.terminate();
                        scriptURL && URL.revokeObjectURL(scriptURL);
                    }
                }
            }
        }
    }

    async onSubmit() {
        try {
            this.props.dialog.close(await this.normalizeResult());
        } catch(err) {
            console.error(err);
            tip("无法格式化数据，请确认输入的数据是否满足参数类型要求！", {type:"error", timeout:1700});
            //this.props.dialog.close(FuncArgUserInput.CancelSymbol)
        }
    }

    onInputKeyDown(_event) {
        let key = String(_event?.key).toLowerCase();
        if (key === "enter") {
            this.onSubmit();
        } else if (key === "escape") {
            this.props.dialog.close(FuncArgUserInput.CancelSymbol)
        }
    }

    render() {
        let signature = this.props.signature;
        let tmpId = "TID" + Math.random().toString(36) + Date.now();
        return <>
            <div className="help-button">?</div>
            <p style={{margin:"0.25em 0"}}>{String(signature.description).split(/[\r\n]/ig)[0]}</p>
            {signature.options?.alternate
                ? (signature.options.editable
                    ? <>
                        <input list={tmpId} d-input-el="1" onKeyDown={(e) => this.onInputKeyDown(e)} ></input>
                        <datalist id={tmpId}>
                            {Object.entries(signature.options.alternate).map((e, idx) => <option value={e[0]} key={idx}>{e[0]}</option>)}
                        </datalist>
                    </>
                    : <select d-input-el="1">
                        {Object.entries(signature.options.alternate).map((e, idx) => <option value={e[0]} key={idx}>{e[0]}</option>)}
                    </select>)
                : (((signature.type?.length === 1) && (String(signature.type[0]).toLowerCase() === "boolean"))
                    ? <select d-input-el="1"><option value="true">是</option><option value="false">否</option></select>
                    : <input d-input-el="1" onKeyDown={(e) => this.onInputKeyDown(e)}></input>)
            }
            <div className="buttons-bar">
                <button onClick={() => this.onSubmit()}>确定</button>
                <button d-type="optional" onClick={() => this.props.dialog.close(FuncArgUserInput.CancelSymbol)}>取消</button>
            </div>
        </>
    }
}

class FuncArgItem extends React.Component {
    constructor(_props) {
        super(_props);

        this.state = {};
        this.killArgFocusHandler = () => {
            this.setState({
                focus: false
            });
        };
    }

    componentWillUnmount() {
        this.props.editorHost?.removeEventListener("kill-select-arg-focus", this.killArgFocusHandler);
    }

    onSelectArg() {
        this.props.editorHost?.dispatchEvent(new CustomEvent("kill-select-arg-focus"));
        this.setState({
            focus: true
        });
        this.props.editorHost?.addEventListener("kill-select-arg-focus", this.killArgFocusHandler, { once:true });

        let passArgs = this.props.args;
        let index = this.props.index;
        if (index < passArgs.length) {
            let arg = Object(passArgs[index]);
            let rID = (arg.refResult?.stepID || arg.refLoopIndex?.stepID);
            this.props.editorHost?.dispatchEvent(new CustomEvent("set-reference-steps", {
                detail: {
                    referenceIDs: (rID ? [rID] : undefined),
                    focus: true
                }
            }));
        }
    }

    async onReferenceStepData(_event) {
        _event.preventDefault();
        _event.stopPropagation();
        if (this.editLocked) {
            return ;
        }
        this.editLocked = true;
        let tipBox;
        try {
            const tipBoxExitCode = Symbol();
            let tipBoxPromise = new Promise(r => {
                tipBox = tip("请选择引用的步骤……", {
                    timeout: 0, 
                    type:"info", 
                    closable: true, 
                    onclose: () => r(tipBoxExitCode)
                });
            });
            do {
                this.props.editorHost?.dispatchEvent(new CustomEvent("select-step-for-reference-data"));
                let rStep = await Promise.race([new Promise(r => {
                    if (this.props.editorHost) {
                        this.props.editorHost.addEventListener("reference-step-selected", (e) => r(e?.detail), {once:true});
                    }
                }), tipBoxPromise]);
                if (rStep === tipBoxExitCode) {
                    tip("未做实际引用", {type:"info", timeout:1700});
                    break;
                }
                let action = rStep?.action;
                (typeof action !== "function") && (action = actionCollection[action]);
                if (typeof action === "function") {
                    let signature = action.getActionSignature();
                    if (signature?.returnType?.length > 0) {
                        let type = 0;
                        if (signature.isIterator) {
                            type = await confirm("引用的步骤是个循环。\n请问您想引用循环的值，还是引用循环的计数？", {icon:"question", buttons:["循环值", "循环计数", "取消"], buttonAlign:"center"});
                        }
                        type = ["refResult", "refLoopIndex"][type];
                        if (type) {
                            this.props.args[this.props.index] = {
                                [type]: {stepID: rStep.id}
                            };
                            this.props.onUpdate(rStep.id);
                        }
                        break;
                    }
                }
                tip("选中的步骤没有可引用的数据，请重新选择", {type:"warn", timeout:1700});
            } while(true);
        } finally {
            this.editLocked = false;
            tipBox?.close();
        }
    }

    async onUserInputArg(_event) {
        _event.preventDefault();
        _event.stopPropagation();
        if (this.editLocked) {
            return ;
        }
        this.editLocked = true;
        try {
            let value = await FuncArgUserInput.input(this.props.args[this.props.index], this.props.signature);
            if (value !== FuncArgUserInput.CancelSymbol) {
                this.props.args[this.props.index] = { value };
                this.props.onUpdate();
            }
        } finally {
            this.editLocked = false;
        }
    }

    onSetAsOptional(_event) {
        _event.preventDefault();
        _event.stopPropagation();
        if (this.props.signature?.optional) {
            this.props.args.splice(this.props.index);
            this.props.onUpdate();
        }
    }

    onDeleteVariable(_event) {
        _event.preventDefault();
        _event.stopPropagation();
        if (this.props.signature?.variable) {
            this.props.editorHost?.dispatchEvent(new CustomEvent("kill-select-arg-focus"));
            this.props.args.splice(this.props.index, 1);
            this.props.onUpdate();
        }
    }

    onAddVariable(_event) {
        _event.preventDefault();
        _event.stopPropagation();
        if (this.props.signature?.variable && (this.props.args.length > this.props.index)) {
            this.props.args.splice(this.props.index + 1, 0, undefined);
            this.props.onUpdate();
        }
    }

    onJumpToReferenceStep(_event) {
        _event.preventDefault();
        _event.stopPropagation();
        let arg = this.props.args[this.props.index];
        let rID = (arg && (arg.refResult?.stepID || arg.refLoopIndex?.stepID));
        rID && this.props.editorHost?.dispatchEvent(new CustomEvent("jumpto-reference-step", { detail: rID }));
    }

    queryReferenceStepInfo(_rID) {
        let event = new CustomEvent("query-step-info", { detail: { id: _rID } });
        this.props.editorHost?.dispatchEvent(event);
        return event.detail.info;
    }

    renderText(_text) {
        return String(_text||"").split("\n").map((e, idx) => <React.Fragment key={idx}>
            {idx > 0 ? <br /> : undefined}
            {e.trim()}
        </React.Fragment>);
    }

    renderEditButtons() {
        if (this.state.focus) {
            let arg = this.props.args[this.props.index];
            return <>
                <code className="arg-btn" d-tooltip="手工填写数据" onClick={(e) => this.onUserInputArg(e)}>
                    <svg viewBox="0 0 64 64" width="0.7em" height="0.7em" xmlns="http://www.w3.org/2000/svg">
                        <path d="m 11.66,51.19 c 0.16,0 0.32,0 0.48,0 l 13.45,-2.34 c 0.16,0 0.31,-0.13 0.42,-0.27 L 59.93,14.69 a 0.7969,0.7969 0 0 0 0,-1.12 L 46.64,0.232 C 46.48,0.08 46.29,0 46.06,0 45.84,0 45.67,0.08 45.51,0.232 L 11.59,34.16 c -0.14,0.11 -0.2,0.25 -0.23,0.4 L 9.006,48.03 a 2.68,2.68 0 0 0 0.743,2.38 c 0.541,0.5 1.201,0.78 1.911,0.78 z M 17.04,37.25 46.06,8.24 51.93,14.1 22.91,43.12 15.79,44.39 Z m 44.4,20.66 H 2.56 C 1.144,57.91 0,59.06 0,60.47 v 2.91 C 0,63.73 0.288,64 0.64,64 H 63.38 C 63.73,64 64,63.73 64,63.38 v -2.91 c 0,-1.41 -1.17,-2.56 -2.56,-2.56 z" />
                    </svg>
                </code>
                <code className="arg-btn" d-tooltip="从前序的步骤引用数据" onClick={(e) => this.onReferenceStepData(e)}>
                    <svg viewBox="0 0 64 64" width="0.7em" height="0.7em" xmlns="http://www.w3.org/2000/svg">
                        <path d="m 37.18,44.79 a 0.6692,0.6692 0 0 0 -0.95,0 l -9.68,9.69 c -4.48,4.48 -12.05,4.96 -17.008,0 -4.954,-4.96 -4.479,-12.52 0,-17 l 9.688,-9.69 c 0.26,-0.26 0.26,-0.68 0,-0.95 l -3.31,-3.31 a 0.6692,0.6692 0 0 0 -0.95,0 l -9.682,9.69 c -7.051,7.05 -7.051,18.45 0,25.49 7.052,7.04 18.462,7.06 25.502,0 l 9.69,-9.68 c 0.25,-0.26 0.25,-0.69 0,-0.95 z M 58.72,5.288 c -7.05,-7.051 -18.45,-7.051 -25.49,0 l -9.7,9.692 a 0.6692,0.6692 0 0 0 0,0.94 l 3.31,3.31 c 0.26,0.25 0.69,0.25 0.94,0 l 9.69,-9.688 c 4.47,-4.488 12.04,-4.963 16.99,0 4.96,4.958 4.48,12.518 0,16.998 l -9.68,9.69 a 0.6692,0.6692 0 0 0 0,0.94 l 3.31,3.31 c 0.26,0.25 0.69,0.25 0.94,0 l 9.69,-9.68 c 7.04,-7.05 7.04,-18.46 0,-25.512 z M 40.18,20.37 a 0.6692,0.6692 0 0 0 -0.94,0 L 20.37,39.23 a 0.6692,0.6692 0 0 0 0,0.95 l 3.3,3.3 c 0.26,0.25 0.68,0.25 0.94,0 L 43.47,24.61 c 0.26,-0.27 0.26,-0.68 0,-0.94 z" />
                    </svg>
                </code>
                {(this.props.signature.variable && (this.props.index < this.props.args.length)) ? <>
                    <code className="arg-btn" d-tooltip="删除当前的可变参数" onClick={(e) => this.onDeleteVariable(e)}>
                        <svg viewBox="0 0 64 64" width="0.7em" height="0.7em" xmlns="http://www.w3.org/2000/svg">
                            <path d="m 58.65,9.973e-4 c 0,0 0,0 0,0.0093 l 5.34,5.3407 c 0,0 0,0 0,0 0,0 0,0.01 0,0.01 L 37.36,32 63.99,58.63 c 0,0 0,0 0,0 0,0 0,0 0,0 l -5.34,5.34 c 0,0 0,0 0,0 0,0 0,0 0,0 L 32,37.36 5.37,63.99 c 0,0 -0.01,0 -0.01,0 0,0 0,0 0,0 L 0.0066,58.65 c -0.0038,0 -0.0047,0 -0.0056,0 0,0 0.0018,0 0.0056,0 L 26.64,32 0.0066,5.37 C 0.0028,5.37 0.0019,5.36 0.001,5.36 c 0,0 0.0018,0 0.0056,0 L 5.348,0.0103 c 0,-0.0093 0,-0.0093 0.01,-0.0093 0,0 0,0 0,0.0093 L 32,26.64 58.63,0.0103 c 0,-0.0093 0,-0.0093 0,-0.0093 z" />
                        </svg>
                    </code>
                    <code className="arg-btn" d-tooltip="插入一个可变参数" onClick={(e) => this.onAddVariable(e)}>
                        <svg viewBox="0 0 64 64" width="0.7em" height="0.7em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 32,0 C 14.33,0 0,14.33 0,32 0,49.67 14.33,64 32,64 49.67,64 64,49.67 64,32 64,14.33 49.67,0 32,0 Z m 0,58.57 C 17.33,58.57 5.429,46.67 5.429,32 5.429,17.33 17.33,5.429 32,5.429 46.67,5.429 58.57,17.33 58.57,32 58.57,46.67 46.67,58.57 32,58.57 Z M 45.14,29.71 H 34.29 V 18.86 c 0,-0.32 -0.26,-0.57 -0.58,-0.57 h -3.42 c -0.32,0 -0.58,0.25 -0.58,0.57 V 29.71 H 18.86 c -0.32,0 -0.57,0.26 -0.57,0.58 v 3.42 c 0,0.32 0.25,0.58 0.57,0.58 h 10.85 v 10.85 c 0,0.32 0.26,0.57 0.58,0.57 h 3.42 c 0.32,0 0.58,-0.25 0.58,-0.57 V 34.29 h 10.85 c 0.32,0 0.57,-0.26 0.57,-0.58 v -3.42 c 0,-0.32 -0.25,-0.58 -0.57,-0.58 z" />
                        </svg>
                    </code>
                </> : (this.props.signature.optional ? <code className="arg-btn" d-tooltip="删除自定义数据，使参数处于缺省状态" onClick={(e) => this.onSetAsOptional(e)}>
                        <svg viewBox="0 0 64 64" width="0.7em" height="0.7em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 28.79,56.81 H 23.75 L 6.668,39.73 22.2,24.2 41.72,43.72 Z M 63.02,25.99 40.09,2.976 c -1.3,-1.301 -3.33,-1.301 -4.63,0 L 0.9759,37.46 c -1.3012,1.3 -1.3012,3.33 0,4.63 L 20.57,61.69 H 55.05 V 56.81 H 36.84 L 63.02,30.63 c 1.31,-1.31 1.31,-3.42 0,-4.64 z" />
                        </svg>
                    </code> : undefined) }
                { (arg && (arg.refResult?.stepID || arg.refLoopIndex?.stepID)) ? <code className="arg-btn" d-tooltip="将引用的步骤调整到视图中" onClick={(e) => this.onJumpToReferenceStep(e)}>
                        <svg viewBox="0 0 64 64" width="0.7em" height="0.7em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 59.6,2 H 4.4 C 3.072,2 2,3.072 2,4.4 V 59.6 C 2,60.93 3.072,62 4.4,62 h 27 c 0.33,0 0.6,-0.27 0.6,-0.6 v -4.2 c 0,-0.33 -0.27,-0.6 -0.6,-0.6 H 7.4 V 7.4 h 49.2 v 24 c 0,0.33 0.27,0.6 0.6,0.6 h 4.2 C 61.73,32 62,31.73 62,31.4 V 4.4 C 62,3.072 60.93,2 59.6,2 Z m -17,36.56 3.91,-3.92 A 0.6008,0.6008 0 0 0 46.16,33.62 L 32.71,32.04 c -0.39,0 -0.72,0.28 -0.67,0.67 l 1.57,13.46 c 0.1,0.49 0.67,0.7 1.02,0.35 l 3.93,-3.93 19.22,19.22 c 0.23,0.23 0.61,0.23 0.85,0 l 3.18,-3.18 c 0.23,-0.24 0.23,-0.62 0,-0.85 z" />
                        </svg>
                    </code> : undefined}
            </>
        }
    }

    render() {
        let passArgs = this.props.args;
        let index = this.props.index;
        let signature = this.props.signature;
        let uiOpt;
        uiOpt = ((uiOpt = signature.options) && uiOpt["editor.ui"]);

        if (signature.variable && this.props.variableArgs) {
            let variableArgs = Array.from(this.props.variableArgs, (_, idx) => <FuncArgItem index={this.props.index + idx} args={this.props.args} signature={this.props.signature} key={idx} editorHost={this.props.editorHost} onUpdate={this.props.onUpdate} virableItem={true} />);
            (variableArgs.length <= 0) && (variableArgs = <FuncArgItem index={this.props.index} args={this.props.args} signature={this.props.signature} editorHost={this.props.editorHost} onUpdate={this.props.onUpdate} virableItem={true} />)
            if (uiOpt) {
                return <>{this.renderText(uiOpt.prefix)}{variableArgs}{this.renderText(uiOpt.postfix)}</>;
            } else {
                return <p>{signature.description||undefined}:{variableArgs}</p>;
            }
        } else {
            let refStepID = "";
            let innerNode;
            let hasValue;
            if (index < passArgs.length) {
                let arg = passArgs[index];
                if (arg) {
                    if ("refResult" in arg) {
                        refStepID = arg.refResult.stepID;
                        let refStepInfo = this.queryReferenceStepInfo(refStepID);
                        innerNode = <i d-error={refStepInfo ? undefined : 1}>{refStepInfo ? String(refStepInfo.comment||"引用数据") : "未知引用"}</i>;
                        hasValue = true;
                    } else if ("refLoopIndex" in arg) {
                        refStepID = arg.refLoopIndex.stepID;
                        let refStepInfo = this.queryReferenceStepInfo(refStepID);
                        innerNode = <i d-error={refStepInfo ? undefined : 1}>{refStepInfo ? ((refStepInfo.comment||"") + "循环次数") : "未知引用循环"}</i>;
                        hasValue = true;
                    } else if ("value" in arg) {
                        innerNode = <>{normalizeArgumentDisplay(arg, signature, true, true)}</>;
                        hasValue = true;
                    }
                }
            } 
            if (!hasValue) {
                innerNode = <>{signature.optional ? String(signature.options?.defaultTip||"缺省") : "未指定" }</>;
            }
            let realRender = <code className="step-arg" d-ref-step-id={refStepID} d-focus={this.state.focus ? 1 : undefined}
                onClick={() => this.onSelectArg()}
            >
                {innerNode}
                {this.renderEditButtons()}
            </code>;

            if (this.props.virableItem) {
                return realRender;
            } else if (uiOpt) {
                return <>{this.renderText(uiOpt.prefix)}{hasValue?(uiOpt.hasValuePre?this.renderText(uiOpt.hasValuePre):undefined):undefined}{realRender}{hasValue?(uiOpt.hasValuePost?this.renderText(uiOpt.hasValuePost):undefined):undefined}{this.renderText(uiOpt.postfix)}</>
            } else {
                return <p>{String(signature.description||"").split("\n")[0]}:{realRender}</p>
            }
        }
    }
}

export class FunctionEditorStepItem extends React.Component {
    static checkValid(_step, _extChecker, _invalidOutput) {
        try {
            let action = _step.action;
            (typeof action !== "function") && (action = actionCollection[action]);
            let signature = action.getActionSignature();
            if (signature.arguments?.length > 0) {
                let index = 0;
                let invalidArg = signature.arguments.find(item => {
                    if (!item.isContext) {
                        if (item.optional || item.variable) {
                            index++;
                        } else {
                            let arg = _step.arguments?.at(index++);
                            if (!arg || (!arg.refResult?.stepID && !arg.refLoopIndex?.stepID && !("value" in Object(arg)))) {
                                _invalidOutput && (_invalidOutput.invalidArgumentIndex = index);
                                return true;
                            } else if (typeof _extChecker === "function") {
                                if (!("value" in arg)) {
                                    let rID = (arg.refResult?.stepID || arg.refLoopIndex?.stepID);
                                    if (!_extChecker({relationStepID: rID})) {
                                        _invalidOutput && (_invalidOutput.invalidArgumentIndex = index, _invalidOutput.relationStepID = true);
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                });
                return !invalidArg;
            } else {
                return true;
            }
        } catch(err) {
            console.error(err);
            _invalidOutput && (_invalidOutput.error = err);
            return false;
        }
    }

    constructor(_props) {
        super(_props);

        this.state = {};
        this.selectionChangeHandle = () => {
            if (this.state.selected) {
                this.setState({
                    selected: false
                });
            }
        }
    }

    componentDidMount() {
        this.props.editorHost?.addEventListener("step-selection-change", this.selectionChangeHandle);
    }

    componentWillUnmount() {
        this.props.editorHost?.removeEventListener("step-selection-change", this.selectionChangeHandle);
    }

    onSelectStep() {
        if (!this.state.selected) {
            if (this.props.onSelect(this.props.step)) {
                this.props.editorHost?.dispatchEvent(new CustomEvent("step-selection-change"));
                this.props.editorHost?.dispatchEvent(new CustomEvent("kill-select-arg-focus"));
                this.props.editorHost?.dispatchEvent(new CustomEvent("set-reference-steps", {
                    detail: {
                        referenceIDs: Array.from(new Set(this.props.step.arguments?.map(e => e && (e.refResult?.stepID || e.refLoopIndex?.stepID)).filter(e => !!e)))
                    }
                }));
                this.props.editorHost?.dispatchEvent(new CustomEvent("set-reference-steps", {
                    detail: {
                        referenceIDs: undefined,
                        focus: true
                    }
                }));
                this.setState({
                    selected: true
                });
            }
        }
    }

    onArgUpdate(_refStepID) {
        this.forceUpdate();
        this.props.editorHost?.dispatchEvent(new CustomEvent("set-reference-steps", {
            detail: {
                referenceIDs: Array.from(new Set(this.props.step.arguments?.map(e => e && (e.refResult?.stepID || e.refLoopIndex?.stepID)).filter(e => !!e)))
            }
        }));
        this.props.editorHost?.dispatchEvent(new CustomEvent("set-reference-steps", {
            detail: {
                referenceIDs: _refStepID ? [_refStepID] : undefined,
                focus: true
            }
        }));
    }

    async onAddStep(_before) {
        let actions = await ActionSelectionDialog.show();
        if (actions && this.props.onAddStep) {
            this.props.onAddStep(actions, this.props.step, _before);
        }
    }

    async onDeleteStep() {
        this.props.onDeleteStep && this.props.onDeleteStep(this.props.step);
    }

    async onCommentStep() {
        let value = await input("请输入步骤的注释：", undefined, {
            default: this.props.step.comment,
            submitText: "确定",
            cancelText: "取消"
        });
        if (undefined !== value) {
            value = String(value).trim();
            if (value) {
                this.props.step.comment = value;
            } else {
                delete this.props.step.comment;
            }
            this.forceUpdate();
        }
    }

    onUnselectStep(_event) {
        if (_event?.target.classList?.contains("step-editbar")) {
            this.props.editorHost?.dispatchEvent(new CustomEvent("step-selection-change"));
        }
    }

    renderArguments() {
        let step = this.props.step;
        let passArgs = (step.arguments instanceof Array) ? step.arguments : (step.arguments = []);
        let argIndex = 0;
        return (this.signature.arguments||[]).map((argSignature, idx) => {
            if (!argSignature.isContext) {
                if (argSignature.variable) {
                    let el = <FuncArgItem key={idx} 
                                variableArgs={{length: passArgs.length - argIndex}} 
                                args={passArgs} index={argIndex} 
                                signature={argSignature} 
                                editorHost={this.props.editorHost} 
                                onUpdate={(e) => this.onArgUpdate(e)} />;
                    argIndex = passArgs.length;
                    return el;
                } else {
                    return <FuncArgItem key={idx} 
                                args={passArgs} index={argIndex++} 
                                signature={argSignature} 
                                editorHost={this.props.editorHost} 
                                onUpdate={(e) => this.onArgUpdate(e)} />;
                }
            }
        });
    }

    render() {
        let error;
        if (this.props.error) {
            error = this.props.error;
        } else {
            try {
                let action = this.props.step.action;
                (typeof action !== "function") && (action = actionCollection[action]);
                if (typeof action !== "function") {
                    throw new Error(`${this.props.step.action} is not a function`);
                }
                let signature = (this.signature = action.getActionSignature());
                if (!signature) {
                    throw new Error(`Can not peek the signature of ${this.props.step.action}`);
                }
                (typeof this.props.step.action === "function") && (this.props.step.action = signature.name);
            } catch(err) {
                error = err;
            }
        }
        return <>
            {this.state.selected ? <div className="step-editbar step-editbar-top" onClick={(e) => this.onUnselectStep(e.nativeEvent)}>
                <button d-type="optional" d-tooltip="snsq" onClick={() => this.onAddStep(true)}>添加</button>
            </div>: undefined}
            <div className="step" 
                d-step-id={this.props.step.id||undefined} 
                d-error={error ? "1" : undefined}
                d-tooltip={error ? String(this.error) : undefined}
                d-action-category={(this.signature.category||[]).join(" ")}
                onClick={() => this.onSelectStep()}>
                {
                    error
                        ? <>格式化步骤时出错<p style={{display:"none"}}>{String(error)}</p></>
                        : <>
                            {this.signature.hideTitleInEditor ? undefined : <p>{this.signature.title}</p>}
                            {this.renderArguments()}
                            {this.props.step.comment ? <p className="comment">{this.props.step.comment}</p> : undefined}
                        </>
                }
            </div>
            {this.state.selected ? <div className="step-editbar step-editbar-bottom" onClick={(e) => this.onUnselectStep(e.nativeEvent)}>
                <button d-type="optional" d-tooltip="为步骤添加注释" onClick={() => this.onCommentStep()}>注释</button>
                <button d-type="optional" d-tooltip="在当前步骤后面添加新步骤" onClick={() => this.onAddStep(false)}>添加</button>
                <button d-type="optional" d-tooltip="删除当前步骤" onClick={() => this.onDeleteStep()}>删除</button>
            </div>: undefined}
        </>;
    }
}