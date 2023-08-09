/**
 * 创建复合数据
 * @param {*} [_ref] 从中复制内容的复合数据 <<< {"editor.ui":{prefix:"按照",postfix:"创建一个新的复合数据"}, defaultTip:"空数据"}
 * @returns {object} 新的复合数据
 * @StepActionSignature
 * @category 复合数据
 * @hideTitleInEditor
 */
export function createObject(_ref) {
    let ret = Object();
    _ref && Object.assign(ret, _ref);
    return ret;
}

/**
 * 检查子项
 * 检查一个复合数据中是否含有某个子项
 * @param {*} _target 待检查的复合数据 <<< {"editor.ui":{prefix:"判断复合数据"}}
 * @param {*} _key 子项的名称 <<< {"editor.ui":{prefix:"中是否存在名为",postfix:"的子项"}}
 * @returns {boolean} 判断的逻辑结果
 * @StepActionSignature
 * @category 复合数据
 * @hideTitleInEditor
 */
export function testHasItem(_target, _key) {
    return _target && (String(_key||"") in _target)
}

/**
 * 设置复合数据子项
 * @param {*} _target 存储值的复合数据 <<< {"editor.ui":{prefix:"将复合数据"}}
 * @param {*} _key 值的名称 <<< {"editor.ui":{prefix:"中名为",postfix:"的子项设置为"}}
 * @param {*} _item 值的内容 <<< {"editor.ui":{}}
 * @StepActionSignature
 * @category 复合数据
 * @hideTitleInEditor
 */
export function setObjectItem(_target, _key, _item) {
    if (_target && (typeof _target === "object")) {
        _target[_key] = _item;
    }
}

/**
 * 取复合数据子项
 * @param {*} _target 复合数据 <<< {"editor.ui":{prefix:"提取复合数据"}}
 * @param {*} _key 值的名称 <<< {"editor.ui":{prefix:"中名为",postfix:"的子项的数据"}}
 * @returns {*} 子项的数据
 * @StepActionSignature
 * @category 复合数据
 * @hideTitleInEditor
 */
export function getObjectItem(_target, _key) {
    if (_target && (typeof _target === "object")) {
        return (_key in _target) ? _target[_key] : undefined;
    }
}

/**
 * 取复合数据子项
 * 在复合数据中提取一个值，并在没有对应值时用默认值初始化
 * @param {*} _target 复合数据 <<< {"editor.ui":{prefix:"提取复合数据"}}
 * @param {*} _key 值的名称 <<< {"editor.ui":{prefix:"中名为",postfix:"的子项的数据。\n如果该子项不存在，则将该子项设置为"}}
 * @param {*} _default 当复合数据中不存在对应数据的时候，填充的默认值 <<< {"alternate":{"空对象":{}}, "editable":true, "editor.ui":{}}
 * @returns {*} 子项的数据
 * @StepActionSignature
 * @category 复合数据
 * @hideTitleInEditor
 */
export function getObjectItemWithDefault(_target, _key, _default) {
    if (_target && (typeof _target === "object")) {
        return (_key in _target) ? _target[_key] : (arguments.length > 2 ? (_target[_key] = (_default instanceof Array ? Array.from(_default) : (typeof _default === "object" ? Object.assign(Object(), _default) : _default))) : undefined);
    }
}

/**
 * 删除复合数据子项
 * @param {*} _target 删除值的复合数据 <<< {"editor.ui":{prefix:"删除复合数据"}}
 * @param {*} _key 值的名称 <<< {"editor.ui":{prefix:"中名为",postfix:"的子项"}}
 * @StepActionSignature
 * @category 复合数据
 * @hideTitleInEditor
 */
export function removeObjectItem(_target, _key) {
    if (_target && (typeof _target === "object") && (_key in _target)) {
        delete _target[_key];
    }
}

/**
 * 复制复合数据
 * 从另一个复合数据中复制所有值
 * @param {*} _target 最终存储数据的复合数据 <<< {"editor.ui":{prefix:"向复合数据"}}
 * @param {*} _source 复制值来源的复合数据 <<< {"editor.ui":{prefix:"中复制复合数据",postfix:"内的所有子项"}}
 * @StepActionSignature
 * @category 复合数据
 * @hideTitleInEditor
 */
export function copyObjectFromOther(_target, _source) {
    if (_target && (typeof _target === "object") && (typeof _source === "object")) {
        Object.assign(_target, _source);
    } 
}

/**
 * 遍历复合数据
 * @param {*} _target 复合数据 <<< {"editor.ui":{prefix:"遍历复合数据",postfix:"中的每个子项\n每次遍历得到子项名称key和子项数据value组成的复合数据"}}
 * @yields {Object} 由子项名称key和子项数据value组成的复合数据
 * @StepActionSignature
 * @category 复合数据
 * @autoRelationWith loopNext
 * @hideTitleInEditor
 */
export function * loopForObjectItems(_target) {
    if (_target && (typeof _target === "object")) {
        for (let entry of Object.entries(_target)) {
            yield {
                key: entry[0],
                value: entry[1]
            };
        }
    }
}
