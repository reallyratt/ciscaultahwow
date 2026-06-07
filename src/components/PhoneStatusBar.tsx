/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, WifiOff, Signal, Battery, Heart, MessageCircle, MoreHorizontal, 
  Settings, Moon, Camera, Sliders, X, Check, Globe
} from 'lucide-react';
import { AppView } from '../types';

interface PhoneStatusBarProps {
  activeView: AppView;
}

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
  
  // Custom interactive dialog popup state for DND
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  // Brightness/Love slider
  const [loveLevel, setLoveLevel] = useState<number>(90);

  // Screenshot flash & thumbnail preview states
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [screenshotPreview, setScreenshotPreview] = useState<{
    view: AppView;
    timestamp: string;
  } | null>(null);

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

  // Handle DND click custom popups
  const handleDndToggle = () => {
    if (dndOn) {
      // Turning off DND
      setDndOn(false);
      setPopupMessage("Awh You're willing to turned off the DND for me and answer my messages fast? :p");
    } else {
      // Turning on DND
      setDndOn(true);
      setPopupMessage("Aw, man... You're not. such unfortunate :(");
    }
  };

  // Trigger Screenshot flow
  const triggerScreenshot = () => {
    // 1. Close drawer
    setIsExpanded(false);
    
    // 2. Trigger white flash after drawer begins sliding up coordinate
    setTimeout(() => {
      setFlashActive(true);
      
      // Flash lasts for 350ms
      setTimeout(() => {
        setFlashActive(false);
        
        // Show screenshot preview thumbnail in the bottom right corner
        setScreenshotPreview({
          view: activeView,
          timestamp: time
        });
      }, 350);
    }, 200);
  };

  return (
    <>
      {/* 1. TOP STATUS BAR (Sits at absolute top layer of phone) */}
      <div 
        onClick={() => setIsExpanded(true)}
        className="absolute top-0 inset-x-0 h-9 bg-white/20 backdrop-blur-xs flex justify-between items-center px-5 text-[#4a4a40]/90 text-xs font-semibold select-none tracking-tight z-45 cursor-pointer hover:bg-white/30 transition-all rounded-t-3xl"
        title="Pull down notification panel"
      >
        {/* Left Side: Message Icon and Triple Horizontal Dots */}
        <div className="flex items-center gap-2.5">
          <MessageCircle className="w-3.5 h-3.5 text-[#ff85a1]" />
          <MoreHorizontal className="w-4 h-4 text-[#5a5a40]/80" />
          <span className="text-[10px] font-mono text-[#5a5a40]/50 font-bold ml-1">{time}</span>
        </div>

        {/* Center Screen spacer representing simulated notch */}
        <div className="w-20 h-4 bg-black/95 rounded-b-xl border-x border-b border-white/5 shadow-inner hidden min-[320px]:block shrink-0 pointer-events-none" />

        {/* Right Side: Signal, Wi-Fi, and Battery */}
        <div className="flex items-center gap-2">
          {/* Signal bars */}
          <div className="flex items-center gap-0.5" title="Signal Active">
            <Signal className="w-3.5 h-3.5 text-[#4a4a40]" />
          </div>
          
          {/* Wi-Fi with conditional display representation */}
          {wifiOn ? (
            <Wifi className="w-3.5 h-3.5 text-[#ff85a1]" title={`Connected to ${wifiStateText}`} />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-[#5a5a40]/40" title="Wifi Disconnected" />
          )}

          {/* Battery Status */}
          <div className="flex items-center gap-1 bg-[#5a5a40]/10 px-1.5 py-0.5 rounded-full border border-black/5" title="Love Charge 100%">
            <Battery className="w-3 h-3 text-[#4a4a40]" />
            <Heart className="w-2 h-2 text-[#ff85a1] fill-[#ff85a1] animate-pulse" />
          </div>
        </div>
      </div>

      {/* 2. AMBIENT GLOW FROM LOVE SLIDER */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-300 z-35"
        style={{
          boxShadow: `inset 0 0 ${loveLevel / 1.5}px rgba(255, 133, 161, ${loveLevel / 230})`,
          background: `rgba(255,133,161, ${loveLevel / 1200})`
        }}
      />

      {/* 3. DETAILED EXPANDED PULL-DOWN NOTIFICATION EXCURSION PANEL */}
      <AnimatePresence>
        {isExpanded && (
          <div className="absolute inset-0 bg-black/45 z-[60] select-none flex flex-col justify-start rounded-3xl overflow-hidden">
            
            {/* Click backdrop area below drawer to close drawer */}
            <div className="absolute inset-0 z-10" onClick={() => setIsExpanded(false)} />

            {/* Sliding Panel Panel Drawer */}
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-gradient-to-b from-[#faf8f5] to-[#f4f0e6] border-b border-[#e5dfd4] px-5 pt-11 pb-5 w-full rounded-b-[28px] shadow-2xl relative z-20 flex flex-col gap-4"
            >
              
              {/* Slidable swipe tray decorator anchor */}
              <div 
                onClick={() => setIsExpanded(false)}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-[#4a4a40]/25 rounded-full cursor-pointer hover:bg-[#ff85a1]/50"
              />

              {/* Header Info Block: Clock, Date on Left, Settings on Right */}
              <div className="flex justify-between items-center bg-[#f0ebe3]/70 p-3 rounded-2xl border border-[#e0dad0]/50 shadow-xs">
                <div>
                  <h2 className="text-3xl font-black text-[#4a4a40] tracking-tight leading-none">
                    {time}
                  </h2>
                  <p className="text-[11px] text-[#5a5a40]/90 font-bold font-sans mt-1">
                    {largeDate}
                  </p>
                </div>
                
                {/* Settings gear trigger dot */}
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="p-2.5 bg-white rounded-full hover:bg-[#ff85a1]/15 text-[#4a4a40] border border-[#e0dad0] transition-colors cursor-pointer shadow-xs"
                >
                  <Settings className="w-4 h-4 text-[#5a5a40]" />
                </button>
              </div>

              {/* Control Panel Grid: 4 Quick Tiles */}
              <div className="grid grid-cols-2 gap-2.5 mt-1">
                
                {/* 1. Mobile Data Tile */}
                <button
                  onClick={() => setDataOn(!dataOn)}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all duration-200 cursor-pointer text-left shadow-xs ${
                    dataOn 
                      ? 'bg-[#ff85a1] border-[#ff85a1]/40 text-white' 
                      : 'bg-white border-[#e0dad0] text-[#5a5a40]'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${dataOn ? 'bg-white/20' : 'bg-[#faf8f5]'}`}>
                    <Globe className="w-4.5 h-4.5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[9px] font-bold block opacity-75 uppercase tracking-wider">Mobile Data</span>
                    <span className="text-xs font-black truncate block tracking-tight leading-tight">
                      {dataOn ? 'SMARTLOVER' : 'Data Off'}
                    </span>
                  </div>
                </button>

                {/* 2. Wi-Fi Tile */}
                <button
                  onClick={handleWifiToggle}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all duration-200 cursor-pointer text-left shadow-xs ${
                    wifiOn && !isWifiConnecting
                      ? 'bg-[#ff85a1] border-[#ff85a1]/40 text-white' 
                      : isWifiConnecting
                      ? 'bg-[#ff85a1]/70 border-[#ff85a1]/25 text-white animate-pulse'
                      : 'bg-white border-[#e0dad0] text-[#5a5a40]'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${wifiOn ? 'bg-white/20' : 'bg-[#faf8f5]'}`}>
                    {wifiOn ? <Wifi className="w-4.5 h-4.5" /> : <WifiOff className="w-4.5 h-4.5" />}
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
                      ? 'bg-[#ff85a1] border-[#ff85a1]/40 text-white' 
                      : 'bg-white border-[#e0dad0] text-[#5a5a40]'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${dndOn ? 'bg-white/20' : 'bg-[#faf8f5]'}`}>
                    <Moon className="w-4.5 h-4.5" />
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
                  className="p-3 bg-white hover:bg-[#ff85a1]/10 hover:border-[#ff85a1]/30 rounded-2xl border border-[#e0dad0] text-[#5a5a40] flex items-center gap-3 transition-all duration-200 cursor-pointer text-left shadow-xs"
                >
                  <div className="p-2 bg-[#faf8f5] rounded-xl shrink-0 text-[#ff85a1]">
                    <Camera className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold block opacity-75 uppercase tracking-wider">Screenshot</span>
                    <span className="text-xs font-black block tracking-tight leading-tight text-[#ff85a1]">
                      Capture Screen
                    </span>
                  </div>
                </button>

              </div>

              {/* Custom Brightness Slider ("Your love for me" inside track) */}
              <div className="w-full bg-white p-3 rounded-2xl border border-[#e0dad0]/60 shadow-xs flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold text-[#5a5a40]/70 uppercase tracking-widest px-1">
                  <span>Love Meter</span>
                  <span className="text-[#ff85a1]">{loveLevel}% Intensity</span>
                </div>
                
                {/* Embedded track bar slider */}
                <div className="relative w-full h-8 flex items-center">
                  {/* Styled Background Slider input */}
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={loveLevel}
                    onChange={(e) => setLoveLevel(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  
                  {/* Realistic Filled Custom Track design container */}
                  <div className="absolute inset-0 rounded-xl bg-[#e8e3d9] border border-[#e0dad0] overflow-hidden z-0 flex items-center">
                    {/* The Fill representation */}
                    <div 
                      className="h-full bg-gradient-to-r from-[#ffcfd9] to-[#ff85a1]" 
                      style={{ width: `${loveLevel}%` }}
                    />
                    
                    {/* Overlay Title centered exactly inside slider track */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                      <span className="text-[10px] font-bold text-[#4a4a40] uppercase tracking-wider flex items-center gap-1 opacity-90">
                        Your love for me <Heart className="w-3 h-3 text-[#ff85a1] fill-[#ff85a1] animate-pulse shrink-0 inline" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* REALISTIC WHATSAPP NOTIFICATION CENTER ELEMENT CARD */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-[#e0dad0]/80 rounded-[20px] p-4 shadow-sm relative flex flex-col gap-2 overflow-hidden"
              >
                {/* Decorative Small WhatsApp badge/line */}
                <div className="absolute top-0 right-0 h-[3px] left-0 bg-emerald-500" />
                
                {/* Header of message notification */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-wider font-sans">
                      WhatsApp Messenger
                    </span>
                  </div>
                  <span className="text-[9px] font-bold font-mono text-gray-400">
                    Just now
                  </span>
                </div>

                {/* Message Content Layout */}
                <div className="flex gap-3 items-start pt-1">
                  {/* Stock Avatar image setup */}
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    referrerPolicy="no-referrer"
                    alt="Cay's Profile"
                    className="w-10 h-10 rounded-full border-2 border-emerald-100 flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 space-y-0.5">
                    <h4 className="text-xs font-extrabold text-[#4a4a40]">
                      Cay! 💬
                    </h4>
                    
                    {/* Message detail from user specs */}
                    <p className="text-[10px] leading-relaxed text-[#5a5a40]/90 font-medium select-text break-words pr-2">
                      "Hi Sayangku Cintaku Happy 19th freaking birthday!!! You're gettin' old and atp is grooming me once again XD"
                    </p>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. DND ALERT TOAST ELEMENT SYSTEM POPUP OVERLAY */}
      <AnimatePresence>
        {popupMessage && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 z-[80] select-none rounded-3xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#faf8f5] border-2 border-[#ff85a1]/70 rounded-[28px] p-5 shadow-2xl max-w-sm w-full space-y-4 text-center select-none"
            >
              <div className="w-12 h-12 bg-[#ff85a1]/10 rounded-full flex items-center justify-center mx-auto text-[#ff85a1]">
                <Heart className="w-6 h-6 fill-[#ff85a1]" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[#4a4a40] uppercase tracking-wide">
                  Cay's Phone Alert
                </h3>
                <p className="text-xs text-[#5a5a40] leading-relaxed px-1">
                  {popupMessage}
                </p>
              </div>

              <button
                onClick={() => setPopupMessage(null)}
                className="w-full bg-[#ff85a1] hover:bg-[#ff7694] text-white py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer shadow-md"
              >
                Respond with Love ❤️
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. WHITE SHUTTER SCREEN FLASH FOR INSTANT SCREENSHOT FEEL */}
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

      {/* 6. CORNER FLOATING SCREENSHOT THUMBNAIL DISPLAY */}
      <AnimatePresence>
        {screenshotPreview && (
          <motion.div
            initial={{ x: 120, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 120, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 180 }}
            className="absolute bottom-24 right-4 w-32 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-[#ff85a1]/30 z-[75] flex flex-col items-center select-none gap-2"
          >
            {/* Thumbnail Close Cross button */}
            <button 
              onClick={() => setScreenshotPreview(null)}
              className="absolute -top-1.5 -left-1.5 bg-black/60 hover:bg-black text-white rounded-full p-1 border border-white/20 transition-all cursor-pointer shadow-md z-10"
              title="Close Preview"
            >
              <X className="w-2.5 h-2.5" />
            </button>

            {/* Simulated Tiny Mock Snapshot content */}
            <div className="relative w-full h-20 rounded-xl overflow-hidden bg-gradient-to-tr from-[#ffeef1] to-[#e8e5dc] border border-gray-150 flex flex-col justify-center items-center">
              
              {/* Dynamic visualization matching activeView */}
              {screenshotPreview.view === 'home' && (
                <div className="text-center space-y-1">
                  <span className="text-xl">🏠</span>
                  <span className="text-[7px] font-bold text-gray-500 block leading-none">Home</span>
                </div>
              )}

              {screenshotPreview.view === 'camera' && (
                <div className="text-center space-y-1">
                  <span className="text-xl">📸</span>
                  <span className="text-[7px] font-bold text-[#ff85a1] block leading-none font-serif">Hearts</span>
                </div>
              )}

              {screenshotPreview.view === 'search' && (
                <div className="text-center space-y-1">
                  <span className="text-xl">🔍</span>
                  <span className="text-[7px] font-extrabold text-[#4285F4] block leading-none">Geolgeol</span>
                </div>
              )}

              {/* Tiny footer caption overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-black/40 text-[6px] text-white font-mono text-center py-0.5 font-bold leading-none select-none">
                {screenshotPreview.timestamp} Capture
              </div>
            </div>

            {/* Text description under the image block */}
            <div className="text-center w-full px-0.5">
              <span className="text-[8px] font-bold text-emerald-600 block flex items-center justify-center gap-0.5">
                <Check className="w-2 h-2" /> Saved
              </span>
              <span className="text-[7px] text-[#5a5a40] block opacity-75 leading-none mt-0.5 font-semibold">
                Tap to clear
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
