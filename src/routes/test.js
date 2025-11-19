const express = require('express');
const ethers = require('ethers');

// Basic ERC20 ABI subset
const erc20Abi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
];

// USDT contract on Sepolia (Tether test deployment)
const USDT_CONTRACT_ADDRESS = process.env.USDT_CONTRACT_ADDRESS

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const usdt = new ethers.Contract(USDT_CONTRACT_ADDRESS, erc20Abi, provider);

const router = express.Router();

// GET /api/test
router.get('/', async (req, res, next) => {
  try {
    const [network, name, symbol, decimals, totalSupplyRaw] = await Promise.all([
      provider.getNetwork(),
      usdt.name(),
      usdt.symbol(),
      usdt.decimals(),
      usdt.totalSupply(),
    ]);

    const scale = 10n ** decimals
    const format = (v) => Number(BigInt(v) / scale);

    const data = {
      network: network.name,
      contract: USDT_CONTRACT_ADDRESS,
      name,
      symbol,
      decimals: decimals.toString(),
      totalSupply: format(totalSupplyRaw),
    };

    res.json({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
