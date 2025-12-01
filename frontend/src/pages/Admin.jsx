import { useState } from "react";
import { createEvent, addCandidate, deactivateEvent, resolveEventId } from "../services/contract";

export default function Admin() {
  const [evName, setEvName] = useState("");
  const [evDesc, setEvDesc] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [maxCands, setMaxCands] = useState(1);
  const [createMsg, setCreateMsg] = useState("");

  const [candEventInput, setCandEventInput] = useState("");
  const [candName, setCandName] = useState("");
  const [candStmt, setCandStmt] = useState("");
  const [candMsg, setCandMsg] = useState("");

  const [deactEventInput, setDeactEventInput] = useState("");
  const [deactMsg, setDeactMsg] = useState("");

  const handleCreate = async () => {
    try {
      setCreateMsg("Creating event...");
      const startTime = Math.floor(new Date(start).getTime() / 1000);
      const endTime = Math.floor(new Date(end).getTime() / 1000);
      await createEvent(evName, evDesc, startTime, endTime, Number(maxCands));
      setCreateMsg("SUCCESS: Event created successfully");
    } catch (e) {
      const errorMsg = e?.message || String(e);
      const shortMsg = errorMsg.length > 100 ? errorMsg.substring(0, 100) + "..." : errorMsg;
      setCreateMsg("ERROR: " + shortMsg);
    }
  };

  const handleAddCandidate = async () => {
    try {
      setCandMsg("Adding candidate...");
      const eventId = await resolveEventId(candEventInput);
      if (!eventId) {
        setCandMsg("ERROR: Event not found");
        return;
      }
      await addCandidate(eventId, candName, candStmt);
      setCandMsg("SUCCESS: Candidate added successfully");
    } catch (e) {
      const errorMsg = e?.message || String(e);
      const shortMsg = errorMsg.length > 100 ? errorMsg.substring(0, 100) + "..." : errorMsg;
      setCandMsg("ERROR: " + shortMsg);
    }
  };

  const handleDeactivate = async () => {
    try {
      setDeactMsg("Deactivating event...");
      const eventId = await resolveEventId(deactEventInput);
      if (!eventId) {
        setDeactMsg("ERROR: Event not found");
        return;
      }
      await deactivateEvent(eventId);
      setDeactMsg("SUCCESS: Event deactivated successfully");
    } catch (e) {
      const errorMsg = e?.message || String(e);
      const shortMsg = errorMsg.length > 100 ? errorMsg.substring(0, 100) + "..." : errorMsg;
      setDeactMsg("ERROR: " + shortMsg);
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
            <div className={`alert mt-3 ${
              createMsg.startsWith('ERROR') ? 'alert-danger' :
              createMsg.startsWith('SUCCESS') ? 'alert-success' :
              'alert-info'
            }`}>{createMsg}</div>
          )}
        </div>

        <div className="card">
          <h3>Add Candidate</h3>
          <div className="mt-3">
            <label>Event ID or Name</label>
            <input className="input mt-2" value={candEventInput} onChange={(e) => setCandEventInput(e.target.value)} placeholder="1 or 'Election 2024'" />
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
            <div className={`alert mt-3 ${
              candMsg.startsWith('ERROR') ? 'alert-danger' :
              candMsg.startsWith('SUCCESS') ? 'alert-success' :
              'alert-info'
            }`}>{candMsg}</div>
          )}
        </div>

        <div className="card">
          <h3>Deactivate Event</h3>
          <div className="mt-3">
            <label>Event ID or Name</label>
            <input className="input mt-2" value={deactEventInput} onChange={(e) => setDeactEventInput(e.target.value)} placeholder="1 or 'Election 2024'" />
          </div>
          <button className="button button-warning mt-3" onClick={handleDeactivate}>Deactivate</button>
          {deactMsg && (
            <div className={`alert mt-3 ${
              deactMsg.startsWith('ERROR') ? 'alert-danger' :
              deactMsg.startsWith('SUCCESS') ? 'alert-success' :
              'alert-info'
            }`}>{deactMsg}</div>
          )}
        </div>
      </div>
    </div>
  );
}


