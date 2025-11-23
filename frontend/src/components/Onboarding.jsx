import { useState } from "react";

export default function Onboarding({ account, hasProvider, connect, onSave }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const canSubmit = name.trim().length >= 2;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (!hasProvider) { setMsg("MetaMask not detected."); return; }
    try {
      await connect();
      onSave(name.trim());
    } catch (e) {
      setMsg("❌ " + (e?.message || e));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Welcome</h3>
        <p className="muted">Enter your display name and connect your wallet.</p>
        <label className="mt-3">Display name
          <input className="input ml-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alice" />
        </label>
        <button className="button button-primary mt-3" onClick={handleSubmit} disabled={!canSubmit}>Connect & Continue</button>
        {account && <div className="muted mt-2">Detected: {account.slice(0,6)}...{account.slice(-4)}</div>}
        {msg && <div className={`alert mt-2 ${msg.startsWith('❌') ? 'alert-danger' : 'alert-info'}`}>{msg}</div>}
      </div>
    </div>
  );
}


