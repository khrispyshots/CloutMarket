# Celo Mainnet Deployment And Operations Checklist

Use this checklist before CloutMarket handles real assets on Celo Mainnet.

## Current Repo Gap

The app currently has:

- Vite + React frontend.
- Mock creators, posts, notifications, holdings, and local economy state.
- No wallet connection layer.
- No contracts directory.
- No ABIs or deployment artifacts.
- No backend/indexer.
- No database schema.
- No production Web3 runbooks.

The app is not mainnet-ready until all sections below are completed.

## Phase 1: Local Web3 Development

- Create `contracts/` workspace.
- Install Hardhat, OpenZeppelin, verification, linting, and coverage packages.
- Add `CreatorRegistry`, `CreatorShares`, `ShareMarket`, and `Treasury`.
- Add local tests for every contract.
- Add local deployment script.
- Add local deployment artifact output.
- Add `src/web3/` with chain config, contract addresses, ABIs, and typed hooks.
- Add wallet connect button and chain guard.
- Replace mock buy/sell/withdraw actions with contract writes behind feature flags.

## Phase 2: Celo Sepolia Testnet

- Create deployer wallet for testnet.
- Fund deployer with Celo Sepolia faucet.
- Deploy contracts to Celo Sepolia.
- Verify contracts on Celo Sepolia explorer.
- Save `contracts/deployments/celo-sepolia.json`.
- Point frontend to Celo Sepolia addresses.
- Run full app QA on Celo Sepolia:
  - Signup/profile claim.
  - Buy shares.
  - Sell shares.
  - Withdraw creator fees.
  - View holdings.
  - View leaderboard.
  - Refresh after transaction.
  - Handle failed/rejected wallet transaction.
- Run indexer against Celo Sepolia.
- Confirm reorg-safe event indexing.
- Confirm analytics and notification data match chain events.

## Phase 3: Production Infrastructure

Set up:

- Production RPC provider for Celo Mainnet.
- Backup RPC provider.
- WalletConnect Cloud project.
- CeloScan API key.
- Production database.
- Database backups and restore test.
- Backend/indexer host.
- Frontend host.
- Error tracking.
- Uptime checks.
- Log aggregation.
- Secret manager.
- GitHub Actions or equivalent CI/CD.

Production CI should run:

```bash
npm run lint
npm run build
npx hardhat compile
npx hardhat test
npx hardhat coverage
```

## Phase 4: Mainnet Contract Readiness

- Confirm every contract has NatSpec comments.
- Confirm every function with money movement is tested.
- Confirm slippage checks exist for buy/sell.
- Confirm max supply cannot be bypassed.
- Confirm treasury recipient cannot be zero address.
- Confirm admin functions are role-gated.
- Confirm emergency pause works.
- Confirm upgrade safety if using proxies.
- Confirm storage layout checks if using upgradeable contracts.
- Confirm all deployment constructor/initializer args are reviewed.
- Confirm protocol fee and creator fee rates are documented.
- Confirm fee changes, if allowed, are capped and timelocked.
- Confirm admin ownership is transferred to Safe multisig.
- Confirm deployer wallet has no lingering privileged ownership.
- Confirm final bytecode matches audited/reviewed commit.

## Phase 5: Mainnet Deployment

Before deploying:

- Freeze contract code.
- Tag the release commit.
- Run tests from a clean checkout.
- Export deployment variables from secret manager.
- Check deployer wallet balance.
- Check Celo Mainnet chain ID is `42220`.
- Check RPC points to Celo Mainnet, not Celo Sepolia.
- Dry-run the deployment against a fork or testnet.

Deploy:

```bash
npx hardhat run scripts/deploy.ts --network celo
```

After deploying:

- Save `contracts/deployments/celo-mainnet.json`.
- Verify all contracts.
- Transfer ownership/admin roles to Safe.
- Test read functions.
- Execute one small buy/sell flow with a test creator.
- Start production indexer from deployment block.
- Confirm frontend reads the new addresses.
- Publish explorer links internally.

## Phase 6: Frontend Mainnet Release

- Set production env variables:

```env
VITE_WALLETCONNECT_PROJECT_ID=
VITE_CELO_RPC_URL=
VITE_CELO_CHAIN_ID=42220
VITE_CONTRACT_CREATOR_REGISTRY=
VITE_CONTRACT_SHARE_MARKET=
VITE_CONTRACT_TREASURY=
```

- Build frontend.
- Deploy preview build.
- Confirm wallet connection.
- Confirm Celo Mainnet chain prompt.
- Confirm all contract addresses match deployment artifact.
- Confirm transaction links open in CeloScan.
- Confirm no private env variables are bundled.
- Ship production build.

## Phase 7: Monitoring And Runbooks

Monitor:

- RPC error rate and latency.
- Failed transaction rate.
- Reverted transaction reasons.
- Indexer lag.
- Missed blocks/events.
- Backend API error rate.
- Database storage and replication.
- Treasury balance.
- ShareMarket pause state.
- Unusual buy/sell volume.
- Frontend error rate.

Create runbooks for:

- Pause market.
- Unpause market.
- Upgrade contract.
- Rotate RPC provider.
- Restart indexer from block.
- Rebuild leaderboard from indexed events.
- Handle duplicate or bad profile claim.
- Handle compromised deployer.
- Handle compromised admin signer.
- Handle stuck funds or failed withdrawal.

## Access Management

Use separate roles:

- Product admin: can manage off-chain profiles/content.
- Contract admin: Safe multisig only.
- Treasury admin: Safe multisig only.
- Emergency guardian: can pause, cannot withdraw.
- Deployer: temporary, no long-term ownership.
- Backend operator: can deploy backend/indexer, cannot move funds.

Every signer should have:

- Hardware wallet where possible.
- Least privilege.
- Named owner.
- Rotation plan.
- Backup plan.

## Data Management

On-chain source of truth:

- Share ownership.
- Supply.
- Buy/sell transactions.
- Fees.
- Treasury withdrawals.
- Creator on-chain registration.

Off-chain source of truth:

- Posts.
- Likes.
- Comments.
- Follow graph.
- Notifications.
- Profile images.
- Signup OAuth data.
- Hot share ranking cache.
- P/L calculations derived from trades.

Backup:

- Database daily snapshot.
- Deployment artifacts.
- ABI files.
- Contract verification metadata.
- Indexer checkpoint block.

## Mainnet Launch Gate

Do not launch until all are true:

- Celo Sepolia QA passed.
- Contracts verified.
- Deployment artifacts committed.
- Admin ownership moved to Safe.
- Monitoring live.
- Runbooks written.
- Indexer caught up.
- Frontend points to mainnet addresses.
- Legal/product has approved public trading language.
- There is a public support path for failed transactions.

## Sources

- Celo network details: https://docs.celo.org/build-on-celo/network-overview
- Celo Hardhat deployment docs: https://docs.celo.org/tooling/dev-environments/hardhat
- Celo contract verification docs: https://docs.celo.org/tooling/contract-verification/hardhat
