import { getValue } from '../util/ObjectUtil.js'

// 通过模板找节点 .get()
let template2Vnode = new Map();

// 通过节点找模板 .get()
let vnode2Template = new Map();

/**
 * 预备渲染，建立树形结构
 * @param {*} vm 
 * @param {*} vnode 
 */
export function prepareRender (vm, vnode) {
    if (vnode == null) return;

    if (vnode.nodeType == 3) {  // 文本节点
        analysisTemplateString(vnode);
    } else if (vnode.nodeType == 1) {  // 标签节点  
        for (let i = 0; i < vnode.children.length; i ++) {
            prepareRender(vm, vnode.children[i]);
        }
    }
}

// 导出 template2Vnode
export function getTemplate2VnodeMap () {
    return template2Vnode;
}
// 导出 vnode2Template
export function getVnode2TemplateMap () {
    return vnode2Template;
}

// 将 _render 挂载到原型上
export function renderMixin (Due) {
    Due.prototype._render = function () {
        renderNode(this, this._vnode);
    }
}

/**
 * 挂载节点
 * @param {*} vm 实例
 * @param {*} vnode 需要挂载的节点
 */
export function renderNode (vm, vnode) {
    if (vnode.nodeType == 3) {
        let templates = vnode2Template.get(vnode);
        if (templates) {
            let result = vnode.text;
            for (let i = 0; i < templates.length; i ++) {
                let templateValue = getTemplateValue([vm._data, vnode.env], templates[i]);
                if (templateValue) {
                    const reg = result.match(/{{\s?|\s?}}+/g);
                    result = result.replace(reg[0] + templates[i] + reg[1], templateValue);
                }
            }
            vnode.elm.nodeValue = result;
        }
    } else {
        for (let i = 0; i < vnode.children.length; i ++) {
            renderNode(vm, vnode.children[i]);
        }
    }
}

/**
 * 渲染数据，监听数据变化，查找映射的节点，只重新挂载该节点
 */
export function renderData (vm, data) {
    let vnodes = template2Vnode.get(data);
    if (vnodes != null) {
        for (let i = 0; i < vnodes.length; i ++) {
            renderNode(vm, vnodes[i]);
        }
    }
}

// 分析模板字符串，设置 Map 对象
function analysisTemplateString (vnode) {
    let templetaStringList = vnode.text.match(/{{[a-zA-Z0-9._\s]+}}/g);
    for (let i = 0; templetaStringList && i < templetaStringList.length; i ++) {
        // 设置模板、节点 Map 对象，形成映射
        setTemplate2Vnode(templetaStringList[i], vnode);
        setVnode2Template(templetaStringList[i], vnode);
    }
}

// 设置通过模板找节点 Map 对象
function setTemplate2Vnode (template, vnode) {
    let templateName = getTemplateName(template);
    let vnodeSet = template2Vnode.get(templateName);
    if (vnodeSet) {
        vnodeSet.push(vnode);
    } else {
        template2Vnode.set(templateName, [vnode]);  // 设为数组的原因是：去重
    }
    // console.log(template2Vnode)
}
// 设置通过节点找模板 Map 对象
function setVnode2Template (template, vnode) {
    let templateSet = vnode2Template.get(vnode);
    if (templateSet) {
        templateSet.push(getTemplateName(template));
    } else {
        vnode2Template.set(vnode, [getTemplateName(template)])
    }
    // console.log(vnode2Template)
}

/**
 * 获取模板内的名称 “{{ name }}”
 */
function getTemplateName (template) {
    return template.replace(/{{|\s|}}/g, '');
}
/**
 * 获取模板的 value 值
 * @param {*} objs 对象
 * @param {*} templateName 模板 name
 */
function getTemplateValue (objs, templateName) {
    for (let i = 0; i < objs.length; i ++) {
        let temp = getValue(objs[i], templateName);
        if (temp != null) {  // 获取到有值
            return temp;
        }
    }
    return null;
}
