// src/pages/Home.jsx
export default function Home() {
  return (
    <div className="container">
      <h1 className="mb-2">Decentralized Voting System</h1>
      <p className="muted mb-4">Transparent, on-chain elections. Connect your wallet to participate.</p>
      <div className="grid cols-3">
        <div className="card">
          <h3>Create</h3>
          <p className="muted mt-2">Anyone can create an event and add candidates.</p>
        </div>
        <div className="card">
          <h3>Vote</h3>
          <p className="muted mt-2">Cast a single, verifiable vote per event.</p>
        </div>
        <div className="card">
          <h3>Results</h3>
          <p className="muted mt-2">View live tallies straight from the chain.</p>
        </div>
      </div>
    </div>
  );
}
