/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Heart, ShieldAlert, Sparkles } from 'lucide-react';

interface AllAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AllAppsModal({ isOpen, onClose }: AllAppsModalProps) {
  const INITIAL_SECONDS = 7;
  const [timeLeft, setTimeLeft] = useState(INITIAL_SECONDS);

  useEffect(() => {
    if (!isOpen) return;
    
    // Reset timer when opened
    setTimeLeft(INITIAL_SECONDS);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose(); // Automatically close when hitting zero
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          {/* Backdrop Tap to close */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-[320px] bg-[#faf8f5] border border-[#e0dad0] rounded-[24px] p-5.5 text-[#4a4a40] shadow-xl overflow-hidden z-10"
          >
            {/* Romantic background blobs inside modal */}
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-sky-200/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-zinc-300/10 rounded-full blur-2xl" />

            {/* Header Lock Icon & X Button */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 text-sky-500" />
                <span>LoveOS Lockout</span>
              </div>
              <button
                id="close-apps-popup"
                onClick={onClose}
                className="p-1 hover:bg-zinc-50 rounded-full transition-colors duration-150 border border-zinc-200"
              >
                <X className="w-4 h-4 text-zinc-600 hover:text-zinc-900" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex flex-col items-center text-center space-y-4 my-2">
              <div className="relative">
                <div className="absolute inset-0 bg-sky-100 rounded-2xl blur-md animate-pulse" />
                <div className="relative w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center shadow-md">
                  <Lock className="w-5.5 h-5.5 text-sky-300" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif-romantic italic font-bold text-lg leading-snug text-zinc-900">
                  Aye! It's not a real phone!
                </h3>
                <p className="text-xs text-zinc-650 font-medium">
                  Constructed exclusively with <span className="text-sky-500 font-bold">Cay & Cey Love Core</span>.
                </p>
              </div>

              <div className="bg-zinc-50 rounded-xl p-3.5 border border-zinc-200 text-left text-[11px] leading-relaxed text-zinc-700 space-y-2">
                <p>
                  🌱 <span className="font-semibold text-zinc-900">All external system apps locked.</span> Cay's memory remains fully occupied with logs of sweet thoughts and photos of Cey. 
                </p>
                <p className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
                  <Sparkles className="w-3 h-3 flex-shrink-0 text-sky-450 text-sky-400" />
                  <span>Try the <strong className="text-zinc-850">Camera 📸</strong> or <strong className="text-zinc-850">Google Widget 🔍</strong>!</span>
                </p>
              </div>
            </div>

            {/* Footer Timer with linear countdown bar */}
            <div className="mt-5 space-y-2">
              <div className="flex justify-between items-center text-[10px] text-zinc-500">
                <span className="flex items-center gap-1 font-medium">
                  <Heart className="w-3 h-3 text-sky-400 fill-sky-400 animate-pulse" />
                  Infinite Connection
                </span>
                <span className="font-mono font-bold text-zinc-800">
                  Closing in {timeLeft}s
                </span>
              </div>
              
              {/* Animated progress bar */}
              <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / INITIAL_SECONDS) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                  className="h-full bg-zinc-950"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
