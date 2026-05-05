import { Screen, Creator, Post, Holding, Notification } from './types';

export const DEFAULT_USER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBPVpsRKHuRuOzQlOqUqi7Bfp7dlrib0uguDeolilblQoO4sMNEWKz6w90n7zWzIP7tTS7vV_irrgb2Dh-jFpUI11phZW1saxp-2N4zKsNCUV8sxFRnMK81JWCiQ7Qag6Jg6XJQUYhY0TeUszJ68O2O0QzSNYukVZ8k63fuL9vnkpaE1C6RG58JJQPqguFPQppk4ux4EeCiuwU7MZz4izu2tedl5VodA9bbjCWYka3DzmUSjPSRqP3g3qHkux157CysxBnmJ_CLw2E';

export const CREATORS: Creator[] = [
  {
    id: '1',
    name: 'SatoshiArt',
    handle: 'SatoshiArt',
    followers: '1.2M',
    price: '$420.69',
    change: '+12.4%',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqyUaMqZxnFpjBPROPLCX1EjsNpNSIzMvlMiS-SwEMJ-HYghGBZBtx_SZqwnIxm1opq6c7xAoGIz7JqbHzFZdopT1NYIwtcmARcswFcSyALrf_BoYS4y6PFShsBCcByxTYBOIpP2Z6XfFGMQmwQeFGWc5XrbmmvcRLf1gShOYfIqSALqEO2W0UqZn2y6NspAULmadRgLDgJ5SFAhfDPqJwC5t7P09RTnXo1FfVMUhJ7ES3Ju0JAeNaeyvl09O-JtMAkIltNto64Ss',
    isVerified: true
  },
  {
    id: '2',
    name: 'DevGiga',
    handle: 'DevGiga',
    followers: '840K',
    price: '$185.20',
    change: '+8.1%',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA270-EOu9bdBR0zCaLw3t05e0hwxLLYkL4foz-Umx0lfawfeSAy8comTm80eKLaPpZGi-Wyi8Uv9vLC05CkEWs3S3X94Fzi32832AMcayP2Tl1jX9n0t78EILULwvGYkb6QxlEs3Hnv060PwLHlEYx5QspM0BhZMjUI0jPRbZxuoJeBvACQnkzLk435viISzDtSs5tibgj3RM3KQhrqnWG7w3RDK7TWmlq4yclrTfHVCSL6ZwkzYvlrz17vZCsuKECbKS2JN-rCo',
    isVerified: true
  },
  {
    id: '3',
    name: 'Alex Rivers',
    handle: 'arivers.clout',
    followers: '500K',
    price: '$42.85',
    change: '+12%',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDaH8uQYDQu4nDQ-w-CN1e_m2xXl92IV1ry2K-bWpiUKYYF-T_apF7pMyMJRPrhmaKmMpKxSzzwjIOYd3M93Zi8kzV8la6l0dh0BstHLqwGlwagKbmXSWj9PnlwDavjOyMJ2SeHnu7hhaHbwEt8LC9eyPg8xWk2ietY4VSzkiuNyHsgzO4bku1VlGZ3DBtZ8lPz7Wwbx3UUnYyWyGHpPdVxXYN11ZnKB5KptlMB0F8n30-xNPREkGPjtu5K1Cg4FX-Ajd-Bodi2QU',
    isVerified: true,
    bio: 'Digital creator and SocialFi pioneer. Building the future of decentralized attention.'
  }
];

