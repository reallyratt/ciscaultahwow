/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Camera, Search, Mic, Heart, Sparkles, Grid, Image, FileText
} from 'lucide-react';
import { AppView } from '../types';

interface PhoneHomeProps {
  onLaunchApp: (app: AppView) => void;
  onOpenAllApps: () => void;
}

export default function PhoneHome({ onLaunchApp, onOpenAllApps }: PhoneHomeProps) {
  const [time, setTime] = useState<string>('00:00');
  const [dateStr, setDateStr] = useState<string>('Saturday, June 6');

  // Real-time updates for clock widget
  useEffect(() => {
    const updateWidgetTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);

      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
      setDateStr(now.toLocaleDateString('en-US', options));
    };

    updateWidgetTime();
    const interval = setInterval(updateWidgetTime, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 pb-4 select-none overflow-hidden">
      
      {/* Top half: Widget block */}
      <div className="space-y-6 pt-12 flex-1 flex flex-col justify-start">
        
        {/* Transparent glassy Clock date Widget container */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full bg-white/55 backdrop-blur-md rounded-[24px] p-4.5 border border-white/60 text-center shadow-md overflow-hidden"
        >
          {/* Animated decorative sparks within widget */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-pink-500/5 rounded-full blur-xl" />
          
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#4a4a40] bg-[#5a5a40]/10 px-2.5 py-0.5 rounded-full border border-[#5a5a40]/15 inline-block">
              {dateStr}
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#4a4a40] leading-none pt-2">
              {time}
            </h1>
            <p className="text-[12px] font-bold text-[#ff85a1] tracking-wide pt-1 text-center">
              Cey, It's your 19th birthday!
            </p>
          </div>
        </motion.div>

        {/* Home screen centered fake Google bar Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onClick={() => onLaunchApp('search')}
          className="w-full bg-white shadow-md hover:shadow-lg hover:bg-white/95 rounded-full flex items-center px-4.5 h-12 border border-white/50 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
        >
          <div className="flex-1 flex items-center gap-2.5">
            {/* Styled colored Google G letter representing search widget */}
            <span className="text-[#5a5a40] font-black text-sm select-none">
              G
            </span>
            <span className="text-xs text-gray-400 font-medium tracking-tight">
              Type anything to discover...
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#ff85a1]">
            <Mic className="w-4 h-4 text-gray-400" />
            <Heart className="w-4 h-4 text-[#ff85a1] fill-[#ff85a1] animate-pulse" />
          </div>
        </motion.div>

      </div>

      {/* Bottom fixed launcher dock representing All Apps, Camera, Gallery, Notes */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[28px] px-5 py-3 flex justify-between items-center gap-3 mt-auto shadow-md relative">
        {/* Floating background blur inside dock */}
        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        {/* All Apps button */}
        <motion.button
          id="trigger-all-apps"
          whileTap={{ scale: 0.95 }}
          onClick={onOpenAllApps}
          className="w-11 h-11 bg-white hover:bg-[#faf8f5] rounded-2xl flex items-center justify-center shadow-sm border border-white/30 cursor-pointer"
          title="All Apps"
        >
          <Grid className="w-5.5 h-5.5 text-[#5a5a40]" />
        </motion.button>

        {/* Camera button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onLaunchApp('camera')}
          className="w-11 h-11 bg-[#ff85a1] hover:bg-[#ff7694] rounded-2xl flex items-center justify-center shadow-md border border-white/20 cursor-pointer"
          title="Camera"
        >
          <Camera className="w-5.5 h-5.5 text-white" />
        </motion.button>

        {/* Gallery button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenAllApps}
          className="w-11 h-11 bg-white hover:bg-[#faf8f5] rounded-2xl flex items-center justify-center shadow-sm border border-white/30 cursor-pointer"
          title="Gallery"
        >
          <Image className="w-5.5 h-5.5 text-[#5a5a40]" />
        </motion.button>

        {/* Notes button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenAllApps}
          className="w-11 h-11 bg-white hover:bg-[#faf8f5] rounded-2xl flex items-center justify-center shadow-sm border border-white/30 cursor-pointer"
          title="Notes"
        >
          <FileText className="w-5.5 h-5.5 text-[#ff85a1]" />
        </motion.button>
      </div>

      {/* Realistic bottom visual indicator bar */}
      <div className="w-28 h-1.25 bg-[#5a5a40]/35 rounded-full mx-auto mt-2.5 pointer-events-none opacity-80" />
    </div>
  );
}
