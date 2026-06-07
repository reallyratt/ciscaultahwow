/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Smartphone, Eye } from 'lucide-react';
import { AppView } from './types';

// Components
import PhoneStatusBar from './components/PhoneStatusBar';
import PhoneHome from './components/PhoneHome';
import CameraApp from './components/CameraApp';
import GoogleSearchApp from './components/GoogleSearchApp';
import AllAppsModal from './components/AllAppsModal';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [isAllAppsOpen, setIsAllAppsOpen] = useState<boolean>(false);

  // Background floating stars & hearts simulation for Launcher Wallpaper feel
  const floatingAccents = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    left: `${(i * 15) % 90 + 5}%`,
    top: `${(i * 123) % 70 + 10}%`,
    delay: i * 0.4,
    size: i % 2 === 0 ? 'text-xs' : 'text-sm',
    char: i % 3 === 0 ? '❤️' : i % 3 === 1 ? '✨' : '🌸',
  }));

  return (
    <div className="min-h-screen w-full bg-[#f8f5f0] flex flex-col items-center justify-center p-0 select-none">
      
      {/* Smartphone frame viewport container */}
      <div className="w-full max-w-md h-[100dvh] bg-black overflow-hidden relative flex flex-col shadow-none">
        
        {/* Beautiful high-quality blurred stock romantic wallpaper background */}
        <div className="absolute inset-0 z-0 overflow-hidden scale-105">
          <img
            src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1080&q=80"
            alt="Dreamy Warm Sunset Sky Wallpaper"
            className="w-full h-full object-cover blur-sm brightness-95"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* ALWAYS-ON TOP NOTIFICATION BAR (No Clock) - Liquid Glass styled */}
        <div className="relative z-50 bg-white/20 backdrop-blur-md border-b border-white/30">
          <PhoneStatusBar />
        </div>
        
        {/* Dynamic floating sparkles in wallpaper */}
        {activeView === 'home' && (
          <div className="absolute inset-0 z-0 pointer-events-none opacity-45 select-none">
            {floatingAccents.map((item) => (
              <motion.span
                key={item.id}
                initial={{ opacity: 0.1, y: 10, scale: 0.8 }}
                animate={{ 
                  opacity: [0.1, 0.7, 0.1], 
                  y: [-10, -35, -10],
                  scale: [0.8, 1.1, 0.8]
                }}
                transition={{ 
                  duration: 4, 
                  delay: item.delay, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
                className={`absolute ${item.left} ${item.top} ${item.size} select-none pointer-events-none`}
              >
                {item.char}
              </motion.span>
            ))}
          </div>
        )}

        {/* Dynamic heart backdrop glow */}
        {activeView === 'home' && (
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-64 h-64 bg-[#ff85a1]/10 rounded-full blur-3xl pointer-events-none z-0" />
        )}

        {/* MAIN MULTI-APP VIEWPORT TRANSITIONS CONTAINER */}
        <div className="flex-1 relative overflow-hidden z-20">
          <AnimatePresence mode="wait">
            
            {activeView === 'home' && (
              <motion.div
                key="home-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
              >
                <PhoneHome 
                  onLaunchApp={(app) => setActiveView(app)} 
                  onOpenAllApps={() => setIsAllAppsOpen(true)} 
                />
              </motion.div>
            )}

            {activeView === 'camera' && (
              <motion.div
                key="camera-app"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                className="absolute inset-0"
              >
                <CameraApp onBack={() => setActiveView('home')} />
              </motion.div>
            )}

            {activeView === 'search' && (
              <motion.div
                key="search-app"
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.05, opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="absolute inset-0"
              >
                <GoogleSearchApp onBack={() => setActiveView('home')} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ALL APPS LOCKDOWN AUTOMATIC MODAL */}
        <AllAppsModal 
          isOpen={isAllAppsOpen} 
          onClose={() => setIsAllAppsOpen(false)} 
        />

      </div>
    </div>
  );
}
