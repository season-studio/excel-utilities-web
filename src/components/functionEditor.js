import * as React from "react";
import * as ReactDOM from "react-dom";
import styles from "./functionEditor.module.css";
import confirm from "../../thirdpart/toolkits/src/tip/confirm";
import { FunctionEditorStepItem } from "./functionEditorStepItem";
import input from "../../thirdpart/toolkits/src/tip/input";
import tip from "../../thirdpart/toolkits/src/tip/tip";
import dialog from "../../thirdpart/toolkits/src/tip/dialog";

class FuncCategoryEditor extends React.Component {

    static show(_initValue, _existsCategories) {
        let dlgNode = document.createElement("div");
        dlgNode.setAttribute("class", styles.editPopupDialog);
        return dialog(dlgNode, {
            onInitialize(_dlg) {
                ReactDOM.render(
                    <FuncCategoryEditor dialog={_dlg} existsCategories={_existsCategories} initValue={_initValue} />, 
                    dlgNode
                );
            },
            onclose() {
                ReactDOM.unmountComponentAtNode(dlgNode);
            }
        });
    }

    static CancelSymbol = Symbol();

    constructor(_props) {
        super(_props);
    }

    componentDidMount() {
        let inputNode = ReactDOM.findDOMNode(this)?.parentElement?.querySelector("[d-input-el]");
        if (inputNode) {
            inputNode.focus();
            inputNode.select();
        }
    }

    onInputKeyDown(_event) {
        let key = String(_event?.key).toLowerCase();
        if (key === "enter") {
            this.onSubmit();
        } else if (key === "escape") {
            this.props.dialog.close(FuncCategoryEditor.CancelSymbol)
        }
    }

    onSubmit() {
        let inputValue = String(ReactDOM.findDOMNode(this)?.parentElement?.querySelector("[d-input-el]")?.value||"").trim();
        this.props.dialog.close(inputValue);
    }

    render() {
        let tmpId = "TID" + Math.random().toString(36) + Date.now();
        return <>
            <p style={{margin: "0.25em, 0"}}>请指定功能的类别</p>
            <input list={tmpId} d-input-el="1" defaultValue={this.props.initValue||""} onKeyDown={(e) => this.onInputKeyDown(e)} ></input>
            <datalist id={tmpId}>
                {Array.from(Object(this.props.existsCategories)).map((e, idx) => <option value={e} key={idx}>{e}</option>)}
            </datalist>
            <div className="buttons-bar">
                <button onClick={() => this.onSubmit()}>确定</button>
                <button d-type="optional" onClick={() => this.props.dialog.close(FuncCategoryEditor.CancelSymbol)}>取消</button>
            </div>
        </>
    }
}

