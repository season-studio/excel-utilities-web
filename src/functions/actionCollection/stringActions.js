/**
 * 去掉文本前后两端的空白
 * @param {*} _value 待处理的文本 <<< {"editor.ui":{prefix:"去掉文本",postfix:"前后两端的空白"}}
 * @returns {text} 新的文本
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function trimText(_value) {
    return String(_value||((_value === 0) ? 0 : "")).trim();
}

/**
 * 取文本长度
 * @param {*} _value 待处理的文本 <<< {"editor.ui":{prefix:"取文本",postfix:"的长度"}}
 * @returns {number} 文本长度
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function getTextLength(_value) {
    return _value ? String(_value||((_value === 0) ? 0 : "")).length : 0;
}

/**
 * 检查文本开头
 * @param {*} _value1 待检查的文本 <<< {"editor.ui":{prefix:"判断文本",postfix:"是否以"}}
 * @param {*} _value2 文本开头要匹配的子文本 <<< {"editor.ui":{postfix:"开头"}}
 * @returns {boolean} 判断的逻辑结果
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function testStartsWith(_value1, _value2) {
    return String(_value1||((_value1 === 0) ? 0 : "")).startsWith(_value2||((_value2 === 0) ? 0 : ""));
}

/**
 * 检查文本结尾
 * @param {*} _value1 待检查的文本 <<< {"editor.ui":{prefix:"判断文本",postfix:"是否以"}}
 * @param {*} _value2 文本结尾要匹配的子文本 <<< {"editor.ui":{postfix:"结尾"}}
 * @returns {boolean} 判断的逻辑结果
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function testEndsWith(_value1, _value2) {
    return String(_value1||((_value1 === 0) ? 0 : "")).endsWith(_value2||((_value2 === 0) ? 0 : ""));
}

/**
 * 检查包含子文本
 * @param {*} _value1 待检查的文本 <<< {"editor.ui":{prefix:"判断文本",postfix:"是否包含"}}
 * @param {*} _value2 要匹配的子文本 <<< {"editor.ui":{}}
 * @returns {boolean} 判断的逻辑结果
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function testContains(_value1, _value2) {
    return String(_value1||((_value1 === 0) ? 0 : "")).includes(_value2||((_value2 === 0) ? 0 : ""));
}

/**
 * 查找子文本位置
 * 获取子文本在父文本中首次出现的位置
 * @param {*} _value1 待检查的文本 <<< {"editor.ui":{prefix:"获取文本",postfix:"中"}}
 * @param {*} _value2 子本文 <<< {"editor.ui":{postfix:"首次出现的位置"}}
 * @returns {number} 子文本位置，如果找不到则输出-1
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function indexOfSubText(_value1, _value2) {
    return _value2 ? String(_value1||((_value1 === 0) ? 0 : "")).indexOf(String(_value2||((_value2 === 0) ? 0 : ""))) : -1;
}

/**
 * 查找子文本位置
 * 获取子文本在父文本中最后出现的位置
 * @param {*} _value1 待检查的文本 <<< {"editor.ui":{prefix:"获取文本",postfix:"中"}}
 * @param {*} _value2 子文本 <<< {"editor.ui":{postfix:"最后出现的位置"}}
 * @returns {number} 子文本位置，如果找不到则输出-1
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function lastIndexOfSubText(_value1, _value2) {
    return _value2 ? String(_value1||((_value1 === 0) ? 0 : "")).lastIndexOf(String(_value2||((_value2 === 0) ? 0 : ""))) : -1;
}

/**
 * 提取子文本
 * @param {*} _value 总体的文本 <<< {"editor.ui":{prefix:"提取文本",postfix:"中"}} 
 * @param {number} _startIndex 子文本的起始位置 <<< {"editor.ui":{prefix:"序号", postfix:"开始的，"}}
 * @param {number} [_length] 子文本的长度 <<< {"editor.ui":{prefix:"长度为", postfix:"的子文本"}, defaultTip:"不限"}
 * @returns {text} 提取到的子文本
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function pickupSubText(_value, _startIndex, _length) {
    return (arguments.length > 2)
                ? String(_value||((_value === 0) ? 0 : "")).substring(Number(_startIndex), Number(_startIndex) + Number(_length))
                : String(_value||((_value === 0) ? 0 : "")).substring(Number(_startIndex));
}

/**
 * 文本分段
 * @param {*} _value 待分割的文本 <<< {"editor.ui":{prefix:"将文本",postfix:"按照"}}  
 * @param {*} _separator 分割符 <<< {"editor.ui":{postfix:"为分割符切分成多个段"}}  
 * @returns {Array} 文本分段组成的数组
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function splitText(_value, _separator) {
    return _separator ? String(_value||((_value === 0) ? 0 : "")).split(_separator) : [String(_value||((_value === 0) ? 0 : ""))];
}

/**
 * 高级文本测试
 * 使用正则表达式测试文本
 * @param {*} _value 待测试的文本 <<< {"editor.ui":{prefix:"对文本"}}
 * @param {*} _regexText 正则表达式 <<< {"editor.ui":{prefix:"使用正则表达式"}}
 * @param {boolean} [_useCase] 是否忽略大小写 <<< {"editor.ui":{postfix:"进行测试"},alternate:{"忽略大小写":false,"区分大小写":true},defaultTip:"忽略大小写"}
 * @returns {boolean} 测试的逻辑结果
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function testTextByRegex(_value, _regexText, _useCase) {
    return new RegExp(_regexText, _useCase ? "g" : "ig").test(String(_value||((_value === 0) ? 0 : "")));
}

/**
 * 使用正则表达式提取文本
 * @param {*} _value 待处理的文本 <<< {"editor.ui":{prefix:"将文本"}}
 * @param {*} _regexText 正则表达式 <<< {"editor.ui":{prefix:"以正则表达式", postfix:"为匹配规则，提取出匹配的文本段"}}
 * @returns {Array} 由匹配的文本段组成的数组
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function advancePickupSubText(_value, _regexText) {
    let regex = new RegExp(_regexText, "ig");
    _value = String(_value||((_value === 0) ? 0 : ""));
    let fn = function * () {
        let result;
        while (result = regex.exec(_value)) {
            if (result.length > 1) {
                yield result.slice(1);
            } else {
                yield result[0]
            }
        }
    };
    return Array.from(fn());
}

/**
 * 拼接文本
 * @param  {...any} _args 待拼接的文本 <<< {"editor.ui":{prefix:"将", postfix:"拼接成整体文本"}}
 * @returns {text} 拼接后的文本
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function concatText(..._args) {
    return _args.map(item => (item || ((item === 0) ? 0 : ""))).join("");
}

/**
 * 文本转大写
 * @param {*} _value 待处理的文本 <<< {"editor.ui":{prefix:"将文本"}}
 * @param {number} [_startIndex] 局部转换的起始位置，如果省略这个及后续的参数，则所有文本都会被转换 <<< {"editor.ui":{prefix:"从位置", postfix:"开始的"}, defaultTip:"0"}
 * @param {number} [_len] 局部转换的长度，如果省略该参数，则自起始位置开始的所有文本都会被转换 <<< {"editor.ui":{prefix:"长度为", postfix:"的内容转换为大写"}, defaultTip:"不限"}
 * @returns {text} 转换后的文本
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function toUpperCase(_value, _startIndex, _len) {
    if (arguments.length < 2) {
        return String(_value||((_value === 0) ? 0 : "")).toUpperCase();
    } else {
        _value = String(_value||((_value === 0) ? 0 : ""));
        _startIndex = Number(_startIndex)||0;
        let _endIndex = (arguments.length > 2) ? (Number(_len)||0) + _startIndex : _value.length;
        return _value.substring(0, _startIndex) + _value.substring(_startIndex, _endIndex).toUpperCase() + _value.substring(_endIndex);
    }
}

/**
 * 文本转小写
 * @param {*} _value 待处理的文本 <<< {"editor.ui":{prefix:"将文本"}}
 * @param {number} [_startIndex] 局部转换的起始位置，如果省略这个及后续的参数，则所有文本都会被转换 <<< {"editor.ui":{prefix:"从位置", postfix:"开始的"}, defaultTip:"0"}
 * @param {number} [_len] 局部转换的长度，如果省略该参数，则自起始位置开始的所有文本都会被转换 <<< {"editor.ui":{prefix:"长度为", postfix:"的内容转换为小写"}, defaultTip:"不限"}
 * @returns {text}
 * @StepActionSignature
 * @category 文本
 * @hideTitleInEditor
 */
export function toLowerCase(_value, _startIndex, _len) {
    if (arguments.length < 2) {
        return String(_value||((_value === 0) ? 0 : "")).toLowerCase();
    } else {
        _value = String(_value||((_value === 0) ? 0 : ""));
        _startIndex = Number(_startIndex)||0;
        let _endIndex = (arguments.length > 2) ? (Number(_len)||0) + _startIndex : _value.length;
        return _value.substring(0, _startIndex) + _value.substring(_startIndex, _endIndex).toLowerCase() + _value.substring(_endIndex);
    }
}
