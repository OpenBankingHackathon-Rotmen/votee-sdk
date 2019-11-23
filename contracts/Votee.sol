pragma solidity 0.5.11;

contract Votee {

    // Events

    event ElectionScheduled(uint electionID);
    event RegisteredIdentifier(uint electionID, bytes32 anonymizedIdentifier);
    event RegisteredOption(uint electionID, address option);

    event Voted(uint electionID, bytes32 indexed anonymizedIdentifier);

    // Structs

    struct Election {
        uint startsAtTimestamp;
        uint endsWithinSeconds;

        mapping(bytes32 => bool) allowedAnonymizedIdentifiers;
        mapping(address => bool) didVote;

        uint optionsCount;
        address[] options;

        mapping(address => uint) votes;
    }

    address owner;
    uint electionsCount;
    mapping(uint => Election) elections;

    constructor() public {
        owner = msg.sender;
    }

    // Modifiers

    modifier isOwner() {
        require(msg.sender == owner, "Contract owner restricted method");
        _;
    }

    modifier isElectionSchedule(uint _electionID) {
        require(electionsCount > _electionID, "Election does not exist");
        _;
    }

    modifier isElectionAlive(uint _electionID) {
        require(
            block.timestamp > elections[_electionID].startsAtTimestamp
            &&
            block.timestamp < elections[_electionID].startsAtTimestamp
            +
            elections[_electionID].endsWithinSeconds,
            "Election does not exist"
            );
        _;
    }

    modifier doesOptionExist(uint _electionID, uint _optionID) {
        require(elections[_electionID].optionsCount > _optionID, "Invalid option");
        _;
    }

    modifier didNotVote(uint _electionID) {
        require(!elections[_electionID].didVote[msg.sender], "You already voted");
        _;
    }
    // Owner restricted methods

    function scheduleElections(uint _startsAtTimestamp, uint _endsWithinSeconds) public isOwner() {
        elections[electionsCount].startsAtTimestamp = _startsAtTimestamp;
        elections[electionsCount].endsWithinSeconds = _endsWithinSeconds;
        emit ElectionScheduled(electionsCount);
        electionsCount++;
    }

    function registerIdentifier(uint _electionID, bytes32 _identifierHash) public
    isOwner()
    isElectionSchedule(_electionID)
    isElectionAlive(_electionID)
    {
        elections[_electionID].allowedAnonymizedIdentifiers[_identifierHash] = true;
        emit RegisteredIdentifier(_electionID, _identifierHash);
    }

    function registerOption(uint _electionID, address _option) public
    isOwner()
    isElectionSchedule(_electionID)
    isElectionAlive(_electionID)
    {
        elections[_electionID].options.push(_option);
        emit RegisteredOption(_electionID, _option);
        elections[_electionID].optionsCount++;
    }

    // Voting

    function vote(uint _electionID, uint _optionID, bytes memory _identifier) public
    isOwner()
    isElectionSchedule(_electionID)
    isElectionAlive(_electionID)
    didNotVote(_electionID)
    doesOptionExist(_electionID, _optionID)
    {
        bytes32 _anonymizedIdentifier = keccak256(_identifier);
        require(elections[_electionID].allowedAnonymizedIdentifiers[_anonymizedIdentifier], "Invalid identifier");
        elections[_electionID].allowedAnonymizedIdentifiers[_anonymizedIdentifier] = false;
        elections[_electionID].didVote[msg.sender] = true;
        elections[_electionID].votes[elections[_electionID].options[_optionID]]++;
        emit Voted(_electionID, _anonymizedIdentifier);
    }
}