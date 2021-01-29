import { constructProxy } from "./proxy.js";
import { mount } from './mount.js'

let uid = 0;

export function initMixin (Due) {
    Due.prototype._init = function (options) {
        const vm = this;
        vm.uid = uid ++;
        vm._isDue = true;

        // 初始化 data
        if (options && options.data) {  // 确认传入了 data 属性
            vm._data = constructProxy(vm, options.data, '');
        }

        // 初始化 el 并挂载
        if (options && options.el) {
            let rootDom = document.getElementById(options.el);
            mount(vm, rootDom);
        }
    }
}