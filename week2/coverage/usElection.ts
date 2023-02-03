import { USElection } from "../typechain-types/Election.sol/USElection";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("USElection", function () {
  let usElectionFactory;
  let usElection: USElection;
  before(async () => {
    usElectionFactory = await ethers.getContractFactory("USElection");
    usElection = await usElectionFactory.deploy();
    await usElection.deployed();
  });

  it("Should return the current leader before submit any election results", async function () {
    expect(await usElection.currentLeader()).to.equal(0); // NOBODY
  });

  it("Should return the election status", async function () {
    expect(await usElection.electionEnded()).to.equal(false); // Not Ended
  });

  it("Should submit state results and get current leader", async function () {
    const stateResults = ["California", 1000, 900, 32];
    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );
    await submitStateResultsTx.wait();
    expect(await usElection.currentLeader()).to.equal(1); // BIDEN
  });

  it("Should throw when try to submit already submitted state results", async function () {
    const stateResults = ["California", 1000, 900, 32];
    expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "This state result was already submitted!"
    );
  });

  it("There cannot be a tie between biden and trump", async function () {
    const stateResults = ["Massachusetts", 1000, 1000, 1];
    expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "Votes cannot be equal"
    );
  });

  it("Should throw when trying to submit state with 0 seats", async function () {
    const stateResults = ["Alaska", 1000, 200, 0];
    expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "States must have at least 1 seat"
    );
  });

  it("Should submit state results and get current leader", async function () {
    const stateResults = ["Ohaio", 800, 1200, 33];
    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );
    await submitStateResultsTx.wait();
    expect(await usElection.currentLeader()).to.equal(2); // TRUMP
  });

  it("Should throw on trying to end election with not the owner", async function () {
    const [owner, addr1] = await ethers.getSigners();
    expect(usElection.connect(addr1).endElection()).to.be.revertedWith('Ownable: caller is not the owner');
    expect(await usElection.electionEnded()).to.equal(false); // Not Ended
  });
  
  it("Should end the elections, get the leader and election status", async function () {
    const endElectionTx = await usElection.endElection();
    await endElectionTx.wait();
    expect(await usElection.currentLeader()).to.equal(2); // TRUMP
    expect(await usElection.electionEnded()).to.equal(true); // Ended
  });

  it("Should throw when trying to end elections that are already ended", async function () {
    expect(usElection.endElection()).to.be.revertedWith(
      "Election is already over"
    );
  });

  it("Trying to submit state result with not the owner", async function () {
    const stateResults = ["Test", 1000, 900, 32];
    const [owner, addr1] = await ethers.getSigners();
    expect(usElection.connect(addr1).submitStateResult(stateResults)).to.be.revertedWith('Ownable: caller is not the owner');
    expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "This state result was already submitted!"
    );
  });

});