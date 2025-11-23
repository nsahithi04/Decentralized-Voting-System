// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useWallet from "./hooks/useWallet";
import NavBar from "./components/NavBar";
import Onboarding from "./components/Onboarding";
import { getProfile, setProfile } from "./services/profile";
import Home from "./pages/Home";
import Vote from "./pages/Vote";
import Results from "./pages/Results";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import Account from "./pages/Account";

function App() {
  const { account, connect, hasProvider } = useWallet();
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    if (!account) { setShowOnboarding(true); return; }
    const p = getProfile(account);
    setShowOnboarding(!p || !p.displayName);
  }, [account]);

  const handleSaveProfile = (displayName) => {
    if (!account) return;
    setProfile(account, { displayName });
    setShowOnboarding(false);
  };

  return (
    <BrowserRouter>
      <NavBar account={account} onConnect={connect} />
      {showOnboarding && (
        <Onboarding account={account} hasProvider={hasProvider} connect={connect} onSave={handleSaveProfile} />
      )}
      {!hasProvider && (
        <div className="container">
          <div className="alert alert-warn mt-3">MetaMask not detected. Install it to interact with the dApp.</div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register account={account} />} />
        <Route path="/vote" element={<Vote account={account} />} />
        <Route path="/results" element={<Results />} />
        <Route path="/create" element={<Admin />} />
        <Route path="/account" element={<Account account={account} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
