import React from "react";
// components
import {ModeToggle} from "@/components/mode-toggle.tsx";

const MainPage: React.FC = () => {
  return (
    <>
      <ModeToggle></ModeToggle>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={"/logo.svg"} className="logo" alt="Vite logo" />
        </a>

      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>

  )
}

export default MainPage