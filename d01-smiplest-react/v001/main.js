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
    const dom = el.type === 'TEXT_ELEMENT'
        ? document.createTextNode("")
        : document.createElement(el.type)

    //处理props
    Object.keys(el.props).forEach((key) => {
        if (key !== 'children') {
            dom[key] = el.props[key]
        }
    })
    //处理children
    const children = el.props.children;
    // console.log('children type:', typeof(children))
    children.forEach((child) => {
        render(child, dom)
    })
    container.append(dom)
}

// const textEl = createTextNode("app")
const App = createElement("div", { id: "app" }, 'mini-', 'react')

render(App, document.querySelector('#root'))
