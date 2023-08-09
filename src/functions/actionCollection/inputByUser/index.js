import * as React from "react";
import * as ReactDOM from "react-dom";
import { generateTableHTML, readTableFromClipboard } from "../../base";
import styles from "./inputByUser.module.css";
import { getGlobalStyleSheets } from "../../base";
import tip from "../../../../thirdpart/toolkits/src/tip/tip";

class InputByUserView extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = { };
        this.inputNode = React.createRef();
    }
    
    componentDidMount() {
    }

    componentWillUnmount() {
        this.props.onResult(this.props.defaultValue);
    }

    onSubmit() {
        let inputNode = this.inputNode.current;
        let result = inputNode.value;
        if (!result) {
            if (this.props.defaultValue !== undefined) {
                result = this.props.defaultValue;
            } else {
                tip("请输入数据", {type:"warn", timeout: 1000});
                return;
            }
        }
        if (inputNode.type === "number") {
            result = Number(result);
            if (isNaN(result)) {
                tip("请输入数值类型的数据", {type:"error", timeout: 1000});
                return;
            }
        }
        this.props.onResult(result);
    }

    onKeyDown(e) {
        let key = String(e?.key).toLowerCase();
        if (key === "enter") {
            this.onSubmit();
        }
    }

    render() {
        return (<>
            <div>{String(this.props.tip||"").split("\n").map((e, idx) => <React.Fragment key={idx}>
                {idx > 0 ? <br /> : undefined}
                {e.trim()}
            </React.Fragment>)}</div>
            <div className={styles.inputLine}>
                <input ref={this.inputNode} type={this.props.valueType} defaultValue={this.props.initValue} placeholder={this.props.defaultValue === undefined ? "" : `${this.props.tip} (默认为"${this.props.defaultValue}")`} className={styles.inputBox} 
                    onKeyDown={(e) => this.onKeyDown(e.nativeEvent) } />
                &nbsp;<button onClick={() => this.onSubmit()}>确定</button>
            </div>
        </>);
    }
}

/**
 * 用户输入
 * @param {Context} _context 
 * @param {text} _tip 提示信息 <<< {"editor.ui":{prefix:"显示",postfix:"等待用户输入"}}
 * @param {text} _type=text 数据类型 <<< {"alternate":{"文本":"text", "数值":"number"}, "editor.ui":{postfix:"类型数据"}}
 * @param {text|number} [_initValue] 初始值 <<< {"editor.ui":{prefix:"\n初始数据是"}}
 * @param {text|number} [_defaultValue] 默认值 <<< {"editor.ui":{prefix:"默认数据是"}}
 * @returns {text|number}
 * @StepActionSignature
 * @category 杂项|界面
 * @hideTitleInEditor
 */
async function inputByUser(_context, _tip, _type, _initValue, _defaultValue) {
    if (!_context?.container) {
        throw "need container";
    }

    (["text", "number"].indexOf(_type) < 0) && (_type = "text");

    try {
        _context.container.innerHTML = "";
        return await new Promise(r => {
            ReactDOM.render(
                <InputByUserView valueType={_type} tip={_tip||""} initValue={String(_initValue||((_initValue === 0) ? 0 : ""))} defaultValue={_defaultValue} onResult={r} />,
                _context.container
            );
        });
    } finally {
        ReactDOM.unmountComponentAtNode(_context.container);
    }
}

export default inputByUser;