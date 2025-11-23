import { useEffect, useState } from "react";
import { getProfile, setProfile, exportProfiles, importProfiles } from "../services/profile";
import { getNoOfEvents, getEvent } from "../services/contract";
import { getRegistrations } from "../services/registration";

export default function Account({ account }) {
  const [displayName, setDisplayName] = useState("");
  const [msg, setMsg] = useState("");
  const [myRegs, setMyRegs] = useState([]);

  useEffect(() => {
    if (!account) return;
    const p = getProfile(account);
    setDisplayName(p?.displayName || "");
    loadMyRegistrations();
  }, [account]);

  const loadMyRegistrations = async () => {
    try {
      const total = await getNoOfEvents();
      const out = [];
      for (let i = 1; i <= total; i++) {
        const list = getRegistrations(i).map((a) => a.toLowerCase());
        if (account && list.includes(account.toLowerCase())) {
          const ev = await getEvent(i);
          out.push({ id: i, name: ev.name, description: ev.description });
        }
      }
      setMyRegs(out);
    } catch (e) {
      // ignore
    }
  };

  const saveName = () => {
    if (!account) { setMsg("Connect wallet first."); return; }
    setProfile(account, { displayName });
    setMsg("✅ Profile saved");
  };

  const handleExport = () => {
    const data = exportProfiles();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profiles.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importProfiles(String(reader.result));
        setMsg("✅ Profiles imported");
      } catch (e) {
        setMsg("❌ " + (e?.message || e));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container">
      <h2 className="mb-4">Account</h2>
      <div className="card">
        <div className="muted">Wallet: {account || 'Not connected'}</div>
        <label className="mt-3">Display name
          <input className="input ml-2" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Alice" />
        </label>
        <button className="button button-primary mt-3" onClick={saveName}>Save</button>
        {msg && <div className={`alert mt-2 ${msg.startsWith('❌') ? 'alert-danger' : 'alert-info'}`}>{msg}</div>}
      </div>

      <div className="card mt-3">
        <div><strong>My Registrations</strong></div>
        {myRegs.length === 0 ? (
          <div className="muted mt-2">No registrations found.</div>
        ) : (
          <div className="grid mt-2">
            {myRegs.map((r) => (
              <div key={r.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>#{r.id} {r.name}</span>
                </div>
                <div className="muted" style={{ fontSize: 13 }}>{r.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card mt-3">
        <div><strong>Profiles backup</strong></div>
        <div className="mt-2">
          <button className="button" onClick={handleExport}>Export</button>
          <label className="button ml-2" style={{ display: 'inline-block' }}>
            Import
            <input type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => e.target.files && handleImport(e.target.files[0])} />
          </label>
        </div>
      </div>
    </div>
  );
}


