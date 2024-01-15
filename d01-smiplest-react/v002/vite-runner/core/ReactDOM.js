import React from "./React.js";
//用一个ReactDOM对象封装createRoot方法以及对应的render方法
// createRoot返回结果还需要有render方法，同时createRoot接收一个根容器
const ReactDOM = {
    createRoot(container){
        return {
            render(App){
                React.render(App, container)
            }
        }
    }
}

export default ReactDOM