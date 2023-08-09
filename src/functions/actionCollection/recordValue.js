const valuConvertFns = {
    number(e) {
        return Number(e)||0;
    },
    boolean(e) {
        return String(e).toLowerCase() === "true";
    },
    object(e) {
        try {
            return JSON.parse(e);
        } catch (err) {
            console.warn("BAD JSON", err);
        }
    }
};

/**
 * 加载历史记录
 * @param {text} _key 记录名称 <<< {"editor.ui":{prefix:"提取名为",postfix:"的本地历史记录"}}
 * @param {text} _type 记录类型 <<< {"alternate":{"文本":"text", "数字值":"number", "布尔值":"boolean", "复合数据":"object"},"editor.ui":{prefix:"并转为",postfix:"类型的数据"}}
 * @returns {*} 提取到的历史记录
 * @StepActionSignature
 * @category 杂项
 * @hideTitleInEditor
 */
export function readRecordValue(_key, _type) {
    let val = localStorage.getItem(_key);
    let fn = valuConvertFns[_type];
    return (typeof fn === "function") ? fn(val) : (val||"");
}

/**
 * 存储历史记录
 * @param {text} _key 记录名称 <<< {"editor.ui":{prefix:"将名为",postfix:"的本地历史记录设置为"}}
 * @param {*} _data 要存储的数据 <<< {"editor.ui":{}}
 * @StepActionSignature
 * @category 杂项
 * @hideTitleInEditor
 */
export function writeRecordValue(_key, _data) {
    if ((_data === undefined) || (_data === null)) {
        localStorage.removeItem(_key);
    } else if (typeof _data === "object") {
        localStorage.setItem(_key, JSON.stringify(_data));
    } else {
        localStorage.setItem(_key, _data);
    }
}
