import React from "./core/React.js";
// const App = React.createElement("div", { id: "app" }, 'hello,','mini-', 'react','-world')
function Counter() {
    return <div>count</div>
}
function CounterContainer() {
    return <Counter></Counter>
}

function App() {
    return (
        <div>hello-mini-rct
            <Counter></Counter>
            {/* <CounterContainer></CounterContainer> */}
        </div>
    )
}
// const App =
//     <div>hello-mini-rct
//         {/* <Counter></Counter> */}
//         <CounterContainer></CounterContainer>
//     </div>
// function App(){
//     return <div>xxx,mini-react</div>
// }
// console.log(AppOne)
export default App