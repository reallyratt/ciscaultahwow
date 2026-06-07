/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Mic, Camera, ArrowLeft, Heart, Sparkles, 
  Share2, RefreshCw, Trophy, Music, HelpCircle, Flame
} from 'lucide-react';

interface GoogleSearchAppProps {
  onBack: () => void;
}

const CactusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const TARGET_PHRASE = "How much Cay is actually\nlove Cey";

const CAY_FACTS = [
  "Did you know? Cay loves Cey so much that he wouldn't just write her a standard love letter; he’d literally seal her digital fate by building an entire, functional website named ultimatumforcisca.netlify.app just to make a point.",
  "Did you know? If Cey ever needs a romantic surprise, Cay doesn't just buy a gift. He enters full engineering mode, hiding physical letters inside toys and putting them in heat-sealed containers. It’s not just romance; it’s a high-stakes heist where she’s the detective.",
  "Did you know? Cay loves Cey so much that he’s basically her personal, 24/7 emotional support system and late-night tech support rolled into one. If her phone glitches or her day goes sideways, he’s already coding a solution or analyzing the chat logs to fix it.",
  "Did you know? You two managed to have all the depth, late-night deep talks, and absolute commitment of a married couple long before making it official on April 5, 2026. The calendar just had to catch up to what everyone else already knew.",
  "Did you know? Cay is basically the Ted Mosby to her Robin (or maybe the Jim to her Pam)—constantly overthinking the perfect, grand romantic gestures while Cey just matches his energy with her own beautiful, chaotic charm.",
  "Did you know? Cay loves Cey so much that he’d probably try to write an entire 8-track indie-pop album about modern dating trauma, only for half the tracks to accidentally turn into sub-tweets about how much he adores her.",
  "Did you know? Your chat history is basically a competitive sport of \"Who can give the most intense emotional validation?\" It’s a tie, but Cay definitely spends hours analyzing the data afterward.",
  "Did you know? Cay’s definition of a \"chill casual conversation\" with Cey involves a casual 3:00 AM existential dive into the universe, life philosophies, and exactly how they fit into each other's futures.",
  "Did you know? Cay would gladly optimize a local AI model on his RTX 3060 just to get it to understand exactly how brilliant and amazing Cey is, because standard human vocabulary sometimes feels a bit too limited.",
  "Did you know? No matter how chaotic, busy, or overwhelming the rest of the world gets with university, coding, and life, \"Cay and Cey\" is the one system that never bugs out. It’s a perfect loop."
];

