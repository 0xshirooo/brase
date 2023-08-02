import React, { useState } from "react";
import "./TransferForm.css";
import { ethers } from "ethers";
import ConnectWalletButton from "./ConnectWalletButton";
import ethLogo from "./eth-logo.png";
import baseLogo from "./base-logo.png";
import websiteLogo from "./website-logo.jpeg";

function TransferForm() {
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [network, setNetwork] = useState(null);

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        setNetwork(network);
        setProvider(provider);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (err) {
        console.error("Failed to connect wallet: ", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const switchToMainnet = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      setNetwork(network);
    } catch (switchError) {
      console.log(switchError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (provider && amount) {
      const signer = provider.getSigner();
      const valueToSend = ethers.utils.parseEther(amount);

      // calculate service fee
      const serviceFee = valueToSend
        .mul(ethers.BigNumber.from("1000"))
        .div(ethers.BigNumber.from("1000000")); // 0.1%

      try {
        // Send service fee to your address first
        const tx1 = await signer.sendTransaction({
          to: "0xE8f5988C4408FF3A098221e2Af9CB9e9AdF75E1E", // destination address for service fee
          value: serviceFee, // value in wei
        });
        console.log(tx1);
        alert(`Service fee successful with hash: ${tx1.hash}`);

        // If service fee transaction is successful, send the user specified amount to the desired address
        const tx2 = await signer.sendTransaction({
          to: "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e", // destination address
          value: valueToSend, // value in wei
        });
        console.log(tx2);
        alert(`Transaction successful with hash: ${tx2.hash}`);
      } catch (err) {
        console.error("Failed to send transaction: ", err);
      }
    } else {
      alert("Please connect your wallet and enter an amount.");
    }
  };
  return (
    <div className="container">
      <img src={websiteLogo} alt="Website Logo" className="website-logo" />{" "}
      <ConnectWalletButton
        handleConnect={handleConnect}
        walletAddress={walletAddress}
      />
      {network && network.chainId !== 1 && (
        <button onClick={switchToMainnet}>Switch to Ethereum Mainnet</button>
      )}
      <form className="form" onSubmit={handleSubmit}>
        <div className="title">
          Brase
          <br />
          <span>Bridge ETH easily</span>
        </div>
        <div className="transfer-direction">
          <div className="crypto-container">
            <img src={ethLogo} alt="ethereum logo" className="logo" />
            <div className="label">
              <b className="text">From</b>
              <span>Ethereum</span>
            </div>
          </div>
          <span className="arrow">→</span>
          <div className="crypto-container">
            <img src={baseLogo} alt="base logo" className="logo" />
            <div className="label">
              <b className="text">To</b>
              <span>Base</span>
            </div>
          </div>
        </div>

        <input
          type="number"
          placeholder="ETH Amount" // Updated placeholder
          name="amount"
          className="input"
          min="0"
          step="0.001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="button-confirm">Transfer →</button>
      </form>
    </div>
  );
}

export default TransferForm;
