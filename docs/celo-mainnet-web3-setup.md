# Celo Mainnet Web3 Setup

This repo is currently a Vite + React frontend with mock market data and a local simulation engine. To deploy CloutMarket as a real Web3 product on Celo Mainnet, we need to add four missing layers:

1. Wallet connection and Celo chain configuration in the frontend.
2. Smart contracts for creator shares, trading, fees, and treasury controls.
3. An indexer/backend for market data, profiles, notifications, and feed state.
4. Mainnet deployment, verification, monitoring, and admin key management.

## Celo Network Targets

Use Celo Sepolia for all contract and app testing before touching mainnet.

| Network | Chain ID | Currency | RPC | Explorer |
| --- | ---: | --- | --- | --- |
| Celo Mainnet | `42220` | `CELO` | `https://forno.celo.org` | `https://celoscan.io` |
| Celo Sepolia | `11142220` | `CELO` | `https://forno.celo-sepolia.celo-testnet.org` | `https://celo-sepolia.blockscout.com` |

Forno is useful for development, but it is rate-limited. For production, use an RPC provider with an SLA and keep Forno as a fallback.

## Recommended Repo Structure

```text
CloutMarket-main/
  contracts/
    contracts/
    scripts/
    ignition/
    test/
    deployments/
    hardhat.config.ts
  src/
    web3/
      chains.ts
      wagmi.ts
      contracts.ts
      hooks.ts
    engine/
    pages/
  server/
    indexer/
    api/
  docs/
```

Keep generated ABIs in `src/web3/abis/` or import them from `contracts/artifacts` during build. The frontend should never hard-code ABI fragments inside page components.

## Install: Frontend Web3

Install wallet, chain, contract-read/write, and async-state tooling:

```bash
npm install wagmi viem@2.x @tanstack/react-query @rainbow-me/rainbowkit
npm install -D @wagmi/cli
```

Why:

- `viem`: low-level Celo/EVM reads, writes, event logs, transaction receipts.
- `wagmi`: React hooks for account state, chain switching, contract reads/writes, transaction lifecycle.
- `@rainbow-me/rainbowkit`: wallet connection UI.
- `@tanstack/react-query`: required by wagmi/RainbowKit for query caching.
- `@wagmi/cli`: optional but recommended for typed ABI hooks and safer contract integration.

## Setup: Wallet Provider

Create `src/web3/chains.ts`:

```ts
import { celo, celoSepolia } from 'wagmi/chains';

export const supportedChains = [celo, celoSepolia] as const;
```

Create `src/web3/wagmi.ts`:

```ts
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { celo, celoSepolia } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'CloutMarket',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [celo, celoSepolia],
  transports: {
    [celo.id]: http(import.meta.env.VITE_CELO_RPC_URL),
    [celoSepolia.id]: http(import.meta.env.VITE_CELO_SEPOLIA_RPC_URL),
  },
});
```

Wrap the app in `WagmiProvider`, `QueryClientProvider`, and `RainbowKitProvider` in `src/main.tsx`.

## Required Environment Variables

Add to `.env.example`:

```env
VITE_WALLETCONNECT_PROJECT_ID=
VITE_CELO_RPC_URL=https://forno.celo.org
VITE_CELO_SEPOLIA_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
VITE_CELO_CHAIN_ID=42220
VITE_CELO_SEPOLIA_CHAIN_ID=11142220
VITE_CONTRACT_CREATOR_REGISTRY=
VITE_CONTRACT_SHARE_MARKET=
VITE_CONTRACT_TREASURY=
```

Do not put private keys in `VITE_*` variables. Anything starting with `VITE_` can be exposed to the browser.

## Frontend Integration Work

Replace mock-only actions with Web3 state gradually:

- Wallet connection in the top bar/profile.
- Chain guard: require Celo Mainnet or Celo Sepolia depending on environment.
- Contract read hooks for balances, share supply, price, holdings, fees.
- Contract write hooks for claim profile, buy shares, sell shares, withdraw creator fees.
- Transaction states: simulate, submit, pending, success, failed, explorer link.
- Event refresh: after a successful transaction, invalidate relevant wagmi queries.

Keep feed posts, comments, likes, notifications, and social profile metadata off-chain unless there is a strong reason to pay gas for them.

## Install: Backend and Indexer

The app will need a backend/indexer because the UI needs sorted leaderboards, hot shares, notifications, and profile data. Do not make the browser scan all logs directly.

```bash
npm install express cors zod pino viem
npm install -D tsx dotenv
```

Choose a database:

```bash
npm install prisma @prisma/client
npm install -D prisma
```

or:

```bash
npm install drizzle-orm postgres
```

Recommended backend responsibilities:

- Index smart contract events into tables.
- Store off-chain profile metadata from signup.
- Store posts, comments, likes, notifications, and follow graph.
- Calculate leaderboards, hot shares, P/L, and new-user sections.
- Expose read APIs to the frontend.
- Run background jobs for reorg-safe event processing.

## Indexer Events To Track

The smart contracts should emit events for:

- `CreatorRegistered`
- `SharesBought`
- `SharesSold`
- `FeesAccrued`
- `CreatorFeesWithdrawn`
- `TreasuryWithdrawn`
- `MarketPaused`
- `MarketUnpaused`

The backend should turn those events into:

- Current share price per creator.
- Total supply per creator.
- Holder balances.
- Trading volume.
- Profit/loss calculations.
- Hot shares leaderboard.
- Notifications.

## Wallet and Account Setup

Create separate wallets/accounts for:

- Deployer account: used only for deployments.
- Admin multisig: owns contracts and upgrade rights.
- Treasury multisig: receives protocol fees.
- Backend/indexer account: only if the backend needs signed actions.
- Test wallets: used on Celo Sepolia and local networks.

Use a Safe multisig for admin and treasury ownership before mainnet launch. Never leave production ownership on a single hot wallet.

## Production Services To Set Up

- RPC provider with SLA for Celo Mainnet and Celo Sepolia.
- WalletConnect Cloud project ID.
- CeloScan API key for verification.
- Database with backups.
- Error tracking such as Sentry.
- Uptime monitoring for frontend, backend, indexer, and RPC.
- Secret manager such as 1Password, Doppler, AWS Secrets Manager, or GitHub Actions secrets.
- CI checks for lint, tests, contract tests, coverage, and deployment dry runs.

## Sources

- Celo network details: https://docs.celo.org/build-on-celo/network-overview
- Celo + viem notes: https://docs.celo.org/tooling/libraries-sdks/viem
- wagmi setup: https://wagmi.sh/react/getting-started
- RainbowKit setup: https://rainbowkit.com/docs/installation
