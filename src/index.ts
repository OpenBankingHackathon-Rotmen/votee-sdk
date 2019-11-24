import EthCrypto from 'eth-crypto';
import * as crypto from 'crypto';

import { IdentifierToken, Identity, ElectionDurationPeriod } from './types';

import * as ethers from 'ethers';

import { Votee } from './utils/typechain/Votee';
import { voteeAbi } from './utils/votee.abi';
import { AbiCoder } from 'ethers/utils';

export class VoteeSdk {
  private identity: Identity;
  private wallet: ethers.Wallet;
  private contractInstance: Votee;

  constructor(providerUrl: string, privateKey: string, voteeContractAddress: string) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    this.wallet = new ethers.Wallet(privateKey, provider);

    const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
    this.identity = { publicKey, privateKey, address: this.wallet.address };

    this.contractInstance = new ethers.Contract(voteeContractAddress, voteeAbi, this.wallet) as Votee;
  }

  static async generateIdentifierToken(
    peselLastFiveCharacters: string,
    nameLastFiveCharacters: string,
    surnameLastFiveCharacters: string,
    thirdPartySalt: string,
  ): Promise<IdentifierToken> {
    const salt = crypto.randomBytes(16).toString('hex');
    const token =
      thirdPartySalt +
      '.' +
      nameLastFiveCharacters +
      '.' +
      peselLastFiveCharacters +
      '.' +
      surnameLastFiveCharacters +
      '.' +
      salt;

    const identifierToken = ethers.utils.solidityKeccak256(
      ['bytes'],
      [ethers.utils.toUtf8Bytes(Buffer.from(token).toString('base64'))],
    );

    const identifierTokenHash = ethers.utils.solidityKeccak256(['bytes32'], [identifierToken]);

    return { identifierToken, identifierTokenHash, salt };
  }

  async signPayload(payload: string): Promise<string> {
    return EthCrypto.sign(this.identity.privateKey, payload);
  }

  async scheduleElections(startDate: number, endsOn: number): Promise<number> {
    const duration = endsOn - startDate;
    const tx = await this.contractInstance.functions.scheduleElections(startDate, duration);
    const txReceipt = await tx.wait();
    const logs = txReceipt.logs;
    if (logs !== undefined) {
      const abiDecoded = new AbiCoder().decode(['uint256', 'uint256', 'uint256'], logs[0].data);
      return parseInt(abiDecoded[0], 16);
    }
    return -1;
  }

  async registerOption(electionID: number, option: string): Promise<number> {
    if (!ethers.utils.isHexString(option)) {
      throw new Error('Invalid option format');
    }

    const tx = await this.contractInstance.functions.registerOption(electionID, option);
    const txReceipt = await tx.wait();
    const logs = txReceipt.logs;
    if (logs !== undefined) {
      const abiDecoded = new AbiCoder().decode(['uint256', 'address', 'uint256'], logs[0].data);
      const [eID, opt, optionID] = abiDecoded;
      return new ethers.utils.BigNumber(optionID).toNumber();
    }
    return -1;
  }

  async registerIdentifier(electionID: number, anonymizedIdentifier: string): Promise<boolean> {
    if (!ethers.utils.isHexString(anonymizedIdentifier)) {
      throw new Error('Invalid anonymizedIdentifier format');
    }

    const tx = await this.contractInstance.functions.registerIdentifier(electionID, anonymizedIdentifier);
    const txReceipt = await tx.wait();

    if (txReceipt.logs !== undefined) {
      const abiDecoded = new AbiCoder().decode(['uint256', 'bytes32'], txReceipt.logs[0].data);
      const [elecID, identifier] = abiDecoded;
      if (elecID && identifier) {
        return true;
      }
    }

    return false;
  }

  async vote(electionID: number, optionID: number, identifier: string): Promise<boolean> {
    const tx = await this.contractInstance.functions.vote(electionID, optionID, identifier);
    const txReceipt = await tx.wait();
    if (txReceipt.logs !== undefined) {
      const recountedIdentifier = ethers.utils.solidityKeccak256(['bytes32'], [identifier]);
      if (recountedIdentifier === txReceipt.logs[0].topics[1]) {
        return true;
      }
    }
    return false;
  }

  // Getters

  static initializeContractInstance(providerUrl: string, voteeContractAddress: string): Votee {
    return new ethers.Contract(
      voteeContractAddress,
      voteeAbi,
      new ethers.providers.JsonRpcProvider(providerUrl),
    ) as Votee;
  }

  static async getElectionsCount(providerUrl: string, voteeContractAddress: string): Promise<number> {
    const contractInstance = VoteeSdk.initializeContractInstance(providerUrl, voteeContractAddress);
    const count = await contractInstance.functions.getElectionsCount();
    return count.toNumber();
  }

  static async getElectionDurationPeriod(
    providerUrl: string,
    voteeContractAddress: string,
    electionID: number,
  ): Promise<ElectionDurationPeriod> {
    const contractInstance = VoteeSdk.initializeContractInstance(providerUrl, voteeContractAddress);

    const start = await contractInstance.functions.getElectionStartTime(electionID);
    const duration = await contractInstance.functions.getElectionDuration(electionID);

    const end = start.add(duration);

    return { start: start.toNumber() * 1000, end: end.toNumber() * 1000 };
  }

  static async isAnonymizedIdentifierAllowedToVote(
    providerUrl: string,
    voteeContractAddress: string,
    electionID: number,
    anonymizedIdentifier: string,
  ): Promise<boolean> {
    const contractInstance = VoteeSdk.initializeContractInstance(providerUrl, voteeContractAddress);
    const isAllowed = await contractInstance.functions.isIdentifierAllowed(electionID, anonymizedIdentifier);
    return isAllowed;
  }

  static async getElectionOptionsCount(
    providerUrl: string,
    voteeContractAddress: string,
    electionID: number,
  ): Promise<number> {
    const contractInstance = VoteeSdk.initializeContractInstance(providerUrl, voteeContractAddress);
    const optionsCount = await contractInstance.functions.getElectionOptionsCount(electionID);
    return optionsCount.toNumber();
  }

  static async getElectionOptionAddress(
    providerUrl: string,
    voteeContractAddress: string,
    electionID: number,
    optionID: number,
  ): Promise<string> {
    const contractInstance = VoteeSdk.initializeContractInstance(providerUrl, voteeContractAddress);
    const address = await contractInstance.functions.getElectionOptionAddress(electionID, optionID);
    return address;
  }

  static async getElectionOptionVotes(
    providerUrl: string,
    voteeContractAddress: string,
    electionID: number,
    option: string,
  ): Promise<number> {
    const contractInstance = VoteeSdk.initializeContractInstance(providerUrl, voteeContractAddress);
    const votes = await contractInstance.functions.getElectionOptionVotes(electionID, option);
    return votes.toNumber();
  }
}
