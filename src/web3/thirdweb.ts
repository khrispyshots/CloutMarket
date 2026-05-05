import { createThirdwebClient } from 'thirdweb';
import { celo } from 'thirdweb/chains';
import { createWallet, inAppWallet } from 'thirdweb/wallets';

export const thirdwebClient = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || 'replace-with-thirdweb-client-id',
});

export const celoMainnet = celo;

export const cloutMarketWallets = [
  inAppWallet({
    auth: {
      mode: 'popup',
      options: ['google', 'email'],
    },
  }),
  createWallet('com.valoraapp'),
  createWallet('io.metamask'),
  createWallet('io.rabby'),
];

export const thirdwebAppMetadata = {
  name: 'CloutMarket',
  url: import.meta.env.VITE_APP_URL || window.location.origin,
  description: 'Trade creator shares on Celo.',
  logoUrl: `${window.location.origin}/logo.svg`,
};
