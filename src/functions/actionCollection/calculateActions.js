/**
 * 数值相加
 * @param  {...any} _args 参与计算的数据 <<< {"editor.ui":{prefix:"将",postfix:"相加"}}
 * @returns {number} 计算结果
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function add(..._args) {
    return _args.reduce((a, b) => (Number(a)||0) + (Number(b)||0));
}

/**
 * 数值相减
 * @param  {...any} _args 参与计算的数据 <<< {"editor.ui":{prefix:"将",postfix:"相减"}}
 * @returns {number} 计算结果
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function sub(..._args) {
    return _args.reduce((a, b) => (Number(a)||0) - (Number(b)||0));
}

/**
 * 数值相乘
 * @param  {...any} _args 参与计算的数据 <<< {"editor.ui":{prefix:"将",postfix:"相乘"}}
 * @returns {number} 计算结果
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function mul(..._args) {
    return _args.reduce((a, b) => (Number(a) || 0) * (Number(b) || 0));
}

/**
 * 数值相除
 * @param  {...any} _args 参与计算的数据 <<< {"editor.ui":{prefix:"将",postfix:"相除"}}
 * @returns {number} 计算结果
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function div(..._args) {
    return _args.reduce((a, b) => {
        b = Number(b);
        isNaN(b) && (b = 1);
        return a / b;
    });
}

/**
 * 数值相除取余数
 * @param  {...any} _args 参与计算的数据 <<< {"editor.ui":{prefix:"将",postfix:"相除取余"}}
 * @returns {number} 计算结果
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function mod(..._args) {
    return _args.reduce((a, b) => {
        b = Number(b);
        isNaN(b) && (b = 1);
        return a % b;
    });
}

/**
 * 与运算
 * AND，数值按位与运算
 * @param  {...any} _args 参与计算的数据 <<< {"editor.ui":{prefix:"将",postfix:"逐位进行与运算"}}
 * @returns {number} 计算结果
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function bitAnd(..._args) {
    return _args.reduce((a, b) => {
        try {
            b = BigInt(b);
        } catch {
            b = BigInt("0xFFFFFFFFFFFFFFFF");
        }
        return a & b;
    }, BigInt("0xFFFFFFFFFFFFFFFF"));
}

/**
 * 或运算
 * OR，数值或运算
 * @param  {...any} _args 参与计算的数据 <<< {"editor.ui":{prefix:"将",postfix:"逐位进行或运算"}}
 * @returns {number} 计算结果
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function bitOr(..._args) {
    return _args.reduce((a, b) => {
        try {
            b = BigInt(b);
            return a | b;
        } catch {
            return a;
        }
    }, BigInt(0));
}

/**
 * 异或运算
 * XOR，数值按位异或运算
 * @param  {...any} _args 参与计算的数据 <<< {"editor.ui":{prefix:"将",postfix:"逐位进行异或运算"}}
 * @returns {number} 计算结果
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function bitXor(..._args) {
    return _args.reduce((a, b) => {
        try {
            b = BigInt(b);
            return a ^ b;
        } catch {
            return a;
        }
    }, BigInt(0));
}

/**
 * 与非运算
 * NAND，数值按位与非运算
 * @param  {...any} _args 参与计算的数据 <<< {"editor.ui":{prefix:"将",postfix:"逐位进行与非运算"}}
 * @returns {number} 计算结果
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function bitNand(..._args) {
    return ~_args.reduce((a, b) => {
        try {
            b = BigInt(b);
        } catch {
            b = BigInt("0xFFFFFFFFFFFFFFFF");
        }
        return a & b;
    }, BigInt("0xFFFFFFFFFFFFFFFF"));
}

/**
 * 或非运算
 * NOR，数值按位或非运算
 * @param  {...any} _args 参与计算的数据 <<< {"editor.ui":{prefix:"将",postfix:"逐位进行或非运算"}}
 * @returns {number} 计算结果
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function bitNor(..._args) {
    return ~_args.reduce((a, b) => {
        try {
            b = BigInt(b);
            return a | b;
        } catch {
            return a;
        }
    }, BigInt(0));
}

/**
 * 异或非运算
 * XNOR，数值按位异或非运算
 * @param  {...any} _args 参与计算的数据 <<< {"editor.ui":{prefix:"将",postfix:"逐位进行异或非运算"}}
 * @returns {number} 计算结果
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function bitXnor(..._args) {
    return ~_args.reduce((a, b) => {
        try {
            b = BigInt(b);
            return a ^ b;
        } catch {
            return a;
        }
    }, BigInt(0));
}

/**
 * 取反运算
 * NOT，数值按位取反运算
 * @param  {*} _value 参与计算的数据 <<< {"editor.ui":{prefix:"将",postfix:"按位取反"}}
 * @returns {number} 计算结果
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function bitNot(_value) {
    try {
        _value = BigInt(_value);
        return ~_value;
    } catch {
        return 0;
    }
}

/**
 * 取数学运算常数
 * @param  {text} _name 常数名称 <<< {"editor.ui":{prefix:"取"},alternate:{"圆周率":"PI", "自然对数的底数":"E", "10的自然对数":"LN10", "2的自然对数":"LN2", "以10为底的E的对数":"LOG10E", "以2为底的E的对数":"LOG2E", "1/2的平方根":"SQRT1_2", "2的平方根":"SQRT2"}}
 * @returns {number} 常数值
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function getMathConstant(_name) {
    return ((_name in Math) && (typeof Math[_name] !== "function")) ? Math[_name] : 0;
}

/**
 * 调用数学函数
 * @param  {text} _name 数学函数的名称 <<< {
 *  "editor.ui":{prefix:"计算数学函数 ",postfix:"("},
 *  alternate:{
 *      "取随机数 random":"random",
 *      "取最大数 max":"max",
 *      "取最小数 min":"min",
 *      "取绝对值 abs":"abs",
 *      "取四舍五入的整数 round":"round",
 *      "截取数值的整数部分 trunc":"trunc",
 *      "取小于等于一个给定数字的最大整数 floor":"floor",
 *      "取大于等于给定数字的最小整数 ceil":"ceil",
 *      "取最接近的单精度浮点数 fround":"fround",
 *      "计算幂 pow":"pow",
 *      "取平方根 sqrt":"sqrt",
 *      "取立方根 cbrt":"cbrt",
 *      "取所有参数的平方和的平方根 hypot":"hypot",
 *      "正弦 sin":"sin",
 *      "双曲正弦 sinh":"sinh",
 *      "余弦 cos":"cos",
 *      "双曲余弦 cosh":"cosh",
 *      "正切 tan":"tan",
 *      "双曲正切 tanh":"tanh",
 *      "反正弦 asin":"asin",
 *      "反双曲正弦 asinh":"asinh",
 *      "反余弦 acos":"acos",
 *      "反双曲余弦 acosh":"acosh",
 *      "反正弦 atan":"atan",
 *      "反双曲正弦 atanh":"atanh",
 *      "从原点(0,0)到(x,y)点的线段与 x 轴正方向之间的平面角度 atan2":"atan2",
 *      "自然对数 ln":"log",
 *      "数加1后的自然对数 log1p":"log1p",
 *      "以2为底的对数 log2":"log2",
 *      "以10为底的对数 log10":"log10",
 *      "自然对数的底数的幂 exp":"exp",
 *      "自然对数的底数的幂减1 expm1":"expm1",
 *      "取无符号整数的前导0位数量 clz32":"clz32",
 *      "32位数相乘 imul":"imul",
 *      "取数字的符号位状态 sign":"sign",
 *  }}
 * @param  {...any} _args 参与函数计算的参数 <<< {"editor.ui":{postfix:")"}}
 * @returns {number} 计算结果
 * @StepActionSignature
 * @category 数值计算
 * @hideTitleInEditor
 */
export function mathFunction(_name, ..._args) {
    let fn = Math[_name];
    return (typeof fn === "function") ? fn.apply(Math, _args) : 0;
}
