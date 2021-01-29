

export default class VNode {
    constructor (tag, elm, children, text, data, parent, nodeType) {
        this.tag = tag;  // 标签类型
        this.elm = elm;  // 对应的真实节点
        this.children = children;  // 当前节下的子节点
        this.text = text;
        this.data = data;  // 
        this.parent = parent;  // 父节点
        this.nodeType = nodeType;  // 节点类型
    }

    
}