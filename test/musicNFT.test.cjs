const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MusicNFT", function () {
  let MusicNFT;
  let musicNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    MusicNFT = await ethers.getContractFactory("MusicNFT");
    [owner, addr1, addr2] = await ethers.getSigners();  
    musicNFT = await MusicNFT.deploy();
    await musicNFT.deployed();
  });

  describe("Function Return Values", function () {
    it("should return the correct music details", async function () {
      await musicNFT.createMusic("Song Title", "Artist Name", ethers.utils.parseEther("1"), "fileHash123");
      const music = await musicNFT.getMusic(1);
      expect(music.title).to.equal("Song Title");
      expect(music.artist).to.equal("Artist Name");
      expect(music.owner).to.equal(owner.address);
      expect(music.price.toString()).to.equal(ethers.utils.parseEther("1").toString());
      expect(music.fileHash).to.equal("fileHash123");
    });
  });

  describe("State Changes", function () {
    it("should update ownership correctly after purchase", async function () {
      await musicNFT.createMusic("Song Title", "Artist Name", ethers.utils.parseEther("1"), "fileHash123");
      await musicNFT.connect(addr1).purchaseMusic(1, { value: ethers.utils.parseEther("1") });
      const music = await musicNFT.getMusic(1);
      expect(music.owner).to.equal(addr1.address);
    });

    it("should change the price of a Music NFT", async function () {
      await musicNFT.createMusic("Song Title", "Artist Name", ethers.utils.parseEther("1"), "fileHash123");
      await musicNFT.changePrice(1, ethers.utils.parseEther("2"));
      const music = await musicNFT.getMusic(1);
      expect(music.price.toString()).to.equal(ethers.utils.parseEther("2").toString());
    });
  });

  describe("Event Emission", function () {
    it("should emit MusicCreated event correctly", async function () {
      await expect(musicNFT.createMusic("Song Title", "Artist Name", ethers.utils.parseEther("1"), "fileHash123"))
        .to.emit(musicNFT, "MusicCreated")
        .withArgs(1, "Song Title", "Artist Name", owner.address, ethers.utils.parseEther("1"), "fileHash123");
    });

    it("should emit MusicPurchased event correctly", async function () {
      await musicNFT.createMusic("Song Title", "Artist Name", ethers.utils.parseEther("1"), "fileHash123");
      await expect(musicNFT.connect(addr1).purchaseMusic(1, { value: ethers.utils.parseEther("1") }))
        .to.emit(musicNFT, "MusicPurchased")
        .withArgs(1, addr1.address, ethers.utils.parseEther("1"));
    });
  });

  describe("Error Handling", function () {
    it("should throw an error for insufficient payment", async function () {
      await musicNFT.createMusic("Song Title", "Artist Name", ethers.utils.parseEther("1"), "fileHash123");
      await expect(musicNFT.connect(addr1).purchaseMusic(1, { value: ethers.utils.parseEther("0.5") }))
        .to.be.revertedWith("Insufficient payment");
    });

    it("should throw an error when trying to purchase own music", async function () {
      await musicNFT.createMusic("Song Title", "Artist Name", ethers.utils.parseEther("1"), "fileHash123");
      await expect(musicNFT.purchaseMusic(1, { value: ethers.utils.parseEther("1") }))
        .to.be.revertedWith("Cannot purchase your own music");
    });

    it("should throw an error when non-owner tries to change the price", async function () {
      await musicNFT.createMusic("Song Title", "Artist Name", ethers.utils.parseEther("1"), "fileHash123");
      await expect(musicNFT.connect(addr1).changePrice(1, ethers.utils.parseEther("2")))
        .to.be.revertedWith("Only the owner can change the price");
    });
  });

  describe("Input Restrictions", function () {
    it("should reject invalid IDs", async function () {
      await expect(musicNFT.getMusic(999)).to.be.revertedWith("Invalid music ID");
    });
  });

  describe("User Restrictions", function () {
    it("should allow only admin to withdraw funds", async function () {
      await musicNFT.createMusic("Song Title", "Artist Name", ethers.utils.parseEther("1"), "fileHash123");
      await musicNFT.connect(addr1).purchaseMusic(1, { value: ethers.utils.parseEther("1") });
      await expect(musicNFT.connect(addr1).withdraw(ethers.utils.parseEther("1")))
        .to.be.revertedWith("Only owner can withdraw");
    });
  });
});