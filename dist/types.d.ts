export interface IdentifierToken {
    readonly identifierToken: string;
    readonly identifierTokenHash: string;
    readonly salt: string;
}
export interface Identity {
    readonly privateKey: string;
    readonly publicKey: string;
    readonly address: string;
}
export interface ElectionDurationPeriod {
    readonly start: number;
    readonly end: number;
}