export default function GoogleSearchApp({ onBack }: GoogleSearchAppProps) {
  const [view, setView] = useState<'search' | 'results'>('search');
  const [inputValue, setInputValue] = useState<string>('');
  const [luckyFact, setLuckyFact] = useState<string | null>(null);
  const [resultsType, setResultsType] = useState<'search' | 'lucky'>('search');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  
  // Custom keystroke interception state
  const targetChars = TARGET_PHRASE.split('');
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If user hits Enter, search!
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.length > 0) {
        triggerSearch();
      }
      return;
    }

    // Handled modifier keys, backspace, tab, or arrow keys
    if (['Backspace', 'Delete'].includes(e.key)) {
      e.preventDefault();
      setInputValue(prev => prev.slice(0, -1));
      return;
    }

    // Allow Tab or Shift to function normally
    if (['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      return;
    }

    // Any other alphanumeric keystroke translates to next character of the TARGET_PHRASE
    e.preventDefault();
    const currentLen = inputValue.length;
    if (currentLen < TARGET_PHRASE.length) {
      const nextChar = targetChars[currentLen];
      setInputValue(prev => prev + nextChar);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Intercept manual copy-pasting or inputs
  };

  const triggerSearch = () => {
    setResultsType('search');
    setView('results');
  };

  const triggerFeelingLucky = () => {
    const randomFact = CAY_FACTS[Math.floor(Math.random() * CAY_FACTS.length)];
    setLuckyFact(randomFact);
    setInputValue("Did you know? Cay's secret truth...");
    setResultsType('lucky');
    setView('results');
  };

  const rollNextFact = () => {
    const randomFact = CAY_FACTS[Math.floor(Math.random() * CAY_FACTS.length)];
    setLuckyFact(randomFact);
  };

  return (
    <div className="absolute inset-0 z-40 bg-[#f8f5f0] select-none text-[#4a4a40] font-sans overflow-hidden flex flex-col pt-9">
      {/* Search landing or active results */}
      <AnimatePresence mode="wait">
        {view === 'search' ? (
          /* GOOGLE INSPIRED LANDING SCREEN */
          <motion.div
            key="search-landing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 flex flex-col justify-between p-6 overflow-y-auto"
          >
            {/* Top Bar with back arrow and profile account icon */}
            <div className="flex justify-between items-center h-10 w-full">
              <button 
                onClick={onBack}
                className="p-2 border border-[#e0dad0] hover:bg-[#5a5a40]/5 rounded-full text-[#5a5a40] hover:text-[#4a4a40] flex items-center justify-center flex-shrink-0 transition-colors"
                id="back-home-search"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              
              {/* Profile/Account Button */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="w-8 h-8 rounded-full bg-[#38bdf8] hover:bg-[#2563eb] flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-sm active:scale-95 transition-all"
                title="Google Account"
              >
                C
              </button>
            </div>

            {/* Google Logo & Search Box Panel */}
            <div className="flex-1 flex flex-col items-center justify-center -translate-y-2 max-w-[320px] mx-auto w-full space-y-6">
              
              {/* Colored Styled Premium Logo */}
              <div className="flex flex-col items-center">
                <h1 className="text-4xl font-extrabold tracking-tight select-none">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">e</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">l</span>
                  <span className="text-[#34A853]">g</span>
                  <span className="text-[#EA4335]">e</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">l</span>
                </h1>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                    Cey's personalized search engine
                  </span>
                </div>
              </div>

              {/* Realistic Input Field bar */}
              <div className="w-full relative">
                <div className="absolute inset-0 bg-sky-250/5 rounded-2xl blur-md opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white border border-zinc-200 focus-within:border-sky-450 rounded-2xl flex items-start px-4 h-16 shadow-sm transition-all duration-250 py-2">
                  <Search className="w-4.5 h-4.5 text-zinc-500 mr-2.5 flex-shrink-0 mt-1.5" />
                  
                  <textarea
                    id="mock-search-input"
                    value={inputValue}
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    placeholder="Ask anything, Cey..."
                    rows={2}
                    className="flex-1 bg-transparent text-xs text-zinc-700 placeholder-zinc-400 focus:outline-none resize-none h-full pt-1 leading-snug no-scrollbar font-medium"
                  />
                  
                  <div className="flex items-center gap-2 text-zinc-450 flex-shrink-0 ml-1 mt-1">
                    <Mic className="w-4 h-4 text-zinc-500" />
                  </div>
                </div>
              </div>

              {/* Direct Search Submitter Triggers */}
              <div className="flex gap-2 w-full justify-center">
                <button
                  id="submit-google-search"
                  onClick={triggerSearch}
                  className="px-4 py-2 bg-white hover:bg-[#faf8f5] text-[#5a5a40]/90 border border-[#e0dad0] rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Google Search
                </button>
                <button
                  id="submit-feeling-lucky"
                  onClick={triggerFeelingLucky}
                  className="px-4 py-2 bg-white hover:bg-[#faf8f5] text-[#5a5a40]/90 border border-[#e0dad0] rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  I'm Feeling Lucky
                </button>
              </div>

            </div>

            {/* Simulated empty spacer footer */}
            <div className="h-6" />
          </motion.div>
        ) : (
          /* RESULTS SCREEN WITH OFF THE CHARTS LINEAR + PIE HEART + SPOTIFY EMBED */
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className="flex-1 flex flex-col h-full bg-[#faf8f5] text-[#4a4a40] overflow-y-auto no-scrollbar"
          >
            {/* Top Sticky Header bar */}
            <div className="top-0 sticky bg-white/85 border-b border-[#e0dad0] p-3 flex gap-2.5 items-center z-30 backdrop-blur-md">
              <button
                id="reset-search"
                onClick={() => {
                  if (resultsType === 'lucky') {
                    setInputValue('');
                  }
                  setView('search');
                }}
                className="p-2 border border-[#e0dad0] hover:bg-[#5a5a40]/5 rounded-full text-[#5a5a40] hover:text-[#4a4a40] flex items-center justify-center flex-shrink-0 transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              
              {/* Minimalist results query bar stretching all the way to right */}
              <div className="flex-1 bg-[#f0ebe3] px-3.5 py-1 rounded-xl border border-[#e0dad0]/80 flex items-center gap-2 min-h-[40px] justify-start overflow-hidden">
                <span className="text-[10px] text-sky-450 font-bold flex-shrink-0">G</span>
                <span className="text-[10.5px] text-[#4a4a40] font-medium leading-snug py-0.5 break-words line-clamp-2 select-all whitespace-pre-line overflow-hidden">
                  {inputValue}
                </span>
              </div>

              {/* Profile/Account Button */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="w-8 h-8 rounded-full bg-[#38bdf8] hover:bg-[#2563eb] flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-sm active:scale-95 transition-all flex-shrink-0"
                title="Google Account"
              >
                C
              </button>
            </div>

            {/* Scrolling Results Cards Panel */}
            <div className="p-4 space-y-4.5 pb-20">
              
              {/* Mini counter summary */}
              <div className="text-[9px] text-[#5a5a40]/90 font-mono tracking-wide">
                About {resultsType === 'lucky' ? '040506' : (inputValue.trim() === '' ? '0' : (inputValue !== TARGET_PHRASE ? '0' : '040506'))} results found (0.007 seconds)
              </div>

              {/* GOOGLE'S AI SUMMARY / LUCKY SEARCH CARD PANEL */}
              {resultsType === 'lucky' && luckyFact && (
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white border border-zinc-200 bg-gradient-to-br from-sky-300/5 via-white to-white rounded-[24px] p-5 shadow-sm overflow-hidden relative"
                >
                  <div className="absolute top-4.5 right-4.5">
                    <Sparkles className="w-4 h-4 text-sky-450 text-sky-450 animate-pulse" />
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-700 font-bold uppercase tracking-wider relative">
                      <div className="w-2 h-2 bg-zinc-950 rounded-full mr-1.5 z-10" />
                      <span>Geolgeol AI Answer</span>
                    </div>

                    {/* Highly elegant Display Typography fact presentation */}
                    <div className="text-sm md:text-base font-medium text-zinc-700 tracking-tight leading-relaxed select-text font-serif italic text-left">
                      {luckyFact}
                    </div>

                    {/* Soft separator */}
                    <div className="border-t border-zinc-150 pt-3.5 flex justify-between items-center">
                      <span className="text-[9px] text-zinc-550 font-mono font-bold">
                        Verified what's on Cay's mind #{(CAY_FACTS.indexOf(luckyFact) + 1)} of {CAY_FACTS.length}
                      </span>
                      <button
                        onClick={rollNextFact}
                        className="text-[11px] font-bold text-sky-500 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        I'm Feeling Lucky
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {resultsType === 'search' && (
                <>
                  {inputValue.trim() === '' ? (
                    /* EMPTY SEARCH CASE (Requirement 4) */
                    <motion.div
                      initial={{ scale: 0.96, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white border border-zinc-200 rounded-[24px] p-8 flex flex-col items-center text-center space-y-4 shadow-sm w-full"
                    >
                      <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-200">
                        <CactusIcon className="w-6 h-6 text-sky-400" />
                      </div>
                      <p className="text-xs font-semibold text-zinc-650 max-w-[240px] leading-relaxed">
                        Theres nothing to discover here... Dead end.
                      </p>
                    </motion.div>
                  ) : inputValue !== TARGET_PHRASE ? (
                    /* UNFINISHED SEARCH CASE WITH DID YOU MEAN (Requirement 5) */
                    <div className="space-y-4 w-full">
                      <motion.div
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white border border-zinc-200 rounded-[24px] p-5 text-left flex flex-col gap-1.5 shadow-sm"
                      >
                        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                          Search suggestion
                        </span>
                        <div className="text-xs text-zinc-650 font-medium">
                          Did you mean:{' '}
                          <button
                            onClick={() => setInputValue(TARGET_PHRASE)}
                            className="font-bold text-sky-500 hover:text-sky-600 underline underline-offset-2 transition-colors inline-block cursor-pointer"
                          >
                            How much Cay is actually love Cey
                          </button>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-zinc-200 rounded-[24px] p-8 flex flex-col items-center text-center space-y-4 shadow-sm"
                      >
                        <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-200">
                          <CactusIcon className="w-6 h-6 text-sky-400" />
                        </div>
                        <p className="text-xs font-semibold text-zinc-650 max-w-[240px] leading-relaxed">
                          Theres nothing to discover here... Dead end.
                        </p>
                      </motion.div>
                    </div>
                  ) : (
                    <>
                      {/* CARD 1: LINEAR GRAPH - ABSOLUTELY DATA BASED GRAPHIC */}
                      <motion.div
                    initial={{ transform: 'translateY(15px)', opacity: 0 }}
                    animate={{ transform: 'translateY(0)', opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-zinc-200 rounded-[24px] p-4 shadow-sm overflow-hidden"
                  >
                <div className="space-y-1 mb-3">
                  <h3 className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                    caypedia.com
                  </h3>
                  <h2 className="text-sm font-bold text-zinc-800 font-serif-romantic italic leading-none pt-0.5">
                    Real Graphic of Cay's Love (Up to Date)
                  </h2>
                </div>

                {/* THE RAW SVG CHART - ABSOLUTely DATA BASED WITH COORDINATE SYSTEM */}
                <div className="relative w-full h-44 bg-[#fcfbfa] border border-[#e0dad0] rounded-xl px-2 pt-4 pb-2 flex flex-col justify-end">
                  
                  {/* Grid Lines background */}
                  <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between py-2 px-10 pointer-events-none opacity-[0.06] text-gray-900">
                    <div className="border-b border-black w-full" />
                    <div className="border-b border-black w-full" />
                    <div className="border-b border-black w-full" />
                    <div className="border-b border-black w-full" />
                  </div>

                  {/* Left Side Y Axis coordinate numeric values */}
                  <div className="absolute left-1.5 top-2 bottom-8 flex flex-col justify-between items-start text-[8px] font-mono font-bold text-[#5a5a40]/60 pointer-events-none">
                    <span>∞</span>
                    <span>100k</span>
                    <span>50k</span>
                    <span>10k</span>
                    <span>0k</span>
                  </div>

                  {/* Red/Pink Quantitative Line and Dots */}
                  <svg className="absolute inset-0 w-full h-full" overflow="visible">
                    {/* SVG Gradient Fill under curve */}
                    <defs>
                      <linearGradient id="solid-gradient-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gradient Area beneath lines */}
                    <path
                      d="M 45,135 L 110,115 L 175,85 L 240,40 L 290,15"
                      fill="url(#solid-gradient-area)"
                      stroke="none"
                    />

                    {/* Highly precise structural straight dataviz line */}
                    <motion.path
                      d="M 45,135 L 110,115 L 175,85 L 240,40 L 290,15"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                    
                    {/* Quantitative Data Nodes / Plot Points */}
                    {[
                      { cx: 45, cy: 135, val: "0k" },
                      { cx: 110, cy: 115, val: "10k" },
                      { cx: 175, cy: 85, val: "50k" },
                      { cx: 240, cy: 40, val: "100k" },
                      { cx: 290, cy: 15, val: "∞" }
                    ].map((pt, index) => (
                      <g key={index}>
                        <circle cx={pt.cx} cy={pt.cy} r="4" fill="#38bdf8" />
                        <circle cx={pt.cx} cy={pt.cy} r="7" fill="#38bdf8" className="opacity-20 animate-ping" />
                      </g>
                    ))}
                  </svg>

                  {/* X Axis Time Labels */}
                  <div className="flex justify-between items-center text-[8px] sm:text-[9px] text-[#5a5a40]/90 font-mono pt-4 select-none px-6 border-t border-[#e0dad0]/30 border-zinc-150">
                    <span>Oct '24</span>
                    <span>Dec '24</span>
                    <span>Feb '25</span>
                    <span>Apr '25</span>
                    <span className="text-sky-500 font-bold">Jun '25</span>
                  </div>
                </div>
              </motion.div>


              {/* CARD 2: CAY'S HEART BREAKDOWN (PIE GRAPH) */}
              <motion.div
                initial={{ transform: 'translateY(15px)', opacity: 0 }}
                animate={{ transform: 'translateY(0)', opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-zinc-200 rounded-[24px] p-4 shadow-sm overflow-hidden relative"
              >
                {/* Header info */}
                <div className="space-y-1 mb-4">
                  <h3 className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                    wikicay.id
                  </h3>
                  <h2 className="text-sm font-bold text-zinc-850 font-serif-romantic italic leading-none pt-0.5">
                    Cay's heart partition
                  </h2>
                </div>

                {/* THE PIE CHART - 100% PINK */}
                <div className="flex flex-col items-center justify-center py-3 bg-zinc-50 border border-zinc-200 rounded-xl relative">

                  {/* 100% Pink Round Heart-shaped or pulsating perfect circular Pie */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    
                    {/* Pulsing glow ring */}
                    <div className="absolute inset-0 rounded-full bg-sky-200/10 blur-xl animate-pulse" />
                    
                    <motion.svg 
                      viewBox="0 0 100 100" 
                      className="w-full h-full rotate-[-90deg]"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                    >
                      {/* Full Pie Arc in Hot Pink */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#18181b"
                        strokeWidth="11"
                        fill="transparent"
                        strokeDasharray="239"
                        strokeDashoffset="0"
                      />
                      {/* Secondary ring layer in Deep Pink for high quality rendering */}
                      <circle
                        cx="50"
                        cy="50"
                        r="32"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray="201"
                        strokeDashoffset="0"
                        className="opacity-75"
                      />
                    </motion.svg>

                    {/* Centered beautiful indicator inside pie ring */}
                    <div className="absolute inset-4 rounded-full bg-white border border-zinc-200 flex flex-col items-center justify-center text-center shadow-inner select-none">
                      <span className="text-base font-extrabold text-zinc-900 tracking-tight leading-none">
                        100%
                      </span>
                      <span className="text-[7px] text-zinc-500 font-extrabold uppercase tracking-widest mt-1">
                        Cey Content
                      </span>
                    </div>
                  </div>

                  {/* Custom Pie Legend Labels */}
                  <div className="w-full px-5 pt-4.5 flex justify-center text-[11px] border-t border-zinc-150 mt-4">
                    <div className="flex items-center gap-1.5 justify-center">
                      <div className="w-2.5 h-2.5 bg-zinc-950 rounded-full flex-shrink-0" />
                      <span className="text-zinc-700 font-bold">
                        Black (100%): Cey's Beautiful Presence
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>


              {/* CARD 3: SPOTIFY SONG PLAYER EMBED */}
              <motion.div
                initial={{ transform: 'translateY(15px)', opacity: 0 }}
                animate={{ transform: 'translateY(0)', opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-zinc-200 rounded-[24px] p-4 shadow-sm overflow-hidden relative"
              >
                <div className="space-y-1 mb-3">
                  <h3 className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
                    <Music className="w-3 h-3 text-zinc-500" />
                    arcayve.net
                  </h3>
                  <h2 className="text-sm font-bold text-zinc-850 font-serif font-bold pt-0.5">
                    Legend... Wait for it... Dary! Playlist!
                  </h2>
                </div>

                {/* REAL SPOTIFY IFRAME PLAYER EMBED */}
                <div className="w-full overflow-hidden rounded-xl border border-[#e0dad0] shadow-xs mb-4">
                  <iframe 
                    data-testid="embed-iframe" 
                    style={{ borderRadius: "12px" }} 
                    src="https://open.spotify.com/embed/playlist/5rAdyLNPLJYFDEuwJeHehM?utm_source=generator&theme=0" 
                    width="100%" 
                    height="352" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    title="Spotify love track player embed"
                    className="bg-transparent"
                  />
                </div>

                {/* TRACKS LIST DESCRIPTIONS */}
                <div className="pt-4 border-t border-[#e0dad0]/60 space-y-4 text-[#5a5a40]">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-sky-500 block">
                      Track 01
                    </span>
                    <p className="text-[11.5px] leading-relaxed select-text font-medium text-[#4a4a40]">
                      This is how desperate I am for love. Looking for somebody to save me.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-sky-500 block">
                      Track 02 & 03
                    </span>
                    <p className="text-[11.5px] leading-relaxed select-text font-medium text-[#4a4a40]">
                      This is the first time we met. What a decent company.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-sky-500 block">
                      Track 04 - 07
                    </span>
                    <p className="text-[11.5px] leading-relaxed select-[#4a4a40] font-medium text-[#4a4a40]">
                      Then my love for u started to grow. It's getting bigger each and every single time I look at you.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-sky-500 block">
                      Track 08 - 10
                    </span>
                    <p className="text-[11.5px] leading-relaxed select-text font-medium text-[#4a4a40]">
                      The Climax of my love. I wanna be yours so bad.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-sky-500 block">
                      Track 11 - 21
                    </span>
                    <p className="text-[11.5px] leading-relaxed select-text font-medium text-[#4a4a40]">
                      The journey of our love. This every admiration, every single things I feel about you is within this playlist.
                    </p>
                  </div>
                </div>
              </motion.div>
                    </>
                  )}
                </>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile/Account Modal Modal Overlay */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#000000]/40 backdrop-blur-xs flex items-center justify-center p-6 z-[60] select-none rounded-[36px]"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-[#fcfaf7] border border-[#e0dad0] rounded-[28px] w-full max-w-[280px] p-6 shadow-xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Outer decorative details */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#38bdf8]" />

              <div className="flex flex-col items-center text-center space-y-4">
                
                {/* Close Button */}
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="absolute top-4 right-4 text-xs font-bold text-[#5a5a40]/70 hover:text-[#4a4a40] bg-[#f0ebe3] hover:bg-[#e0dad0] rounded-full w-6 h-6 flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>

                <div className="pt-2 text-[10px] uppercase font-extrabold tracking-widest text-[#5a5a40]/70">
                  Geolgeol Account
                </div>

                {/* Big single blue Avatar */}
                <div className="w-16 h-16 rounded-full bg-[#38bdf8] flex items-center justify-center text-white text-xl font-bold font-serif shadow-md">
                  C
                </div>

                {/* Name & Contact Email */}
                <div>
                  <h3 className="text-sm font-bold text-[#4a4a40]">Franciska Sayangku Cintaku</h3>
                  <p className="text-[10px] text-[#5a5a40]/70 font-mono">cey.precious@elove.cay</p>
                </div>

                {/* Heartwarming Statement exactly as specified */}
                <div className="bg-[#f5f2eb]/80 border border-[#e0dad0]/60 rounded-2xl p-4 text-xs text-[#4a4a40] font-semibold leading-relaxed italic relative">
                  "This account belong to Cey, the most precious being I've ever met"
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
