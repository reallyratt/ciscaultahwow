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
    name: 'Preset 1',
    color: 'bg-white',
    className: '',
    emoji: '💝'
  },
  {
    id: 'neon-glow',
    name: 'Preset 2',
    color: 'bg-neutral-900',
    className: '',
    emoji: '⚡'
  },
  {
    id: 'photobooth-strip',
    name: 'Preset 3',
    color: 'bg-rose-50',
    className: '',
    emoji: '🌹'
  }
];

const getOverlayUrl = (frameId: string, text: string) => {
  // Replace these dynamic data-URIs with your real transparent PNG URLs in the future!
  if (frameId === 'polaroid') {
    const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' width='500' height='500'>
        <rect x='0' y='0' width='500' height='500' fill='none' stroke='#ffffff' stroke-width='32'/>
        <rect x='0' y='410' width='500' height='90' fill='#ffffff'/>
        <text x='250' y='458' font-family='Georgia, serif' font-weight='900' font-size='22' fill='#333333' text-anchor='middle'>${escapedText || 'An Eternity Moment'}</text>
      </svg>
    `;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg.trim());
  } else if (frameId === 'neon-glow') {
    const escapedText = text.toUpperCase().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' width='500' height='500'>
        <!-- Outer dark premium border -->
        <rect x='0' y='0' width='500' height='500' fill='none' stroke='#1c1917' stroke-width='24'/>
        <!-- Dynamic neon main frames -->
        <rect x='20' y='20' width='460' height='460' fill='none' stroke='#38bdf8' stroke-width='4' opacity='0.9'/>
        <rect x='28' y='28' width='444' height='444' fill='none' stroke='#38bdf8' stroke-width='1' opacity='0.4'/>
        
        <!-- Glowing corner anchors -->
        <path d='M 12,40 L 12,12 L 40,12' fill='none' stroke='#38bdf8' stroke-width='4' stroke-linecap='round'/>
        <path d='M 488,40 L 488,12 L 460,12' fill='none' stroke='#38bdf8' stroke-width='4' stroke-linecap='round'/>
        <path d='M 12,460 L 12,488 L 40,488' fill='none' stroke='#38bdf8' stroke-width='4' stroke-linecap='round'/>
        <path d='M 488,460 L 488,488 L 460,488' fill='none' stroke='#38bdf8' stroke-width='4' stroke-linecap='round'/>

        <!-- Tech grid crosshairs -->
        <path d='M 40,40 M 35,40 L 45,40 M 40,35 L 40,45' fill='none' stroke='#e0dad0' stroke-width='1.5' opacity='0.6'/>
        <path d='M 460,40 M 455,40 L 465,40 M 460,35 L 460,45' fill='none' stroke='#e0dad0' stroke-width='1.5' opacity='0.6'/>
        <path d='M 40,460 M 35,460 L 45,460 M 40,455 L 40,465' fill='none' stroke='#e0dad0' stroke-width='1.5' opacity='0.6'/>
        <path d='M 460,460 M 455,460 L 465,460 M 460,455 L 460,465' fill='none' stroke='#e0dad0' stroke-width='1.5' opacity='0.6'/>

        <!-- Elegant measurement notches -->
        <line x1='120' y1='20' x2='380' y2='20' stroke='#38bdf8' stroke-width='1.5' stroke-dasharray='4,8' opacity='0.5'/>
        <line x1='120' y1='480' x2='380' y2='480' stroke='#38bdf8' stroke-width='1.5' stroke-dasharray='4,8' opacity='0.5'/>

        <!-- Top Left elegant sparkle vector -->
        <path d='M 65,65 Q 65,75 75,75 Q 65,75 65,85 Q 65,75 55,75 Q 65,75 65,65 Z' fill='#38bdf8'/>
        <circle cx='65' cy='75' r='1.5' fill='#ffffff'/>
        
        <!-- Top Right elegant sparkle vector -->
        <path d='M 435,65 Q 435,75 445,75 Q 435,75 435,85 Q 435,75 425,75 Q 435,75 435,65 Z' fill='#38bdf8'/>
        <circle cx='435' cy='75' r='1.5' fill='#ffffff'/>

        <!-- Bottom caption capsule background -->
        <rect x='80' y='435' width='340' height='34' rx='17' ry='17' fill='#1c1917' stroke='#38bdf8' stroke-width='2'/>

        <!-- Headline Caption -->
        <text x='250' y='457' font-family='monospace' font-weight='900' font-size='13' fill='#38bdf8' text-anchor='middle' letter-spacing='2.5'>${escapedText || 'AN ETERNITY MOMENT'}</text>
      </svg>
    `;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg.trim());
  } else {
    const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' width='500' height='500'>
        <!-- Scalloped vintage border with pastel frame -->
        <rect x='10' y='10' width='480' height='480' rx='22' ry='22' fill='none' stroke='#fbcfe8' stroke-width='16'/>
        <rect x='22' y='22' width='456' height='456' rx='14' ry='14' fill='none' stroke='#ec4899' stroke-width='2' stroke-dasharray='10,6'/>
        
        <!-- Classic Ribbon crown vector stamps at corners -->
        <path d='M 35,35 Q 40,25 45,35 Q 55,40 45,45 Q 40,55 35,45 Q 25,40 35,35 Z M 40,40 A 4,4 0 1,0 40,39.9 Z' fill='#ec4899'/>
        <path d='M 465,35 Q 470,25 475,35 Q 485,40 475,45 Q 470,55 465,45 Q 455,40 465,35 Z M 470,40 A 4,4 0 1,0 470,39.9 Z' fill='#ec4899'/>

        <!-- Centered beautiful vintage lettering banner with ribbon tail edges -->
        <path d='M 110,432 L 390,432 C 405,432 405,466 390,466 L 110,466 C 95,466 95,432 110,432 Z' fill='#fff5f7' stroke='#ec4899' stroke-width='2'/>
        
        <!-- Ribbon side folds -->
        <path d='M 90,449 L 112,439 L 112,459 Z' fill='#db2777'/>
        <path d='M 410,449 L 388,439 L 388,459 Z' fill='#db2777'/>

        <!-- Red Cherry pairs decoration in bottom corners -->
        <!-- Cherry left -->
        <circle cx='55' cy='438' r='6.5' fill='#e21d48'/>
        <circle cx='64' cy='443' r='6.5' fill='#e21d48'/>
        <path d='M 55,438 Q 62,427 64,443' fill='none' stroke='#16a34a' stroke-width='2' stroke-linecap='round'/>
        
        <!-- Cherry right -->
        <circle cx='436' cy='438' r='6.5' fill='#e21d48'/>
        <circle cx='445' cy='443' r='6.5' fill='#e21d48'/>
        <path d='M 436,438 Q 443,427 445,443' fill='none' stroke='#16a34a' stroke-width='2' stroke-linecap='round'/>

        <!-- Heart accents at upper borders -->
        <path d='M 130,22 Q 135,12 140,22' fill='none' stroke='#ec4899' stroke-width='1.5'/>
        <path d='M 370,22 Q 375,12 380,22' fill='none' stroke='#ec4899' stroke-width='1.5'/>

        <text x='250' y='454' font-family='Georgia, serif' font-style='italic' font-weight='800' font-size='13.5' fill='#db2777' text-anchor='middle'>${escapedText || 'An Eternity Moment'}</text>
      </svg>
    `;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg.trim());
  }
};

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
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);
  
  // Coupling/sticker customization for simulation backup
  const [coupleStyle, setCoupleStyle] = useState<'hug' | 'pose' | 'sparkle'>('sparkle');
  const [customText, setCustomText] = useState<string>('An Eternity Moment');
  const [stickerEmoji, setStickerEmoji] = useState<'💕' | '✨' | '🔥' | '🐱' | '🐶'>('💕');

  // Launch camera
  const initCamera = async () => {
    setCamError(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      // Use ideal resolution parameters for flawless mobile device browser loading
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });
      setStream(mediaStream);
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

  // Reactively bind stream to video element once mounted in DOM
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && stream) {
      if (videoElement.srcObject !== stream) {
        videoElement.srcObject = stream;
      }
      videoElement.play().catch(e => {
        console.warn('AutoPlay play attempt interrupted:', e);
      });
    }
  }, [stream, cameraActive]);

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

  // Capture immediately without countdown delay
  const triggerCapture = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    takeSnapshot();
  };

  // Capture current frames
  const takeSnapshot = () => {
    setFlashActive(true);
    playShutterSound();
    
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsCapturing(false);
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

    // Apply transparent PNG overlay frame onto Canvas directly
    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    const finalizeCapture = () => {
      setFlashActive(false);
      const dataUrl = canvas.toDataURL('image/png');
      const now = new Date();
      const newPhoto: PhotoCapture = {
        id: Math.random().toString(36).substring(2, 9),
        url: dataUrl,
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        frameId: selectedFrame.id
      };

      // Save taken photo automatically directly to the gallery app ('loveos_gallery')
      try {
        const saved = localStorage.getItem('loveos_gallery');
        let currentList: PhotoCapture[] = [];
        if (saved) {
          try {
            currentList = JSON.parse(saved);
          } catch (e) {
            // list fallback
          }
        }
        if (!Array.isArray(currentList)) {
          currentList = [];
        }
        localStorage.setItem('loveos_gallery', JSON.stringify([newPhoto, ...currentList]));
      } catch (err) {
        console.warn('Failed to insert captured photo to persistent loveos_gallery:', err);
      }

      setIsCapturing(false);
      setShowSavedToast(true);
      setTimeout(() => {
        setShowSavedToast(false);
      }, 2000);
    };

    frameImg.onload = () => {
      ctx.drawImage(frameImg, 0, 0, size, size);
      finalizeCapture();
    };

    frameImg.onerror = (e) => {
      console.warn("Error loading frame overlay, drawing default fallback borders", e);
      ctx.strokeStyle = '#ff85a1';
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, size - 14, size - 14);
      finalizeCapture();
    };

    frameImg.src = getOverlayUrl(selectedFrame.id, customText);
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
    <div className="absolute inset-0 z-40 bg-[#f5f2eb] flex flex-col overflow-hidden select-none pt-9">
      
      {/* Invisible Canvas for rendering full image */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Save Notification Toast */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-16 left-4 right-4 bg-[#4a4a40] text-[#f8f5f0] px-3.5 py-3 rounded-2xl shadow-lg flex items-center justify-between gap-3 z-50 border border-[#5a5a40]/20"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">📸</span>
              <div className="text-left">
                <p className="text-[11px] font-extrabold leading-tight tracking-tight">Keepsake Saved!</p>
                <p className="text-[9.5px] text-[#faf8f5]/80 font-medium">Added to your Gallery app.</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md">
              Saved
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Header */}
      <div className="h-14 bg-[#f8f5f0] border-b border-[#e0dad0] flex items-center justify-between px-3 text-[#4a4a40]">
        <button
          onClick={onBack}
          className="p-2 border border-[#e0dad0] hover:bg-[#5a5a40]/5 rounded-full text-[#5a5a40] hover:text-[#4a4a40] flex items-center justify-center flex-shrink-0 transition-colors"
          title="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-serif font-bold text-sm tracking-tight text-[#4a4a40]">
          Unique Camera
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
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#f8f5f0] to-[#faf8f5] text-[#4a4a40] overflow-hidden text-center justify-between py-6">
                  <div className="absolute inset-0 opacity-15 overflow-hidden">
                    <div className="absolute top-2 left-6 w-16 h-16 bg-white rounded-full blur-xl" />
                    <div className="absolute bottom-10 right-4 w-20 h-20 bg-[#38bdf8]/10 rounded-full blur-xl animate-pulse" />
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
                      <div className="w-full h-0.5 border-t border-dashed border-[#e0dad0]" />
                    </div>

                    {/* Cey */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-md border border-[#e0dad0]">
                        👩‍🎨
                      </div>
                      <span className="text-[10px] bg-[#e0dad0]/40 px-1.5 py-0.5 rounded mt-1 font-bold text-[#5a5a40]">Cey</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#5a5a40] font-semibold line-clamp-2 max-w-[240px] px-2 leading-relaxed mt-2">
                    Camera loading. Enjoy our natural <strong className="text-[#38bdf8] font-bold">Selfie Simulator</strong>! Let's take a cute keepsake portrait.
                  </p>

                  {/* Quick style controls for mock couple portrait */}
                  <div className="flex gap-1.5 justify-center z-20 mt-2">
                    <button 
                      onClick={() => setCoupleStyle('sparkle')}
                      className={`text-[10px] px-2.5 py-1 rounded-full border font-bold transition-all ${coupleStyle === 'sparkle' ? 'bg-[#4a4a40] border-[#4a4a40] text-white shadow-xs' : 'bg-white border-[#e0dad0] text-[#5a5a40]'}`}
                    >
                      Sparkles ✨
                    </button>
                    <button 
                      onClick={() => setCoupleStyle('hug')}
                      className={`text-[10px] px-2.5 py-1 rounded-full border font-bold transition-all ${coupleStyle === 'hug' ? 'bg-[#4a4a40] border-[#4a4a40] text-white shadow-xs' : 'bg-white border-[#e0dad0] text-[#5a5a40]'}`}
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

              {/* Physical Frame Overlay (applied live on preview using SVG/PNG data overlays) */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <img 
                  src={getOverlayUrl(selectedFrame.id, customText)}
                  alt="Frame selection" 
                  className="w-full h-full object-fill absolute inset-0"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Countdown overlay indicator */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-xs z-30">
                  <motion.div
                    initial={{ scale: 0.1, opacity: 0 }}
                    animate={{ scale: [0.8, 1.2, 1], opacity: 1 }}
                    className="text-6xl font-serif italic font-extrabold text-[#38bdf8] drop-shadow-sm"
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
                    🌿 Unique Camera Keepsake - {capturedPhoto.timestamp}
                  </span>
                  <div className="h-0.5 w-6 bg-[#38bdf8] mx-auto rounded-full" />
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
                  <RefreshCw className="w-3.5 h-3.5 text-[#38bdf8]" />
                  Retake Photo
                </button>
                <button
                  id="camera-download"
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white rounded-full font-bold text-xs shadow-md transition-all active:scale-95"
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
              <span>A LETTER</span>
              <span>{customText.length}/24</span>
            </label>
            <input 
              id="caption-input"
              type="text"
              maxLength={24}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Cay & Cey 2026"
              className="w-full bg-white border border-[#e0dad0] rounded-xl px-3 py-2 text-xs text-[#4a4a40] placeholder-gray-400 focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          {/* Frames Selection list row */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#5a5a40]/90 font-extrabold block">
              FRAME
            </span>
            <div className="flex gap-2 justify-between">
              {FRAMES.map((f) => (
                <button
                  key={f.id}
                  id={`frame-${f.id}`}
                  onClick={() => setSelectedFrame(f)}
                  className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-bold border transition-all ${
                    selectedFrame.id === f.id
                      ? 'bg-[#4a4a40] border-[#4a4a40] text-white shadow-xs'
                      : 'bg-white border-[#e0dad0] text-[#5a5a40] hover:bg-[#5a5a40]/5'
                  }`}
                >
                  <span className="truncate block w-full text-center">{f.name}</span>
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
              <div className="w-13 h-13 bg-[#38bdf8] hover:bg-[#0ea5e9] rounded-full flex items-center justify-center border-2 border-white shadow-inner">
                <Camera className="w-5.5 h-5.5 text-white" />
              </div>

              {/* Pulsing ring during capture count */}
              {isCapturing && (
                <div className="absolute inset-0 rounded-full border-4 border-[#38bdf8] animate-ping pointer-events-none" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
