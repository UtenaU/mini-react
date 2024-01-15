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
    // const dom = el.type === 'TEXT_ELEMENT'
    //     ? document.createTextNode("")
    //     : document.createElement(el.type)

    // //处理props
    // Object.keys(el.props).forEach((key) => {
    //     if (key !== 'children') {
    //         dom[key] = el.props[key]
    //     }
    // })
    // //处理children
    // const children = el.props.children;
    // // console.log('children type:', typeof(children))
    // children.forEach((child) => {
    //     render(child, dom)
    // })
    // container.append(dom)
}
let nextWorkOfUnit = null
function workLoop(deadline) {
    let shouldYield = false;
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
        shouldYield = deadline.timeRemaining < 1;
    }
    requestIdleCallback(workLoop)
}
function performWorkOfUnit(work) {
    // 1. 创建DOM
    if (!work.dom) {
        const dom = (work.dom = work.type === 'TEXT_ELEMENT'
            ? document.createTextNode("")
            : document.createElement(work.type))
        work.parent.dom.append(dom)
        // 2. 处理props
        Object.keys(work.props).forEach((key) => {
            if (key !== 'children') {
                dom[key] = work.props[key]
            }
        })
    }

    // 3. 转换成Linear，设置好指针
    const children = work.props.children
    let prevChild = null
    children.forEach((child, index) => {
        const newWork = {
            type: child.type,
            props: child.props,
            child: null,
            parent: work,
            sibling: null,
            dom: null

        }
        if (index === 0) {
            work.child = newWork
        } else {
            prevChild.sibling = newWork
        }
        prevChild = newWork

    })
    // 4. 返回下一个要执行的任务 
    if (work.child) {
        return work.child
    }
    if (work.sibling) {
        return work.sibling
    }
    return work.parent?.sibling
}
requestIdleCallback(workLoop)

const React = {
    render,
    createElement,
}

export default React