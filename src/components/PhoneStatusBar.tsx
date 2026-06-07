/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Heart } from 'lucide-react';

export default function PhoneStatusBar() {
  const [time, setTime] = useState<string>('00:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-2 text-[#4a4a40]/90 text-xs font-semibold select-none tracking-tight z-50">
      {/* Notifications / Operator Info (No Clock!) */}
      <div className="flex items-center gap-1.5 text-[10px] tracking-wide font-bold uppercase text-[#4a4a40]/90">
        <span>Geolgeol LTE</span>
        <Heart className="w-3 h-3 text-[#ff85a1] fill-[#ff85a1] animate-pulse" />
        <span className="w-1.5 h-1.5 bg-[#ff85a1] rounded-full animate-ping ml-0.5" />
      </div>

      {/* Dynamic Notch/Island Spacer */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-24 h-5 bg-[#2a2a2a] rounded-full border border-white/5 shadow-inner hidden md:block" />

      {/* Connection & Battery details */}
      <div className="flex items-center gap-2">
        <Signal className="w-3.5 h-3.5 fill-current text-[#4a4a40]/80" />
        <span className="text-[10px] font-extrabold tracking-widest text-[#5a5a40]">5G</span>
        <Wifi className="w-3.5 h-3.5 text-[#4a4a40]/80" />
        
        {/* Heart Battery */}
        <div className="flex items-center gap-1 bg-[#5a5a40]/10 px-2 py-0.5 rounded-full border border-[#5a5a40]/10">
          <Heart className="w-2.5 h-2.5 text-[#ff85a1] fill-[#ff85a1] animate-ping absolute" />
          <Heart className="w-2.5 h-2.5 text-[#ff85a1] fill-[#ff85a1] relative" />
          <span className="text-[9px] font-mono leading-none font-bold text-[#4a4a40]">100%</span>
        </div>
      </div>
    </div>
  );
}
