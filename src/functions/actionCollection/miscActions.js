import { escapeHTMLText, getGlobalStyleSheets } from "../base";
import "./miscStyles.css";

/**
 * 空动作
 * @StepActionSignature
 * @category 杂项
 */
export function nop() {

}

/**
 * 转换成数值
 * 将数据转换为数字值类型
 * @param {*} _value 待转换的数据 <<< {"editor.ui":{prefix:"将",postfix:"转换成数字值"}}
 * @param {number} [_fallback] 转换失败是的默认值
 * 如果忽略该参数，则转换失败的默认值为0 <<< {"editor.ui":{prefix:"\n如果转换失败，则用",postfix:"作为结果数值"}, defaultTip:"0"}
 * @returns {number} 转换得到的数值
 * @StepActionSignature
 * @category 杂项
 * @hideTitleInEditor
 */
export function toNumber(_value, _fallback) {
    let ret = Number(_value);
    return isNaN(ret) ? (_fallback || 0) : ret;
}

/**
 * 调试输出
 * 在调试控制台进行输出
 * @param {...any} _msg 输出的信息 <<< {"editor.ui":{prefix:"在调试控制台输出"}}
 * @StepActionSignature
 * @category 杂项
 * @hideTitleInEditor
 */
export function debugOutput(..._msg) {
    console.log.apply(console, _msg);
}

/**
 * 显示提示
 * @param {Context} _context 
 * @param {*} _tip 提示信息 <<< {"editor.ui":{prefix:"在主界面中显示"}}
 * @param {text} _type 提示类型 <<< {"alternate":{"等待":"wait", "常规":"normal"}, "editor.ui":{prefix:"（该信息以",postfix:"、"}}
 * @param {boolean} [_exclusive] 是否为独占模式 <<< {alternate:{"独占":true,"非独占":false}, "editor.ui":{postfix:"模式进行显示）"}, defaultTip:"非独占"}
 * @StepActionSignature
 * @category 杂项|界面
 * @hideTitleInEditor
 */
export function showTip(_context, _tip, _type, _exclusive) {
    if (!_context?.container) {
        throw "need container";
    }

    if (_exclusive) {
        _context.container.innerHTML = "";
    }

    let div = document.createElement("div");
    let root = div.attachShadow({ mode: "open" });
    let styleHTMLs = getGlobalStyleSheets().map(e => e.outerHTML);
    root.innerHTML = `${styleHTMLs.join("")}<div id="content" class="--action-tip --action-tip-${_type||"normal"}">${escapeHTMLText(_tip||"")}</div>`;
    _context.container.appendChild(div);
}

/**
 * 清除显示区域
 * @param {Context} _context 
 * @StepActionSignature
 * @category 杂项|界面
 */
export function clearDisplay(_context) {
    _context?.container && (_context.container.innerHTML = "");
}

/**
 * 引用数据
 * @param {*} _data 被引用的数据，它将会被原样返回 <<< {"editor.ui":{"prefix":"引用", "postfix":"作为结果"}}
 * @returns {*}
 * @StepActionSignature
 * @category 杂项
 * @hideTitleInEditor
 */
export function referenceData(_data) {
    return _data;
}

/**
 * 触发断点
 * 当打开调试窗口时，此动作将触发一次断点
 * @StepActionSignature
 * @category 杂项
 */
export function triggerBreakpoint() {
    debugger;
}

/**
 * 手动触发一个异常
 * @param {*} _message 异常信息
 * @StepActionSignature
 * @hiddenForCustomer
 */
export async function raiseError(_message) {
    await new Promise(r => setImmediate(r));
    throw new Error(_message);
}
