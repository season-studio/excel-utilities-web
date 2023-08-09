/**
 * 创建数组
 * @param {Array} [_ref] 参考数组
 * 该参数可以忽略；当指定该参数的时候，可以将该参数中的元素复制到新创建的数组中 <<< {"editor.ui":{prefix:"按照",postfix:"创建一个新数组"}, defaultTip:"空数据"}
 * @returns {Array} 新数组
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function createArray(_ref) {
    return _ref instanceof Array ? Array.from(_ref) : Array.of();
}

/**
 * 组装数组
 * 将一串数据组装成一个数组
 * @param {...any} _values 用来组装成数组的数据 <<< {"editor.ui":{prefix:"将",postfix:"组成一个新数组"}}
 * @returns {Array} 新数组
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function makeupArray(..._values) {
    return Array.from(_values);
}

/**
 * 取数组长度
 * @param {Array} _target 目标数组 <<< {"editor.ui":{prefix:"获取数组",postfix:"内的元素数量"}}
 * @returns {number} 数据内的元素数量
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function getArrayLength(_target) {
    return _target?.length || 0;
}

/**
 * 设置数组长度
 * @param {Array} _target 目标数组 <<< {"editor.ui":{prefix:"将数组",postfix:"内的元素数量修改为"}}
 * @param {number} _value 目标长度 <<< {"editor.ui":{}}
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function setArrayLength(_target, _value) {
    (_target instanceof Array) && (!isNaN(_value)) && (_target.length = _value);
}

/**
 * 取数组元素
 * 取得数组的指定位置处的元素
 * @param {Array} _target 目标数组 <<< {"editor.ui":{prefix:"获取数组",postfix:"内"}}
 * @param {number} _index 目标元素位置 <<< {"editor.ui":{prefix:"第",postfix:"号元素的数据"}}
 * @returns {*} 目标元素的数据
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function getArrayElement(_target, _index) {
    return (_target instanceof Array) ? _target[_index] : undefined;
}

/**
 * 设置数组元素
 * 设置数组指定位置处的元素值
 * @param {Array} _target 目标数组 <<< {"editor.ui":{prefix:"将数组",postfix:"内"}}
 * @param {number} _index 目标元素位置 <<< {"editor.ui":{prefix:"第",postfix:"号元素设置为"}}
 * @param {*} _value 目标元素值 <<< {"editor.ui":{}}
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function setArrayElement(_target, _index, _value) {
    (_target instanceof Array) && (_target[_index] = _value)
}

/**
 * 追加数组元素
 * 在数组的尾部追加元素
 * @param {Array} _target 目标数组 <<< {"editor.ui":{prefix:"在数组",postfix:"的结尾添加"}}
 * @param {...any} _values 追加元素的值 <<< {"editor.ui":{}}
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function appendArrayElement(_target, ..._values) {
    (_target instanceof Array) && _target.push(..._values);
}

/**
 * 追加数组
 * 将一个数组内的所有元素追加到既有数组的结尾
 * @param {Array} _target 目标数组 <<< {"editor.ui":{prefix:"在数组",postfix:"的结尾添加"}}
 * @param {Array} _array2 追加元素的值 <<< {"editor.ui":{prefix:"数组", postfix:"内的所有元素"}}
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function appendArrayElementByArray(_target, _array2) {
    (_target instanceof Array) && (_array2 instanceof Array) && _target.push(..._array2);
}

/**
 * 插入数组元素
 * 在数组指定位置插入元素
 * @param {Array} _target 目标数组 <<< {"editor.ui":{prefix:"在数组",postfix:"内"}}
 * @param {number} _index 插入的位置 <<< {"editor.ui":{prefix:"第",postfix:"位置处添加"}}
 * @param {*} _value 插入元素的值 <<< {"editor.ui":{}}
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function insertArrayElement(_target, _index, _value) {
    (_target instanceof Array) && _target.splice(Number(_index)||0, 0, _value);
}

/**
 * 删除数组元素
 * 删除数组指定位置处开始的元素
 * @param {Array} _target 目标数组 <<< {"editor.ui":{prefix:"删除数组",postfix:"内"}}
 * @param {number} _index 要删除元素的起始位置 <<< {"editor.ui":{prefix:"第",postfix:"号元素开始的"}}
 * @param {number} [_count] 要删除的元素数量
 * 如果忽略该参数，则删除起始位置开始的所有元素 <<< {"editor.ui":{postfix:"元素",hasValuePost:"个"}, defaultTip:"所有" } 
 * @returns {Array} 由被删除的元素组成的新数组
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function removeArrayElement(_target, _index, _count) {
    _index = Number(_index);
    if (isNaN(_index) || !(_target instanceof Array)) {
        return [];
    } else {
        _count = Number(_count);
        return isNaN(_count) ? _target.splice(_index) : _target.splice(_index, _count);
    }
}

/**
 * 提取局部数组
 * 提取源数组中某一段元素组成新的数组
 * @param {Array} _src 源数组 <<< {"editor.ui":{prefix:"从数组",postfix:"内提取"}}
 * @param {number} _index 要提取的子数据的首个元素在源数组中的起始位置 <<< {"editor.ui":{prefix:"第",postfix:"号元素开始的"}}
 * @param {number} [_count] 要提取的元素数量
 * 如果忽略该参数，则提取起始位置开始的所有元素 <<< {"editor.ui":{postfix:"元素组成新的数组",hasValuePost:"个"}, defaultTip:"所有" } 
 * @returns {Array} 由提取的元素组成的新数组
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function getSubArray(_src, _index, _count) {
    _index = Number(_index);
    if (isNaN(_index) || !(_src instanceof Array)) {
        return [];
    } else {
        _count = Number(_count);
        return isNaN(_count) ? _src.slice(_index) : _src.slice(_index, _index + _count);
    }
}

/**
 * 查找数组元素
 * 在数组中查找某个元素自指定查找起始位置开始首次出现的位置
 * @param {Array} _target 目标数组 <<< {"editor.ui":{prefix:"在数组",postfix:"中查找"}}
 * @param {*} _value 要查找的元素值 <<< {"editor.ui":{prefix:"值与",postfix:"相等的元素首次出现的位置"}}
 * @param {number} [_startIndex] 查找的起始位置
 * 如果忽略该参数, 则从数组的第一个元素开始查找 <<< {"editor.ui":{prefix:"\n（查找的起始位置为",postfix:"）"}, defaultTip:"数组的头部"}
 * @returns {number} 查找到的元素的位置编号，如果找不到则返回-1
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function indexOfElement(_target, _value, _startIndex) {
    return (_target instanceof Array) ? _target.indexOf(_value, Number(_startIndex)||0) : -1;
}

/**
 * 反向查找数组元素
 * 在数组中查找某个元素自指定位置开始向前查找的首次出现的位置
 * @param {Array} _target 目标数组 <<< {"editor.ui":{prefix:"在数组",postfix:"中查找"}}
 * @param {*} _value 要查找的元素值 <<< {"editor.ui":{prefix:"值与",postfix:"相等的元素最后出现的位置"}}
 * @param {number} [_startIndex] 查找的起始位置
 * 如果忽略该参数, 则从数组的最后一个元素开始查找 <<< {"editor.ui":{prefix:"\n（查找时不超过位置倒数第",postfix:"号元素）"}, defaultTip:"1"}
 * @returns {number} 查找到的元素的位置编号，如果找不到则返回-1
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function lastIndexOfElement(_target, _value, _startIndex) {
    _startIndex = Number(_startIndex);
    (isNaN(_startIndex) || (_startIndex === 0)) && (_startIndex = -1);
    (_startIndex > 0) && (_startIndex = -_startIndex);
    return (_target instanceof Array) ? _target.lastIndexOf(_value, _startIndex) : -1;
}

/**
 * 遍历数组
 * 遍历数组中的每一个元素
 * @param {Array} _target 目标数组 <<< {"editor.ui":{prefix:"循环遍历数组",postfix:"中的每个元素"}}
 * @param {...number} _skips 跳过的元素索引号 <<< {"editor.ui":{prefix:"，但跳过",postfix:"号元素"}}
 * @yields {*} 遍历到的元素
 * @StepActionSignature
 * @autoRelationWith loopNext
 * @category 数组
 * @hideTitleInEditor
 */
