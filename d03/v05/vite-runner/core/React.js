//type props children
//object express
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                return typeof child === 'string' ? createTextNode(child) : child
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
}
function commitWork(fiber) {
    if (!fiber) return
    fiber.parent.dom.append(fiber.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}
function createDom(type) {
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

function initChildren(fiber) {
    const children = fiber.props.children;
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
function performWorkOfUnit(fiber) {
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type));

        // fiber.parent.dom.append(dom);

        updateProps(dom, fiber.props);
    }

    initChildren(fiber)
    // // 1. 创建DOM
    // if (!work.dom) {
    //     const dom = (work.dom = work.type === 'TEXT_ELEMENT'
    //         ? document.createTextNode("")
    //         : document.createElement(work.type))
    //     work.parent.dom.append(dom)
    //     // 2. 处理props
    //     Object.keys(work.props).forEach((key) => {
    //         if (key !== 'children') {
    //             dom[key] = work.props[key]
    //         }
    //     })
    // }

    // // 3. 转换成Linear，设置好指针
    // const children = work.props.children
    // let prevChild = null
    // children.forEach((child, index) => {
    //     const newWork = {
    //         type: child.type,
    //         props: child.props,
    //         child: null,
    //         parent: work,
    //         sibling: null,
    //         dom: null

    //     }
    //     if (index === 0) {
    //         work.child = newWork
    //     } else {
    //         prevChild.sibling = newWork
    //     }
    //     prevChild = newWork

    // })
    // 4. 返回下一个要执行的任务 
    if (fiber.child) {
        return fiber.child
    }
    if (fiber.sibling) {
        return fiber.sibling
    }
    return fiber.parent?.sibling
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