import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CurrentUser, Post, Screen } from './types';
import { BottomNavBar, TopAppBar } from './components/Navigation';
import { Splash } from './pages/Splash';
import { Feed } from './pages/Feed';
import { Discover } from './pages/Discover';
import { Portfolio } from './pages/Portfolio';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Leaderboard } from './pages/Leaderboard';
import { BuyToken } from './pages/BuyToken';
import { SellToken } from './pages/SellToken';
import { Withdraw } from './pages/Withdraw';
import { OnboardingHandle } from './pages/OnboardingHandle';
import { OnboardingWallet } from './pages/OnboardingWallet';
import { OnboardingWelcome } from './pages/OnboardingWelcome';
import { Signup } from './pages/Signup';
import { DEFAULT_USER_AVATAR, NOTIFICATIONS } from './constants';

const cleanHandle = (handle: string) => handle.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'frosthub';

const nameFromHandle = (handle: string) =>
  cleanHandle(handle)
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Frosthub';

const createCurrentUser = (handle: string): CurrentUser => {
  const cleaned = cleanHandle(handle);
  return {
    id: 'me',
    name: nameFromHandle(cleaned),
    handle: cleaned,
    cloutName: `${cleaned}.clout`,
    followers: '0',
    price: '$1.00',
    change: '+0.0%',
    avatar: DEFAULT_USER_AVATAR,
    bio: 'Verified creator profile powered by your signup identity.',
    joinedAt: 'Today',
    isVerified: true,
  };
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Splash);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => createCurrentUser('frosthub'));
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>('me');
  const [notificationReturnScreen, setNotificationReturnScreen] = useState<Screen>(Screen.Feed);
  const [myPosts, setMyPosts] = useState<Post[]>([]);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const navigateFromBottom = (screen: Screen) => {
    if (screen === Screen.Profile) setSelectedCreatorId('me');
    setCurrentScreen(screen);
  };

  const openProfile = (creatorId = 'me') => {
    setSelectedCreatorId(creatorId);
    navigate(Screen.Profile);
  };

  const openBuy = (creatorId = selectedCreatorId) => {
    setSelectedCreatorId(creatorId === 'me' ? '3' : creatorId);
    navigate(Screen.BuyToken);
  };

  const openSell = (creatorId = selectedCreatorId) => {
    setSelectedCreatorId(creatorId === 'me' ? '3' : creatorId);
    navigate(Screen.SellToken);
  };

  const openNotifications = () => {
    setNotificationReturnScreen(currentScreen === Screen.Notifications ? Screen.Feed : currentScreen);
    navigate(Screen.Notifications);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Splash:
        return <Splash onComplete={() => navigate(Screen.Onboarding_Welcome)} onLogin={() => navigate(Screen.Feed)} />;
      case Screen.Signup:
        return <Signup onComplete={(handle) => {
          setCurrentUser(createCurrentUser(handle));
          navigate(Screen.Onboarding_Wallet);
        }} />;
      case Screen.Onboarding_Wallet:
        return (
          <OnboardingWallet
            xHandle={currentUser.handle}
            onComplete={(walletAddress) => {
              setCurrentUser((user) => ({ ...user, walletAddress, walletChainId: 42220 }));
              navigate(Screen.Onboarding_Handle);
            }}
            onBack={() => navigate(Screen.Signup)}
          />
        );
      case Screen.Onboarding_Handle:
        return <OnboardingHandle xHandle={currentUser.handle} walletAddress={currentUser.walletAddress} onComplete={() => navigate(Screen.Feed)} onBack={() => navigate(Screen.Onboarding_Wallet)} />;
      case Screen.Onboarding_Welcome:
        return <OnboardingWelcome onComplete={() => navigate(Screen.Signup)} />;

      case Screen.Feed:
        return <Feed currentUser={currentUser} myPosts={myPosts} onPostCreated={(post) => setMyPosts((items) => [post, ...items])} onCreatorSelect={openProfile} onInvest={openBuy} />;
      case Screen.Discover:
        return <Discover onInvest={openBuy} onProfile={openProfile} />;
      case Screen.Portfolio:
        return <Portfolio onShowLeaderboard={() => navigate(Screen.Leaderboard)} onBuy={() => navigate(Screen.Discover)} onWithdraw={() => navigate(Screen.Withdraw)} />;
      case Screen.Profile:
        return (
          <Profile
            currentUser={currentUser}
            selectedCreatorId={selectedCreatorId}
            myPosts={myPosts}
            onBuy={() => openBuy(selectedCreatorId)}
            onBack={() => navigate(Screen.Feed)}
            onSettings={() => navigate(Screen.Settings)}
            onSell={() => openSell(selectedCreatorId)}
            onPortfolio={() => navigate(Screen.Portfolio)}
            onNotifications={openNotifications}
          />
        );
      case Screen.BuyToken:
        return <BuyToken creatorId={selectedCreatorId} onBack={() => openProfile(selectedCreatorId)} onComplete={() => navigate(Screen.Portfolio)} />;
      case Screen.SellToken:
        return <SellToken creatorId={selectedCreatorId} onBack={() => openProfile(selectedCreatorId)} onComplete={() => navigate(Screen.Portfolio)} />;
      case Screen.Withdraw:
        return <Withdraw onBack={() => navigate(Screen.Portfolio)} onComplete={() => navigate(Screen.Portfolio)} />;
      case Screen.Notifications:
        return <Notifications onBack={() => navigate(notificationReturnScreen)} />;
      case Screen.Settings:
        return <Settings onBack={() => navigate(Screen.Profile)} onLogout={() => navigate(Screen.Splash)} />;
      case Screen.Leaderboard:
        return <Leaderboard onProfileSelect={openProfile} />;
      default:
        return <Feed currentUser={currentUser} myPosts={myPosts} onPostCreated={(post) => setMyPosts((items) => [post, ...items])} onCreatorSelect={openProfile} onInvest={openBuy} />;
    }
  };

  const isFullPage = [
    Screen.Splash,
    Screen.Onboarding_Handle,
    Screen.Onboarding_Wallet,
    Screen.Onboarding_Welcome,
    Screen.Signup,
    Screen.BuyToken,
    Screen.SellToken,
    Screen.Withdraw,
  ].includes(currentScreen);

  const showTopBar = !isFullPage && ![
    Screen.Profile,
    Screen.Settings,
    Screen.Notifications
  ].includes(currentScreen);

  const showBottomBar = !isFullPage;

  return (
    <div className="h-dvh max-h-dvh flex flex-col overflow-hidden bg-clout-bg selection:bg-clout-yellow selection:text-border-dark">
      {showTopBar && (
        <TopAppBar
          currentUser={currentUser}
          unreadCount={NOTIFICATIONS.filter((n) => !n.isRead).length}
          onAvatarClick={() => openProfile('me')}
          onNotificationsClick={openNotifications}
        />
      )}

      <main
        className={
          showTopBar
            ? 'flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain pt-[calc(4.25rem+env(safe-area-inset-top,0px))] sm:pt-[calc(4.75rem+env(safe-area-inset-top,0px))]'
            : 'flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain'
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`w-full max-w-xl mx-auto ${isFullPage ? 'h-full min-h-0 flex flex-col' : 'min-h-0'}`}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {showBottomBar && <BottomNavBar activeScreen={currentScreen} onNavigate={navigateFromBottom} />}
    </div>
  );
}
