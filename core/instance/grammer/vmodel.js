import { setValue } from "../../util/ObjectUtil.js"

/**
 * v-model 事件触发
 * @param {*} vm 
 * @param {*} elm 
 * @param {*} data 
 */
export function vmodel (vm, elm, data) {
    // 失去焦点触发，改变状态值
    elm.onchange = function (event) {
        setValue(vm, data, elm.value);
    }
}