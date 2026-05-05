# Smart Contracts Setup For CloutMarket

CloutMarket should not put every social action on-chain. The smart contracts should own money, tradable shares, supply, fees, and creator claims. The backend should own posts, likes, comments, rankings, notifications, and fast product data.

## Recommended Contract Stack

Use Hardhat as the primary project because this repo is already TypeScript/React. Add Foundry later if the team wants heavier fuzz testing and gas-focused Solidity workflows.

```bash
npm install -D hardhat @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-verify dotenv
npm install @openzeppelin/contracts
npm install -D @openzeppelin/hardhat-upgrades solidity-coverage solhint prettier prettier-plugin-solidity
npm install @openzeppelin/contracts-upgradeable
```

Optional but useful:

```bash
npm install -D typechain @typechain/hardhat @typechain/ethers-v6
```

Optional Foundry setup:

```bash
# Install foundryup from the official Foundry installer, then:
foundryup
forge install OpenZeppelin/openzeppelin-contracts
```

## Contract Architecture

### 1. `CreatorRegistry`

Purpose:

- Connect a wallet to a creator profile.
- Enforce one active creator identity per wallet.
- Store minimal on-chain metadata pointer, not full profile data.

Suggested state:

```solidity
struct Creator {
    address owner;
    string handle;
    string metadataURI;
    uint64 registeredAt;
    bool active;
}
```

Suggested events:

```solidity
event CreatorRegistered(uint256 indexed creatorId, address indexed owner, string handle, string metadataURI);
event CreatorMetadataUpdated(uint256 indexed creatorId, string metadataURI);
event CreatorOwnerTransferred(uint256 indexed creatorId, address indexed oldOwner, address indexed newOwner);
```

### 2. `CreatorShares`

Purpose:

- Represent creator shares.
- Enforce max supply such as `10_000` shares per creator.
- Track balances and supply.

Recommended implementation:

- Use ERC1155 if every creator share can be represented as a token ID.
- Use ERC20 clone/factory only if each creator needs independent token behavior or integrations.

For CloutMarket, ERC1155 is likely the better first implementation because it is cheaper and easier to index at scale.

### 3. `ShareMarket`

Purpose:

- Handle buy/sell.
- Calculate bonding curve price.
- Collect protocol and creator fees.
- Mint/burn or transfer shares.

Required protections:

- `ReentrancyGuard`
- `Pausable`
- Strict slippage checks
- Max supply checks
- Minimum output checks on sell
- Fee recipient validation

Suggested events:

```solidity
event SharesBought(
    uint256 indexed creatorId,
    address indexed buyer,
    uint256 sharesOut,
    uint256 amountIn,
    address paymentToken,
    uint256 protocolFee,
    uint256 creatorFee
);

event SharesSold(
    uint256 indexed creatorId,
    address indexed seller,
    uint256 sharesIn,
    uint256 amountOut,
    address paymentToken,
    uint256 protocolFee
);
```

### 4. `Treasury`

Purpose:

- Hold protocol fees.
- Route creator fees.
- Allow withdrawals only by authorized roles.

Recommended ownership:

- Protocol fee recipient: treasury Safe.
- Upgrade/admin role: admin Safe.
- Emergency pause role: admin Safe or dedicated guardian Safe.

### 5. Optional `RewardsLedger`

Only add this if Clout points must be claimable/redeemable on-chain. Otherwise, keep Clout points off-chain and derive them from indexed events plus product activity.

## Payment Tokens

Start simple:

- Phase 1: CELO only.
- Phase 2: add Celo stablecoins such as cUSD/USDC if product economics need stable pricing.

Celo supports fee-currency behavior through Celo-aware tooling such as viem, but product payment tokens are still your contract design decision. Keep payment token support allowlisted.

## Hardhat Network Config

Create `contracts/hardhat.config.ts`:

```ts
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-verify';
import '@openzeppelin/hardhat-upgrades';
import 'dotenv/config';

const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    celoSepolia: {
      url: process.env.CELO_SEPOLIA_RPC_URL || 'https://forno.celo-sepolia.celo-testnet.org',
      chainId: 11142220,
      accounts: privateKey ? [privateKey] : [],
    },
    celo: {
      url: process.env.CELO_RPC_URL || 'https://forno.celo.org',
      chainId: 42220,
      accounts: privateKey ? [privateKey] : [],
    },
  },
  etherscan: {
    apiKey: {
      celo: process.env.CELOSCAN_API_KEY || '',
      celoSepolia: process.env.CELOSCAN_API_KEY || '',
    },
    customChains: [
      {
        network: 'celo',
        chainId: 42220,
        urls: {
          apiURL: 'https://api.etherscan.io/v2/api',
          browserURL: 'https://celoscan.io',
        },
      },
      {
        network: 'celoSepolia',
        chainId: 11142220,
        urls: {
          apiURL: 'https://api.etherscan.io/v2/api',
          browserURL: 'https://sepolia.celoscan.io',
        },
      },
    ],
  },
};

export default config;
```

If using mnemonic-based accounts, Celo's documented derivation path is `m/44'/52752'/0'/0`. For production deployments, prefer a hardware wallet or multisig-controlled deployment workflow over raw mnemonic use.

## Contract Environment Variables

Add a contract-specific `.env.example` under `contracts/`:

```env
CELO_RPC_URL=https://forno.celo.org
CELO_SEPOLIA_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
DEPLOYER_PRIVATE_KEY=
CELOSCAN_API_KEY=
TREASURY_SAFE=
ADMIN_SAFE=
GUARDIAN_SAFE=
```

Never commit `.env`, private keys, mnemonics, or deployment key JSON files.

## Deployment Commands

Compile:

```bash
npx hardhat compile
```

Test:

```bash
npx hardhat test
npx hardhat coverage
```

Deploy to Celo Sepolia:

```bash
npx hardhat run scripts/deploy.ts --network celoSepolia
```

Deploy to Celo Mainnet:

```bash
npx hardhat run scripts/deploy.ts --network celo
```

Verify on Celo Mainnet:

```bash
npx hardhat verify CONTRACT_ADDRESS CONSTRUCTOR_ARGS --network celo
```

## Deployment Artifacts

Every deployment should write a JSON file:

```text
contracts/deployments/
  celo-sepolia.json
  celo-mainnet.json
```

Each file should include:

```json
{
  "chainId": 42220,
  "network": "celo",
  "deployer": "0x...",
  "contracts": {
    "CreatorRegistry": "0x...",
    "CreatorShares": "0x...",
    "ShareMarket": "0x...",
    "Treasury": "0x..."
  },
  "blockNumber": 0,
  "commit": "git-sha",
  "deployedAt": "ISO-8601"
}
```

The frontend should consume addresses from these artifacts through a controlled build step.

## Testing Checklist

Unit tests:

- Creator registration and duplicate handle/wallet prevention.
- Buy price calculation.
- Sell price calculation.
- Max supply enforcement.
- Protocol and creator fee calculation.
- Treasury withdrawals.
- Pause/unpause behavior.
- Access control failures.
- Slippage protection.
- Reentrancy protection.

Integration tests:

- Register creator -> buy -> sell -> withdraw creator fees.
- Index events from a local chain.
- Frontend can read balances and submit transactions.
- Upgrade flow preserves storage if using proxies.

Security tests:

- Fuzz bonding curve inputs.
- Test edge supply values: `0`, `1`, max supply, max supply minus one.
- Test fee recipient set to zero address.
- Test malicious receiver reentrancy.
- Test pausing during pending market activity.

## Security Setup Before Mainnet

Minimum mainnet requirements:

- All contracts use OpenZeppelin primitives where possible.
- Admin roles transferred to Safe multisig.
- Upgrade rights behind Safe and ideally timelock.
- Emergency pause role documented.
- Contract verification completed.
- Deployment artifact committed.
- Independent audit or at least external review completed.
- Bug bounty or disclosure email prepared.
- Runbooks created for pause, upgrade, stuck funds, bad deployment, and compromised deployer.

## Sources

- Celo Hardhat deployment docs: https://docs.celo.org/tooling/dev-environments/hardhat
- Celo Hardhat verification docs: https://docs.celo.org/tooling/contract-verification/hardhat
- OpenZeppelin Contracts: https://docs.openzeppelin.com/contracts/5.x
- OpenZeppelin Upgradeable Contracts: https://docs.openzeppelin.com/contracts/5.x/upgradeable
- Hardhat: https://hardhat.org
