import { initMixin } from './init.js';
import { renderMixin } from './render.js';

function Due (options) {
    this._init(options);  // 初始化
    this._render();  // 渲染
}

initMixin(Due);
renderMixin(Due);

export default Due;