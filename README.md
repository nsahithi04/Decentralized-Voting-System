# Decentralized Voting System

A blockchain-based voting platform built with Solidity smart contracts and React for transparent, secure, and tamper-proof elections.

## 🎯 Features

- Create voting events with time limits
- Add candidates to events
- One vote per wallet address
- Automatic event activation/deactivation
- Real-time vote counting
- Transparent and immutable voting records

## 🏗️ Project Structure
```
voting-dapp/
├── smart-contracts/       # Solidity contracts
│   └── votingSystem.sol
└── frontend/             # React application
    └── src/
```

## 🔧 Tech Stack

**Smart Contract:** Solidity, Hardhat/Remix  
**Frontend:** React, Web3.js/Ethers.js, MetaMask

## 🚀 Quick Start

### Smart Contract

1. Open `votingSystem.sol` in Remix IDE
2. Compile with Solidity ^0.7.0
3. Deploy to testnet (Sepolia/Goerli)
4. Copy contract address and ABI

### Frontend

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Add contract address to `.env`:
```env
REACT_APP_CONTRACT_ADDRESS=your_contract_address
```

3. Run the app:
```bash
npm start
```

## 📝 Main Functions

- `createEvent()` - Create a new voting event
- `addCandidate()` - Add candidates (event creator only)
- `vote()` - Cast your vote
- `getResults()` - View voting results
- `getCandidates()` - Get all candidates

## 🔐 Security

✅ Double-voting prevention  
✅ Time-based access control  
✅ Creator-only candidate management  
✅ Immutable vote records

## 👥 Team

**Smart Contract:** [Your Name]  
**Frontend:** [Teammate Names]

## 📄 License

MIT License

---

**Built with Blockchain Technology** 🔗