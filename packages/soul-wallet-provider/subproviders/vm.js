const doWhilst = require('async/doWhilst')
const inherits = require('util').inherits
const Stoplight = require('../util/stoplight.js')
// const createVm = require('ethereumjs-vm/dist/hooked').fromWeb3Provider
const { Address } = require('@ethereumjs/util')
const BN = require('bignumber.js')
const { Chain, Common, Hardfork }= require('@ethereumjs/common')
const { Transaction, TransactionFactory } = require('@ethereumjs/tx')

const { VM } = require('@ethereumjs/vm')

const Block = require('ethereumjs-block')
const ethUtil = require('ethereumjs-util')
const rpcHexEncoding = require('../util/rpc-hex-encoding.js')
const Subprovider = require('./subprovider.js')

module.exports = VmSubprovider

// handles the following RPC methods:
//   eth_call
//   eth_estimateGas


inherits(VmSubprovider, Subprovider)

function VmSubprovider(opts){
  const self = this
  self.opts = opts || {};
  self.methods = ['eth_call', 'eth_estimateGas']
  // set initialization blocker
  self._ready = new Stoplight()
  self._blockGasLimit = null
}

// setup a block listener on 'setEngine'
VmSubprovider.prototype.setEngine = function(engine) {
  const self = this
  Subprovider.prototype.setEngine.call(self, engine)
  // unblock initialization after first block
  engine.once('block', function(block) {
    self._blockGasLimit = ethUtil.bufferToInt(block.gasLimit)
    self._ready.go()
  })
}

VmSubprovider.prototype.handleRequest = function(payload, next, end) {

  const self = this

  // console.log('window',window.web3)

  // skip unrelated methods
  if (self.methods.indexOf(payload.method) < 0) {
    return next()
  }

  // wait until we have seen 1 block
  self._ready.await(async () => {

    switch (payload.method) {

      case 'eth_call':
        const result = await window.web3.eth.call(payload.params[0])
        end(null, result)

        // self.runVm(payload, function(err, results){
        //   if (err) return end(err)
        //   var result = '0x'
        //   if (!results.error && results.vm.return) {
        //     result = ethUtil.addHexPrefix(results.vm.return.toString('hex'))
        //   }
        //   end(null, result)
        // })
        return

      case 'eth_estimateGas':
        const gasLimit = await window.web3.eth.estimateGas(payload.params[0])
        // self.estimateGas(payload, end)
        end(null, gasLimit)

        return
    }
  })
}

VmSubprovider.prototype.estimateGas = function(payload, end) {
    const self = this
    var lo = 0
    var hi = self._blockGasLimit
    if (!hi) return end(new Error('VmSubprovider - missing blockGasLimit'))

    var minDiffBetweenIterations = 1200
    var prevGasLimit = self._blockGasLimit
    doWhilst(
      function(callback) {
        // Take a guess at the gas, and check transaction validity
        var mid = (hi + lo) / 2
        payload.params[0].gas = mid
        self.runVm(payload, function(err, results) {
            var gasUsed = err ? self._blockGasLimit : ethUtil.bufferToInt(results.gasUsed)
            if (err || gasUsed === 0) {
                lo = mid
            } else {
                hi = mid
                // Perf improvement: stop the binary search when the difference in gas between two iterations
                // is less then `minDiffBetweenIterations`. Doing this cuts the number of iterations from 23
                // to 12, with only a ~1000 gas loss in precision.
                if (Math.abs(prevGasLimit - mid) < minDiffBetweenIterations) {
                    lo = hi
                }
            }
            prevGasLimit = mid
            callback()
        })
      },
      function() { return lo+1 < hi },
      function(err) {
          if (err) {
              end(err)
          } else {
              hi = Math.floor(hi)
              var gasEstimateHex = rpcHexEncoding.intToQuantityHex(hi)
              end(null, gasEstimateHex)
          }
      }
    )
}