export const POSTS: Post[] = [
  {
    id: 'p1',
    creatorId: '3',
    creatorName: 'Alex Rivers',
    creatorHandle: 'arivers.clout',
    creatorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMHmNjbkEPNddAnNgrYmpHoYuOS8Bd4bospWxwBHSCMpYW4Dqc0zCu9rL3_U0HC-057-34EIhZ8UOdWM2tYJgTfdlGsKAteWMYuDfNnx3UJTGV--0OvXiiyccfDUkgwrCR8D9qhYI1vSEG11ZbhOOKcphxn_N2iIX0iz5bbk9IaPG76LEMAwo5a6qUNadfH0e8L7Wdfzcvv46ocvRR5DBzUa6c6-nMXRKipMltz1yiUxxwRXI12HZuXyVATuG4171tRx-L354ZTBg',
    content: 'Just reached a new milestone! \uD83D\uDE80 Big thank you to my top 10 holders for believing in the mission. New drop coming next week.',
    likes: '124',
    comments: '18',
    timestamp: '2 hours ago'
  },
  {
    id: 'p2',
    creatorId: '3',
    creatorName: 'Alex Rivers',
    creatorHandle: 'arivers.clout',
    creatorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMHmNjbkEPNddAnNgrYmpHoYuOS8Bd4bospWxwBHSCMpYW4Dqc0zCu9rL3_U0HC-057-34EIhZ8UOdWM2tYJgTfdlGsKAteWMYuDfNnx3UJTGV--0OvXiiyccfDUkgwrCR8D9qhYI1vSEG11ZbhOOKcphxn_N2iIX0iz5bbk9IaPG76LEMAwo5a6qUNadfH0e8L7Wdfzcvv46ocvRR5DBzUa6c6-nMXRKipMltz1yiUxxwRXI12HZuXyVATuG4171tRx-L354ZTBg',
    content: 'Teaser for the Genesis Collection. Early holders get priority access.',
    likes: '89',
    comments: '12',
    timestamp: '4 hours ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4wgdo1bRyIMn_q1aXCHHq_KP6YUBNy1HcWnIpwmfZJb55s9KVTkdrtXZXsKAQPsQpTR6AtW7mRx_7Tr1inVbTIKNTDuDmaonG3juDB64ToYcYohiRl96zYfsKzDh4nPhBanPUnhvWsn9ErmGd1P0ZkGrITe_jUuB_CTGJDcmRMj2uadoI6XZ0NjQrpYxEWOaQiXbgZKmwwBAvl3RZzH6dyixltEk04YCAQ3KyALjkVe3F3iV7Zd-nRBa7NJ2GO_sLFXR2dQypHWc'
  },
  {
    id: 'p3',
    creatorId: '1',
    creatorName: 'Sarah Jenkins',
    creatorHandle: 'sarah.clout',
    creatorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7xuYq3Qztb6rdPkNTAHz0f5QghCckfZbyDx-H70ll8JCZMhvy98Bt9ihdEPxB3xRTGNQd2KUHG82jrxcTAuZRYqzfEU0CJ9RS18zuFOULPwYebp9RrSpp_uAvmcqUYM7GutU81Hk7arrteOuvGxkbfEadoUn9O0QZk9JqnleGbxNs3M9nFoAFIfK5ltARdawIx3Bt0S5IHfM9nu-1jCy0mjl_iroenRlP29Z7tx3BnHJ9A8OQ-bPpfdpBlZAbvj7wnjD3j3xTuCI',
    content: 'Just minted my first influence tokens on CloutMarket! The decentralized social future is looking very bright today.',
    likes: '2.4k',
    comments: '128',
    timestamp: '2h ago'
  }
];

export const HOLDINGS: Holding[] = [
  {
    id: 'h1',
    name: 'CloutToken',
    symbol: 'CLOUT',
    value: '$12,400.00',
    amount: '2.41 CLOUT',
    icon: 'token',
    color: 'clout-purple'
  },
  {
    id: 'h2',
    name: 'Creator Pass: Alex',
    symbol: 'ALEX_PASS',
    value: '$8,250.40',
    amount: '\u25B2 4.2%',
    icon: 'group',
    color: 'clout-green'
  },
  {
    id: 'h3',
    name: 'Ethereum',
    symbol: 'ETH',
    value: '$22,199.84',
    amount: '8.42 ETH',
    icon: 'diamond',
    color: 'clout-yellow'
  }
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'follower',
    title: 'NEW FOLLOWER',
    content: 'just followed your creator profile.',
    timestamp: '2m ago',
    isRead: false,
    color: 'clout-green',
    icon: 'person_add'
  },
  {
    id: 'n2',
    type: 'investment',
    title: 'NEW INVESTMENT',
    content: 'bought $250 worth of your $CLOUT coins.',
    timestamp: '15m ago',
    isRead: false,
    color: 'clout-yellow',
    icon: 'payments'
  },
  {
    id: 'n3',
    type: 'alert',
    title: 'PRICE ALERT',
    content: 'reached a new all-time high of $12.42.',
    timestamp: '1h ago',
    isRead: false,
    color: 'clout-purple',
    icon: 'trending_up'
  }
];
