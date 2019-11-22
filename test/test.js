'use strict';

const expect = require('chai').expect;
const VoteeSdk = require('../lib/index').VoteeSdk;

const Web3 = require('web3');

const fs = require('fs');

describe('Voteesdk class tests', async () => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/9defdc016d654060a6d372cbe5b2de0c'),
  );
  const privateKey = '';

  it('should', async () => {});
});
