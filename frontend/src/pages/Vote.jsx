// src/pages/Vote.jsx
import { useEffect, useState } from "react";
import { fetchCandidates, castVote, getEvent, resolveEventId } from "../services/contract";
import { isRegistered } from "../services/registration";

export default function Vote({ account }) {
  const [eventId, setEventId] = useState(0);
  const [eventQuery, setEventQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [eventInfo, setEventInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const loadCandidates = async (id) => {
    setLoading(true);
    setMsg("");
    try {
      const [ev, list] = await Promise.all([
        getEvent(id),
        fetchCandidates(id),
      ]);
      setEventInfo(ev);
      setCandidates(list);
      if (!list.length) setMsg("No candidates for this event.");
    } catch (e) {
      console.error(e);
      setMsg("Error loading candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates(eventId);
  }, [eventId]);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      const resolved = await resolveEventId(eventQuery);
      if (!ignore && resolved != null) setEventId(resolved);
    };
    if (eventQuery && eventQuery !== String(eventId)) run();
    return () => { ignore = true; };
  }, [eventQuery]);

  const handleVote = async (idx) => {
    if (!account) {
      setMsg("ERROR: Connect wallet first.");
      return;
    }
    if (!isRegistered(eventId, account)) {
      setMsg("ERROR: You must register for this event first (see Register tab).");
      return;
    }
    try {
      setMsg("Submitting vote...");
      await castVote(eventId, idx);
      setMsg("SUCCESS: Vote recorded on-chain.");
    } catch (e) {
      console.error(e);
      const errorMsg = e?.message || String(e);
      const shortMsg = errorMsg.length > 80 ? errorMsg.substring(0, 80) + "..." : errorMsg;
      setMsg("ERROR: " + shortMsg);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Cast Your Vote</h2>

      <label className="mb-2">
        Event (ID or name):
        <input
          type="text"
          value={eventQuery}
          onChange={(e) => setEventQuery(e.target.value)}
          placeholder={`e.g. ${eventId || 1} or "My Election"`}
          className="input ml-2"
        />
      </label>

      {eventInfo && (
        <div className="card mt-3">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>{eventInfo.name}</strong></span>
            <span className="muted">{eventInfo.isActive && Date.now() / 1000 <= Number(eventInfo.endTime) ? 'Active' : 'Inactive'}</span>
          </div>
          <p className="muted mt-2">{eventInfo.description}</p>
          <p className="muted mt-2">Window: {new Date(Number(eventInfo.startTime) * 1000).toLocaleString()} → {new Date(Number(eventInfo.endTime) * 1000).toLocaleString()}</p>
        </div>
      )}

      {loading ? (
        <div className="alert alert-info mt-3">Loading candidates...</div>
      ) : (
        <div className="grid cols-3 mt-4">
          {candidates.map((c, idx) => (
            <div key={idx} className="card">
              <h3>{c.name ?? `Candidate ${idx + 1}`}</h3>
              {c.statement && <p className="muted mt-2">{c.statement}</p>}
              <p className="muted">Index: {idx}</p>
              <button onClick={() => handleVote(idx)} className="button button-primary mt-3">Vote</button>
            </div>
          ))}
        </div>
      )}

      {msg && (
        <div className={`alert mt-4 ${
          msg.startsWith('ERROR') ? 'alert-danger' :
          msg.startsWith('SUCCESS') ? 'alert-success' :
          'alert-info'
        }`}>{msg}</div>
      )}
    </div>
  );
}
