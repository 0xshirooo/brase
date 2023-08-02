import React from "react";
import "./ConnectWalletButton.css";

function ConnectWalletButton({ handleConnect, walletAddress }) {
  return (
    <button className="button-connect-wallet" onClick={handleConnect}>
      {walletAddress ? "Connected" : "Connect"}
    </button>
  );
}

export default ConnectWalletButton;
