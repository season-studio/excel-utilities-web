import * as React from "react";
import * as ReactDOM from "react-dom";
import actionCollection from "../functions/actionCollection";
import { LastResultList } from "./lastResultList";
import { FunctionStation } from "./functionStation";

export class FunctionPlayer extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = { };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (<>
            <div className="app-title">
                <div className="app-title-content">
                    {this.props.activeFunction.title||"<未命名>"}
                </div>
                <div className="app-title-buttons">
                    <button d-type="optional" onClick={() => this.props.globalApp?.switchStage("")}>停止执行</button>
                </div>
            </div>
            <FunctionStation 
                funcImpl={this.props.activeFunction} 
                actionCollection={actionCollection} 
                onResult={(e) => this.props.globalApp?.submitFuncResult(e)} 
                onClose={() => this.props.globalApp?.switchStage("")} />
            <LastResultList globalApp={this.props.globalApp} />
        </>);
    }
}