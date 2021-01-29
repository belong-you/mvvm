import { renderData } from "./render.js";

const arrayProto = Array.prototype;
function defArrayFunc (obj, func, namespace, vm) {
    Object.defineProperty(obj, func, {
        enumerable: true,  // 可枚举的
        configurable: true,  // 可配置的
        value (...args) {
            let original = arrayProto[func];
            const result = original.apply(this, args);
            // console.log(getNameSpace(namespace, ''));
            renderData(vm, getNameSpace(namespace, prop));
            return result;
        }
    })
}

// 对数组方法进行代理
function proxyArr (vm, arr, namespace) {
    // 方法重写
    let obj = {
        eleType: 'Array',
        toString () {
            let result = '';
            for (let i = 0; i < arr.length; i ++) {
                result += arr[i] + ', ';
            }
            return result.substring(0, result.length - 2);  // 减去最后面的 ', '
        },
        push () {},
        pop () {},
        shift () {},
        unshift () {},
    }
    defArrayFunc.call(vm, obj, 'pop', namespace, vm);
    defArrayFunc.call(vm, obj, 'push', namespace, vm);
    defArrayFunc.call(vm, obj, 'shift', namespace, vm);
    defArrayFunc.call(vm, obj, 'unshift', namespace, vm);
    arr.__proto__ = obj;

    return arr;
}

/**
 * 监听属性修改，捕获事件
 * @param {*} vm  Due 对象
 * @param {*} obj  要代理的对象
 * @param {*} namespace 
 */
export function constructProxy (vm, obj, namespace) {
    let proxyObj = null;

    if (obj instanceof Array) {  // 如果为数组
        proxyObj = new Array(obj.length);
        for (let i = 0; i < obj.length; i++) {
            // 再次进行递归
            if (proxyObj[i] instanceof Object) {
                proxyObj[i] = constructProxy(vm, obj[i], namespace);
            }
        }
        proxyObj = proxyArr(vm, obj, namespace);
    } else if (obj instanceof Object) {  // 如果为对象
        // 递归
        proxyObj = constructObjectProxy(vm, obj, namespace);
    } else {
        throw new Error('error')
    }

    return proxyObj;
}


/**
 * 
 * @param {*} vm 
 * @param {*} obj 
 * @param {*} namespace 
 */
function constructObjectProxy (vm, obj, namespace) {
    let proxyObj = {};

    // 遍历该对象，对每个 key 值添加 get 和 set 方法
    for (const prop in obj) {
        Object.defineProperty(proxyObj, prop, {  // Object 身上的方法，属性描述符
            configurable: true,
            get () {
                return obj[prop];
            },
            set (value) {  // 改变数据
                // console.log(`${getNameSpace(namespace, prop)}: ${value}`);
                obj[prop] = value;
                renderData(vm, getNameSpace(namespace, prop));
            }
        })

        // 将 _data 中的属性挂载到 vm 上，可以在实例上直接调用
        Object.defineProperty(vm, prop, {
            configurable: true,
            get () {
                return obj[prop];
            },
            set (value) {
                // console.log(`${getNameSpace(namespace, prop)}: ${value}`);
                obj[prop] = value;
                renderData(vm, getNameSpace(namespace, prop));
            }
        })

        // 解决对象嵌套的情况
        if (obj[prop] instanceof Object) {
            // 递归到父级去
            proxyObj[prop] = constructProxy(vm, obj[prop], getNameSpace(namespace, prop))
        }
    } 

    return proxyObj;
}

/**
 * 获取当前属性
 * @param {*} nowNameSpace  当前的 namespace
 * @param {*} nowProp  当前属性
 */
function getNameSpace (nowNameSpace, nowProp) {
    if (nowNameSpace == null || nowNameSpace == '') {
        return nowProp;
    } else if (nowProp == null || nowProp == '') {
        return nowNameSpace;
    } else {
        return nowProp + '.' + nowNameSpace;
    }
}