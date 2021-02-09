import VNode from "../vdom/vnode.js";
import { vforInit } from "./grammer/vfor.js";
import { vmodel } from "./grammer/vmodel.js";
import { prepareRender, getTemplate2VnodeMap, getVnode2TemplateMap, getVnodeByTemplate, clearMap } from "./render.js";
import { mergeAttr } from '../util/ObjectUtil.js'

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
    
    let vnode = analysisAttr(vm, elm, parent);;  // 创建一个节点
    if (vnode == null) {
        let children = [];  // 存放子节点
        let text = getNodeText(elm);  // 文本节点
        let data = null;
        let nodeType = elm.nodeType;  // 节点类型
        let tag = elm.nodeName;  // 
        vnode = new VNode(tag, elm, children, text, data, parent, nodeType);
        if (elm.nodeType == 1 && elm.getAttribute('env')) {
            vnode.env = mergeAttr(vnode.env, JSON.parse(elm.getAttribute('env')));
        } else {
            vnode.env = mergeAttr(vnode.env, parent ? parent.env : {});
        }
    }

    let childs = vnode.nodeType == 0 ? vnode.parent.elm.childNodes : vnode.elm.childNodes;
    let len = vnode.nodeType == 0 ? vnode.parent.elm.childNodes.length : vnode.elm.childNodes.length;
    for (let i = 0; i < len; i++) {
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

/**
 * 分析属性
 * @param {*} vm 
 * @param {*} elm 
 * @param {*} parent 
 */
function analysisAttr (vm, elm, parent) {
    if (elm.nodeType == 1) {
        let attrNames = elm.getAttributeNames();
        if (attrNames.indexOf('v-model') > -1) {
            vmodel(vm, elm, elm.getAttribute('v-model'));
        }
        if (attrNames.indexOf('v-for') > -1) {
            return vforInit(vm, elm, parent, elm.getAttribute('v-for'));
        }
    }
}

export function rebuild (vm, template) {
    let virtualNode = getVnodeByTemplate(template);
    for (let i = 0; i < virtualNode.length; i ++) {
        virtualNode[i].parent.elm.innerHTML = '';
        virtualNode[i].parent.elm.appendChild(virtualNode[0].elm);
        let result = constructVNode(vm, virtualNode[i].elm, virtualNode[i].parent);
        virtualNode[i].parent.children = [result];
        clearMap();
        prepareRender(vm, vm._vnode);
    }
}