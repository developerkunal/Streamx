// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./Streamx.sol";

contract StreamxFactory {
  
  Streamx[] private _streamers;

  struct Item {
        uint256 id;
        address owner;
        address contractaddress;
    }
  mapping(uint256 => Item) public items;

  event StreamerCreated(Streamx indexed streamer, address indexed owner);
  
  uint256 constant maxLimit = 20;

  uint256 public currentId;
  function _checkstatus(address _owner) internal view returns( bool value){
        uint256 totalItems = currentId;
        value=true;
        for (uint i = 0; i < totalItems; i++) {
            if(items[i].owner == _owner){
                value=false;
            }
        }
        return value;
    }
  function createStreamer(
    string memory name,
    string memory url,
    string[] memory images,
    string[] memory categories,
    string memory description
  ) public {
    require(_checkstatus(msg.sender),"One User Can have only 1 Profile");
    Streamx streamer =
      new Streamx(currentId, name, url, images, categories, description);
    streamer.transferOwnership(msg.sender);
    items[currentId] = Item(currentId, msg.sender, address(streamer));
    _streamers.push(streamer);
    currentId += 1;
    emit StreamerCreated(streamer, msg.sender);
  }

  function streamersCount() public view returns (uint256) {
    return _streamers.length;
  }

  function streamers(uint256 limit, uint256 offset)
    public
    view
    returns (Streamx[] memory coll)
  {
    require(offset <= streamersCount(), "offset out of bounds");
    uint256 size = streamersCount() - offset;
    size = size < limit ? size : limit;
    size = size < maxLimit ? size : maxLimit;
    coll = new Streamx[](size);

    for (uint256 i = 0; i < size; i++) {
      coll[i] = _streamers[offset + i];
    }

    return coll;
  }
   function getOwnedItems(address _owner) external view returns(Item[] memory nfts){
        uint256 totalItems = currentId;
        nfts = new Item[](totalItems);
        for (uint i = 0; i < totalItems; i++) {
            if(items[i].owner == _owner){
                Item storage item = items[i];
                nfts[i] = item;
            }
        }
        return nfts;
    }
     function checkstatus(address _owner) external view returns( bool value){
        uint256 totalItems = currentId;
        value=true;
        for (uint i = 0; i < totalItems; i++) {
            if(items[i].owner == _owner){
                value=false;
            }
        }
        return value;
    }
}
