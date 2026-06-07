/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, ArrowLeft, RefreshCw, Sparkles, AlertCircle, 
  Heart, Download
} from 'lucide-react';
import { PhotoCapture, RomanticFrame } from '../types';

interface CameraAppProps {
  onBack: () => void;
}

const FRAMES: RomanticFrame[] = [
  {
    id: 'polaroid',
    name: 'Classic Polaroid 📸',
    color: 'bg-white',
    className: 'border-white border-b-[54px] border-t-8 border-x-8 rounded-sm shadow-xl',
    emoji: '💝'
  },
  {
    id: 'neon-glow',
    name: 'Cyber Hearts 💖',
    color: 'bg-neutral-900',
    className: 'border-pink-500 border-8 rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.6)]',
    emoji: '⚡'
  },
  {
    id: 'photobooth-strip',
    name: 'Love Ribbon 🎀',
    color: 'bg-rose-50 border-rose-200 border-4',
    className: 'border-double border-8 rounded-3xl',
    emoji: '🌹'
  }
];

export default function CameraApp({ onBack }: CameraAppProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [camError, setCamError] = useState<string | null>(null);
  
  const [selectedFrame, setSelectedFrame] = useState<RomanticFrame>(FRAMES[0]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoCapture | null>(null);
  
  // Coupling/sticker customization for simulation backup
  const [coupleStyle, setCoupleStyle] = useState<'hug' | 'pose' | 'sparkle'>('sparkle');
  const [customText, setCustomText] = useState<string>('Cay ♥ Cey Forever');
  const [stickerEmoji, setStickerEmoji] = useState<'💕' | '✨' | '🔥' | '🐱' | '🐶'>('💕');

  // Launch camera
  const initCamera = async () => {
    setCamError(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 480, height: 480 },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access failed, using premium avatar snapshot mode:', err);
      // Fallback is structured gracefully
      setCamError(err.message || 'Permission denied');
      setCameraActive(false);
    }
  };

  useEffect(() => {
    initCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const playShutterSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1100;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {
      console.log('Audio feedback trigger bypassed');
    }
  };

  // Start snapshot count down
  const triggerCapture = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      takeSnapshot();
    }
  }, [countdown]);

  // Capture current frames
  const takeSnapshot = () => {
    setFlashActive(true);
    playShutterSound();
    
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsCapturing(false);
      setCountdown(null);
      setFlashActive(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-res square dimensions
    const size = 600;
    canvas.width = size;
    canvas.height = size;

    // Clear background
    ctx.fillStyle = '#171717';
    ctx.fillRect(0, 0, size, size);

    if (cameraActive && videoRef.current) {
      // Draw camera mirror image
      ctx.save();
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
      
      const v = videoRef.current;
      const videoWidth = v.videoWidth || size;
      const videoHeight = v.videoHeight || size;
      const minDim = Math.min(videoWidth, videoHeight);
      const sx = (videoWidth - minDim) / 2;
      const sy = (videoHeight - minDim) / 2;
      
      ctx.drawImage(v, sx, sy, minDim, minDim, 0, 0, size, size);
      ctx.restore();
    } else {
      // Draw Romantic Illustrator Selfie simulation if physical camera is blocked
      ctx.save();
      const grad = ctx.createLinearGradient(0, 0, 0, size);
      grad.addColorStop(0, '#f43f5e'); // rose-500
      grad.addColorStop(1, '#881337'); // rose-900
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // Starry particles in base background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 24; i++) {
        const px = Math.sin(i * 99) * size;
        const py = Math.cos(i * 44) * size;
        ctx.beginPath();
        ctx.arc(Math.abs(px) % size, Math.abs(py) % size, (i % 3) + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw gorgeous couple caricature using nice canvas arcs
      // Cay's silhouette (indigo-dark/slate)
      ctx.fillStyle = '#1e293b'; // slate-800
      ctx.beginPath();
      ctx.arc(size / 3, size * 0.72, 90, 0, Math.PI * 2); // body/shoulder
      ctx.fill();
      ctx.beginPath();
      ctx.arc(size / 3, size * 0.48, 48, 0, Math.PI * 2); // head
      ctx.fill();

      // Cey's silhouette (coral-pink / warm white)
      ctx.fillStyle = '#ffe4e6'; // rose-100
      ctx.beginPath();
      ctx.arc(size * 0.64, size * 0.76, 80, 0, Math.PI * 2); // body/shoulder
      ctx.fill();
      ctx.beginPath();
      ctx.arc(size * 0.64, size * 0.52, 44, 0, Math.PI * 2); // head
      ctx.fill();

      // Hair highlights + custom elements based on styles
      if (coupleStyle === 'hug') {
        // Interconnected hands representation or heart on Cey's head
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(size / 2, size * 0.58, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // Drawing cute glowing heart over their heads
      ctx.fillStyle = '#fb7185';
      ctx.font = '76px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('❤️', size / 2, size * 0.32);

      // Tiny sparkle text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'semibold 20px sans-serif';
      ctx.fillText(stickerEmoji, size * 0.2, size * 0.25);
      ctx.fillText(stickerEmoji, size * 0.8, size * 0.25);

      // Info warning simulation watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '12px monospace';
      ctx.fillText('[ LoveOS Simulated Selfie ]', size / 2, size * 0.88);

      ctx.restore();
    }

    // Apply romantic frames in Canvas context!
    ctx.save();
    if (selectedFrame.id === 'polaroid') {
      // Draw a classic Polaroid look inside
      // Let's create an overlapping overlay. In polaroid canvas, card is white block
      // But we captured the center scene. Let's make a mini polaroid within
      // Actually we can composite it or draw borders:
      // A thick white border on outer edges
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 16;
      ctx.strokeRect(8, 8, size - 16, size - 16);
      
      // Bottom banner area for handwritten text
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, size - 120, size, 120);

      // Handwritten romantic caption
      ctx.fillStyle = '#0f172a'; // dark-indigo
      ctx.font = 'bold 36px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(customText, size / 2, size - 60);

      // Mini heart stamps
      ctx.fillStyle = '#f43f5e';
      ctx.font = '28px sans-serif';
      ctx.fillText('✨ 💕', size * 0.88, size - 60);
    } else if (selectedFrame.id === 'neon-glow') {
      // Neon frames
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, size - 14, size - 14);

      // Neon-pink outer line
      ctx.strokeStyle = '#ec4899'; // pink-500
      ctx.lineWidth = 16;
      ctx.strokeRect(22, 22, size - 44, size - 44);

      // Neon-cyan secondary line
      ctx.strokeStyle = '#06b6d4'; // cyan-500
      ctx.lineWidth = 4;
      ctx.strokeRect(32, 32, size - 64, size - 64);

      // Add cute corners stickers
      ctx.fillStyle = '#ffffff';
      ctx.font = '40px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💖', 60, 70);
      ctx.fillText('💖', size - 60, 70);
      ctx.fillText('⚡', 60, size - 60);
      ctx.fillText('⚡', size - 60, size - 60);

      // Custom tag text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`⚡ ${customText.toUpperCase()} ⚡`, size / 2, size - 50);
    } else {
      // Ribbon / Booth Frame
      ctx.strokeStyle = '#fbcfe8'; // pink-200
      ctx.lineWidth = 24;
      ctx.strokeRect(12, 12, size - 24, size - 24);

      ctx.strokeStyle = '#fda4af'; // rose-300
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, size - 60, size - 60);

      // Double line border styling
      ctx.strokeStyle = '#f43f5e'; // rose-500
      ctx.lineWidth = 3;
      ctx.strokeRect(40, 40, size - 80, size - 80);

      // Floating stickers
      ctx.font = '36px Arial';
      ctx.fillText('🌹', 70, 80);
      ctx.fillText('🧸', size - 70, 80);
      ctx.fillText('🎀', 70, size - 70);
      ctx.fillText('🍓', size - 70, size - 70);

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'italic bold 28px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(`★ ${customText} ★`, size / 2, size - 50);
    }
    ctx.restore();

    setTimeout(() => {
      setFlashActive(false);
      const dataUrl = canvas.toDataURL('image/png');
      const now = new Date();
      setCapturedPhoto({
        id: Math.random().toString(36).substring(2, 9),
        url: dataUrl,
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        frameId: selectedFrame.id
      });
      setIsCapturing(false);
      setCountdown(null);
    }, 450);
  };

  const handleDownload = () => {
    if (!capturedPhoto) return;
    const link = document.createElement('a');
    link.download = `cay-ce-lovebox-${capturedPhoto.id}.png`;
    link.href = capturedPhoto.url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="absolute inset-0 z-40 bg-[#f5f2eb] flex flex-col overflow-hidden select-none">
      
      {/* Invisible Canvas for rendering full image */}
      <canvas ref={canvasRef} className="hidden" />

      {/* App Header */}
      <div className="h-14 bg-[#f8f5f0] border-b border-[#e0dad0] flex items-center justify-between px-3 text-[#4a4a40]">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-[#5a5a40]/5 rounded-full transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-[#5a5a40]" />
        </button>
        <span className="font-serif-romantic italic font-bold text-sm tracking-tight flex items-center gap-1.5 text-[#ff85a1]">
          <Sparkles className="w-4 h-4 text-[#ff85a1] animate-spin" />
          LoveBox Photobox
        </span>
        <div className="w-9 h-9" /> {/* Spacer */}
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!capturedPhoto ? (
            /* Live Camera Feed or Backup simulator screen */
            <motion.div 
              key="camera-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-[310px] aspect-square flex flex-col items-center justify-center bg-white rounded-[24px] overflow-hidden shadow-md border border-[#e0dad0]"
            >
              {/* Actual physical camera element */}
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                /* BACKUP SIMULATION AVATAR DISPLAY */
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#ffefef] to-[#faf8f5] text-[#4a4a40] overflow-hidden text-center">
                  <div className="absolute inset-0 opacity-15 overflow-hidden">
                    <div className="absolute top-2 left-6 w-16 h-16 bg-white rounded-full blur-xl" />
                    <div className="absolute bottom-10 right-4 w-20 h-20 bg-[#ff85a1]/10 rounded-full blur-xl animate-pulse" />
                  </div>
                  
                  {/* Nice illustrative silhouettes */}
                  <div className="flex items-end justify-center space-x-2 w-full max-w-[200px] mt-2 relative z-10">
                    {/* Cay */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-md border border-[#e0dad0]">
                        👨‍💻
                      </div>
                      <span className="text-[10px] bg-[#5a5a40]/10 px-1.5 py-0.5 rounded mt-1 font-bold text-[#5a5a40]">Cay</span>
                    </div>

                    {/* Love core connecting line */}
                    <div className="flex flex-col items-center pb-4 flex-1">
                      <span className="text-xl animate-bounce">🌱</span>
                      <div className="w-full h-0.5 border-t border-dashed border-[#ff85a1]" />
                    </div>

                    {/* Cey */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-md border border-[#ff85a1]/25">
                        👩‍🎨
                      </div>
                      <span className="text-[10px] bg-[#ff85a1]/10 px-1.5 py-0.5 rounded mt-1 font-bold text-[#ff85a1]">Cey</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#5a5a40] font-semibold mt-4 line-clamp-2 max-w-[240px] px-2 leading-relaxed">
                    Camera loading. Enjoy our natural <strong className="text-[#ff85a1] font-bold">Selfie Simulator</strong>! Let's take a cute keepsake portrait.
                  </p>

                  {/* Quick style controls for mock couple portrait */}
                  <div className="mt-4 flex gap-1.5 justify-center z-20">
                    <button 
                      onClick={() => setCoupleStyle('sparkle')}
                      className={`text-[10px] px-2.5 py-1 rounded-full border font-bold transition-all ${coupleStyle === 'sparkle' ? 'bg-[#ff85a1] border-[#ff85a1] text-white shadow-xs' : 'bg-white border-[#e0dad0] text-[#5a5a40]'}`}
                    >
                      Sparkles ✨
                    </button>
                    <button 
                      onClick={() => setCoupleStyle('hug')}
                      className={`text-[10px] px-2.5 py-1 rounded-full border font-bold transition-all ${coupleStyle === 'hug' ? 'bg-[#ff85a1] border-[#ff85a1] text-white shadow-xs' : 'bg-white border-[#e0dad0] text-[#5a5a40]'}`}
                    >
                      Romantic ♥
                    </button>
                    <button 
                      onClick={() => {
                        const stickers: ('💕' | '✨' | '🔥' | '🐱' | '🐶')[] = ['💕', '✨', '🔥', '🐱', '🐶'];
                        const nextIdx = (stickers.indexOf(stickerEmoji) + 1) % stickers.length;
                        setStickerEmoji(stickers[nextIdx]);
                      }}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-white hover:bg-[#faf8f5] text-[#5a5a40] font-bold flex items-center gap-1 border border-[#e0dad0]"
                    >
                      Emoji: {stickerEmoji}
                    </button>
                  </div>
                </div>
              )}

              {/* Physical Frame Overlay (applied live on preview) */}
              <div className={`absolute inset-0 pointer-events-none flex flex-col justify-between ${
                selectedFrame.id === 'polaroid' ? 'border-white border-b-[28px] border-t-4 border-x-4 shadow-sm' :
                selectedFrame.id === 'neon-glow' ? 'border-[#ff85a1] border-4 shadow-[inset_0_0_12px_rgba(255,133,161,0.2)]' :
                'border-semibold border-[10px] border-[#e0dad0]'
              }`}>
                {/* Heart details/watermarks based on selected frames */}
                <div className="absolute top-2 left-2 z-20 pointer-events-none drop-shadow">
                  {selectedFrame.emoji}
                </div>
                <div className="absolute top-2 right-2 z-20 pointer-events-none drop-shadow">
                  {selectedFrame.emoji}
                </div>
                
                {/* Simulated text strip at polaroid bottom inside preview */}
                {selectedFrame.id === 'polaroid' && (
                  <div className="absolute bottom-[-24px] left-0 right-0 text-center font-sans">
                    <span className="text-[8px] font-bold text-neutral-800 truncate block px-3">
                      {customText}
                    </span>
                  </div>
                )}
              </div>

              {/* Countdown overlay indicator */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-xs z-30">
                  <motion.div
                    initial={{ scale: 0.1, opacity: 0 }}
                    animate={{ scale: [0.8, 1.2, 1], opacity: 1 }}
                    className="text-6xl font-serif-romantic italic font-extrabold text-[#ff85a1] drop-shadow-sm"
                  >
                    {countdown === 0 ? '📷' : countdown}
                  </motion.div>
                </div>
              )}

              {/* White Camera flash effect fade */}
              <AnimatePresence>
                {flashActive && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-white z-50 pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Snapshot Output & Polaroid Preview */
            <motion.div
              key="output-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col items-center justify-center w-full max-w-[310px]"
            >
              <div className="relative p-3 bg-white shadow-md rounded-[20px] border border-[#e0dad0] flex flex-col items-center">
                <img 
                  src={capturedPhoto.url} 
                  alt="Couple capture polaroid" 
                  className="w-68 h-68 object-cover rounded-md"
                  referrerPolicy="no-referrer"
                />
                
                {/* Polaroid Bottom bar details */}
                <div className="w-full pt-4 pb-2 text-center">
                  <span className="font-mono text-[9px] text-[#5a5a40] uppercase tracking-widest block mb-1 font-bold">
                    🌿 Photobox Keepsake - {capturedPhoto.timestamp}
                  </span>
                  <div className="h-0.5 w-6 bg-[#ff85a1] mx-auto rounded-full" />
                </div>
              </div>

              {/* Active Action Controls */}
              <div className="w-full flex justify-center gap-3 mt-5">
                <button
                  id="camera-retake"
                  onClick={() => {
                    setCapturedPhoto(null);
                    // Re-init camera video stream
                    initCamera();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#faf8f5] text-[#4a4a40] border border-[#e0dad0] rounded-full font-bold text-xs shadow-xs transition-all active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#ff85a1]" />
                  Retake Photo
                </button>
                <button
                  id="camera-download"
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#ff85a1] hover:bg-[#ff7694] text-white rounded-full font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save Image
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Frame Selectors & Custom Text Input Bar (Only visible while camera active, not previewing result) */}
      {!capturedPhoto && (
        <div className="bg-[#faf8f5] border-t border-[#e0dad0] p-4.5 space-y-4">
          
          {/* Custom Card/Photo Frame caption typography */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#5a5a40] font-extrabold flex justify-between">
              <span>Handwritten Card Lettering</span>
              <span>{customText.length}/24</span>
            </label>
            <input 
              id="caption-input"
              type="text"
              maxLength={24}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Cay & Cey 2026"
              className="w-full bg-white border border-[#e0dad0] rounded-xl px-3 py-2 text-xs text-[#4a4a40] placeholder-gray-400 focus:outline-none focus:border-[#ff85a1]"
            />
          </div>

          {/* Frames Selection list row */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#5a5a40]/90 font-extrabold block">
              Frame Frame Theme
            </span>
            <div className="flex gap-2 justify-between">
              {FRAMES.map((f) => (
                <button
                  key={f.id}
                  id={`frame-${f.id}`}
                  onClick={() => setSelectedFrame(f)}
                  className={`flex-1 flex flex-col items-center py-2 px-2 rounded-xl text-[10px] font-bold border transition-all ${
                    selectedFrame.id === f.id
                      ? 'bg-[#ff85a1]/10 border-[#ff85a1] text-[#ff85a1]'
                      : 'bg-white border-[#e0dad0] text-[#5a5a40]'
                  }`}
                >
                  <span className="text-sm">{f.emoji}</span>
                  <span className="mt-0.5 truncate max-w-[80px]">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Centered Click Trigger Shutter block */}
          <div className="flex justify-center items-center py-2 relative">
            <button
              id="shutter-button"
              disabled={isCapturing}
              onClick={triggerCapture}
              className={`relative p-1 rounded-full border-[6px] border-[#5a5a40]/10 transition-all ${
                isCapturing ? 'opacity-80 scale-90' : 'hover:scale-105 active:scale-95'
              }`}
            >
              <div className="w-13 h-13 bg-[#ff85a1] hover:bg-[#ff7694] rounded-full flex items-center justify-center border-2 border-white shadow-inner">
                <Camera className="w-5.5 h-5.5 text-white" />
              </div>

              {/* Pulsing ring during capture count */}
              {isCapturing && (
                <div className="absolute inset-0 rounded-full border-4 border-[#ff85a1] animate-ping pointer-events-none" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
