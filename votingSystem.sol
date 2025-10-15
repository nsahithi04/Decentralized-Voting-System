// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0; // gives the compliler version

contract votingSystem{
    
    uint public noOfEvents;
    address public owner;

    struct Event{
        string name;
        string description;
        uint startTime;
        uint endTime;
        uint noOfCandidates;
        uint candidateNum;
        bool isActive;
        address creator;
    }

     struct Candidate{
        string name;
        string statement;
    }

    mapping(uint => Event) public events;
    mapping(uint => mapping(uint => Candidate)) public candidates; // eventId => candidateId => Candidate
    mapping(uint => mapping(uint => uint)) public votes; // eventId => candidateId => votes
    mapping(uint => mapping(address => bool)) public hasVoted;

    constructor() {
        owner = msg.sender;
    }

    function createEvent(string calldata _name, string calldata _description, uint _startTime, uint _endTime, uint _noOfCandidates) public{
        require(_startTime < _endTime, "Start time must be less than end time");
        require(_noOfCandidates > 0, "Number of candidates must be greater than 0");
        noOfEvents++;
        events[noOfEvents] = Event(_name, _description, _startTime, _endTime, _noOfCandidates, 0, true, msg.sender);

        emit EventCreated(noOfEvents, msg.sender, _name);
    }

    function addCandidate(uint _eventId, string calldata _name, string calldata _statement) public{
        require(events[_eventId].creator == msg.sender, "Only event creator can add candidates");
        require(events[_eventId].isActive, "Event is not active");
        require(events[_eventId].candidateNum < events[_eventId].noOfCandidates, "Maximum candidates reached");
        
        candidates[_eventId][events[_eventId].candidateNum] = Candidate(_name, _statement);
        emit CandidateAdded(_eventId, events[_eventId].candidateNum, _name);

        events[_eventId].candidateNum++;
    }

    function vote(uint _eventId, uint _candidateId) public{
        if(block.timestamp > events[_eventId].endTime){
            events[_eventId].isActive = false;
        }
        require(events[_eventId].isActive, "Event has ended");
        require(block.timestamp >= events[_eventId].startTime, "Event has not started yet");
        require(_candidateId < events[_eventId].candidateNum, "Candidate does not exist");

        require(!hasVoted[_eventId][msg.sender], "You have already voted");
        hasVoted[_eventId][msg.sender] = true;

        votes[_eventId][_candidateId]++;

        emit VoteCast(_eventId, _candidateId, msg.sender);
    }

    function getResults(uint _eventId) public view returns (string[] memory names, uint[] memory voteCount){
        uint numCandidates = events[_eventId].candidateNum;
        names = new string[](numCandidates);
        voteCount = new uint[](numCandidates);
    
        for(uint i = 0; i < numCandidates; i++){
            names[i] = candidates[_eventId][i].name;
            voteCount[i] = votes[_eventId][i];
        }
    }   

    function getCandidates(uint _eventId) public view returns (Candidate[] memory){
        Candidate[] memory candidatesList = new Candidate[](events[_eventId].candidateNum);
        for(uint i = 0; i < events[_eventId].candidateNum; i++){
            candidatesList[i] = candidates[_eventId][i];
        }
        return candidatesList;
    }

    function getEvent(uint _eventId) public view returns (Event memory) {
        return events[_eventId];
    }

    // logs for frontend
    event EventCreated(uint indexed eventId, address indexed creator, string name);
    event CandidateAdded(uint indexed eventId, uint candidateId, string name);
    event VoteCast(uint indexed eventId, uint candidateId, address indexed voter);

}