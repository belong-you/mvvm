let number = 1;

/**
 * 虚拟节点
 */
export default class VNode {
    constructor (tag, elm, children, text, data, parent, nodeType) {
        this.tag = tag;  // 标签类型
        this.elm = elm;  // 对应的真实节点
        this.children = children;  // 当前节下的子节点
        this.text = text;
        this.data = data;  // 
        this.parent = parent;  // 父节点
        this.nodeType = nodeType;  // 节点类型
        this.env = {};  // 当前节点环境变量
        this.instructions = null;  // 存放指令
        this.template = [];  // 当前节点涉及到的模板
        this.number = number ++;
    }

}