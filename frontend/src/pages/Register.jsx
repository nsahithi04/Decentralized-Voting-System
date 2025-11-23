// src/pages/Register.jsx
import { useEffect, useState } from "react";
import { resolveEventId, getEvent } from "../services/contract";
import { register as doRegister, isRegistered, getRegistrations } from "../services/registration";

export default function Register({ account }) {
  const [query, setQuery] = useState("");
  const [eventId, setEventId] = useState(null);
  const [ev, setEv] = useState(null);
  const [status, setStatus] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      const id = await resolveEventId(query);
      if (ignore) return;
      setEventId(id);
      if (id != null) {
        const e = await getEvent(id);
        if (ignore) return;
        setEv(e);
        setList(getRegistrations(id));
      } else {
        setEv(null);
        setList([]);
      }
    };
    if (query) run(); else { setEventId(null); setEv(null); setList([]); }
    return () => { ignore = true; };
  }, [query]);

  const handleRegister = async () => {
    if (!account) { setStatus("Connect wallet first."); return; }
    if (eventId == null) { setStatus("Enter a valid event (ID or name)."); return; }
    try {
      doRegister(eventId, account);
      setStatus("✅ Registered for this event (off-chain)");
      setList(getRegistrations(eventId));
    } catch (e) {
      setStatus("❌ " + (e?.message || e));
    }
  };

  const already = isRegistered(eventId, account);

  return (
    <div className="container">
      <h2 className="mb-4">Registration</h2>
      <div className="card">
        <p className="mb-3">Wallet: <span className="muted">{account || "Not connected"}</span></p>
        <label>
          Event (ID or name)
          <input className="input ml-2" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. 1 or My Election" />
        </label>
        {ev && (
          <div className="muted mt-2">{ev.name} — {ev.description}</div>
        )}
        <button onClick={handleRegister} className="button button-accent mt-3" disabled={!account || already}>Register</button>
        {already && <div className="alert alert-info mt-2">You are already registered.</div>}
        {status && <div className={`alert mt-2 ${status.startsWith('❌') ? 'alert-danger' : 'alert-info'}`}>{status}</div>}
      </div>
      {eventId != null && (
        <div className="card mt-3">
          <div><strong>Registered addresses</strong></div>
          <div className="muted" style={{ fontSize: 13 }}>{list.length} total</div>
        </div>
      )}
    </div>
  );
}
