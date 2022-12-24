/**
 * helper contract for EntryPoint, to call userOp.initCode from a "neutral" address,
 * which is explicitly not the entryPoint itself.
 */
contract SenderCreator {
    event InitAddress(address);
    event CodeLen(uint256);

    /**
     * call the "initCode" factory to create and return the sender wallet address
     * @param initCode the initCode value from a UserOp. contains 20 bytes of factory address, followed by calldata
     * @return sender the returned address of the created wallet, or zero address on failure.
     */
    function createSender(bytes calldata initCode)
        external
        returns (address sender)
    {
        address initAddress = address(bytes20(initCode[0:20]));
        emit InitAddress(initAddress);

        // revert(Strings.toHexString(uint160(initAddress), 20));
        bytes memory initCallData = initCode[20:];
        emit CodeLen(initCallData.length);
        bool success;
        /* solhint-disable no-inline-assembly */
        assembly {
            success := call(
                gas(),
                initAddress,
                0,
                add(initCallData, 0x20),
                mload(initCallData),
                0,
                32
            )
            sender := mload(0)
        }
        if (!success) {
            revert("create fail");
        }
    }
}

contract CreatorTest {
    SenderCreator private immutable senderCreator = new SenderCreator();
    event create(address);

    function testAB(
        bytes memory _calldata,
        bytes memory _initCode,
        bytes32 _salt
    ) external returns (address, address) {
        address A = deployA(_initCode, _salt);
        address B = deployB(_calldata);
        return (A, B);
    }

    function deployB(bytes memory _calldata) public returns (address) {
        address sender = senderCreator.createSender(_calldata);
        emit create(sender);
        return sender;
    }

    /**
     * @notice Deploys `_initCode` using `_salt` for defining the deterministic address.
     * @param _initCode Initialization code.
     * @param _salt Arbitrary value to modify resulting address.
     * @return createdContract Created contract address.
     */
    function deployA(bytes memory _initCode, bytes32 _salt)
        public
        returns (address payable createdContract)
    {
        assembly {
            createdContract := create2(
                0,
                add(_initCode, 0x20),
                mload(_initCode),
                _salt
            )
        }
        emit create(createdContract);
    }
}
