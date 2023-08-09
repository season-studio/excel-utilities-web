import * as React from "react";
import * as ReactDOM from "react-dom";
import { generateTableHTML, readTableFromClipboard } from "../../base";
import styles from "./selectFromTable.module.css";
import { getGlobalStyleSheets } from "../../base";
import { TableCellCoordinate, TableData } from "../../dataTypes/tableData";

class TableContentSelector extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = { };
    }
    
    componentDidMount() {
        let node = ReactDOM.findDOMNode(this)?.parentElement?.querySelector("." + styles.tablePreview);
        if (node) {
            let previewDoc = (this.previewDoc = node.attachShadow({ mode: "open" }));
            if (previewDoc) {
                let styleHTMLs = getGlobalStyleSheets().map(e => e.outerHTML);
                previewDoc.innerHTML = styleHTMLs.join("") + "<style>table { cursor: pointer; }</style><style d-selection-style=\"1\"></style><div id=\"tip\" style=\"position:sticky;top:0;width:100%;background-color:#999;color:#fff;font-weight:bolder;\"></div>" + this.props.table.toHTML();
                this.selectionStyle = previewDoc.querySelector("[d-selection-style]");
                let tipDiv = previewDoc.querySelector("#tip");
                let rows = Array.from(previewDoc.querySelectorAll("tr"));
                rows.forEach(e => e.style.display="none");

                let startIdx = 0;
                let percent = 0;
                this.abortSignalController = new AbortController();
                let abortSignal = this.abortSignalController.signal;
                const updateFn = function () {
                    if (!abortSignal.aborted) {
                        let endIdx = startIdx + 1000;
                        rows.slice(startIdx, endIdx).forEach(e => e.style.display = "");
                        startIdx = endIdx;
                        if ((startIdx < rows.length) && !abortSignal.aborted) {
                            requestAnimationFrame(updateFn);
                        } else {
                            tipDiv?.remove();
                        }
                        let newPercent = Math.trunc(startIdx / rows.length * 100);
                        if (newPercent > percent) {
                            percent = newPercent;
                            tipDiv && (tipDiv.textContent = `表格正在展开显示，请稍后……(${percent}%)`);
                        }
                    }
                }
                requestAnimationFrame(updateFn);
            }
        }
    }

    componentWillUnmount() {
        this.abortSignalController?.abort();
        this.props.onResult();
    }

    onClickForSelect(e) {
        let cellNode = e?.composedPath()?.find(item => ((item?.tagName === "TD") || (item?.tagName === "TH")));
        if (cellNode) {
            let rowIdx = Number(cellNode.getAttribute("d-row-idx"));
            let colIdx = Number(cellNode.getAttribute("d-col-idx"));
            if (isNaN(rowIdx) || isNaN(colIdx)) {
                return;
            }
            this.setState({ selection: [rowIdx, colIdx] });
            if (this.props.selectionType === "row") {
                this.selectionStyle.innerHTML = `td[d-row-idx="${rowIdx}"] { background-color: var(--table-select-color); }`;
            } else if (this.props.selectionType === "column") {
                this.selectionStyle.innerHTML = `td[d-col-idx="${colIdx}"] { background-color: var(--table-select-color); }`;
            } else {
                this.selectionStyle.innerHTML = `td[d-row-idx="${rowIdx}"][d-col-idx="${colIdx}"] { background-color: var(--table-select-color); }`;
            }
        }
    }

    onSubmit() {
        if (this.state.selection) {
            let result;
            if (this.props.selectionType === "row") {
                result = this.state.selection[0];
            } else if (this.props.selectionType === "column") {
                result = this.state.selection[1];
            } else {
                result = new TableCellCoordinate(this.state.selection[0], this.state.selection[1]);
            }
            this.props.onResult(result);
        }
    }

    render() {
        return (<>
            <div style={{margin: "0 0 0.5em 0"}}>
                请点击选择{this.props.selectionType === "row" ? "表格数据行" : (this.props.selectionType === "column" ? "表格数据列" : "表格单元格")}{this.props.tip ? `（${this.props.tip}）` : undefined}&nbsp;
                {this.state.selection && (<button onClick={() => this.onSubmit()}>选定</button>)}
            </div>
            <div className={styles.tablePreview} onClick={(e) => this.onClickForSelect(e.nativeEvent)}></div>
        </>);
    }
}

/**
 * 在表格中进行选择
 * @param {Context} _context 
 * @param {TableData} _table 给定的表格 <<< {"editor.ui":{prefix:"在表格",postfix:"选择"}}
 * @param {text} _selectionType 选择模式 <<< {"alternate":{"行索引号":"row", "列索引号":"column", "单元格坐标":"cell"}, "editor.ui":{}}
 * @param {*} [_tip] 提示信息 <<< {"editor.ui":{prefix:"\n选择界面中显示的提示为"}}
 * @returns {number|TableCellCoordinate}
 * @StepActionSignature
 * @category 表格|界面
 * @hideTitleInEditor
 */
async function selectFromTable(_context, _table, _selectionType, _tip) {
    if (!_context?.container) {
        throw "need container";
    }

    if (!(_table instanceof TableData)) {
        throw "bad table parameter";
    }

    (["row", "column", "cell"].indexOf(_selectionType) < 0) && (_selectionType = "cell");

    try {
        _context.container.innerHTML = "";
        return await new Promise(r => {
            ReactDOM.render(
                <TableContentSelector selectionType={_selectionType} table={_table} onResult={r} tip={_tip} />,
                _context.container
            );
        });
    } finally {
        ReactDOM.unmountComponentAtNode(_context.container);
    }
}

export default selectFromTable;
