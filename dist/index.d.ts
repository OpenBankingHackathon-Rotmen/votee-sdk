import { IdentifierToken, ElectionDurationPeriod } from './types';
import { Votee } from './utils/typechain/Votee';
export declare class VoteeSdk {
    private identity;
    private wallet;
    private contractInstance;
    constructor(providerUrl: string, privateKey: string, voteeContractAddress: string);
    static generateIdentifierToken(peselLastFiveCharacters: string, nameLastFiveCharacters: string, surnameLastFiveCharacters: string, thirdPartySalt: string): Promise<IdentifierToken>;
    signPayload(payload: string): Promise<string>;
    scheduleElections(startDate: number, endsOn: number): Promise<number>;
    registerOption(electionID: number, option: string): Promise<number>;
    registerIdentifier(electionID: number, anonymizedIdentifier: string): Promise<boolean>;
    vote(electionID: number, optionID: number, identifier: string): Promise<boolean>;
    static initializeContractInstance(providerUrl: string, voteeContractAddress: string): Votee;
    static getElectionsCount(providerUrl: string, voteeContractAddress: string): Promise<number>;
    static getElectionDurationPeriod(providerUrl: string, voteeContractAddress: string, electionID: number): Promise<ElectionDurationPeriod>;
    static isAnonymizedIdentifierAllowedToVote(providerUrl: string, voteeContractAddress: string, electionID: number, anonymizedIdentifier: string): Promise<boolean>;
    static getElectionOptionsCount(providerUrl: string, voteeContractAddress: string, electionID: number): Promise<number>;
}
