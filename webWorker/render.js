//尝试实现一个简单的vdom的渲染

//渲染器函数,原理:输入一段虚拟的DOM和该元素的父节点元素后直接渲染
const render = (vdom, parent = null) => {
    const mount = parent ? (el => parent.appendChild(el)) : (el => el);
    if (isTextVdom(vdom)) {
        return mount(document.createTextNode(vdom));
    } else if (isElementVdom(vdom)) {
        const dom = mount(document.createElement(vdom.type));
        if (vdom.children !== undefined)
            for (const child of vdom.children) {
                render(child, dom);
            }
        if (vdom.props !== undefined)
            for (const prop in vdom.props) {
                setAttribute(dom, prop, vdom.props[prop]);
            }
        return dom;
    } else {
        throw new Error(`Invalid VDOM: ${vdom}.`);
    }
};


//用于判断vdom的类型即是否是文本类型的Vdom,
function isTextVdom(vdom) {
    return typeof vdom == 'string' || typeof vdom == 'number';
}

function isElementVdom(vdom) {
    return typeof vdom == 'object' && typeof vdom.type == 'string';
}

function isEventListenerAttr(key, value) {
    return typeof value == 'function' && key.startsWith('on');
}

function isStyleAttr(key, value) {
    return key == 'style' && typeof value == 'object';
}

function isPlainAttr(key, value) {
    return typeof value != 'object' && typeof value != 'function';
}

//用于设置虚拟dom节点的属性
const setAttribute = (dom, key, value) => {
    if (isEventListenerAttr(key, value)) {
        console.log("add event");
        const eventType = key.slice(2).toLowerCase();
        dom.addEventListener(eventType, value);
    } else if (isStyleAttr(key, value)) {
        Object.assign(dom.style, value);
    } else if (isPlainAttr(key, value)) {
        dom.setAttribute(key, value);
    }
}