export function * loopForArrayElement(_target, ..._skips) {
    if (_target instanceof Array) {
        let idx = 0;
        for (let item of _target) {
            if (!_skips.includes(idx++)) {
                yield item;
            }
        }
    }
}

/**
 * 拼接数组
 * 拼接两个数组保存为新的数组
 * @param {Array} _value1 数组1 <<< {"editor.ui":{prefix:"将数组",postfix:"和"}}
 * @param {Array} _value2 数组2 <<< {"editor.ui":{prefix:"数组",postfix:"拼接为一个新数组"}}
 * @returns {Array} 拼接后的新数组
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function concatArray(_value1, _value2) {
    if (_value1 instanceof Array) {
        return (_value2 instanceof Array) ? _value1.concat(_value2) : Array.from(_value1);
    } else {
        return (_value2 instanceof Array) ? Array.from(_value2) : [];
    }
}

/**
 * 拼接数组为文本
 * 将数组中的元素连接成一段文本
 * @param {Array} _target 目标数组 <<< {"editor.ui":{prefix:"将数组",postfix:"内的所有元素拼接成一段文本"}}
 * @param {*} [_connector] 每两个元素之间的连接符
 * 如果忽略该参数，则两个元素之间不填充任何连接符号 <<< {defaultTip:"无连接符"}
 * @returns {text} 拼接得到的文本
 * @StepActionSignature
 * @category 数组
 * @hideTitleInEditor
 */
export function connectAsText(_target, _connector) {
    return (_target instanceof Array) ? _target.join(_connector||"") : "";
}
