// src/pages/Results.jsx
import { useEffect, useState } from "react";
import { fetchCandidates, fetchResults, getEvent, resolveEventId } from "../services/contract";

export default function Results() {
  const [eventId, setEventId] = useState(0);
  const [eventQuery, setEventQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState("");
  const [eventInfo, setEventInfo] = useState(null);

  const loadAll = async (id) => {
    setMsg("");
    try {
      const [ev, cands, res] = await Promise.all([
        getEvent(id),
        fetchCandidates(id),
        fetchResults(id),
      ]);
      setEventInfo(ev);
      setCandidates(cands);
      setResults(res);
    } catch (e) {
      console.error(e);
      setMsg("Could not load results.");
    }
  };

  useEffect(() => {
    loadAll(eventId);
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

  return (
    <div className="container">
      <h2 className="mb-4">Election Results</h2>

      <label className="mb-3">
        Event (ID or name):
        <input
          type="text"
          value={eventQuery}
          onChange={(e) => setEventQuery(e.target.value)}
          placeholder={`e.g. ${eventId || 1} or "My Election"`}
          className="input ml-2"
        />
      </label>

      <button onClick={() => loadAll(eventId)} className="button mb-4">Refresh</button>

      {msg && <div className="alert alert-danger mb-3">{msg}</div>}

      {eventInfo && (
        <div className="card mb-4">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>{eventInfo.name}</strong></span>
            <span className="muted">{eventInfo.isActive ? 'Active' : 'Inactive'}</span>
          </div>
          <p className="muted mt-2">{eventInfo.description}</p>
        </div>
      )}

      <div className="grid">
        {candidates.map((c, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div>{c.name ?? `Candidate ${idx + 1}`}</div>
              {c.statement && <div className="muted" style={{ fontSize: 13 }}>{c.statement}</div>}
            </div>
            <div>{results[idx]?.toString?.() ?? 0} votes</div>
          </div>
        ))}
      </div>
    </div>
  );
}
