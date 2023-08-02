import React from "react";
import "./App.css";
import TransferForm from "./TransferForm";
import ConnectWalletButton from "./ConnectWalletButton";

function App() {
  return (
    <div className="App">
      <ConnectWalletButton />
      <TransferForm />
    </div>
  );
}

export default App;
