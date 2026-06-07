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
import NotesApp from './components/NotesApp';
import GalleryApp from './components/GalleryApp';

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
      
      {/* Device Screen Background Wallpaper with soft romantic Natural Tones gradient */}
      <div className="w-full max-w-md h-[100dvh] bg-black overflow-hidden relative flex flex-col shadow-none">
        
        {/* Device Screen Background Wallpaper with soft romantic Natural Tones gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffefef] to-[#f5f5f0] z-0" />
        
        {/* Top-Level Simulated Interactive Phone Status / Notification Bar */}
        <PhoneStatusBar activeView={activeView} />
        
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

            {activeView === 'notes' && (
              <motion.div
                key="notes-app"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                className="absolute inset-0"
              >
                <NotesApp onBack={() => setActiveView('home')} />
              </motion.div>
            )}

            {activeView === 'gallery' && (
              <motion.div
                key="gallery-app"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                className="absolute inset-0"
              >
                <GalleryApp onBack={() => setActiveView('home')} />
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