VmSubprovider.prototype.runVm = async function(payload, cb){
  const self = this

  var blockData = self.currentBlock

  var block = blockFromBlockData(blockData)

  var blockNumber = ethUtil.addHexPrefix(blockData.number.toString('hex'))

  console.log('block number is', parseInt(blockNumber))
  // create vm with state lookup intercepted
  // var vm = self.vm = createVm(self.engine, blockNumber, {
  //   enableHomestead: false
  // })

  const common = new Common({ chain: Chain.Goerli })

  const hardforkByBlockNumber = true

  const vm = await VM.create({ common, hardforkByBlockNumber })

  if (self.opts.debug) {
    vm.on('step', function (data) {
      console.log(data.opcode.name)
    })
  }
  // create tx
  var txParams = payload.params[0]

  // txParams.from = '0x11EeAD9FA8B7Bce9F883add2b5254d0d46764F9b'

  const normalizedTxParams = {
    to: txParams.to ? ethUtil.addHexPrefix(txParams.to) : undefined,
    from: txParams.from ? ethUtil.addHexPrefix(txParams.from) : undefined,
    value: txParams.value ? ethUtil.addHexPrefix(txParams.value) : undefined,
    data: txParams.data ? ethUtil.addHexPrefix(txParams.data) : undefined,
    gasLimit: txParams.gas ? ethUtil.addHexPrefix(txParams.gas) : block.header.gasLimit,
    gasPrice: txParams.gasPrice ? ethUtil.addHexPrefix(txParams.gasPrice) : undefined,
    nonce: txParams.nonce ? ethUtil.addHexPrefix(txParams.nonce) : undefined,
  }

  // cb(null, {vm: {return :'12'}})

  // return

  // var pk = Buffer.from('ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', 'hex');

  // tx.sign(txData)
  const tx = TransactionFactory.fromTxData(normalizedTxParams, {common})
  console.log('tx', tx)

  const fakeTx = Object.create(tx)
  // override getSenderAddress
  fakeTx.getSenderAddress = () => {

    return normalizedTxParams.from}

  console.log('fake tx', fakeTx)

  // tx.sign(pk)

  // const fakeTx = Object.create(tx)
  // // override getSenderAddress
  // fakeTx.getSenderAddress = () => normalizedTxParams.from

  const res = await vm.runTx({ tx: fakeTx,     
    block: block,
    skipNonce: true,
    skipBlockGasLimitValidation: true,
    skipBalance: true })

  console.log('ressssss', res)

  cb(null, res)

  // vm.runTx({
  //   tx: fakeTx,
  //   block: block,
  //   skipNonce: true,
  //   skipBalance: true
  // }, function(err, results) {
  // console.log('What is this???', results)

  //   if (err) return cb(err)
  //   if (results.error != null) {
  //     return cb(new Error("VM error: " + results.error))
  //   }
  //   if (results.vm && results.vm.exception !== 1) {
  //     return cb(new Error("VM Exception while executing " + payload.method + ": " + results.vm.exceptionError))
  //   }

  //   cb(null, results)
  // })

}

function blockFromBlockData(blockData){
  var block = new Block()
  // block.header.hash = ethUtil.addHexPrefix(blockData.hash.toString('hex'))

  block.header.parentHash = blockData.parentHash
  block.header.uncleHash = blockData.sha3Uncles
  block.header.coinbase = blockData.miner
  block.header.stateRoot = blockData.stateRoot
  block.header.transactionTrie = blockData.transactionsRoot
  block.header.receiptTrie = blockData.receiptRoot || blockData.receiptsRoot
  block.header.bloom = blockData.logsBloom
  block.header.difficulty = blockData.difficulty
  block.header.number = blockData.number
  block.header.gasLimit = blockData.gasLimit
  block.header.gasUsed = blockData.gasUsed
  block.header.timestamp = blockData.timestamp
  block.header.extraData = blockData.extraData
  return block
}
