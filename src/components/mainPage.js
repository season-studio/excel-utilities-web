import * as React from "react";
import * as ReactDOM from "react-dom";
import predefinedFunctions from "../functions";
import { LastResultList } from "./lastResultList";
import tip from "../../thirdpart/toolkits/src/tip/tip";
import styles from "./mainPage.module.css";
import confirm from "../../thirdpart/toolkits/src/tip/confirm";
import { pickFile } from "../../thirdpart/toolkits/src/fileDlgKit";
import { ProcessDialog } from "./processDialog";

export class MainPage extends React.Component {

    constructor(_props) {
        super(_props);

        this.reloadFunctionList();
    }

    componentDidMount() {
        this.hasMounted = true;
    }

    componentWillUnmount() {
    }

    reloadFunctionList() {
        let allFuncs = [];
        for (let idx = localStorage.length - 1; idx >= 0; idx--) {
            let key = localStorage.key(idx);
            if (key.startsWith("FUNC-")) {
                try {
                    let func = JSON.parse(localStorage.getItem(key));
                    if (func && func.title && func.uuid) {
                        allFuncs.push(func);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        }
        allFuncs = allFuncs.concat(predefinedFunctions);
        this.allFunctions = allFuncs;
        this.hasMounted ? this.setState({ funcList: allFuncs }) : (this.state = { funcList: allFuncs });
        this.functionCategories = Array.from(new Set(allFuncs.map(e => e.category))).filter(e => !!e);
    }

    filterFuncList(_categoryNode, _queryNode) {
        let parentNode = ReactDOM.findDOMNode(this)?.parentElement;
        let category = (_categoryNode || parentNode?.querySelector(".top-bar > select")).value;
        let queryText = (_queryNode || parentNode?.querySelector("input.func-query")).value;
        this.setState({
            funcList: this.allFunctions.filter(item => 
                (!category || String(item.category) === category)
                && (!queryText || String(item.title).includes(queryText))
            )
        });
    }

    onSelectCategory(_event) {
        this.filterFuncList(_event?.target);
    }

    onQueryKeydown(_event) {
        let target = _event?.target;
        if (target) {
            let key = String(_event.key).toLowerCase();
            if (key === "enter") {
                target.value = String(target.value||"").trim();
                this.filterFuncList(undefined, target);
            } else if (key === "escape") {
                target.value = "";
                this.filterFuncList(undefined, target);
            }
        }
    }

    onClearFunctionsQuery(_event) {
        if (checkIsAfterEvent(_event)) {
            let queryInput = ReactDOM.findDOMNode(this)?.parentElement?.querySelector("input.func-query");
            if (queryInput) {
                queryInput.value = "";
                this.filterFuncList(undefined, queryInput);
            }
        }
    }

    async onSaveOfflineEdition() {
        let blob = await ProcessDialog.show("正在打包，请稍候……", async () => {
            try {
                let html = await fetch("./");
                html = await html.text();
                let doc = (new DOMParser()).parseFromString(html, "text/html");
                await Promise.all(Array.from(doc.querySelectorAll("script")).map(async (item) => {
                    if (item.src) {
                        let scriptText = await fetch(item.src);
                        scriptText = await scriptText.text();
                        let newScipt = document.createElement("script");
                        newScipt.innerHTML = scriptText;
                        item.before(newScipt);
                        item.remove();
                    }
                }));
                await Promise.all(Array.from(doc.querySelectorAll("link[rel=\"stylesheet\"]")).map(async (item) => {
                    if (item.src) {
                        let styleText = await fetch(item.href);
                        styleText = await styleText.text();
                        let newStyle = document.createElement("style");
                        newStyle.innerHTML = styleText;
                        item.before(newStyle);
                        item.remove();
                    }
                }));
                html = `<!DOCTYPE html>${doc.documentElement.outerHTML}`;
                return new Blob([html], { type: "text/html" });
            } catch(err) {
                console.error(err);
                tip("打包离线版本失败！", {type:"error", timeout:1700});
            }
        });

        if (blob instanceof Blob) {
            let url;
            try {
                url = URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                a.rel = "noopener";
                a.download = `${PackageName}.html`;
                a.click();
            } catch(err) {
                console.error(err);
                tip("下载离线版本失败！", {type:"error", timeout:1700});
            } finally {
                url && URL.revokeObjectURL(url);
            }
        }
    }

    onShowManageMenu(_event) {
        let parent = ReactDOM.findDOMNode(this)?.parentElement;
        if (parent) {
            this.hideContextMenu();
            let menuNode = parent.querySelector("[d-menu=\"func-manage-context\"]");
            if (menuNode) {
                let winWidth = window.innerWidth;
                let winHeight = window.innerHeight;
                menuNode.style.top = _event.clientY + "px";
                menuNode.style.left = _event.clientX + "px";
                menuNode.style.display = "unset";
                requestAnimationFrame(() => {
                    let {right, bottom, width, height} = menuNode.getBoundingClientRect();
                    (right > winWidth) && (menuNode.style.left = (winWidth - width) + "px");
                    (bottom > winHeight) && (menuNode.style.top = (winHeight - height) + "px");
                    menuNode.focus();
                });
            }
        }
    }

    onContextMenu(_event, _funcItem) {
        _event.preventDefault();
        let parent = ReactDOM.findDOMNode(this)?.parentElement;
        if (parent) {
            this.hideContextMenu();
            let menuNode = parent.querySelector("[d-menu=\"func-item-context\"]");
            if (menuNode) {
                this.contextFunction = _funcItem;
                let winWidth = window.innerWidth;
                let winHeight = window.innerHeight;
                menuNode.style.top = _event.clientY + "px";
                menuNode.style.left = _event.clientX + "px";
                menuNode.style.display = "unset";
                requestAnimationFrame(() => {
                    let {right, bottom, width, height} = menuNode.getBoundingClientRect();
                    (right > winWidth) && (menuNode.style.left = (winWidth - width) + "px");
                    (bottom > winHeight) && (menuNode.style.top = (winHeight - height) + "px");
                    menuNode.focus();
                });
            }
        }
    }

    hideContextMenu() {
        Array.from(ReactDOM.findDOMNode(this)?.parentElement?.querySelectorAll("." + styles.contextMenu)).forEach(e => e.style.display = "none");
        this.contextFunction = undefined;
    }

    async onDeleteFunction(_func) {
        if (predefinedFunctions.includes(_func)) {
            tip("不能删除预定义的功能！", {type:"error", timeout:1700});
        } else if (0 === await confirm(`您确定要删除“${_func.title}”吗？\n未被导出的功能在删除后无法被恢复，请谨慎操作。`, {icon:"warn", buttons:["确定", "取消"], default: 1, buttonAlign:"center"})) {
            let oriScrollTop = ReactDOM.findDOMNode(this)?.parentElement?.querySelector(".func-list")?.scrollTop;
            localStorage.removeItem("FUNC-" + _func.uuid);
            this.reloadFunctionList();
            this.forceUpdate(() => {
                if (oriScrollTop) {
                    let listNode = ReactDOM.findDOMNode(this)?.parentElement?.querySelector(".func-list");
                    listNode && (listNode.scrollTop = oriScrollTop);
                }
            });
        }
    }

    normalizeFunction(_func) {
        _func?.steps?.forEach(e => {
            if (typeof e.action === "function") {
                let signature = e.action.getActionSignature();
                e.action = (signature?.name ? signature.name : e.action.name);
            }
        })
    }

    async onExport(_funcList) {
        if (_funcList) {
            let blob = await ProcessDialog.show("正在准备导出数据", async () => {
                try {
                    _funcList = _funcList.filter(e => !predefinedFunctions.includes(e));
                    if (_funcList.length <= 0) {
                        tip("没有自定义的功能可供导出", {type:"info", timeout:1700});
                    } else {
                        _funcList.forEach(e => this.normalizeFunction(e));
                        return new Blob([JSON.stringify(_funcList)], {type:"text/json"});
                    }
                } catch (err) {
                    console.error(err);
                    tip("导出功能时出现错误！", {type:"error", timeout:1700});
                }
            });
            if (blob instanceof Blob) {
                let url;
                try {
                    url = URL.createObjectURL(blob);
                    let a = document.createElement("a");
                    a.href = url;
                    a.rel = "noopener";
                    a.download = `导出的功能-${new Date().toLocaleString().replace(/[:/\\]/ig, "-")}.eef-json`;
                    a.click();
                } catch(err) {
                    console.error(err);
                    tip("无法下载导出数据！", {type:"error", timeout:1700});
                } finally {
                    url && URL.revokeObjectURL(url);
                }
            }
        }
    }

    async onImport() {
        try {
            let blob = await pickFile(".eef-json");
            if (blob instanceof Blob) {
                await ProcessDialog.show("正在导入数据", async () => {
                    try {
                        let funcs = JSON.parse(await blob.text());
                        if (!funcs) {
                            throw new Error("数据不合法");
                        }
                        (!(funcs instanceof Array)) && (funcs = [funcs]);
                        let count = 0;
                        let conflictiveFuncs = [];
                        funcs.forEach(item => {
                            if (item && item.title && (item.steps?.length > 0)) {
                                (!item.uuid) && (item.uuid = crypto.randomUUID());
                                let key = "FUNC-" + item.uuid;
                                if (localStorage.getItem(key)) {
                                    conflictiveFuncs.push(item);
                                } else {
                                    localStorage.setItem(key, JSON.stringify(item));
                                    count++;
                                }
                            }
                        });
                        if (conflictiveFuncs.length > 0) {
                            let ret = await confirm(`${conflictiveFuncs.map(e => e.title).join("、")} 的ID已经存在。\n您打算怎么处理？`, {
                                icon: "question",
                                buttons: ["覆盖原数据", "更换ID后导入", "放弃导入"],
                                default: 2, 
                                buttonAlign:"center"
                            });
                            if (0 === ret) {
                                conflictiveFuncs.forEach(item => {
                                    localStorage.setItem("FUNC-" + item.uuid, JSON.stringify(item));
                                    count++;
                                });
                            } else if (1 === ret) {
                                conflictiveFuncs.forEach(item => {
                                    let id;
                                    let key;
                                    do {
                                        id = crypto.randomUUID();
                                        key = "FUNC-" + id;
                                    } while(localStorage.getItem(key));
                                    item.uuid = id;
                                    localStorage.setItem(key, JSON.stringify(item));
                                    count++;
                                });
                            }
                        }
                        let leftCount = funcs.length - count;
                        await confirm(`从文件中导入${count}个功能。${leftCount > 0 ? ("\n" + leftCount + "个功能无法导入！") : ""}`, {icon:(leftCount > 0 ? "warn" : "info"), buttons:["确定"], buttonAlign:"center"});
                    } catch(err) {
                        console.error(err);
                        tip(`无法导入功能！\n${err||""}`, {type:"error", timeout:1700});
                    }
                });
                this.reloadFunctionList();
            }
        } catch(err) {
            console.error(err);
            tip(`无法导入功能！\n${err||""}`, {type:"error", timeout:1700});
        }
    }

    onEditFunction(_func) {
        if (predefinedFunctions.includes(_func)) {
            tip("不能编辑预定义的功能！", {type:"error", timeout:1700});
        } else {
            this.props.globalApp?.switchStage("function-editor", {function: _func, existsCategories: this.functionCategories})
        }
    }

    onNewFunction() {
        this.props.globalApp?.switchStage("function-editor", {function: {
            title: `功能${(new Date()).toLocaleString()}`,
            steps: [{
                action: "nop"
            }]
        }, existsCategories: this.functionCategories});
    }

    async onDuplicateFunction(_func) {
        let targetFunc = await ProcessDialog.show("正在复制功能数据", () => {
            try {
                this.normalizeFunction(_func);
                let newFunc = JSON.parse(JSON.stringify(_func));
                newFunc.title = newFunc.title + "(副本)";
                newFunc.uuid = crypto.randomUUID();
                return newFunc;
            } catch(err) {
                console.error(err);
                tip(`无法复制该功能！\n${err||""}`, {type:"error", timeout:1700});
            }
        });
        this.props.globalApp?.switchStage("function-editor", {function: targetFunc, existsCategories: this.functionCategories});
    }

    render() {
        return (<>
            <div className="app-title">
                <div className="app-title-content">
                    {`表格数据工具箱 ${(new Date(Number(BuildStamp))).toLocaleString()}`}
                </div>
                <div className="app-title-buttons">
                    <button d-type="optional" onClick={(e) => this.onShowManageMenu(e.nativeEvent)}>管理</button>
                    {(location.protocol.toLowerCase() !== "file:") ? <button d-type="optional" onClick={() => this.onSaveOfflineEdition()}>保存离线版</button> : undefined}
                </div>
            </div>
            <div className={styles.mainContent}>
                <div className="top-bar">
                    <select style={{width:"calc(33vw)"}} onChange={e => this.onSelectCategory(e)}>
                        <option value="">全部</option>
                        {this.functionCategories.map((item, idx) => <option key={idx} value={item}>{item}</option>)}
                    </select>
                    <div className="func-query-box" d-after-button="×" onClick={(e) => this.onClearFunctionsQuery(e.nativeEvent)}>
                        <input className="func-query" placeholder="搜索" onKeyDown={e => this.onQueryKeydown(e.nativeEvent)} />
                    </div>
                </div>
                <div className="func-list">
                    {(this.state.funcList?.length > 0) 
                        ? this.state.funcList.map((item, idx) => 
                            <div className="item" key={idx} onClick={() => this.props.globalApp?.switchStage("function-player", {activeFunction: item})} onContextMenu={(e) => this.onContextMenu(e.nativeEvent, item)}>
                                <p>{item.title}</p><code>{item.category||"<无类别>"}{predefinedFunctions.indexOf(item) >= 0 ? "(预置)" : undefined}</code>
                            </div>)
                        : <p style={{width:"100%", textAlign:"center"}}>没有可用的功能</p>}
                </div>
            </div>
            <LastResultList globalApp={this.props.globalApp} />
            <div d-menu="func-item-context" className={styles.contextMenu} tabIndex="0" onClick={(e) => this.hideContextMenu()} onBlur={(e) => this.hideContextMenu()} >
                <div className="menu-item" onClick={() => this.onEditFunction(this.contextFunction)}>编辑</div>
                <div className="menu-item" onClick={() => this.onExport([this.contextFunction])}>导出</div>
                <div className="menu-item" onClick={() => this.onDeleteFunction(this.contextFunction)}>删除</div>
                <div className="menu-item" onClick={() => this.onDuplicateFunction(this.contextFunction)}>复制</div>
                <div className="menu-item" onClick={() => this.onNewFunction()}>新建</div>
            </div>
            <div d-menu="func-manage-context" className={styles.contextMenu} tabIndex="0" onClick={(e) => this.hideContextMenu()} onBlur={(e) => this.hideContextMenu()} >
                <div className="menu-item" onClick={() => this.onExport(this.state.funcList)}>导出筛选的功能</div>
                <div className="menu-item" onClick={() => this.onImport()}>从文件中导入功能</div>
                <div className="menu-item" onClick={() => this.onNewFunction()}>新建空白功能</div>
                <div className="menu-item" onClick={() => this.props.globalApp?.switchStage("about-page")}>工具介绍</div>
            </div>
        </>);
    }
}