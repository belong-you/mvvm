# MVVM - Due

[源码地址](https://github.com/belong-you/MVVM_Due)

## 数据响应式（监听属性修改，捕获事件）

- 该对象为对象
    - 用 Object.defineProperty 来监听属性

- 该对象为数组
    - 重写 Array 原型方法（改变 this 指向），对数组的每一个值进行监听 Object.defineProperty
    - 数组中有对象：进行递归，再次监听对象

```js
Object.defineProperty(vm, prop, {
    configurable: true,
    get () {
        return obj[prop];
    },
    set (value) {
        obj[prop] = value;
        // 渲染节点
    }
}
```

## 初始化渲染

1. 建立树形结构，进行预备渲染
    - 创建节点，存放子元素节点、文本节点等；
    - 对子元素节点再次进行递归，最终要形成一个树形结构；
2. 模板与节点之间形成映射关系
    - 将获取到的文本节点进行模板分析，拿到状态值，状态值与 data 对象形成映射关系；
3. 查找节点及属性，挂载替换
    - 通过状态值查找对应的节点与 data 中的属性；
    - 将 data 中的属性与节点内容替换，完成挂载。

## 改变数据，页面刷新

1. 在 Object.defineProperty 改变属性值时，执行 “初始化渲染 3.” （只对数据改变的节点进行重新挂载）

