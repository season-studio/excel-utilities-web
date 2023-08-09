import * as React from "react";
import * as ReactDOM from "react-dom";
import dialog from "../../thirdpart/toolkits/src/tip/dialog";

export class ProcessDialog extends React.Component {

    static show(_tip, _fn) {
        let dlgNode = document.createElement("div");
        dlgNode.setAttribute("style", "text-align:center;");
        return dialog(dlgNode, {
            onInitialize(_dlg) {
                ReactDOM.render(
                    <ProcessDialog dialog={_dlg} initTip={_tip} processFn={_fn} />, 
                    dlgNode
                );
            },
            onclose() {
                ReactDOM.unmountComponentAtNode(dlgNode);
            }
        });
    }

    constructor(_props) {
        super(_props);

        this.state = {
            tip: this.props.initTip
        };
    }

    componentDidMount() {
        setImmediate(async () => {
            let ret = await Promise.resolve((typeof this.props.processFn === "function") && this.props.processFn(this.changeTip.bind(this)));
            this.props.dialog.close(ret);
        });
    }

    changeTip(_text) {
        this.setState({
            tip: _text
        });
        return new Promise(r => this.forceUpdate(r));
    }

    render() {
        return <>{String(this.state.tip||" ")}</>;
    }
}
