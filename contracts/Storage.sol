//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Storage {
    uint256 public commitment_root;
    mapping(bytes5 => bool) public nullifierHashes;

    constructor() {
        //initialise the commitment root to a uint256 value
        commitment_root = type(uint256).max;
        
    }

    function spend(bytes5 _nullifierHash) public  {
        // add a nullifier to the list
        nullifierHashes[_nullifierHash]=true;
    }

    function change_root(uint256 _commitment_root) public {
        commitment_root = _commitment_root;
    }

    function batch_spend(bytes5[] memory _nullifierHashes) public {
        for (uint256 i = 0; i < _nullifierHashes.length; i++) {
            nullifierHashes[_nullifierHashes[i]]=true;
        }
    }
}