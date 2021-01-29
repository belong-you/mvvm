import VNode from "../vdom/vnode.js";
import { prepareRender, getTemplate2VnodeMap, getVnode2TemplateMap } from "./render.js";

export function initMount (Due) {
    // 挂载到 $mount 上
    Due.prototype.$mount = function (el) {
        let vm = this;
        let rootDom = document.getElementById(el);
        mount(vm, rootDom);
    }
}

export function mount (vm, el) {
    // 进行挂载
    vm._vnode = constructVNode(vm, el, null);

    // 建立树形结构，进行预备渲染（建立模板索引，通过模板找 vnode，通过 vnode 找模板）
    prepareRender(vm, vm._vnode);
}

/**
 * 创建一个节点
 * @param {*} vm 
 * @param {*} elm 
 * @param {*} parent 
 */
function constructVNode (vm, elm, parent) {
    let vnode = null;  // 创建一个节点
    let children = [];  // 存放子节点
    let text = getNodeText(elm);  // 文本节点
    let data = null;
    let nodeType = elm.nodeType;  // 节点类型
    let tag = elm.nodeName;  // 
    vnode = new VNode(tag, elm, children, text, data, parent, nodeType);

    let childs = vnode.elm.childNodes;
    for (let i = 0; i < childs.length; i++) {
        // 递归，深度优先搜索
        let childNodes = constructVNode(vm, childs[i], vnode);
        if (childNodes instanceof VNode) {  // 返回单一节点
            vnode.children.push(childNodes);
        } else {  // 返回数组
            vnode.children = vnode.children.concat(childNodes);  // 将子节点进行拼接
        }
    }
    return vnode;
}

// 获取节点中的文本
function getNodeText (elm) {
    if (elm.nodeType == 3) {
        return elm.nodeValue;
    } else {
        return '';
    }
}
