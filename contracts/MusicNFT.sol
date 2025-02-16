// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MusicNFT is ERC721, ReentrancyGuard {
    struct Music {
        uint256 id;
        string title;
        string artist;
        uint256 price;
        string fileHash;
    }

    mapping(uint256 => Music) private musicCollection;
    mapping(string => bool) private musicExists;
    mapping(address => uint256[]) private userMusic;

    uint256 public musicCount;
    address public immutable owner;

    event MusicCreated(uint256 id, string title, string artist, address owner, uint256 price, string fileHash);
    event MusicPurchased(uint256 id, address newOwner, uint256 price);
    event PriceChanged(uint256 id, uint256 newPrice);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can withdraw");
        _;
    }

    constructor() ERC721("MusicNFT", "MNFT") {
        owner = msg.sender;
    }

    function createMusic(string memory _title, string memory _artist, uint256 _price, string memory _fileHash) public {
        require(_price > 0, "Price must be greater than zero");
        require(!musicExists[_fileHash], "Music already exists");

        musicCount++;
        musicCollection[musicCount] = Music(musicCount, _title, _artist, _price, _fileHash);
        musicExists[_fileHash] = true;
        userMusic[msg.sender].push(musicCount);

        _safeMint(msg.sender, musicCount);

        emit MusicCreated(musicCount, _title, _artist, msg.sender, _price, _fileHash);
    }

    function purchaseMusic(uint256 _id) public payable nonReentrant {
        Music storage music = musicCollection[_id];
        require(msg.value == music.price, "Send the exact amount");
        require(ownerOf(_id) != msg.sender, "Cannot purchase your own music");

        address payable previousOwner = payable(ownerOf(_id));
        _transfer(previousOwner, msg.sender, _id);
        previousOwner.transfer(msg.value);

        emit MusicPurchased(_id, msg.sender, msg.value);
    }

    function changePrice(uint256 _id, uint256 newPrice) public {
        require(newPrice > 0, "New price must be greater than zero");
        require(ownerOf(_id) == msg.sender, "Only the owner can change the price");

        musicCollection[_id].price = newPrice;
        emit PriceChanged(_id, newPrice);
    }

    function getMusic(uint256 _id) public view returns (Music memory) {
        require(_id > 0 && _id <= musicCount, "Invalid music ID");
        return musicCollection[_id];
    }

    function getUserMusic(address _owner) public view returns (Music[] memory) {
        uint256[] memory userMusicIds = userMusic[_owner];
        Music[] memory userMusicCollection = new Music[](userMusicIds.length);

        for (uint256 i = 0; i < userMusicIds.length; i++) {
            userMusicCollection[i] = musicCollection[userMusicIds[i]];
        }

        return userMusicCollection;
    }

    function withdraw(uint256 amount) external onlyOwner {
        payable(owner).transfer(amount);
    }
}