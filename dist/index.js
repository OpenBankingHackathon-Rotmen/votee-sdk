"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const eth_crypto_1 = __importDefault(require("eth-crypto"));
const crypto = __importStar(require("crypto"));
const ethers = __importStar(require("ethers"));
const votee_abi_1 = require("./utils/votee.abi");
const utils_1 = require("ethers/utils");
class VoteeSdk {
    constructor(providerUrl, privateKey, voteeContractAddress) {
        const provider = new ethers.providers.JsonRpcProvider(providerUrl);
        this.wallet = new ethers.Wallet(privateKey, provider);
        const publicKey = eth_crypto_1.default.publicKeyByPrivateKey(privateKey);
        this.identity = { publicKey, privateKey, address: this.wallet.address };
        this.contractInstance = new ethers.Contract(voteeContractAddress, votee_abi_1.voteeAbi, this.wallet);
    }
    static generateIdentifierToken(peselLastFiveCharacters, nameLastFiveCharacters, surnameLastFiveCharacters, thirdPartySalt) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = crypto.randomBytes(16).toString('hex');
            const token = thirdPartySalt +
                '.' +
                nameLastFiveCharacters +
                '.' +
                peselLastFiveCharacters +
                '.' +
                surnameLastFiveCharacters +
                '.' +
                salt;
            const identifierToken = ethers.utils.solidityKeccak256(['bytes'], [ethers.utils.toUtf8Bytes(Buffer.from(token).toString('base64'))]);
            const identifierTokenHash = ethers.utils.solidityKeccak256(['bytes32'], [identifierToken]);
            return { identifierToken, identifierTokenHash, salt };
        });
    }
    signPayload(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return eth_crypto_1.default.sign(this.identity.privateKey, payload);
        });
    }
    scheduleElections(startDate, endsOn) {
        return __awaiter(this, void 0, void 0, function* () {
            const duration = endsOn - startDate;
            const tx = yield this.contractInstance.functions.scheduleElections(startDate, duration);
            const txReceipt = yield tx.wait();
            const logs = txReceipt.logs;
            if (logs !== undefined) {
                const abiDecoded = new utils_1.AbiCoder().decode(['uint256', 'uint256', 'uint256'], logs[0].data);
                console.log(logs);
                return parseInt(abiDecoded[0], 16);
            }
            return -1;
        });
    }
    registerOption(electionID, option) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ethers.utils.isHexString(option)) {
                throw new Error('Invalid option format');
            }
            const tx = yield this.contractInstance.functions.registerOption(electionID, option);
            const txReceipt = yield tx.wait();
            const logs = txReceipt.logs;
            if (logs !== undefined) {
                const abiDecoded = new utils_1.AbiCoder().decode(['uint256', 'address', 'uint256'], logs[0].data);
                const [eID, opt, optionID] = abiDecoded;
                return new ethers.utils.BigNumber(optionID).toNumber();
            }
            return -1;
        });
    }
    registerIdentifier(electionID, anonymizedIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ethers.utils.isHexString(anonymizedIdentifier)) {
                throw new Error('Invalid anonymizedIdentifier format');
            }
            const tx = yield this.contractInstance.functions.registerIdentifier(electionID, anonymizedIdentifier);
            const txReceipt = yield tx.wait();
            if (txReceipt.logs !== undefined) {
                const abiDecoded = new utils_1.AbiCoder().decode(['uint256', 'bytes32'], txReceipt.logs[0].data);
                const [elecID, identifier] = abiDecoded;
                if (elecID && identifier) {
                    return true;
                }
            }
            return false;
        });
    }
    vote(electionID, optionID, identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield this.contractInstance.functions.vote(electionID, optionID, identifier);
            const txReceipt = yield tx.wait();
            if (txReceipt.logs !== undefined) {
                const recountedIdentifier = ethers.utils.solidityKeccak256(['bytes32'], [identifier]);
                if (recountedIdentifier === txReceipt.logs[0].topics[1]) {
                    return true;
                }
            }
            return false;
        });
    }
    // Getters
    static initializeContractInstance(providerUrl, voteeContractAddress) {
        return new ethers.Contract(voteeContractAddress, votee_abi_1.voteeAbi, new ethers.providers.JsonRpcProvider(providerUrl));
    }
    static getElectionsCount(providerUrl, voteeContractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const contractInstance = VoteeSdk.initializeContractInstance(providerUrl, voteeContractAddress);
            const count = yield contractInstance.functions.getElectionsCount();
            return count.toNumber();
        });
    }
    static getElectionDurationPeriod(providerUrl, voteeContractAddress, electionID) {
        return __awaiter(this, void 0, void 0, function* () {
            const contractInstance = VoteeSdk.initializeContractInstance(providerUrl, voteeContractAddress);
            const start = yield contractInstance.functions.getElectionStartTime(electionID);
            const duration = yield contractInstance.functions.getElectionDuration(electionID);
            const end = start.add(duration);
            return { start: start.toNumber() * 1000, end: end.toNumber() * 1000 };
        });
    }
    static isAnonymizedIdentifierAllowedToVote(providerUrl, voteeContractAddress, electionID, anonymizedIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const contractInstance = VoteeSdk.initializeContractInstance(providerUrl, voteeContractAddress);
            const isAllowed = yield contractInstance.functions.isIdentifierAllowed(electionID, anonymizedIdentifier);
            return isAllowed;
        });
    }
    static getElectionOptionsCount(providerUrl, voteeContractAddress, electionID) {
        return __awaiter(this, void 0, void 0, function* () {
            const contractInstance = VoteeSdk.initializeContractInstance(providerUrl, voteeContractAddress);
            const optionsCount = yield contractInstance.functions.getElectionOptionsCount(electionID);
            return optionsCount.toNumber();
        });
    }
}
exports.VoteeSdk = VoteeSdk;
