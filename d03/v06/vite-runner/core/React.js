//type props children
//object express
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                console.log(child)
                const isTextNode = typeof child === "string" || typeof child === "number"
                return isTextNode ? createTextNode(child) : child
                // return typeof child === 'string' ? createTextNode(child) : child
            })
        }
    }
}

function createTextNode(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        }
    };
}

function render(el, container) {
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
    root = nextWorkOfUnit
}
let root = null
let nextWorkOfUnit = null
function workLoop(deadline) {
    let shouldYield = false;
    while (!shouldYield && nextWorkOfUnit) {
        // if(!root){
        //     root = nextWorkOfUnit
        // }
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
        shouldYield = deadline.timeRemaining < 1;
    }
    if (!nextWorkOfUnit) {
        // 得到所有的dom都生成了，我们再去统一提交给DOM树去把他们添加上去
        // 即，有了链表之后要从头开始遍历该链表，将其append to dom tree
        // 所以，我们需要有链表头,在所有dom都生成后，统一提交链表头的添加，然后伴随着线性的后续dom元素提交 
        commitRoot(root)
    }
    requestIdleCallback(workLoop)
}
function commitRoot(root) {
    // fiber.parent.dom.append(fiber.dom)
    commitWork(root.child)
    //处理子节点
    root = null
}
function commitWork(fiber) {
    if (!fiber) return

    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }
    if (fiber.dom) {
        // fiber.parent.dom.append(fiber.dom)
        fiberParent.dom.append(fiber.dom)
    }
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}
function createDom(type) {
    console.log(type)
    return type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(type);
}

function updateProps(dom, props) {
    Object.keys(props).forEach((key) => {
        if (key !== "children") {
            dom[key] = props[key];
        }
    });
}

function initChildren(fiber, children) {
    let prevChild = null;
    children.forEach((child, index) => {
        const newFiber = {
            type: child.type,
            props: child.props,
            child: null,
            parent: fiber,
            sibling: null,
            dom: null,
        };

        if (index === 0) {
            fiber.child = newFiber;
        } else {
            prevChild.sibling = newFiber;
        }
        prevChild = newFiber;
    });
}
function updateFunctionComponent(fiber) {
    const children = [fiber.type(fiber.props)]
    initChildren(fiber, children)
}
function updateHostComponent(fiber) {
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type));
        updateProps(dom, fiber.props);
    }
    const children = fiber.props.children
    initChildren(fiber, children)
}
function performWorkOfUnit(fiber) {
    const isFuctionComponent = typeof fiber.type === "function"
    if(isFuctionComponent){
        updateFunctionComponent(fiber)
    }else{
        updateHostComponent(fiber)
    }

    if (fiber.child) {
        return fiber.child
    }
    //循环，要一直往上找父级的sibling，直到父级sibling到顶为空
    let nextFiber = fiber
    while(nextFiber){
        if(nextFiber.sibling) return nextFiber.sibling
        nextFiber = nextFiber.parent
    }
}
requestIdleCallback(workLoop)
/**
 * 如果 main.js 文件引用了 React，并且 react.js 文件中的 requestIdleCallback(workLoop) 是在 main.js 之后执行的，
 * 那么它将共享同一个全局上下文。
 * 在这种情况下，requestIdleCallback 会生效，因为它注册的回调函数 workLoop 将在浏览器的空闲时段内执行。

这是因为全局上下文是一个共享的环境，requestIdleCallback 注册的回调函数是在全局上下文中执行的。
只要 requestIdleCallback 的调用发生在 workLoop 实际需要执行之前，并且在同一个全局上下文中，它就会生效
 */

const React = {
    render,
    createElement,
}

export default React