import { getValue } from "../../util/ObjectUtil.js";
import VNode from "../../vdom/vnode.js";


export function vforInit (vm, elm, parent, instructions) {
    const virualNode = new VNode(elm.nodeName, elm, [], '', getVirtualNodeData(instructions)[2], parent, 0);
    virualNode.instructions = instructions;
    parent.elm.removeChild(elm);  // 移除当前节点（会连带删除一个文本节点）
    parent.elm.appendChild(document.createTextNode(''));  // 添加一个文本节点
    
    analysisInstructions(vm, instructions, elm, parent);
    return virualNode;
}

// 获取指令
function getVirtualNodeData (instructions) {
    let insSet = instructions.trim().split(' ');
    if (insSet.length != 3 || insSet[1] != 'in' && insSet[2] != 'of') {
        throw new Error('error');
    }
    return insSet;
}

/**
 * 分析指令
 */
function analysisInstructions (vm, instructions, elm, parent) {
    let insSet = getVirtualNodeData(instructions);
    let dataSet = getValue(vm._data, insSet[2]);
    if (!dataSet) {
        throw new Error('error');
    }

    let resultSet = [];
    for (let i = 0; i < dataSet.length; i ++) {
        let tempDom = document.createElement(elm.nodeName);
        tempDom.innerHTML = elm.innerHTML;
        let env = analysisKV(insSet[0], dataSet[i], i);  // 获取局部变量
        tempDom.setAttribute('env', JSON.stringify(env));  // 将变量设置到 dom 中
        parent.elm.appendChild(tempDom);
        resultSet.push(tempDom);
    }
    return resultSet;
}

function analysisKV (instructions, value, index) {
    if (/([a-zA-Z0-9_$]+)/.test(instructions)) {
        instructions = instructions.trim();
        instructions = instructions.substring(1, instructions.length - 1);
    }
    let keys = instructions.split(',');
    if (keys.length == 0) {
        throw new Error('error');
    }
    let obj = {};
    if (keys.length >= 1) {
        obj[keys[0].trim()] = value;
    }
    if (keys.length >= 2) {
        obj[keys[1].trim()] = index;
    }
    return obj;
}