/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Download, Trash2, ArrowLeftRight, ChevronLeft, ChevronRight, CheckCircle2, Circle, Check } from 'lucide-react';
import { PhotoCapture } from '../types';

interface GalleryAppProps {
  onBack: () => void;
}

// Inline preloaded beautiful memories to ensure the gallery is never empty
const DEFAULT_PRESET_PHOTOS: PhotoCapture[] = [
  {
    id: 'memory-1',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' width='500' height='500'>
        <rect width='500' height='500' fill='#fff5f7'/>
        <!-- Warm glowing background -->
        <circle cx='250' cy='250' r='180' fill='#ffe4e6' opacity='0.7'/>
        <!-- Cute stylized illustration of Cay and Cey of LoveOS -->
        <g transform='translate(150, 160)'>
          <!-- Cay silhouette -->
          <path d='M30,120 Q50,60 70,120 Z' fill='#1e293b'/>
          <circle cx='50' cy='50' r='25' fill='#1e293b'/>
          <!-- Cey silhouette -->
          <path d='M130,130 Q150,70 170,130 Z' fill='#f43f5e'/>
          <circle cx='150' cy='60' r='22' fill='#ffd1d9'/>
          <!-- Little connecting heart -->
          <path d='M95,65 C95,65 92,60 88,60 C84,60 81,64 81,68 C81,74 95,82 95,82 C95,82 109,74 109,68 C109,64 106,60 102,60 C98,60 95,65 95,65 Z' fill='#e11d48' scale='1.2'/>
        </g>
        <!-- Title and text in frame -->
        <rect x='0' y='0' width='500' height='500' fill='none' stroke='#fbcfe8' stroke-width='20'/>
        <rect x='0' y='410' width='500' height='90' fill='#ffffff'/>
        <text x='250' y='452' font-family='Georgia, serif' font-style='italic' font-weight='800' font-size='15' fill='#db2777' text-anchor='middle'>First Day we met ♥</text>
        <text x='250' y='472' font-family='monospace' font-size='10' fill='#9d174d' text-anchor='middle' letter-spacing='1'>CAY &amp; CEY MEMORIES</text>
      </svg>
    `.trim()),
    timestamp: '10:00 AM',
    frameId: 'photobooth-strip'
  },
  {
    id: 'memory-2',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' width='500' height='500'>
        <rect width='500' height='500' fill='#1c1917'/>
        <!-- Space gradient aura -->
        <circle cx='250' cy='250' r='200' fill='#0ea5e9' opacity='0.15' filter='blur(40px)'/>
        <!-- Tech outline crosshair grid -->
        <path d='M 250,50 L 250,450 M 50,250 L 450,250' stroke='#38bdf8' stroke-width='0.5' stroke-dasharray='5,5' opacity='0.3'/>
        
        <!-- Interactive vector nodes -->
        <circle cx='250' cy='200' r='12' fill='none' stroke='#38bdf8' stroke-width='2' opacity='0.8'/>
        <path d='M 190,260 Q 250,230 310,260' fill='none' stroke='#38bdf8' stroke-width='3' stroke-linecap='round'/>
        <text x='250' y='320' font-family='monospace' font-weight='bold' font-size='18' fill='#38bdf8' text-anchor='middle' letter-spacing='2'>STARRING NIGHT</text>
        <rect x='0' y='0' width='500' height='500' fill='none' stroke='#38bdf8' stroke-width='20' opacity='0.9'/>
        <rect x='0' y='425' width='500' height='75' fill='#1c1917'/>
        <text x='250' y='460' font-family='monospace' font-weight='800' font-size='12' fill='#38bdf8' text-anchor='middle' letter-spacing='3'>PRESET 2 NEON FRAME</text>
      </svg>
    `.trim()),
    timestamp: '11:15 PM',
    frameId: 'neon-glow'
  },
  {
    id: 'memory-3',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' width='500' height='500'>
        <rect width='500' height='500' fill='#ffffff'/>
        <rect x='30' y='30' width='440' height='360' fill='#faf8f5' stroke='#e0dad0' stroke-width='1'/>
        <!-- Mini camera visual -->
        <rect x='215' y='170' width='70' height='50' rx='8' fill='#4a4a40'/>
        <circle cx='250' cy='195' r='16' fill='#ffffff' stroke='#4a4a40' stroke-width='3'/>
        <circle cx='272' cy='182' r='4' fill='#38bdf8'/>
        <path d='M220,170 L230,158 L270,158 L280,170 Z' fill='#4a4a40'/>
        
        <text x='250' y='270' font-family='Georgia, serif' font-style='italic' font-size='16' fill='#4a4a40' text-anchor='middle'>Capturing Our Life Together</text>
        <rect x='0' y='0' width='500' height='500' fill='none' stroke='#ffffff' stroke-width='24'/>
        <rect x='0' y='410' width='500' height='90' fill='#ffffff'/>
        <text x='250' y='458' font-family='Georgia, serif' font-weight='900' font-size='22' fill='#333333' text-anchor='middle'>Eternity Keepsake</text>
      </svg>
    `.trim()),
    timestamp: '03:45 PM',
    frameId: 'polaroid'
  }
];

const getFrameName = (frameId?: string): string => {
  if (!frameId) return 'Preset 1';
  if (frameId === 'polaroid') return 'Preset 1';
  if (frameId === 'neon-glow') return 'Preset 2';
  if (frameId === 'photobooth-strip') return 'Preset 3';
  return frameId;
};

export default function GalleryApp({ onBack }: GalleryAppProps) {
  const [photos, setPhotos] = useState<PhotoCapture[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  
  // Preview State
  const [previewPhotoId, setPreviewPhotoId] = useState<string | null>(null);

  // Load photos from LocalStorage
  const loadPhotos = () => {
    const saved = localStorage.getItem('loveos_gallery');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPhotos(parsed);
          return;
        }
      } catch (e) {
        console.warn('Failed to parse gallery photos:', e);
      }
    }
    // Prepopulate with default templates
    setPhotos(DEFAULT_PRESET_PHOTOS);
    localStorage.setItem('loveos_gallery', JSON.stringify(DEFAULT_PRESET_PHOTOS));
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  // Sync photos to Local Storage whenever they modify
  const savePhotosToStorage = (updatedList: PhotoCapture[]) => {
    setPhotos(updatedList);
    localStorage.setItem('loveos_gallery', JSON.stringify(updatedList));
  };

  // Multiple selection helper
  const toggleMultiSelectMode = () => {
    if (isMultiSelectMode) {
      // Clear selection upon exit
      setSelectedPhotoIds(new Set());
    }
    setIsMultiSelectMode(!isMultiSelectMode);
  };

  const toggleSelectPhoto = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextSet = new Set(selectedPhotoIds);
    if (nextSet.has(id)) {
      nextSet.delete(id);
    } else {
      nextSet.add(id);
    }
    setSelectedPhotoIds(nextSet);
  };

  // Preview cycle helpers
  const currentPhotoIndex = previewPhotoId 
    ? photos.findIndex(p => p.id === previewPhotoId) 
    : -1;

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (photos.length === 0 || currentPhotoIndex === -1) return;
    const nextIndex = (currentPhotoIndex + 1) % photos.length;
    setPreviewPhotoId(photos[nextIndex].id);
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (photos.length === 0 || currentPhotoIndex === -1) return;
    const prevIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    setPreviewPhotoId(photos[prevIndex].id);
  };

  // Keyboard navigation for carousel preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (previewPhotoId === null) return;
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'Escape') setPreviewPhotoId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewPhotoId, photos, currentPhotoIndex]);

  // Click on a library thumbnail
  const handlePhotoClick = (photo: PhotoCapture) => {
    if (isMultiSelectMode) {
      toggleSelectPhoto(photo.id);
    } else {
      setPreviewPhotoId(photo.id);
    }
  };

  // Download Trigger Utility
  const downloadSinglePhoto = (photo: PhotoCapture) => {
    const link = document.createElement('a');
    link.download = `loveos-keepsake-${photo.id}.png`;
    link.href = photo.url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSelected = () => {
    if (selectedPhotoIds.size === 0) return;
    photos.forEach(p => {
      if (selectedPhotoIds.has(p.id)) {
        downloadSinglePhoto(p);
      }
    });
    // Exit multi select after download
    setIsMultiSelectMode(false);
    setSelectedPhotoIds(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedPhotoIds.size === 0) return;
    const updated = photos.filter(p => !selectedPhotoIds.has(p.id));
    savePhotosToStorage(updated.length > 0 ? updated : []);
    setIsMultiSelectMode(false);
    setSelectedPhotoIds(new Set());
  };

  const handleDeletePreview = (idToDelete: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = photos.filter(p => p.id !== idToDelete);
    savePhotosToStorage(updated);
    setPreviewPhotoId(null);
  };

  return (
    <div className="absolute inset-0 z-40 bg-[#f5f2eb] flex flex-col pt-9 select-none text-[#4a4a40]">
      
      {/* HEADER BAR */}
      <div className="h-14 bg-[#f8f5f0] border-b border-[#e0dad0] flex items-center justify-between px-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-2 border border-[#e0dad0] hover:bg-[#5a5a40]/5 rounded-full text-[#5a5a40] hover:text-[#4a4a40] flex items-center justify-center flex-shrink-0 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-serif font-bold text-base tracking-tight text-[#4a4a40]">
            Gallery
          </span>
        </div>

        {/* Toggle Multi-Select visual indicator (Circle toggle selector on the top right) */}
        <button
          onClick={toggleMultiSelectMode}
          className={`p-2 border rounded-full transition-all flex items-center justify-center gap-1.5 ${
            isMultiSelectMode 
              ? 'bg-[#4a4a40] border-[#4a4a40] text-white hover:bg-[#4a4a40]/90 shadow-2xs' 
              : 'border-[#e0dad0] text-[#5a5a40] hover:bg-[#5a5a40]/5 hover:text-[#4a4a40]'
          }`}
          title={isMultiSelectMode ? "Cancel Selection" : "Multiple Select"}
        >
          {isMultiSelectMode ? (
            <Check className="w-4 h-4 text-emerald-300" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
          )}
        </button>
      </div>

      {/* GALLERY GRID */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar">
        {photos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-center">
            <span className="text-3xl grayscale mb-2">📸</span>
            <p className="text-[12px] text-[#5a5a40]/60 font-medium">No keepsakes taken yet.</p>
            <p className="text-[10px] text-[#5a5a40]/40 max-w-[180px] mt-1">Photos captured with the camera appear here automatically!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => {
              const isSelected = selectedPhotoIds.has(photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => handlePhotoClick(photo)}
                  className={`bg-white rounded-2xl border p-2 cursor-pointer transition-all relative overflow-hidden group select-none ${
                    isSelected 
                      ? 'border-[#38bdf8] ring-2 ring-[#38bdf8]/20 shadow-xs scale-[0.98]' 
                      : 'border-[#e0dad0] hover:border-stone-400 hover:shadow-xs'
                  }`}
                >
                  {/* Aspect-square cropped polaroid wrapper */}
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#faf8f5] border border-stone-100 flex items-center justify-center relative">
                    <img 
                      src={photo.url} 
                      alt="Captured keepsake" 
                      className="w-full h-full object-cover select-none pointer-events-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* Multiple select circle indicator badge in corners */}
                    {isMultiSelectMode && (
                      <div className="absolute top-2 right-2 z-10">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-[#38bdf8] flex items-center justify-center text-white shadow-sm ring-2 ring-white">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-black/30 border-2 border-white flex items-center justify-center text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Photo details line label */}
                  <div className="pt-2 pb-0.5 px-1 flex justify-between items-center text-[9.5px] font-mono text-[#5a5a40]/60 font-bold">
                    <span>{photo.timestamp}</span>
                    <span className="capitalize text-[8.5px] bg-[#5a5a40]/8 px-1.5 py-0.2 rounded text-[#5a5a40]">
                      {getFrameName(photo.frameId)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SELECTION ACTION BAR - ONLY AT THE BOTTOM OF THE GRID VIEWPORT WHEN ACTIVE */}
      <AnimatePresence>
        {isMultiSelectMode && selectedPhotoIds.size > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="absolute bottom-5 left-5 right-5 bg-stone-900 text-white rounded-2xl p-3.5 shadow-xl flex items-center justify-between gap-3 z-30"
          >
            <span className="text-[11px] font-bold font-mono text-zinc-300 pl-1">
              Selected ({selectedPhotoIds.size})
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all"
                title="Delete selected"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
              <button
                onClick={handleDownloadSelected}
                className="px-3 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all"
                title="Download selected"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN CAROUSEL PREVIEW OVERLAY MODAL */}
      <AnimatePresence>
        {previewPhotoId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col text-white pt-9"
          >
            {/* PREVIEW TOP PANEL */}
            <div className="h-14 flex items-center justify-between px-4 z-20">
              <button
                onClick={() => setPreviewPhotoId(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                title="Back to gallery"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="font-mono text-xs font-semibold text-zinc-400">
                {currentPhotoIndex + 1} / {photos.length}
              </div>

              {/* Multi-select circle toggle & Delete buttons inside preview top-right */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (previewPhotoId) {
                      const nextSet = new Set(selectedPhotoIds);
                      if (nextSet.has(previewPhotoId)) {
                        nextSet.delete(previewPhotoId);
                      } else {
                        nextSet.add(previewPhotoId);
                      }
                      setSelectedPhotoIds(nextSet);
                      setIsMultiSelectMode(true); // Automatically toggle selection grid bar on
                    }
                  }}
                  className={`p-2 rounded-full transition-all flex items-center justify-center ${
                    selectedPhotoIds.has(previewPhotoId || '')
                      ? 'bg-[#38bdf8] border-[#38bdf8] text-white shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title="Toggle Select for Multiple Download/Delete"
                >
                  {selectedPhotoIds.has(previewPhotoId || '') ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-250 text-sky-950" />
                  ) : (
                    <Circle className="w-4 h-4 text-white" />
                  )}
                </button>

                <button
                  onClick={() => handleDeletePreview(previewPhotoId)}
                  className="p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-300 rounded-full text-white transition-all"
                  title="Delete keepsake photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PREVIEW CAROUSEL CORE WORKSPACE */}
            <div className="flex-1 flex items-center justify-between px-3 relative">
              
              {/* Left Navigate Switch */}
              <button
                onClick={handlePrevPhoto}
                className="absolute left-4 p-3 bg-black/40 hover:bg-black/60 hover:scale-105 active:scale-95 text-white border border-white/10 rounded-full transition-all duration-150 z-20"
                title="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6 text-sky-300" />
              </button>

              {/* Photo Canvas render frame */}
              <div className="w-full flex justify-center items-center px-8 z-10 select-all">
                {photos[currentPhotoIndex] && (
                  <motion.div
                    key={photos[currentPhotoIndex].id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 bg-white text-black shadow-2xl rounded-2xl border border-stone-800 max-w-[310px] w-full flex flex-col items-center"
                  >
                    <img
                      src={photos[currentPhotoIndex].url}
                      alt="Polaroid Keepsake Core"
                      className="w-full aspect-square object-cover rounded-lg pointer-events-none select-none"
                    />
                  </motion.div>
                )}
              </div>

              {/* Right Navigate Switch */}
              <button
                onClick={handleNextPhoto}
                className="absolute right-4 p-3 bg-black/40 hover:bg-black/60 hover:scale-105 active:scale-95 text-white border border-white/10 rounded-full transition-all duration-150 z-20"
                title="Next Photo"
              >
                <ChevronRight className="w-6 h-6 text-sky-300" />
              </button>
            </div>

            {/* PREVIEW BOTTOM ACTION CONTROL PANEL */}
            <div className="h-28 flex flex-col justify-center items-center gap-1 z-20 bg-gradient-to-t from-black to-transparent">
              {/* Download button on the bottom middle */}
              <button
                onClick={() => downloadSinglePhoto(photos[currentPhotoIndex])}
                className="px-6 py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-extrabold rounded-full font-serif text-xs tracking-wider flex items-center gap-2.5 shadow-lg active:scale-95 transition-all duration-150 cursor-pointer"
                title="Download Keepsake Image"
              >
                <Download className="w-4 h-4 text-white" />
                DOWNLOAD PHOTO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
