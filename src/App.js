import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import Main from "./components/Main";
import RightPanel from "./components/RightPanel";
import React from "react";

function App() {
  return (
    <div className="App">
      <Header />
      <LeftPanel />
      <RightPanel />
      <Main />
    </div>
  );
}

export default App;
