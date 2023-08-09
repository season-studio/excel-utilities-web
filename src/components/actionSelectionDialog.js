import * as React from "react";
import * as ReactDOM from "react-dom";
import styles from "./actionSelectionDialog.module.css";
import actionCollection from "../functions/actionCollection";
import dialog from "../../thirdpart/toolkits/src/tip/dialog";
import tip from "../../thirdpart/toolkits/src/tip/tip";

export class ActionSelectionDialog extends React.Component {

    static show() {
        let dlgNode = document.createElement("div");
        dlgNode.setAttribute("class", styles.actionSelectionDialog);
        return dialog(dlgNode, {
            onInitialize(_dlg) {
                ReactDOM.render(
                    <ActionSelectionDialog dialog={_dlg} />, 
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
            actionList: Object.entries(actionCollection).filter(e => {
                let signature = e[1]?.getActionSignature();
                return signature && (!signature.hiddenForCustomer);
            })
        };
    }

    setActionList(_actionList) {
        this.setState({
            actionList: _actionList,
            selection: undefined
        });
    }

    filterActionList(_categoryNode, _queryNode) {
        let parentNode = ReactDOM.findDOMNode(this)?.parentElement;
        let category = (_categoryNode || parentNode?.querySelector("select")).value;
        let queryText = (_queryNode || parentNode?.querySelector(".filter-box > input")).value;
        this.setActionList(
            Object.entries(actionCollection).filter(e => {
                let signature = e[1]?.getActionSignature();
                return (signature && (!signature.hiddenForCustomer) 
                        && (!category || signature.category?.includes(category))
                        && (!queryText || String(signature.title||"").includes(queryText) || String(signature.description||"").includes(queryText))
                        );
            })
        );
    }

    onChangeCategory(_event) {
        this.filterActionList(_event?.target);
    }

    onSelectAction(_name, _action, _signature) {
        this.setState({
            selection: {
                name: _name,
                action: _action,
                signature: _signature
            }
        });
    }

    onSelectAndSubmitAction(_name, _action, _signature) {
        this.onSelectAction(_name, _action, _signature);
        this.onSubmit();
    }

    onSubmit() {
        if (this.state.selection?.name) {
            let actions = ((this.state.selection.signature?.autoRelationAction?.length > 0) ? [this.state.selection.name, this.state.selection.signature.autoRelationAction].flat() : [this.state.selection.name]);
            this.props.dialog.close(actions);
        } else {
            tip("您需要先选中一个动作", {type:"error", timeout:1700});
        }
    }

    onClearQuery(_event) {
        if (checkIsAfterEvent(_event)) {
            let target = ReactDOM.findDOMNode(this)?.parentElement?.querySelector(".filter-box > input");
            target && (target.value = "");
            this.filterActionList(undefined, target);
        }
    }

    onQueryInputKeyDown(_event) {
        let target = _event?.target;
        if (target) {
            let key = String(_event.key).toLowerCase();
            if (key === "enter") {
                target.value = String(target.value||"").trim();
                this.filterActionList(undefined, target);
            } else if (key === "escape") {
                target.value = "";
                this.filterActionList(undefined, target);
            }
        }
    }

    render() {
        return <>
            <style dangerouslySetInnerHTML={{
                __html: this.state.selection?.name 
                            ? `.action-item[d-name="${this.state.selection?.name}"] { animation: 1s linear 0s forwards 1 ${styles.selectionActionKeyframe}; }` 
                            : "" 
            }}>
            </style>
            <p className="title">请选择动作</p>
            <div className="top-bar">
                类别：
                <select onChange={(e) => this.onChangeCategory(e)}>
                    <option value="">全部</option>
                    {Array.from(
                        new Set(Object.values(actionCollection).map(e => e?.getActionSignature()?.category).flat().filter(e => e)), 
                        (e, idx) => <option value={e} key={idx}>{e}</option>)}
                </select>
                <div className="filter-box" d-after-button="×" onClick={(e) => this.onClearQuery(e.nativeEvent)}>
                    <input placeholder="查找" onKeyDown={(e) => this.onQueryInputKeyDown(e.nativeEvent)}></input>
                </div>
            </div>
            <div className="action-list">
                {(this.state.actionList.length > 1) ? this.state.actionList.map((e, idx) => {
                    let signature = e[1]?.getActionSignature();
                    return signature ? <div className="action-item" key={idx} d-name={e[0]} d-action-category={signature.category?.join(" ")} onClick={() => this.onSelectAction(e[0], e[1], signature)} onDoubleClick={() => this.onSelectAndSubmitAction(e[0], e[1], signature)}>
                        <p>{signature.title}</p>
                        {signature.description ? <p className="extend">{signature.description}</p> : undefined}
                        <code>{signature.category?.join("|")||"<无类别>"}</code>
                    </div> : undefined;
                }) : <p>没有匹配到任何动作</p>}
            </div>
            {(this.state.selection?.signature) ? ((signature) => 
                <div className="action-info">
                    <p className="attention">选中项说明:</p>
                    <p>{signature.title}{signature.isIterator ? "(循环方法)" : ""}</p>
                    {signature.description ? <p className="extend">{signature.description}</p> : undefined}
                    {(signature.returnType?.length > 1) ? <>
                        <p className="attention">输出：</p>
                        <ul>
                            {signature.returnType.map((e, idx) => <li key={idx}>
                                {e.description ? <>{e.description}({e.type})</> : (e.type||"")}
                            </li>)}
                        </ul>
                    </> : ((signature.returnType?.length === 1) ? <p>
                        <span className="attention">输出：</span>
                        {((e) => (e.description ? <>{e.description}({e.type})</> : (e.type||"")))(signature.returnType[0])}
                    </p> : <p className="attention">没有输出</p>)}
                    {signature.arguments?.length > 0 ? <>
                        <p className="attention">输入参数：</p>
                        <ul>
                            {signature.arguments.map((e, idx) => e.isContext ? undefined : <li key={idx}>
                                {e.description}{e.optional ? "(可选)": ""}{e.variable ? "(可变参数)" : ""}
                            </li>)}
                        </ul>
                    </> : undefined}
                </div>)(this.state.selection.signature)
                : undefined
            }
            <div className="buttons-bar">
                <button onClick={() => this.onSubmit()}>确定</button>
                <button d-type="optional" onClick={() => this.props.dialog.close()}>取消</button>
            </div>
        </>
    }
}