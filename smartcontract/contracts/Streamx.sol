// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract Streamx is ERC721, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;
  uint256 public id;
  string public streamername;
  string public url;
  string[] public images;
  string[] public categories;
  string public description;
  string public streamUri;
  bool public streamstatus;
  string public streamdesc;
  constructor(
    uint256 _id,
    string memory _name,
    string memory _url,
    string[] memory _images,
    string[] memory _categories,
    string memory _description
  ) ERC721(_name, "STX") {
    id = _id;
    streamername = _name;
    url = _url;
    images = _images;
    categories = _categories;
    description = _description;
    streamstatus=false;

  }

  function safeMint(address to, string memory uri) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
  }
  function streamURIupdate(bool update,string memory streamuri,string memory streamdescs) public onlyOwner {
    if(update==true){
    streamUri=streamuri;
    streamdesc=streamdescs;
    streamstatus=true;
    }else{
    streamUri="";
    streamdesc="";
    streamstatus=false;
    }
  }
  // The following functions are overrides required by Solidity.

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }
  function getImageUrls() public view returns(string[] memory){
    return images;
  }

  function getCategories() public view returns(string[] memory){
    return categories;
  }
}
