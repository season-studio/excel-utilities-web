import * as React from "react";
import * as ReactDOM from "react-dom";
import "../thirdpart/toolkits/src/tip/default-style.css"
import "./index.css";
import * as Configuration from "./config";
import { MainPage } from "./components/mainPage";
import { FunctionPlayer } from "./components/functionPlayer";
import actionCollection from "./functions/actionCollection";
import { ActionFlowEngine } from "./functions/ActionFlowEngine";
import { FunctionEditor } from "./components/functionEditor";
import predefinedFunctions from "./functions";
import { AboutPage } from "./components/about";

class ExcelUtilitisWebApp extends React.Component {

    constructor(_props) {
        super(_props);

        this.state = {};

        this.eventTarget = new EventTarget();
        this.lastResults = [];

        window.$this = this;
    }

    on(..._args) {
        this.eventTarget.addEventListener(..._args);
    }

    off(..._args) {
        this.eventTarget?.removeEventListener(..._args);
    }

    trigger(_event) {
        this.eventTarget?.dispatchEvent(_event);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    submitFuncResult(_result) {
        if (_result) {
            this.lastResults.push({time: Date.now(), result: _result});
            this.trigger(new CustomEvent("update-last-results"));
        }
    }

    switchStage(_stage, _props) {
        this.setState({
            stage: _stage,
            stageProps: _props
        });
    }

    ["render-function-player"](_app, _props) {
        return <FunctionPlayer globalApp={_app} activeFunction={_props.activeFunction} />;
    }

    ["render-function-editor"](_app, _props) {
        return <FunctionEditor globalApp={_app} function={_props.function} existsCategories={_props.existsCategories} />;
    }

    ["render-about-page"](_app, _props) {
        return <AboutPage globalApp={_app} />;
    }

    renderActionCategoryStyle() {
        let categories = Array.from(
            new Set(Object.values(actionCollection).map(e => e?.getActionSignature()?.category).flat().filter(e => e)));
        if (categories.length > 0) {
            return `* { --action-category-count: ${categories.length}; }\n` + categories.map((e, idx) => `[d-action-category~="${e}"] { --action-category-index: ${idx};}`).join("\n");
        } else {
            return "";
        }
    }

    render() {
        let fn = this["render-" + this.state.stage];
        return <>
            <style dangerouslySetInnerHTML={{__html: this.renderActionCategoryStyle()}}></style>
            {(typeof fn === "function")
                ? fn(this, this.state.stageProps)
                : <><MainPage globalApp={this} />{console.log("stage:", this.state.stage||"main page")}</>}
        </>;
    }
}

function onCalcForTooltip(_event) {
    let element = _event.target;
    if (element.hasAttribute("d-tooltip") && (_event.pseudoElement === "::after")) {
        let { width:cx, height:cy } = getComputedStyle(element, "::after");
        let { x, y, width, height } = element.getBoundingClientRect();
        let { clientWidth, clientHeight } = document.documentElement;
        cx = Number(String(cx).replace("px", ""))||0;
        cy = Number(String(cy).replace("px", ""))||0;
        let tx = ((x + cx) > clientWidth) ? (0 - (cx + x - clientWidth)) : 0;
        let ty = ((y + cy + height) > clientHeight) ? (0 - height - cy) : 0;
        let tt = (ty < 0) ? -1 : 1;
        element.style.setProperty("--tooltip-tx", tx + "px");
        element.style.setProperty("--tooltip-ty", ty + "px");
        element.style.setProperty("--tooltip-tt", tt + "px");
    }
}

window["checkIsAfterEvent"] = function (_event) {
    let element = _event.target;
    if (!element.getAttribute("d-after-button")) {
        return false;
    }
    let { left, top, width, height } = getComputedStyle(element, "::after");
    left = Number(String(left).replace("px", ""));
    top = Number(String(top).replace("px", ""));
    width = Number(String(width).replace("px", ""));
    height = Number(String(height).replace("px", ""));
    let right = left + width;
    let bottom = top + height;
    return (_event.offsetX >= left) && (_event.offsetX < right) && (_event.offsetY >= top) && (_event.offsetY < bottom);
}

/**
 * abc
 * @param  {...any} args 
 * @category abc
 * @return {*} snsq
 */
async function onLoad(...args) {
    document.addEventListener("transitionstart", onCalcForTooltip);
    let appNode = document.querySelector(".app");
    if (appNode) {
        try {
            appNode.innerHTML = "加载中……";
            let funcsFile = await fetch("./functions.json");
            if (funcsFile.ok) {
                funcsFile = await funcsFile.json();
                (funcsFile instanceof Array) && predefinedFunctions.push(...funcsFile);
            }
        } catch(err) {
            console.error(err);
        } finally {
            appNode.innerHTML = "";
        }
        ReactDOM.render(
            <ExcelUtilitisWebApp />, 
            appNode
        );
    }
}

window.addEventListener("load", onLoad);

if (__DEV_MODE__) {
    console.log("DEBUG:");
    Object.keys(actionCollection).forEach(item => {
        item = actionCollection[item];
        console.log(item?.getActionSignature?.call(item));
    });

    window.$doFlowTest = async function(_flow, _p) {
        let node = document.querySelector("#test-node");
        if (!node) {
            node = document.createElement("div");
            node.setAttribute("id", "test-node");
            document.body.appendChild(node);
        }
        try {
            let engine = new ActionFlowEngine(_flow, actionCollection);
            console.timeEnd("a1");
            console.time("a1");
            for await (let r of engine.execute(node)) {
                _p && r && console.log(String(r));
            }
            console.timeEnd("a1");
            console.log(Array.from(engine.iterateResult()));
        } catch (err) {
            console.error(err);
        }
    }

    window.$doTest = async function(_count, _a, _p) {
        function * fn(_count) {
            for (let i = 0; i < _count; i++) {
                yield i;
            }
        }
        console.timeEnd("a2");
        console.time("a2");
        let rs = [];
        for (let i of fn(_count)) {
            _p && console.debug("STEP", i, $doTest.name);
            _a ? await Promise.resolve((async () => console.log(i))()) : console.log(i);
            //rs.push(console.log(i));
            //rs.push(null);
            _p && console.debug("STEP #", i, "=>", undefined);
            _p && console.debug("step passed", {i});
        }
        console.timeEnd("a2");
    }
}
