
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
