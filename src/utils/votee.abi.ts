export const voteeAbi = [
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'electionID',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startTimestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
    ],
    name: 'ElectionScheduled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'electionID',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'anonymizedIdentifier',
        type: 'bytes32',
      },
    ],
    name: 'RegisteredIdentifier',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'electionID',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'option',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'optionID',
        type: 'uint256',
      },
    ],
    name: 'RegisteredOption',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'electionID',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'anonymizedIdentifier',
        type: 'bytes32',
      },
    ],
    name: 'Voted',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_startsAtTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_endsWithinSeconds',
        type: 'uint256',
      },
    ],
    name: 'scheduleElections',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_electionID',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '_identifierHash',
        type: 'bytes32',
      },
    ],
    name: 'registerIdentifier',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_electionID',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_option',
        type: 'address',
      },
    ],
    name: 'registerOption',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_electionID',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_optionID',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '_identifier',
        type: 'bytes32',
      },
    ],
    name: 'vote',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getElectionsCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint256',
        name: '_electionID',
        type: 'uint256',
      },
    ],
    name: 'getElectionStartTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint256',
        name: '_electionID',
        type: 'uint256',
      },
    ],
    name: 'getElectionDuration',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint256',
        name: '_electionID',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '_anonymizedIdentifier',
        type: 'bytes32',
      },
    ],
    name: 'isIdentifierAllowed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint256',
        name: '_electionID',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_voter',
        type: 'address',
      },
    ],
    name: 'didVote',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint256',
        name: '_electionID',
        type: 'uint256',
      },
    ],
    name: 'getElectionOptionsCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint256',
        name: '_electionID',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_optionID',
        type: 'uint256',
      },
    ],
    name: 'getElectionOptionAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint256',
        name: '_electionID',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_option',
        type: 'address',
      },
    ],
    name: 'getElectionOptionVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
