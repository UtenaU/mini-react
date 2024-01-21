import React from "./core/React.js";
// const App = React.createElement("div", { id: "app" }, 'hello,','mini-', 'react','-world')
function Counter({ num }) {
    return <div>count: { num }</div>
}
function CounterContainer() {
    return <Counter></Counter>
}

function App() {
    return (
        <div>hello-mini-rct
            <Counter num={10}></Counter>
            <Counter num={20}></Counter>
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