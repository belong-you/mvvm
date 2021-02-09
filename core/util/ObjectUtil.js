
/**
 * 获取对象的 value 值
 * @param {*} obj 要查询的对象
 * @param {*} name 对象的 key 值 “a.b”
 */
export function getValue (obj, name) {
    if (!obj) return;
    let nameList = name.split('.');
    let temp = obj;
    for (let i = 0; i < nameList.length; i ++) {
        if (temp[nameList[i]]) {
            temp = temp[nameList[i]];
        } else {
            return undefined;
        }
    }
    return temp;
}
// getValue({a: 1, b: {c: 3}}, 'b.c')  //--> 3

/**
 * 设置对象 value 值
 * @param {*} obj  PS: {a: 1, b: {c: 3}}
 * @param {*} data 要改变的 key 值  PS: a 或 b.c
 * @param {*} value 设置 value
 */
export function setValue (obj, data, value) {
    if (!obj) return;
    let attrList = data.split('.');
    let temp = obj;
    for (let i = 0; i < attrList.length - 1; i ++) {
        if (temp[attrList[i]]) {
            temp = temp[attrList[i]];
        } else {
            return;
        }
    }
    if (temp[attrList[attrList.length - 1]] != null) {
        temp[attrList[attrList.length - 1]] = value;
    }
}

/**
 * 合并对象
 * @param {*} obj1 
 * @param {*} obj2 
 */
export function mergeAttr (obj1, obj2) {
    obj1 == null && clone(obj2);
    obj2 == null && clone(obj1);
    let result = {};
    let obj1Attrs = Object.getOwnPropertyNames(obj1);
    for (let i = 0; i < obj1Attrs.length; i ++) {
        result[obj1Attrs[i]] = obj1[obj1Attrs[i]];
    }
    let obj2Attrs = Object.getOwnPropertyNames(obj2);
    for (let i = 0; i < obj2Attrs.length; i ++) {
        result[obj2Attrs[i]] = obj2[obj2Attrs[i]];
    }
    return result;
}

/**
 * 克隆对象
 * @param {*} obj 
 */
export function clone (obj) {
    // JSON.parse(JSON.stringify(obj))  // 此方法无法合并代理对象

    // 克隆算法
    if (obj instanceof Array) {
        return cloneArray(obj);
    } else if (obj instanceof Object) {
        return cloneObject(obj);
    } else {
        return obj;
    }
}
function cloneObject (obj) {
    let result = {};
    let names = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < names.length; i ++) {
        result[names[i]] = clone(obj[names[i]]);
    }
    return result;
}
function cloneArray (obj) {
    let result = new Array(obj.length);
    for (let i = 0; i < result.length; i ++) {
        result[i] = clone(obj[i]);
    }
    return result;
}