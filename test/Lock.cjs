const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

async function deployOneYearLockFixture() {
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

  const lockedAmount = ethers.utils.parseEther("1");

  const [owner, otherAccount] = await ethers.getSigners();

  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  return { lock, unlockTime, lockedAmount, owner, otherAccount };
}

describe("Lock", function () {
  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should set the right owner", async function () {
      const { lock, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      const { lock, lockedAmount } = await loadFixture(deployOneYearLockFixture);

      expect(await ethers.provider.getBalance(lock.address)).to.equal(lockedAmount);
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      const latestTime = await time.latest();
      const Lock = await ethers.getContractFactory("Lock");
      await expect(Lock.deploy(latestTime, { value: ethers.utils.parseEther("1") })).to.be.revertedWith(
        "Unlock time should be in the future"
      );
    });
  });

  describe("Withdrawals", function () {
    it("Should revert with the right error if called too soon", async function () {
      const { lock } = await loadFixture(deployOneYearLockFixture);
      await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
    });

    it("Should revert with the right error if called from another account", async function () {
      const { lock, unlockTime, otherAccount } = await loadFixture(deployOneYearLockFixture);
      await time.increaseTo(unlockTime);
      await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith("You aren't the owner");
    });

    it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
      const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
      await time.increaseTo(unlockTime);
      await expect(lock.withdraw()).not.to.be.reverted;
    });

    it("Should emit an event on withdrawals", async function () {
      const { lock, unlockTime, lockedAmount, owner } = await loadFixture(deployOneYearLockFixture);
      await time.increaseTo(unlockTime);
      await expect(lock.withdraw()).to.emit(lock, "Withdrawal").withArgs(lockedAmount, owner.address);
    });

    it("Should transfer the funds to the owner", async function () {
      const { lock, unlockTime, owner } = await loadFixture(deployOneYearLockFixture);
      await time.increaseTo(unlockTime);
      const initialBalance = await ethers.provider.getBalance(owner.address);
      await lock.withdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.above(initialBalance);
    });
  });
});