import * as React from "react";
import * as ReactDOM from "react-dom";
import tip from "../../thirdpart/toolkits/src/tip/tip";
import styles from "./lastResultList.module.css";

export class LastResultList extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = { 
            showLastResults: 0
        };

        this.fnUpdate = () => this.forceUpdate();
    }

    componentDidMount() {
        this.props.globalApp?.on("update-last-results", this.fnUpdate);
    }

    componentWillUnmount() {
        this.props.globalApp?.off("update-last-results", this.fnUpdate);
        this.fnUpdate = undefined;
    }

    render() {
        return (
            <div className={styles.lastResultsList} d-shown={this.state.showLastResults}>
                <div className="last-results-bar">
                    <div className="last-results-extract-button" onClick={() => this.setState({showLastResults: (this.state.showLastResults^1)})}>
                        历史结果 {this.state.showLastResults ? "▼" : "▲"}
                    </div>
                </div>
                {this.state.showLastResults 
                    ? <div className="last-results">
                        {this.props.globalApp?.lastResults?.map((item, index) => 
                            <div className="last-result-line" key={index}>
                                <code>{(new Date(item.time)).toLocaleString()}</code>
                                <div className="last-result-content">{item.result?.toString()}</div>
                                <div>
                                    {item.result?.hasPreview ? <button d-type="optional" onClick={() => item.result?.preview?.call(item.result)}>预览</button> : undefined}
                                    <button d-type="optional" onClick={() => { item.result?.copy?.call(item.result), tip("数据已复制", {type:"info", timeout:1000}) }}>复制</button>
                                </div>
                            </div>
                        )}
                    </div> : undefined}
            </div>
        );
    }
}
