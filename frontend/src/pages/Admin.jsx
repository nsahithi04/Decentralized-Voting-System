import { useState } from "react";
import { createEvent, addCandidate } from "../services/contract";

export default function Admin() {
  const [evName, setEvName] = useState("");
  const [evDesc, setEvDesc] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [maxCands, setMaxCands] = useState(1);
  const [createMsg, setCreateMsg] = useState("");

  const [candEventId, setCandEventId] = useState(0);
  const [candName, setCandName] = useState("");
  const [candStmt, setCandStmt] = useState("");
  const [candMsg, setCandMsg] = useState("");

  const handleCreate = async () => {
    try {
      setCreateMsg("Creating event...");
      const startTime = Math.floor(new Date(start).getTime() / 1000);
      const endTime = Math.floor(new Date(end).getTime() / 1000);
      await createEvent(evName, evDesc, startTime, endTime, Number(maxCands));
      setCreateMsg("✅ Event created");
    } catch (e) {
      setCreateMsg("❌ " + (e?.message || e));
    }
  };

  const handleAddCandidate = async () => {
    try {
      setCandMsg("Adding candidate...");
      await addCandidate(Number(candEventId), candName, candStmt);
      setCandMsg("✅ Candidate added");
    } catch (e) {
      setCandMsg("❌ " + (e?.message || e));
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Create Event & Add Candidates</h2>

      <div className="grid">
        <div className="card">
          <h3>Create Event</h3>
          <div className="mt-3">
            <label>Name</label>
            <input className="input mt-2" value={evName} onChange={(e) => setEvName(e.target.value)} />
          </div>
          <div className="mt-3">
            <label>Description</label>
            <input className="input mt-2" value={evDesc} onChange={(e) => setEvDesc(e.target.value)} />
          </div>
          <div className="mt-3">
            <label>Start</label>
            <input type="datetime-local" className="input mt-2" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="mt-3">
            <label>End</label>
            <input type="datetime-local" className="input mt-2" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div className="mt-3">
            <label>Max Candidates</label>
            <input type="number" className="input mt-2" value={maxCands} min={1} onChange={(e) => setMaxCands(e.target.value)} />
          </div>
          <button className="button button-primary mt-3" onClick={handleCreate}>Create</button>
          {createMsg && (
            <div className={`alert mt-3 ${createMsg.startsWith('❌') ? 'alert-danger' : 'alert-info'}`}>{createMsg}</div>
          )}
        </div>

        <div className="card">
          <h3>Add Candidate</h3>
          <div className="mt-3">
            <label>Event ID</label>
            <input type="number" className="input mt-2" value={candEventId} onChange={(e) => setCandEventId(e.target.value)} />
          </div>
          <div className="mt-3">
            <label>Name</label>
            <input className="input mt-2" value={candName} onChange={(e) => setCandName(e.target.value)} />
          </div>
          <div className="mt-3">
            <label>Statement</label>
            <input className="input mt-2" value={candStmt} onChange={(e) => setCandStmt(e.target.value)} />
          </div>
          <button className="button button-accent mt-3" onClick={handleAddCandidate}>Add Candidate</button>
          {candMsg && (
            <div className={`alert mt-3 ${candMsg.startsWith('❌') ? 'alert-danger' : 'alert-info'}`}>{candMsg}</div>
          )}
        </div>
      </div>
    </div>
  );
}


