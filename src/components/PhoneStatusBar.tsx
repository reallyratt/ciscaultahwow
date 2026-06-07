/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, WifiOff, Signal, Battery, Heart, MessageCircle, MoreHorizontal, 
  Settings, Moon, Camera, X, Check, Globe
} from 'lucide-react';
import { AppView } from '../types';

interface PhoneStatusBarProps {
  activeView: AppView;
}

type PopupType = 'settings' | 'dnd-on' | 'dnd-off';

export default function PhoneStatusBar({ activeView }: PhoneStatusBarProps) {
  const [time, setTime] = useState<string>('00:00');
  const [largeDate, setLargeDate] = useState<string>('Sunday, June 7');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // States for Quick Settings
  const [dataOn, setDataOn] = useState<boolean>(true);
  const [wifiOn, setWifiOn] = useState<boolean>(true);
  const [wifiStateText, setWifiStateText] = useState<string>("Cay's Heart");
  const [isWifiConnecting, setIsWifiConnecting] = useState<boolean>(false);
  const [dndOn, setDndOn] = useState<boolean>(true);
  
  // Custom interactive dialog popup state for active notifications (replicates AllAppsModal logic)
  const [activePopup, setActivePopup] = useState<PopupType | null>(null);
  const [popupTimeLeft, setPopupTimeLeft] = useState<number>(7);

  // Brightness/Love slider
  const [loveLevel, setLoveLevel] = useState<number>(90);

  // Screenshot flash & thumbnail preview states
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [screenshotPreview, setScreenshotPreview] = useState<{
    view: AppView;
    timestamp: string;
  } | null>(null);

  const INITIAL_SECONDS = 7;

  // Handle popup auto-close timer (matching AllAppsModal behavior)
  useEffect(() => {
    if (!activePopup) return;
    
    setPopupTimeLeft(INITIAL_SECONDS);

    const timer = setInterval(() => {
      setPopupTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setActivePopup(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activePopup]);

  // Update clocks
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);

      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
      setLargeDate(now.toLocaleDateString('en-US', options));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle Wi-Fi Click transitions
  const handleWifiToggle = () => {
    if (wifiOn) {
      setWifiOn(false);
      setWifiStateText("Wi-Fi");
    } else {
      setIsWifiConnecting(true);
      setWifiStateText("Connecting...");
      setTimeout(() => {
        setWifiOn(true);
        setIsWifiConnecting(false);
        setWifiStateText("Cay's Heart");
      }, 1200);
    }
  };

  // Handle DND click custom popups (now matches AllAppsModal)
  const handleDndToggle = () => {
    if (dndOn) {
      setDndOn(false);
      setIsExpanded(false);
      setActivePopup('dnd-off');
    } else {
      setDndOn(true);
      setIsExpanded(false);
      setActivePopup('dnd-on');
    }
  };

  // Trigger Screenshot flow
  const triggerScreenshot = () => {
    setIsExpanded(false);
    
    setTimeout(() => {
      setFlashActive(true);
      
      setTimeout(() => {
        setFlashActive(false);
        
        setScreenshotPreview({
          view: activeView,
          timestamp: time
        });
      }, 350);
    }, 200);
  };

  return (
    <>
      {/* 1. TOP MINI STATUS BAR (Sits at absolute top layer of phone) */}
      <div 
        onClick={() => setIsExpanded(true)}
        className="absolute top-0 inset-x-0 h-9 bg-white/25 backdrop-blur-md flex justify-between items-center px-5 text-zinc-800 text-xs font-semibold select-none tracking-tight z-45 cursor-pointer hover:bg-white/40 transition-all rounded-t-3xl border-b border-zinc-200/20"
        title="Pull down notification panel"
      >
        {/* Left Side: Message Icon and Triple Horizontal Dots (Time Clock removed here as requested) */}
        <div className="flex items-center gap-2">
          <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
          <MoreHorizontal className="w-4 h-4 text-zinc-400" />
        </div>



        {/* Right Side: Signal, Wi-Fi, and Battery */}
        <div className="flex items-center gap-2">
          {/* Signal bars */}
          <div className="flex items-center gap-0.5" title="Signal Active">
            <Signal className="w-3.5 h-3.5 text-zinc-700" />
          </div>
          
          {/* Wi-Fi state display */}
          {wifiOn ? (
            <Wifi className="w-3.5 h-3.5 text-sky-400" title={`Connected to ${wifiStateText}`} />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-zinc-400" title="Wi-Fi Disconnected" />
          )}

          {/* Battery Status */}
          <div className="flex items-center gap-1 bg-zinc-400/10 px-1.5 py-0.5 rounded-full border border-black/5" title="Love Charged">
            <Battery className="w-3 h-3 text-zinc-750" />
            <Heart className="w-2 h-2 text-sky-400 fill-sky-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 2. AMBIENT GLOW FROM LOVE SLIDER (Pastel black and white with blue sky pastel glow) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-300 z-35"
        style={{
          boxShadow: `inset 0 0 ${loveLevel / 1.5}px rgba(56, 189, 248, ${loveLevel / 350})`,
          background: `rgba(56, 189, 248, ${loveLevel / 1800})`
        }}
      />

      {/* 3. EXPANDED NOTIFICATION PANEL DRAWER */}
      <AnimatePresence>
        {isExpanded && (
          <div className="absolute inset-0 bg-black/40 z-[60] select-none flex flex-col justify-start rounded-3xl overflow-hidden">
            
            {/* Click backdrop to close drawer */}
            <div className="absolute inset-0 z-10" onClick={() => setIsExpanded(false)} />

            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 180 }}
              className="bg-gradient-to-b from-[#fafafa] to-[#f4f4f5] border-b border-zinc-200 px-5 pt-11 pb-5 w-full rounded-b-[28px] shadow-2xl relative z-20 flex flex-col gap-4"
            >
              
              {/* Swipe Handle Indicator */}
              <div 
                onClick={() => setIsExpanded(false)}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-zinc-300 rounded-full cursor-pointer hover:bg-sky-400/40"
              />

              {/* Header Info Block: Clock & Date on Left, Settings on Right */}
              <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-zinc-200 shadow-xs">
                <div>
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight leading-none">
                    {time}
                  </h2>
                  <p className="text-[11px] text-zinc-500 font-bold font-sans mt-1 uppercase tracking-wider">
                    {largeDate}
                  </p>
                </div>
                
                {/* Settings gear trigger with alert pop up callback */}
                <button 
                  onClick={() => {
                    setIsExpanded(false);
                    setActivePopup('settings');
                  }}
                  className="p-2.5 bg-zinc-50 hover:bg-sky-50 rounded-full text-zinc-600 hover:text-sky-500 border border-zinc-200 transition-colors cursor-pointer shadow-xs"
                  title="System Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Settings Grid */}
              <div className="grid grid-cols-2 gap-2.5 mt-1">
                
                {/* 1. Mobile Data Tile */}
                <button
                  onClick={() => setDataOn(!dataOn)}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all duration-200 cursor-pointer text-left shadow-xs ${
                    dataOn 
                      ? 'bg-zinc-900 border-zinc-900 text-white' 
                      : 'bg-white border-zinc-200 text-zinc-600'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${dataOn ? 'bg-white/25' : 'bg-zinc-100'}`}>
                    <Globe className={`w-4.5 h-4.5 ${dataOn ? 'text-sky-300' : 'text-zinc-400'}`} />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[9px] font-bold block opacity-75 uppercase tracking-wider">Mobile Data</span>
                    <span className="text-xs font-black truncate block tracking-tight leading-tight">
                      {dataOn ? 'SMARTLOVER' : 'Off'}
                    </span>
                  </div>
                </button>

                {/* 2. Wi-Fi Tile */}
                <button
                  onClick={handleWifiToggle}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all duration-200 cursor-pointer text-left shadow-xs ${
                    wifiOn && !isWifiConnecting
                      ? 'bg-zinc-900 border-zinc-900 text-white' 
                      : isWifiConnecting
                      ? 'bg-zinc-800 border-zinc-800 text-white animate-pulse'
                      : 'bg-white border-zinc-200 text-zinc-600'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${wifiOn ? 'bg-white/25' : 'bg-zinc-100'}`}>
                    {wifiOn ? <Wifi className={`w-4.5 h-4.5 ${wifiOn && !isWifiConnecting ? 'text-sky-300' : 'text-zinc-400'}`} /> : <WifiOff className="w-4.5 h-4.5" />}
                  </div>
                  <div className="overflow-hidden w-full">
                    <span className="text-[9px] font-bold block opacity-75 uppercase tracking-wider">Wi-Fi</span>
                    <span className="text-xs font-black truncate block tracking-tight leading-tight">
                      {isWifiConnecting ? 'Connecting...' : wifiOn ? "Cay's Heart" : 'Off'}
                    </span>
                  </div>
                </button>

                {/* 3. Do Not Disturb (DND) Tile */}
                <button
                  onClick={handleDndToggle}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all duration-200 cursor-pointer text-left shadow-xs ${
                    dndOn 
                      ? 'bg-zinc-900 border-zinc-900 text-white' 
                      : 'bg-white border-zinc-200 text-zinc-600'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${dndOn ? 'bg-white/25' : 'bg-zinc-100'}`}>
                    <Moon className={`w-4.5 h-4.5 ${dndOn ? 'text-sky-300' : 'text-zinc-400'}`} />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[9px] font-bold block opacity-75 uppercase tracking-wider">DND Shield</span>
                    <span className="text-xs font-black truncate block tracking-tight leading-tight">
                      {dndOn ? 'DND On' : 'DND Off'}
                    </span>
                  </div>
                </button>

                {/* 4. Screenshot Tile */}
                <button
                  onClick={triggerScreenshot}
                  className="p-3 bg-white hover:bg-sky-50 hover:border-sky-250 rounded-2xl border border-zinc-200 text-zinc-600 flex items-center gap-3 transition-all duration-200 cursor-pointer text-left shadow-xs"
                >
                  <div className="p-2 bg-zinc-100 rounded-xl shrink-0 text-sky-400">
                    <Camera className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold block opacity-75 uppercase tracking-wider">Screenshot</span>
                    <span className="text-xs font-black block tracking-tight leading-tight text-sky-500">
                      Capture Screen
                    </span>
                  </div>
                </button>

              </div>

              {/* Slider Panel ("Your love for me" text overlay completely removed) */}
              <div className="w-full bg-white p-3.5 rounded-2xl border border-zinc-200 shadow-xs flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest px-1">
                  <span>Love Brightness</span>
                  <span className="text-sky-500 font-extrabold">{loveLevel}% Intensity</span>
                </div>
                
                {/* Custom track bar slider input */}
                <div className="relative w-full h-8 flex items-center">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={loveLevel}
                    onChange={(e) => setLoveLevel(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  
                  {/* Clean Track and Fill */}
                  <div className="absolute inset-0 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden z-0 flex items-center">
                    <div 
                      className="h-full bg-gradient-to-r from-zinc-850 via-zinc-900 to-sky-450" 
                      style={{ width: `${loveLevel}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* CELESTIAL HI LOVE! MESSENGER CARD */}
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white border border-zinc-200 rounded-[20px] p-4 shadow-sm relative flex flex-col gap-2 overflow-hidden"
              >
                {/* Sky blue pastel border accent strip */}
                <div className="absolute top-0 right-0 h-[3.5px] left-0 bg-sky-400" />
                
                {/* Header message */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="text-[10px] font-extrabold text-sky-500 uppercase tracking-wider font-sans">
                      HI LOVE! MESSENGER
                    </span>
                  </div>
                  <span className="text-[9px] font-bold font-mono text-zinc-450">
                    Just now
                  </span>
                </div>

                {/* Sender body details */}
                <div className="flex gap-3 items-start pt-1">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    referrerPolicy="no-referrer"
                    alt="Cay's Profile"
                    className="w-10 h-10 rounded-full border border-sky-100 flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 space-y-0.5">
                    <h4 className="text-xs font-black text-zinc-805 flex items-center gap-1.5">
                      Cay! 💬
                    </h4>
                    
                    <p className="text-[10.5px] leading-relaxed text-zinc-650 font-medium select-text break-words pr-2">
                      "Hi Sayangku Cintaku Happy 19th freaking birthday!!! You're gettin' old and atp is grooming me once again XD"
                    </p>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. COHESIVE SYSTEM ALERTS MODAL (Timered & closeable, driven by activePopup) */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-6 z-[80] select-none rounded-[36px]"
          >
            {/* Backdrop Tap click closes modal */}
            <div className="absolute inset-0" onClick={() => setActivePopup(null)} />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-[280px] bg-white border border-zinc-200 rounded-[24px] p-5 text-zinc-850 shadow-2xl overflow-hidden z-10"
            >
              {/* Blue sky pastel decorative ambiance blobs */}
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-sky-200/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-zinc-350/10 rounded-full blur-2xl" />

              {/* Popup Header */}
              <div className="flex justify-between items-center mb-3.5">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-full text-[9px] font-bold uppercase tracking-wider">
                  <span>LOVE OS ALERT</span>
                </div>
                <button
                  onClick={() => setActivePopup(null)}
                  className="p-1 hover:bg-zinc-100 rounded-full transition-colors duration-150 border border-zinc-200 cursor-pointer"
                  title="Close Dialog"
                >
                  <X className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-850" />
                </button>
              </div>

              {/* Dynamic Information Body driven by selected type */}
              <div className="flex flex-col items-center text-center space-y-3.5 my-1">
                <div className="relative">
                  <div className="absolute inset-x-0 bottom-0 bg-sky-200 rounded-2xl blur-md scale-110 opacity-60" />
                  <div className="relative w-11 h-11 bg-zinc-950 rounded-2xl flex items-center justify-center shadow-lg text-white">
                    {activePopup === 'settings' && <Settings className="w-5 h-5 text-sky-300" />}
                    {activePopup === 'dnd-off' && <Heart className="w-5 h-5 text-sky-300 fill-sky-300" />}
                    {activePopup === 'dnd-on' && <Moon className="w-5 h-5 text-sky-300" />}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-base tracking-tight text-zinc-900">
                    {activePopup === 'settings' && 'System Controls'}
                    {activePopup === 'dnd-off' && 'DND Disabled ❤️'}
                    {activePopup === 'dnd-on' && 'DND Enabled 🌙'}
                  </h3>
                  <p className="text-[11.5px] leading-relaxed text-zinc-650 font-medium px-0.5">
                    {activePopup === 'settings' && 'Ini gaperlu di setting, Cay udah nurut kok! (kadang)'}
                    {activePopup === 'dnd-off' && "Awh You're willing to turned off the DND for me and answer my messages fast? :p"}
                    {activePopup === 'dnd-on' && "Aw, man... You're not. such unfortunate :("}
                  </p>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. WHITE SHUTTER FLASH (Screenshot feedback) */}
      <AnimatePresence>
        {flashActive && (
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-white z-[90] pointer-events-none rounded-3xl"
          />
        )}
      </AnimatePresence>

      {/* 6. FLOATING SCREENSHOT CORNER BOX */}
      <AnimatePresence>
        {screenshotPreview && (
          <motion.div
            initial={{ x: 120, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 120, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 180 }}
            className="absolute bottom-24 right-4 w-32 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-zinc-250 z-[75] flex flex-col items-center select-none gap-2 animate-bounce"
          >
            <button 
              onClick={() => setScreenshotPreview(null)}
              className="absolute -top-1.5 -left-1.5 bg-black text-white rounded-full p-1 border border-white/20 transition-all cursor-pointer shadow-md z-10"
              title="Dismiss Saved Snapshot"
            >
              <X className="w-2.5 h-2.5" />
            </button>

            {/* Micro Snapshot placeholder */}
            <div className="relative w-full h-20 rounded-xl overflow-hidden bg-gradient-to-tr from-zinc-50 to-sky-50 border border-zinc-200 flex flex-col justify-center items-center">
              
              {screenshotPreview.view === 'home' && (
                <div className="text-center space-y-1">
                  <span className="text-xl">🏠</span>
                  <span className="text-[7px] font-black text-zinc-500 block leading-none">Home View</span>
                </div>
              )}

              {screenshotPreview.view === 'camera' && (
                <div className="text-center space-y-1">
                  <span className="text-xl">📸</span>
                  <span className="text-[7px] font-black text-sky-500 block leading-none font-serif">Hearts</span>
                </div>
              )}

              {screenshotPreview.view === 'search' && (
                <div className="text-center space-y-1">
                  <span className="text-xl">🔍</span>
                  <span className="text-[7px] font-black text-zinc-700 block leading-none">Geolgeol</span>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-zinc-900/60 text-[6px] text-white font-mono text-center py-0.5 font-bold leading-none select-none">
                {screenshotPreview.timestamp} Capture
              </div>
            </div>

            <div className="text-center w-full px-0.5">
              <span className="text-[8px] font-bold text-sky-650 block flex items-center justify-center gap-0.5">
                <Check className="w-2.5 h-2.5 text-sky-500" /> Saved
              </span>
              <span className="text-[7px] text-zinc-500 block opacity-75 leading-none mt-0.5 font-semibold">
                Tap to dismiss
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
