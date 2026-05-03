import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen } from './types';
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
import { OnboardingWelcome } from './pages/OnboardingWelcome';
import { Signup } from './pages/Signup';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Splash);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Splash:
        return <Splash onComplete={() => navigate(Screen.Signup)} onLogin={() => navigate(Screen.Signup)} />;
      case Screen.Signup:
        return <Signup onComplete={() => navigate(Screen.Onboarding_Handle)} />;
      case Screen.Onboarding_Handle:
        return <OnboardingHandle onComplete={() => navigate(Screen.Onboarding_Welcome)} onBack={() => navigate(Screen.Signup)} />;
      case Screen.Onboarding_Welcome:
        return <OnboardingWelcome onComplete={() => navigate(Screen.Feed)} />;
      case Screen.Feed:
        return <Feed onCreatorSelect={() => navigate(Screen.Profile)} onInvest={() => navigate(Screen.BuyToken)} />;
      case Screen.Discover:
        return <Discover onInvest={() => navigate(Screen.BuyToken)} onProfile={() => navigate(Screen.Profile)} />;
      case Screen.Portfolio:
        return <Portfolio onShowLeaderboard={() => navigate(Screen.Leaderboard)} onBuy={() => navigate(Screen.Discover)} onWithdraw={() => navigate(Screen.Withdraw)} />;
      case Screen.Profile:
        return <Profile onBuy={() => navigate(Screen.BuyToken)} onBack={() => navigate(Screen.Feed)} onSettings={() => navigate(Screen.Settings)} onSell={() => navigate(Screen.SellToken)} />;
      case Screen.BuyToken:
        return <BuyToken onBack={() => navigate(Screen.Profile)} onComplete={() => navigate(Screen.Portfolio)} />;
      case Screen.SellToken:
        return <SellToken onBack={() => navigate(Screen.Profile)} onComplete={() => navigate(Screen.Portfolio)} />;
      case Screen.Withdraw:
        return <Withdraw onBack={() => navigate(Screen.Portfolio)} onComplete={() => navigate(Screen.Portfolio)} />;
      case Screen.Notifications:
        return <Notifications />;
      case Screen.Settings:
        return <Settings onBack={() => navigate(Screen.Profile)} onLogout={() => navigate(Screen.Splash)} />;
      case Screen.Leaderboard:
        return <Leaderboard onBack={() => navigate(Screen.Portfolio)} onProfileSelect={() => navigate(Screen.Profile)} />;
      default:
        return <Feed onCreatorSelect={() => navigate(Screen.Profile)} onInvest={() => navigate(Screen.BuyToken)} />;
    }
  };

  const isFullPage = [
    Screen.Splash,
    Screen.Onboarding_Handle,
    Screen.Onboarding_Welcome,
    Screen.Signup,
    Screen.BuyToken,
    Screen.SellToken,
    Screen.Withdraw,
  ].includes(currentScreen);

  const showTopBar = !isFullPage && ![
    Screen.Leaderboard,
    Screen.Profile,
    Screen.Settings,
    Screen.Notifications
  ].includes(currentScreen);

  const showBottomBar = !isFullPage;

  return (
    <div className="h-dvh max-h-dvh flex flex-col overflow-hidden bg-clout-bg selection:bg-clout-yellow selection:text-border-dark">
      {showTopBar && (
        <TopAppBar
          onAvatarClick={() => navigate(Screen.Profile)}
          onWalletClick={() => navigate(Screen.Portfolio)}
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
            className={`w-full max-w-lg mx-auto ${isFullPage ? 'h-full min-h-0 flex flex-col' : 'min-h-0'}`}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {showBottomBar && <BottomNavBar activeScreen={currentScreen} onNavigate={navigate} />}
    </div>
  );
}