export class FunctionEditor extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = { };
        this.props.function.uuid || (this.props.function.uuid = crypto.randomUUID());
        this.editSteps = (this.props.function.steps||(this.props.function.steps = []));
        this.stepSelectMode = undefined;
        this.eventSite = new EventTarget();
        
        this.eventSite.addEventListener("select-step-for-reference-data", () => this.stepSelectMode = "reference");
        this.eventSite.addEventListener("set-reference-steps", (e) => this.onSetReferenceStep(e));
        this.eventSite.addEventListener("jumpto-reference-step", (e) => this.onJumpToReferenceStep(e));
        this.eventSite.addEventListener("query-step-info", (e) => {
            let id = e?.detail?.id;
            id && (e.detail.info = this.editSteps.find(item => item.id === id));
        });
        this.keydownHandler = (e) => this.onKeyDown(e);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.keydownHandler);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keydownHandler);
    }

    onJumpToReferenceStep(_event) {
        let rID = _event?.detail;
        if (rID) {
            let parentNode = ReactDOM.findDOMNode(this)?.parentElement;
            let stepNode = parentNode.querySelector(`.step[d-step-id="${rID}"]`);
            stepNode?.scrollIntoView({block:"center"});
        }
    }

    onSetReferenceStep(_event) {
        let { referenceIDs, focus } = _event?.detail || {};
        if (focus) {
            this.setState({
                focusReferenceStepIDs: referenceIDs
            });
        } else {
            this.setState({
                referenceStepIDs: referenceIDs
            })
        }
    }

    async onCancel() {
        if (0 === await confirm("您确定要取消编辑吗？\n所有未保存的变更将丢失。", {buttons:["确定", "取消"], icon:"question", buttonAlign:"center"})) {
            this.props.globalApp?.switchStage("");
        }
    }

    onSelectStep(_step) {
        try {
            switch(this.stepSelectMode) {
                case "reference":
                    this.stepSelectMode = "";
                    this.eventSite?.dispatchEvent(new CustomEvent("reference-step-selected", { detail: _step }));
                    break;
                
                default:
                    this.setState({
                        selectionStepID: _step.id,
                        relationStepIDs: Array.from(Object(_step.relationStep)),
                        referenceStepIDs: undefined,
                        focusReferenceStepIDs: undefined
                    });
                    return true;
                    break;
            }
        } catch(err) {
            console.error(err);
        }
    }

    onAddStep(_actions, _step, _before) {
        if (_actions) {
            let index = this.editSteps.indexOf(_step);
            if (index >= 0) {
                let ids = _actions.map(() => `${this.props.function.uuid}-S-${crypto.randomUUID().replaceAll("-", "")}`);
                let newSteps = _actions.map((e, idx) => {
                    return Object.assign({
                        action: e,
                        id: ids[idx],
                        arguments: [],
                    }, (_actions.length > 1) && {
                        relationStep: ids.filter((_, ididx) => (ididx !== idx))
                    });
                });
                this.editSteps.splice(_before ? index : index + 1, 0, ...newSteps);
                this.eventSite.dispatchEvent(new CustomEvent("step-selection-change"));
                this.forceUpdate(() => {
                    ReactDOM.findDOMNode(this)?.parentElement?.querySelector(`.step[d-step-id="${ids[0]}"]`)?.scrollIntoView({block:"center"});
                });
            }
        }
    }

    async onDeleteStep(_step) {

        let stepRels = ((_step.relationStep instanceof Array) ? _step.relationStep : undefined);
        let affectStepsIndex = this.editSteps.map((e, idx) => 
            ((e.id === _step.id) || e.relationStep?.includes(_step.id) || stepRels?.includes(e.id)) ? idx : -1)
        .filter(e => e >= 0);

        if (affectStepsIndex.length > 0) {
            let confirmRet = (affectStepsIndex.length > 1) 
                ? await confirm("警告：删除步骤是不可逆的！\n该步骤关联有其它步骤，相关步骤及其包络的块会受到影响！", {
                    icon:"warn", 
                    buttons:["放弃删除", "删除所有关联步骤及块", "删除关联步骤，保留块"], 
                    default: 0,
                    buttonAlign: "center"
                }) : await confirm("警告：删除步骤是不可逆的！", {
                    icon:"warn", 
                    buttons:["放弃删除", "确定删除"], 
                    default: 0,
                    buttonAlign: "center"
                });

            if (confirmRet > 0) {
                affectStepsIndex.sort((a, b) => ((a > b) ? 1 : ((a === b) ? 0: -1)));
                if (confirmRet === 1) {
                    let startIndex = affectStepsIndex[0];
                    let count = affectStepsIndex[affectStepsIndex.length - 1] - startIndex + 1;
                    this.editSteps.splice(startIndex, count);
                } else if (confirmRet === 2) {
                    affectStepsIndex.reverse().forEach(e => this.editSteps.splice(e, 1));
                }

                if (this.editSteps.length <= 0) {
                    this.editSteps.push({
                        action: "nop",
                        id: `${this.props.function.uuid}-S-${crypto.randomUUID().replaceAll("-", "")}`
                    });
                }
                
                this.eventSite.dispatchEvent(new CustomEvent("step-selection-change"));
    
                let parentNode = ReactDOM.findDOMNode(this)?.parentElement;
                let oriScrollTop = parentNode?.scrollTop;
                this.forceUpdate(() => {
                    parentNode && (parentNode.scrollTop = oriScrollTop);
                });
            }
        }
    }

    async onRename() {
        let value = await input("请输入功能的标题：", undefined, {
            default: this.props.function.title,
            submitText: "确定",
            cancelText: "取消"
        });
        value = value && String(value).trim();
        if (value) {
            this.props.function.title = value;
            this.forceUpdate();
        } else {
            tip("不允许给功能定义空白的标题", {type:"error", timeout:1700});
        }
    }

    async onSetCategory() {
        let oriCategory = this.props.function.category;
        let newCategory = await FuncCategoryEditor.show(oriCategory, this.props.existsCategories);
        if ((newCategory !== FuncCategoryEditor.CancelSymbol) && (newCategory !== oriCategory)) {
            if (newCategory) {
                this.props.function.category = newCategory;
            } else {
                delete this.props.function.category;
            }
        }
    }

    async onSave() {
        try {
            let funcJSON = JSON.stringify(this.props.function);
            localStorage.setItem("FUNC-"+this.props.function.uuid, funcJSON);
            // check if all step is valiable
            this.eventSite.dispatchEvent(new CustomEvent("clear-invalid-tip"));
            let extChecker = (e) => {
                e = Object(e);
                if ("relationStepID" in e) {
                    let rID = e.relationStepID;
                    return !!this.editSteps.find(item => item.id === rID);
                }
            };
            let invalidOutput = {};
            let invalidStep = this.editSteps.find(step => {
                return !FunctionEditorStepItem.checkValid(step, extChecker, invalidOutput);
            });
            if (invalidStep) {
                if (0 === await confirm("功能已保存，但是检查到有步骤存在不正确的配置。\n是否要将异常步骤转到编辑视图中？", {icon:"warn", buttons:["显示异常步骤", "忽略"], buttonAlign:"center"})) {
                    ReactDOM.findDOMNode(this)?.parentElement?.querySelector(`.step[d-step-id="${invalidStep.id}"]`).scrollIntoView({block:"center"});
                    this.setState({
                        invalidStepID: invalidStep.id
                    });
                    setTimeout(() => this.setState({
                        invalidStepID: undefined
                    }), 3000);
                    let invalidTip = (invalidOutput.error ? String(invalidOutput.error) : `第${invalidOutput.invalidArgumentIndex}个参数${invalidOutput.relationStepID ? "引用的步骤不存在" : "没有配置"}`);
                    let tipBox = tip(invalidTip, {type:"error", timeout:0, closable:true});
                    this.eventSite.addEventListener("clear-invalid-tip", function () { tipBox?.close(); tipBox = undefined; }, {once:true});
                } else {
                    return true;
                }
            } else {
                tip("功能已保存", {type:"info", timeout:1700});
                return true;
            }
        } catch(err) {
            console.error(err);
            await confirm("保存功能时出现错误\n" + String(err), {icon:"error", buttons:["确定"], buttonAlign:"center"});
        } finally {
            this.forceUpdate();
        }
    }
    
    async onSaveAndExit() {
        if (await this.onSave()) {
            this.props.globalApp?.switchStage("");
        }
    }

    async onKeyDown(_event) {
        let {key, ctrlKey, altKey, shiftKey} = (_event || {});
        key = String(key).toLowerCase();
        if ((key === "s") && ctrlKey && !altKey && !shiftKey) {
            _event.preventDefault();
            _event.stopPropagation();
            await this.onSave();
        }
    }

    renderSteps(_steps) {
        if (_steps instanceof Array) {
            let skipIdx = 0;
            return _steps.map((step, index) => {
                if (index < skipIdx) {
                    return undefined;
                }
                step.id || (step.id = `${this.props.function.uuid}-S-${crypto.randomUUID().replaceAll("-", "")}`);
                try {
                    // 判断块的起始和中止
                    const placeholderSymbol = Symbol();
                    let relationSteps = Array.from(step.relationStep || []);
                    let subSteps = undefined;
                    if (relationSteps.length > 0) {
                        let lastRelStep = index;
                        if (undefined === _steps.find((item, relIdx) => {
                                let matchIdx = relationSteps.indexOf(item.id);
                                if (matchIdx >= 0) {
                                    if (relIdx < index) {
                                        return true;
                                    }
                                    if (relIdx > lastRelStep) {
                                        lastRelStep = relIdx;
                                    }
                                    relationSteps[matchIdx] = placeholderSymbol;
                                }
                        })) {
                            if (relationSteps.find(e => e !== placeholderSymbol) === undefined) {
                                skipIdx = lastRelStep;
                                subSteps = _steps.slice(index + 1, lastRelStep);
                            }
                        }
                    }
                    // 渲染
                    return <React.Fragment key={index}>
                        <FunctionEditorStepItem step={step} onSelect={e => this.onSelectStep(e)} editorHost={this.eventSite} onAddStep={(a,s,b) => this.onAddStep(a,s,b)} onDeleteStep={(e) => this.onDeleteStep(e)} />
                        { subSteps 
                            ? <div className="step-block" d-step-id={step.id}>{this.renderSteps(subSteps)}</div> 
                            : undefined }
                    </React.Fragment>;
                } catch(err) {
                    console.error(err);
                    // 出错时的渲染
                    return <FunctionEditorStepItem step={step} key={index} error={err} onSelect={e => this.onSelectStep(e)} editorHost={this.eventSite} onAddStep={(a,s,b) => this.onAddStep(a,s,b)} onDeleteStep={(e) => this.onDeleteStep(e)} />;
                }
            });
        }
    }

    render() {
        return <>
            <div className="app-title">
                <div className="app-title-content">
                    { this.state.editTitle ? <input defaultValue={this.props.function.title} ></input> : `编辑：${this.props.function.title||"<未命名>"}` }
                </div>
                <div className="app-title-buttons">
                    <button d-type="optional" onClick={() => this.forceUpdate()}>刷新</button>
                    <button d-type="optional" onClick={() => this.onRename()}>重命名</button>
                    <button d-type="optional" onClick={() => this.onSetCategory()}>设置类别</button>
                    <button d-type="optional" onClick={() => this.onCancel()}>取消</button>
                    <button d-type="optional" onClick={() => this.onSave()}>保存</button>
                    <button d-type="optional" onClick={() => this.onSaveAndExit()}>保存并退出</button>
                </div>
            </div>
            <div className={styles.actionList}>
                <style dangerouslySetInnerHTML={{__html: `.step[d-step-id="${this.state.selectionStepID}"] { animation: 3s linear 0s infinite ${styles.selectionStepKeyframes}}`}}></style>
                {this.state.relationStepIDs?.length > 0 ? <style dangerouslySetInnerHTML={{__html: `${this.state.relationStepIDs.map(e => `.step[d-step-id="${e}"]`).join(", ")} { animation: 3s linear 0s infinite ${styles.relationStepKeyframes}}`}}></style>: undefined}
                {this.state.referenceStepIDs?.length > 0 ? <style dangerouslySetInnerHTML={{__html: `${this.state.referenceStepIDs.map(e => `.step[d-step-id="${e}"]`).join(", ")} { animation: 3s linear 0s infinite ${styles.referenceStepKeyframes}}`}}></style>: undefined}
                {this.state.focusReferenceStepIDs?.length > 0 ? <style dangerouslySetInnerHTML={{__html: `${this.state.focusReferenceStepIDs.map(e => `.step[d-step-id="${e}"]`).join(", ")} { animation: 3s linear 0s infinite ${styles.focusReferenceStepKeyframes}}`}}></style>: undefined}
                {this.state.invalidStepID ? <style dangerouslySetInnerHTML={{__html:`.step[d-step-id="${this.state.invalidStepID}"] { animation: 0.5s linear 0s 5 ${styles.invalidStepFocusKeyframes}}`}}></style> : undefined}
                {this.renderSteps(this.editSteps)}
            </div>
        </>;
    }
}