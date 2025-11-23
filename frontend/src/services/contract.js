// src/services/contract.js
import { ethers } from "ethers";
import abi from "../abi.json";
import { CONTRACT_ADDRESS } from "../config";

async function getSignerAndContract() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  if (!CONTRACT_ADDRESS) throw new Error("Contract address missing. Set REACT_APP_CONTRACT_ADDRESS.");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  return { signer, contract };
}

// READ candidates for an event
export async function fetchCandidates(eventId) {
  const { contract } = await getSignerAndContract();
  // adjust this if your function name is a bit different
  const candidates = await contract.getCandidates(eventId);
  return candidates;
}

// READ results for an event
export async function fetchResults(eventId) {
  const { contract } = await getSignerAndContract();
  const results = await contract.getResults(eventId);
  // getResults returns [names[], voteCount[]]; return only the vote counts
  const voteCounts = Array.isArray(results) && results.length >= 2 ? results[1] : [];
  return voteCounts;
}

// WRITE: cast vote
export async function castVote(eventId, candidateIndex) {
  const { contract } = await getSignerAndContract();
  const tx = await contract.vote(eventId, candidateIndex);
  await tx.wait();
  return true;
}

// OPTIONAL admin calls
export async function createEvent(name, description, startTime, endTime, noOfCandidates) {
  const { contract } = await getSignerAndContract();
  const tx = await contract.createEvent(name, description, startTime, endTime, noOfCandidates);
  await tx.wait();
}

export async function addCandidate(eventId, name, statement) {
  const { contract } = await getSignerAndContract();
  const tx = await contract.addCandidate(eventId, name, statement);
  await tx.wait();
}

// READ: get a single event
export async function getEvent(eventId) {
  const { contract } = await getSignerAndContract();
  const ev = await contract['getEvent(uint256)'](eventId);
  return ev;
}


// READ: number of events
export async function getNoOfEvents() {
  try {
    const { contract } = await getSignerAndContract();
    const count = await contract.noOfEvents();
    return Number(count);
  } catch (e) {
    // Surface a friendly message for common misconfig (wrong address / wrong chain)
    console.warn("noOfEvents failed:", e);
    return 0;
  }
}

// ADMIN: deactivate event (creator or owner)
export async function deactivateEvent(eventId) {
  const { contract } = await getSignerAndContract();
  const tx = await contract.deactivateEvent(eventId);
  await tx.wait();
}

// Helper: resolve user input (ID or name) to eventId
export async function resolveEventId(query) {
  if (query == null) return null;
  const trimmed = String(query).trim();
  if (trimmed === "") return null;
  const asNumber = Number(trimmed);
  if (!Number.isNaN(asNumber) && Number.isFinite(asNumber) && asNumber > 0) {
    return Math.floor(asNumber);
  }
  try {
    const total = await getNoOfEvents();
    for (let i = 1; i <= total; i++) {
      try {
        const ev = await getEvent(i);
        if (!ev) continue;
        const name = ev.name?.toString?.() || "";
        const desc = ev.description?.toString?.() || "";
        if (name.toLowerCase().includes(trimmed.toLowerCase()) || desc.toLowerCase().includes(trimmed.toLowerCase())) {
          return i;
        }
      } catch (_) {}
    }
  } catch (e) {
    console.warn("resolveEventId failed:", e);
  }
  return null;
}
