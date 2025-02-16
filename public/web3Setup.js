const web3 = new Web3('http://127.0.0.1:7545');

const contractABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_artist",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_fileHash",
                "type": "string"
            }
        ],
        "name": "createMusic",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "musicCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress = '0x6F383552acE74a142dE095d40E7E5527E7338F6d';

window.web3 = web3;
window.contractABI = contractABI;
window.contractAddress = contractAddress;