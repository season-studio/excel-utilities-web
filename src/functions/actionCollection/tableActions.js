import { TableCellCoordinate, TableData } from "../dataTypes/tableData";

/**
 * 取单元格数据
 * @param {TableData} _table 目标表格 <<< {"editor.ui":{prefix:"在表格",postfix:"中提取坐标为"}}
 * @param {TableCellCoordinate} _coordinate 单元格坐标 <<< {"editor.ui":{postfix:"的单元格的数据"}}
 * @returns {*} 目标单元格的数据
 * @StepActionSignature
 * @category 表格
 * @hideTitleInEditor
 */
export function getTableCellData(_table, _coordinate) {
    if ((_table instanceof TableData) && (_coordinate instanceof TableCellCoordinate)) {
        return _table.cell(_coordinate.row, _coordinate.column);
    }
}

/**
 * 取表格行
 * 获取表格中指定的行
 * @param {TableData} _table 目标表格 <<< {"editor.ui":{prefix:"在表格",postfix:"中提取标号为"}}
 * @param {number} _rowIndex 行的序号 <<< {"editor.ui":{postfix:"的行的数据"}}
 * @returns {Array} 目标行的数据
 * @StepActionSignature
 * @category 表格
 * @hideTitleInEditor
 */
export function getTableRow(_table, _rowIndex) {
    return (_table instanceof TableData) ? _table.row(Number(_rowIndex)||0) : [];
}

/**
 * 取表格列
 * 获取表格中指定的列
 * @param {TableData} _table 目标表格 <<< {"editor.ui":{prefix:"在表格",postfix:"中提取标号为"}}
 * @param {number} _colIndex 列的序号 <<< {"editor.ui":{postfix:"的列的数据"}}
 * @returns {Array} 目标列的数据
 * @StepActionSignature
 * @category 表格
 * @hideTitleInEditor
 */
export function getTableColumn(_table, _colIndex) {
    return (_table instanceof TableData) ? _table.column(Number(_colIndex)||0) : [];
}

/**
 * 更新单元格
 * 更新表格中指定单元格的数据
 * @param {TableData} _table 目标表格 <<< {"editor.ui":{prefix:"将表格",postfix:"中坐标为"}}
 * @param {TableCellCoordinate} _coordinate 要更新的单元格的坐标 <<< {"editor.ui":{postfix:"的单元格的数据设置为"}}
 * @param {*} _value 目标数据值 <<< {"editor.ui":{}}
 * @StepActionSignature
 * @category 表格
 * @hideTitleInEditor
 */
export function updateTableCell(_table, _coordinate, _value) {
    if ((_table instanceof TableData) && (_coordinate instanceof TableCellCoordinate)) {
        _table.updateCell(_value, _coordinate.row, _coordinate.column);
    }
}

/**
 * 追加表格行
 * 在表格的末尾加入一行
 * @param {TableData} _table 目标表格 <<< {"editor.ui":{prefix:"在表格",postfix:"底部插入"}}
 * @param {Array} _row 新的行的数据 <<< {"editor.ui":{postfix:"作为新的一行"}}
 * @StepActionSignature
 * @category 表格
 * @hideTitleInEditor
 */
export function appendTableRow(_table, _row) {
    (_table instanceof TableData) && _table.appendRow(_row);
}

/**
 * 追加表格列
 * 在表格的末尾加入一列
 * @param {TableData} _table 目标表格 <<< {"editor.ui":{prefix:"在表格",postfix:"最右侧插入"}}
 * @param {Array} _col 新的列的数据 <<< {"editor.ui":{postfix:"作为新的一列"}}
 * @StepActionSignature
 * @category 表格
 * @hideTitleInEditor
 */
export function appendTableColumn(_table, _col) {
    (_table instanceof TableData) && _table.appendColumn(_col);
}

/**
 * 更新表格行
 * 更新表格中的指定行
 * @param {TableData} _table 目标表格 <<< {"editor.ui":{prefix:"将表格",postfix:"中标号为"}}
 * @param {number} _rowIndex 要更新的行的序号 <<< {"editor.ui":{postfix:"的行的数据设置为"}}
 * @param {Array} _row 目标数据 <<< {"editor.ui":{}}
 * @StepActionSignature
 * @category 表格
 * @hideTitleInEditor
 */
