'use strict';

const expect = require('chai').expect;
const VoteeSdk = require('../dist/index').VoteeSdk;

const fs = require('fs');

describe('Voteesdk class tests', async () => {
  const privateKey = fs.readFileSync('.privateKey', { encoding: 'utf8' });
  const infuraNetwork = 'ropsten';
  const infuraProjectID = '9defdc016d654060a6d372cbe5b2de0c';

  const providerUrl = 'http://localhost:7545';
  const contractAddress = '0xd9802ba8D9E16BB89828896e087C0c6c1Ef066CE';

  const voteeSdk = new VoteeSdk(providerUrl, privateKey, contractAddress);

  const peselLast5Characters = '00673';
  const nameLast5Characters = 'alena';
  const surnameLast5Characters = 'ardus';

  it('should generate an identifier', async () => {
    const identifier = await VoteeSdk.generateIdentifierToken(
      peselLast5Characters,
      nameLast5Characters,
      surnameLast5Characters,
      '892782',
    );
    console.log('generated identifier: ', identifier);
  });

  let anonymizedIdentifier;
  let identifierr;

  it('should sign an identifier hash', async () => {
    const identifier = await VoteeSdk.generateIdentifierToken(
      peselLast5Characters,
      nameLast5Characters,
      surnameLast5Characters,
      '823783',
    );
    anonymizedIdentifier = identifier.identifierTokenHash;
    identifierr = identifier.identifierToken;
    const signature = await voteeSdk.signPayload(identifier.identifierTokenHash);
    console.log('Token signature:', signature);
  });

  let electionId;

  it('should schedule an election', async () => {
    const start = Math.floor(new Date('2018-12-17T03:24:00').getTime() / 1000);
    const end = Math.floor(new Date('2020-12-17T03:24:00').getTime() / 1000);

    console.log(start, end);

    const electionID = await voteeSdk.scheduleElections(start, end);
    electionId = electionID;
    console.log('Registered election with ID: ', electionID);
  });

  let optionId;

  it('should register an option', async () => {
    const optionAddress = '0xb0E624Fd26EA982e101D2273eb9a1537DEE1d403';
    const optionID = await voteeSdk.registerOption(electionId, optionAddress);
    optionId = optionID;
    console.log('registred option with ID: ', optionID);
  });

  it('should register an anonymizedIdentifier', async () => {
    const success = await voteeSdk.registerIdentifier(electionId, anonymizedIdentifier);
    expect(success).to.equal(true);
  });

  it('should vote', async () => {
    const success = await voteeSdk.vote(electionId, optionId, identifierr);
    expect(success).to.equal(true);
  });

  // Getters test

  it('should count the number of elections', async () => {
    const count = await VoteeSdk.getElectionsCount(providerUrl, contractAddress);
    console.log('Number of registered elections :', count);
  });

  it('should return how the dates of an election', async () => {
    const duration = await VoteeSdk.getElectionDurationPeriod(providerUrl, contractAddress, electionId);
    console.log('start: ', new Date(duration.start), ',  end: ', new Date(duration.end));
  });

  it('should check if identifier is allowed to vote', async () => {
    const isAllowed = await VoteeSdk.isAnonymizedIdentifierAllowedToVote(
      providerUrl,
      contractAddress,
      electionId,
      anonymizedIdentifier,
    );
    expect(isAllowed).to.equal(false);
  });

  it('should return the number of candidates in the election', async () => {
    const count = await VoteeSdk.getElectionOptionsCount(providerUrl, contractAddress, electionId);
    expect(count).to.equal(1);
  });

  it('should return the option address', async () => {
    const address = await VoteeSdk.getElectionOptionAddress(providerUrl, contractAddress, electionId, 0);
    const optionAddress = '0xb0E624Fd26EA982e101D2273eb9a1537DEE1d403';
    expect(address).to.equal(optionAddress);
  });

  it('should return the number of votes for an option', async () => {
    const optionAddress = '0xb0E624Fd26EA982e101D2273eb9a1537DEE1d403';
    const votes = await VoteeSdk.getElectionOptionVotes(providerUrl, contractAddress, electionId, optionAddress);
    expect(votes).to.equal(1);
  });
});
