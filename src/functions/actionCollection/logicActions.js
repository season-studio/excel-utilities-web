import { FlowController } from "../dataTypes/specialFlowTypes";

/**
 * 条件判断
 * 如果条件成立则执行块中内容
 * @param {Context} _context 
 * @param {*} _value 需要被判断的数据 <<< {"editor.ui":{prefix:"如果"}}
 * @param {number} _mod 判断标准 <<< {"editor.ui":{}, alternate:{
 *      "为真": "0",
 *      "为假": "1",
 *      "不为0": "2",
 *      "为0": "3",
 *      "是有效数据": "4",
 *      "是无效数据": "5",
 * }}
 * @StepActionSignature
 * @autoRelationWith endIf
 * @category 逻辑运算
 * @hideTitleInEditor
 */
export function ifCondition(_context, _value, _mod) {
    _mod = Number(_mod);
    let condition = ((_mod & 1) === 0);
    condition = (_mod >= 4) ? (condition === ((_value !== undefined) && (_value !== null))) : (condition === !!_value);
    if (!condition) {
        return new FlowController({
            toStep: _context.stepInfo?.relationStep[0]
        });
    }
}

/**
 * 结束条件判断逻辑块
 * @StepActionSignature
 * @category 逻辑运算
 * @hiddenForCustomer
 */
export function endIf() { }

const compareMethods = {
    "=": function (a, b) {
        return a == b
    },
    ">": function (a, b) {
        return Number(a) > Number(b)
    },
    ">=": function (a, b) {
        return Number(a) >= Number(b)
    },
    "<": function (a, b) {
        return Number(a) < Number(b)
    }, 
    "<=": function (a, b) {
        return Number(a) <= Number(b)
    }
}

/**
 * 比较两个数据
 * @param {*} _value1 数据1 <<< {"editor.ui":{"prefix":"比较"}}
 * @param {text} _method 比较方法 <<< {"alternate":{"相等":"=", "大于":">", "大于或等于":">=", "小于":"<", "小于或等于":"<="}, "editor.ui":{"prefix":"是否"}}
 * @param {*} _value2 数据2 <<< {"editor.ui":{"prefix":""}}
 * @returns {boolean} 比较的逻辑结果
 * @StepActionSignature
 * @category 逻辑运算
 * @hideTitleInEditor
 */
export function compare(_value1, _method, _value2) {
    let fn = compareMethods[_method];
    return (typeof fn === "function") && fn(_value1, _value2)
}

/**
 * 并且
 * 并且运算，逻辑与运算
 * @param {*} _value1 数据1 <<< {"editor.ui":{prefix:"判断",postfix:"和"}}
 * @param {*} _value2 数据2 <<< {"editor.ui":{postfix:"在逻辑上是否都为真"}}
 * @returns {boolean} 运算结果
 * @StepActionSignature
 * @category 逻辑运算
 * @hideTitleInEditor
 */
export function logicAnd(_value1, _value2) {
    return _value1 && _value2;
}

/**
 * 或者
 * 或者运算，逻辑或运算
 * @param {*} _value1 数据1 <<< {"editor.ui":{prefix:"判断",postfix:"和"}}
 * @param {*} _value2 数据2 <<< {"editor.ui":{postfix:"中任意一者是否在逻辑上是否为真"}}
 * @returns {boolean} 运算结果
 * @StepActionSignature
 * @category 逻辑运算
 * @hideTitleInEditor
 */
export function logicOr(_value1, _value2) {
    return _value1 || _value2;
}

/**
 * 逻辑取反
 * @param {*} _value 数据 <<< {"editor.ui":{prefix:"将",postfix:"按逻辑取反"}}
 * @returns {boolean} 运算结果
 * @StepActionSignature
 * @category 逻辑运算
 * @hideTitleInEditor
 */
export function logicNot(_value) {
    return !_value;
}

/**
 * 根据逻辑赋值
 * 对输入值做逻辑判断，按逻辑真假返回不同的值
 * @param {*} _value 待判断的数据 <<< {"editor.ui":{prefix:"如果",postfix:"为逻辑真，则赋值"}}
 * @param {*} _true 数据为真时，返回的值 <<< {"editor.ui":{postfix:"，否则赋值"}}
 * @param {*} _false 数据为假时，返回的值 <<< {"editor.ui":{}}
 * @returns {*} 最终赋值结果
 * @StepActionSignature
 * @category 逻辑运算
 * @hideTitleInEditor
 */
export function ifElse(_value, _true, _false) {
    return _value ? _true : _false;
}