export function updateTableRow(_table, _rowIndex, _row) {
    (_table instanceof TableData) && _table.updateRow(_row, Number(_rowIndex)||0);
}

/**
 * 更新表格列
 * 更新表格中的指定列
 * @param {TableData} _table 目标表格 <<< {"editor.ui":{prefix:"将表格",postfix:"中标号为"}}
 * @param {number} _colIndex 要更新的列的序号 <<< {"editor.ui":{postfix:"的列的数据设置为"}}
 * @param {Array} _col 目标数据 <<< {"editor.ui":{}}
 * @StepActionSignature
 * @category 表格
 * @hideTitleInEditor
 */
export function updateTableColumn(_table, _colIndex, _col) {
    (_table instanceof TableData) && _table.updateColumn(_col, Number(_colIndex)||0);
}

/**
 * 创建表格
 * 创建一个新的表格
 * @param {Array} [_data] 构成表格的数组 <<< {"editor.ui":{prefix:"参考",postfix:"创建一个表格"},defaultTip:"空数据"}
 * @returns {TableData} 新的表格
 * @StepActionSignature
 * @category 表格
 * @hideTitleInEditor
 */
export function createTable(_data) {
    return new TableData(arguments.length > 0 ? _data : []);
}

/**
 * 取表格大小
 * 提取表格的大小信息
 * @param {TableData} _table 目标表格 <<< {"editor.ui":{prefix:"提取表格",postfix:"的"}}
 * @param {number} _mod 要更新的列的序号 <<< {"editor.ui":{}, alternate:{"单元格数量":0,"行总数":1,"列总数":2}}
 * @returns {number} 提取到的数量信息
 * @StepActionSignature
 * @category 表格
 * @hideTitleInEditor
 */
export function getTableSize(_table, _mod) {
    if (_table instanceof TableData) {
        _mod = Number(_mod);
        if (_mod === 1) {
            return _table.rowCount;
        } else if (_mod === 2) {
            return _table.columnCount;
        } else {
            return _table.rowCount * _table.columnCount;
        }
    } else {
        return 0;
    }
}

/**
 * 声明单元格坐标
 * @param {number} _rowIndex 单元格所在行的序号 <<< {"editor.ui":{prefix:"声明（行：",postfix:", "}}
 * @param {number} _colIndex 单元格所在列的序号 <<< {"editor.ui":{prefix:"列：",postfix:"）为一个单元格坐标"}}
 * @returns {TableCellCoordinate} 单元格坐标
 * @StepActionSignature
 * @category 表格
 * @hideTitleInEditor
 */
export function declareTableCellCoordinate(_rowIndex, _colIndex) {
    return new TableCellCoordinate(Number(_rowIndex)||0, Number(_colIndex)||0);
}

/**
 * 遍历表格行
 * @param {TableData} _table 目标表格 <<< {"editor.ui":{"prefix":"循环遍历表格","postfix":"的行"}}
 * @param {...number} _skipRowIndexs 跳过的行号 <<< {"editor.ui":{"prefix":"，但跳过其中行号为","postfix":"的行"}}
 * @yields {Array} 行数据
 * @StepActionSignature
 * @autoRelationWith loopNext
 * @category 表格
 * @hideTitleInEditor
 */
export function * loopForTableRow(_table, ..._skipRowIndexs) {
    if (_table instanceof TableData) {
        let idx = 0;
        for (let row of _table.iterateRows()) {
            if (!_skipRowIndexs.includes(idx)) {
                yield row;
            }
            idx++;
        }
    }
}

/**
 * 遍历表格列
 * @param {TableData} _table 目标表格 <<< {"editor.ui":{"prefix":"循环遍历表格","postfix":"的列"}}
 * @param {...number} _skipColIndexs 跳过的列号 <<< {"editor.ui":{"prefix":"，但跳过其中标号为","postfix":"的列"}}
 * @yields {Array} 列数据
 * @StepActionSignature
 * @autoRelationWith loopNext
 * @category 表格
 * @hideTitleInEditor
 */
export function * loopForTableColumn(_table, ..._skipColIndexs) {
    if (_table instanceof TableData) {
        let idx = 0;
        for (let col of _table.iterateColumn()) {
            if (!_skipColIndexs.includes(idx)) {
                yield col;
            }
            idx++;
        }
    }
}
