import * as React from "react";
import * as ReactDOM from "react-dom";
import styles from "./functionStation.module.css";
import { ActionFlowEngine } from "../functions/ActionFlowEngine";
import tip from "../../thirdpart/toolkits/src/tip/tip";
import { getGlobalStyleSheets } from "../functions/base";

export class FunctionStation extends React.Component {
    constructor(_props) {
        super(_props);

        this.engine = new ActionFlowEngine(this.props.funcImpl?.steps, this.props.actionCollection);
        this.abortController = new AbortController();

        this.state = {
            showStepResults: 0
        };

        this.engine.addEventListener("action-error", (e) => this.onActionError(e));
    }

    componentDidMount() {
        let onInit = this.props.funcImpl?.initialize;
        Promise.all([(typeof onInit === "function") && onInit(this)])
            .then(() => setImmediate(() => this.execute()));
    }

    componentWillUnmount() {
        this.abortController?.abort();
    }

    onActionError(_event) {
        let detail = _event?.detail;
        if (detail) {
            detail.handledError();
            setImmediate(() => {
                this.setState({
                    errorStepIndex: detail.engine.errorStepIndex,
                    error: detail.error
                })
            });
        }
    }

    async execute() {
        let stepContainer = ReactDOM.findDOMNode(this)?.querySelector(".step-station");
        try {
            let engine = this.engine;
            let abortSignal = this.abortController.signal;
            let context = {
                container: stepContainer,
                abortSignal
            };
            for await (let stepResult of engine.execute(context)) {
                if (stepResult && this.state.showStepResults) {
                    this.forceUpdate();
                }
                if (abortSignal.aborted) {
                    return ;
                }
            }
            if (engine.error === undefined) {
                this.setState({
                    end: true
                });
                this.finalResult = Array.from(this.engine.iterateResult()).pop();
                this.props.onResult?.call(null, this.finalResult);
            }
        } catch (error) {
            this.setState({
                errorStepIndex: this.engine.errorStepIndex,
                error
            });
        }
    }

    showFinalResult() {
        setImmediate(() => {
            let rootNode = ReactDOM.findDOMNode(this);
            if (rootNode) {
                let stepContainer = rootNode.querySelector(".step-station");
                stepContainer && (stepContainer.innerHTML = "");
                let finalResultNode = rootNode.querySelector(".final-result");
                if (finalResultNode) {
                    finalResultNode.innerHTML = "最终结果是:<br />";
                    let iframe = document.createElement("iframe");
                    let html = `<html lang="zh-cn"><head><meta charset="utf-8" />${getGlobalStyleSheets().map(e => e.outerHTML).join("")}</head><body style="display:flex;flex-direction:column;align-items:center;">${this.finalResult?.previewHTML||""}</body></html>`
                    let blob = new Blob([html], {type:"text/html"});
                    let url = URL.createObjectURL(blob);
                    iframe.setAttribute("style", "width:100%;height:calc(45vh);outline:none;border:0;margin:0.5em 0;");
                    finalResultNode.appendChild(iframe);
                    iframe.addEventListener("load", () => URL.revokeObjectURL(url));
                    iframe.src = url;
                }
            }
        });
    }

    copyFinalResult() {
        try {
            this.finalResult?.copy();
            tip("数据已复制", {type:"info", timeout:1000});
        } catch(err) {
            tip("数据复制失败!", {type:"error", timeout:1000});
            console.error(err);
        }
    }

    render() {
        return (<div className={styles.funcStation} d-in-progress={(this.state.end || this.state.error) ? "0" : "1"}>
            <div className="step-results" d-shown={this.state.showStepResults}>
                <div className="step-results-header">
                    { (this.state.showStepResults||"") && "过程步骤的阶段结果：" }
                    <button d-type="optional" onClick={() => this.setState({showStepResults: this.state.showStepResults ^ 1})}>{ this.state.showStepResults ? "隐藏步骤结果" : "显示步骤结果" }</button>
                </div>
                <div className="step-results-list">
                    { this.state.showStepResults ? Array.from(this.engine.iterateResult()).map((item, idx) => <div key={idx}>{`(${item.stepInfo?.index}, ${item.stepInfo?.name}) => [${item.rawType}] ${item}`}</div>) : undefined }
                </div>
            </div>
            {
                this.state.error
                    ? <div className="step-error">执行步骤（{this.state.errorStepIndex}）时出现错误，{String(this.state.error)}</div>
                    : ((this.state.end !== undefined) 
                        ? <div className="step-end">
                            功能运行已完成
                            <div className="final-result">{this.showFinalResult()}</div>
                            <div>
                                <button onClick={() => this.props.onClose?.call(null)}>返回主页</button>
                                &nbsp;
                                <button d-type="optional" onClick={() => this.copyFinalResult()}>复制结果</button>
                            </div>
                        </div>
                        : undefined)
            }
            <div className="step-station"></div>
        </div>);
    }
}
