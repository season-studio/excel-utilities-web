import { escapeHTMLText, generateTableHTML } from "../base";
import dialog from "../../../thirdpart/toolkits/src/tip/dialog";
import tip from "../../../thirdpart/toolkits/src/tip/tip";

const TableRawData = new WeakMap();

function getRawData(_o) {
    return TableRawData.get(_o) || [];
}

export function TableData(_rawData) {
    if (_rawData instanceof TableData) {
        return _rawData;
    }
    if (!(this instanceof TableData)) {
        return new TableData(...Array.from(arguments));
    }
    (arguments.length <= 0) ? (_rawData = []) : ((_rawData instanceof Array) || (_rawData = [_rawData]));
    _rawData = _rawData.map(line => (line instanceof Array) ? line : [line]);
    TableRawData.set(this, _rawData);
    this.normalizeDimension();
    Object.defineProperties(this, {
        rowCount: {
            get() {
                return getRawData(this).length;
            }
        },
        columnCount: {
            get() {
                return this.normalizeDimension();
            }
        }
    })
}

TableData.prototype.normalizeDimension = function () {
    let rawData = getRawData(this);
    if (rawData instanceof Array) {
        let maxLen = 0;
        rawData.forEach(line => (line instanceof Array) && (maxLen < line.length) && (maxLen = line.length));
        rawData = Array.from(rawData).map(line => {
            if (!(line instanceof Array)) {
                line = [];
            }
            (line.length < maxLen) && (line.length = maxLen);
            return line;
        });
        TableRawData.set(this, rawData);
        return maxLen;
    } else {
        TableRawData.set(this, []);
        return 0;
    }
}

TableData.prototype.toHTML = function () {
    this.normalizeDimension();
    return generateTableHTML(getRawData(this));
}

TableData.prototype.toString = function () {
    return `[Table ${this.rowCount} x ${this.columnCount}]`;
}

TableData.normalizeValue = function (_val) {
    return ((typeof _val !== "number") && (typeof _val !== "boolean")) ? (_val || "") : _val;
}

TableData.prototype.cell = function (_row, _col) {
    if (_row instanceof TableCellCoordinate) {
        _row = _row.row;
        _col = _row.column;
    }
    _row = Number(_row) || 0;
    _col = Number(_col) || 0;
    (_row < 0) && (_row = 0);
    (_col < 0) && (_col = 0);
    return TableData.normalizeValue(getRawData(this)[_row][_col]);
}

TableData.prototype.row = function (_row) {
    _row = Number(_row) || 0;
    (_row < 0) && (_row = 0);
    return Array.from(getRawData(this)[_row] || []).map(TableData.normalizeValue);
}

TableData.prototype.column = function (_col) {
    _col = Number(_col) || 0;
    (_col < 0) && (_col = 0);
    return getRawData(this).map(line => TableData.normalizeValue(line[_col]));
}

TableData.prototype.updateCell = function (_val, _row, _col) {
    if (_row instanceof TableCellCoordinate) {
        _row = _row.row;
        _col = _row.column;
    }
    _row = Number(_row) || 0;
    _col = Number(_col) || 0;
    (_row < 0) && (_row = 0);
    (_col < 0) && (_col = 0);
    let line = getRawData(this)[_row];
    (line instanceof Array) && (line[_col] = TableData.normalizeValue(_val));
}

TableData.prototype.appendRow = function (_data) {
    (_data instanceof Array) || (_data = [_data]);
    getRawData(this).push(_data.map(TableData.normalizeValue));
}

TableData.prototype.appendColumn = function (_data) {
    (_data instanceof Array) || (_data = [_data]);
    let rawData = getRawData(this);
    let newColCount = this.columnCount + 1;
    let rowCount = this.rowCount;
    _data.forEach((e, idx) => {
        if (idx < rowCount) {
            rawData[idx].push(TableData.normalizeValue(e));
        } else {
            let newRow = Array(newColCount);
            newRow[idx] = TableData.normalizeValue(e);
            rawData.push(newRow);
        }
    })
}

TableData.prototype.updateRow = function (_data, _row) {
    (_data instanceof Array) || (_data = [_data]);
    _row = Number(_row) || 0;
    (_row < 0) && (_row = 0);
    getRawData(this)[_row] = _data.map(TableData.normalizeValue);
}

TableData.prototype.updateColumn = function (_data, _col) {
    (_data instanceof Array) || (_data = [_data]);
    _col = Number(_col) || 0;
    (_col < 0) && (_col = 0);
    let rawData = getRawData(this);
    _data.forEach((_val, idx) => {
        _val = TableData.normalizeValue(_val);
        let line = rawData[idx];
        if (line instanceof Array) {
            line[_col] = _val;
        } else {
            line = [];
            line[_col] = _val;
            rawData[idx] = line;
        }
    });
}

TableData.prototype.iterateRows = function * () {
    this.normalizeDimension();
    let rows = getRawData(this);
    for (let line of rows) {
        yield line;
    }
}

TableData.prototype.iterateColumn = function * () {
    let columnCount = this.normalizeDimension();
    let rows = getRawData(this);
    for (let i = 0; i < columnCount; i++) {
        yield rows.map(line => line[i]);
    }
}

TableData.prototype.preview = async function (_title) {
    let tableHTML = this.toHTML();
    if (tableHTML) {
        dialog(`<div>${_title ? "<div style=\"align-self:center;\">" + escapeHTMLText(_title) + "</div>" : ""}
<div style="max-height:calc(80vh);max-width:calc(80vw);overflow:auto;align-self:center;margin: 0.5em 0;">${tableHTML}</div>
<div style="display:flex;flex-direction:row;justify-content:space-evenly;">
<button d-click="copy">复制</button>&nbsp;<button d-click="close">关闭</button>
</div>
</div>`, {
            close() {
                this.close();
            },
            copy() {
                navigator.clipboard.write([
                    new ClipboardItem({
                        "text/html": new Blob([tableHTML], {type:"text/html"})
                    })
                ]);
                tip("表格已复制", {type:"info", timeout:1000});
            }
        })
    }
}

TableData.prototype.copyToClipboard = function () {
    navigator.clipboard.write([
        new ClipboardItem({
            "text/html": new Blob([this.toHTML()], {type:"text/html"})
        })
    ]);
}

TableData.prototype.serializeFn = function () {
    return JSON.stringify(getRawData(this));
}

export function TableCellCoordinate(_rowIdx, _colIdx) {
    if (!(this instanceof TableCellCoordinate)) {
        return new TableCellCoordinate(_rowIdx, _colIdx);
    }
    Object.defineProperties(this, {
        row: {
            value: _rowIdx
        },
        column: {
            value: _colIdx
        }
    });
}

TableCellCoordinate.prototype.toString = function () {
    return `(${this.row}, ${this.column})`;
}

TableCellCoordinate.prototype.serializeFn = function() {
    return `[${this.row}, ${this.column}]`;
}
