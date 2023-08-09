import * as React from "react";
import * as ReactDOM from "react-dom";
import { generateTableHTML, readTableFromClipboard } from "../../base";
import { tip } from "../../../../thirdpart/toolkits/src/tip";
import styles from "./getTableFromClipboard.module.css";
import { getGlobalStyleSheets } from "../../base";
import { TableData } from "../../dataTypes/tableData";

class TableFromClipboardGetter extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = { };
    }

    
    componentDidMount() {
        let node = ReactDOM.findDOMNode(this)?.parentElement?.querySelector("." + styles.tablePreview);
        if (node) {
            this.previewDoc = node.attachShadow({ mode: "open" });
            this.styleHTML = getGlobalStyleSheets().map(e => e.outerHTML).join("");
        }
    }

    componentWillUnmount() {
        this.abortSignalController?.abort();
        this.props.onResult();
    }

    async onReadClipboard() {
        let previewDoc = this.previewDoc;
        previewDoc && (previewDoc.innerHTML = `${this.styleHTML}<div style="width:100%;padding:0.5em;text-align:center;">正在读取剪贴板……</div>`);
        let table = await readTableFromClipboard();
        let tableHTML = generateTableHTML(table);
        if (!tableHTML) {
            tip("剪贴板中没有有效表格", {type:"warn", timeout: 1000});
            previewDoc && (previewDoc.innerHTML = "");
        } else {
            this.setState({
                table
            });
            if (!previewDoc) {
                tip("无法预览", {type: "error", timeout: 1000});
            } else {
                previewDoc.innerHTML = this.styleHTML + "<div id=\"tip\" style=\"position:sticky;top:0;width:100%;background-color:#999;color:#fff;font-weight:bolder;\"></div>" + tableHTML;
                let tipDiv = previewDoc.querySelector("#tip");
                let rows = Array.from(previewDoc.querySelectorAll("tr"));
                rows.forEach(e => e.style.display = "none");

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
                            tipDiv && (tipDiv.textContent = `数据加载中，请稍后……(${percent}%)`);
                        }
                    }
                }
                requestAnimationFrame(updateFn);
            }
        }
    }

    onSubmit() {
        this.state.table && this.props.onResult(new TableData(this.state.table));
    }

    render() {
        return (<>
            {this.props.tip ? <div>{this.props.tip}</div> : undefined}
            <div style={{margin: "0.5em 0"}}>
                <button onClick={() => this.onReadClipboard()}>读取剪贴板</button>
                &nbsp;
                {this.state.table && (<button onClick={() => this.onSubmit()}>选定</button>)}
            </div>
            <div className={styles.tablePreview} d-has-table={this.state.table?1:0}></div>
        </>);
    }
}

/**
 * 从“剪贴板”中读取表格
 * @param {Context} _context 
 * @param {*} [_tip] 提示信息
 * @returns {TableData}
 * @StepActionSignature
 * @category 表格|界面
 */
async function getTableFromClipboard(_context, _tip) {
    if (!_context?.container) {
        throw "need container";
    }

    try {
        _context.container.innerHTML = "";
        return await new Promise(r => {
            ReactDOM.render(
                <TableFromClipboardGetter onResult={r} tip={_tip} />,
                _context.container
            );
        });
    } finally {
        ReactDOM.unmountComponentAtNode(_context.container);
    }
}

export default getTableFromClipboard;