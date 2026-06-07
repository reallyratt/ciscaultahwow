/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Pin, Trash2, Check } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  isPinned?: boolean;
}

interface NotesAppProps {
  onBack: () => void;
}

export default function NotesApp({ onBack }: NotesAppProps) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('loveos_notes');
    const defaultBirthdayNote: Note = {
      id: 'pinned-hbd',
      title: 'A Message for Cey!',
      content: "Aye! Cisca is turning 20?! U know... It takes such a great energy, especially it's u we're talking about... The one that has been shaken, crunched by the world over and over again. But the way u stood up and not giving up? That's MC energy, Cey... I am suuppeerrr proud of u for living this life this far.\n\nNow I wanted to say, may God bless u, bless us this year, so that your life would be easier. That way u can be more happy, be more... Relaxed.\n\nI wished for everything good, positive for u to lay on this year!\n\nAnd no matter what happened I'll always be here, with u. The woman that groomed me.",
      lastModified: Date.now(),
      isPinned: true
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure the pinned HBD is always present with the upgraded text
        const hasPinnedHbd = parsed.some((n: Note) => n.id === 'pinned-hbd');
        if (!hasPinnedHbd) {
          return [defaultBirthdayNote, ...parsed];
        }
        // Upgrade existing old template pinned note to this custom beautiful text
        return parsed.map((n: Note) => {
          if (n.id === 'pinned-hbd') {
            return {
              ...n,
              title: defaultBirthdayNote.title,
              content: defaultBirthdayNote.content
            };
          }
          return n;
        });
      } catch (e) {
        // Fallback below
      }
    }
    return [defaultBirthdayNote];
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editorTitle, setEditorTitle] = useState<string>('');
  const [editorContent, setEditorContent] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | null>(null);

  // Sync state with local storage on any notes change
  useEffect(() => {
    localStorage.setItem('loveos_notes', JSON.stringify(notes));
  }, [notes]);

  // Open helper for existing notes
  const handleOpenNote = (note: Note) => {
    setActiveNoteId(note.id);
    setEditorTitle(note.title);
    setEditorContent(note.content);
    setIsEditing(true);
    setSaveStatus('saved');
  };

  // Open helper for new empty note
  const handleCreateNote = () => {
    const newId = `note-${Date.now()}`;
    setActiveNoteId(newId);
    setEditorTitle('');
    setEditorContent('');
    setIsEditing(true);
    setSaveStatus(null);
  };

  // Auto-saving logic as user types
  const handleNoteInputChange = (newTitle: string, newContent: string) => {
    setEditorTitle(newTitle);
    setEditorContent(newContent);

    if (!activeNoteId) return;

    // Show indicator
    setSaveStatus('saving');

    const trimmedTitle = newTitle.trim();
    const trimmedContent = newContent.trim();

    // If both empty, remove or skip adding if not already in notes
    if (!trimmedTitle && !trimmedContent) {
      setNotes((prev) => prev.filter((n) => n.id !== activeNoteId));
      setSaveStatus(null);
      return;
    }

    setNotes((prev) => {
      const exists = prev.some((n) => n.id === activeNoteId);
      if (exists) {
        return prev.map((n) =>
          n.id === activeNoteId
            ? { ...n, title: newTitle, content: newContent, lastModified: Date.now() }
            : n
        );
      } else {
        // New save below pinned notes
        const newNote: Note = {
          id: activeNoteId,
          title: newTitle,
          content: newContent,
          lastModified: Date.now(),
          isPinned: false,
        };
        return [...prev, newNote];
      }
    });

    // Simulated short debounced saving indicator
    setTimeout(() => {
      setSaveStatus('saved');
    }, 400);
  };

  // Delete note helper
  const handleDeleteNote = (idToDelete: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Prevent deleting the initial HBD note just for safety or allow it? Let's check.
    // Usually it's nice to keep pinned note safe, but we also let them delete others.
    setNotes((prev) => prev.filter((n) => n.id !== idToDelete));
    if (activeNoteId === idToDelete) {
      setIsEditing(false);
      setActiveNoteId(null);
    }
  };

  // Split pinned and non-pinned list
  const pinnedNotes = notes.filter((n) => n.isPinned);
  const normalNotes = notes.filter((n) => !n.isPinned);

  return (
    <div className="absolute inset-0 z-40 bg-[#f8f5f0] flex flex-col pt-9 select-none text-[#4a4a40]">
      <AnimatePresence mode="wait">
        {!isEditing ? (
          /* PRIMARY NOTES LIST SCREEN */
          <motion.div
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-full relative"
          >
            {/* Standard uniform Header bar */}
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
                  Notes
                </span>
              </div>
              <div className="w-8 h-8" /> {/* Spacer */}
            </div>

            {/* Note content container list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 no-scrollbar">
              
              {/* Pinned Note Container */}
              {pinnedNotes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[9.5px] uppercase font-bold tracking-wider text-[#5a5a40]/70 pl-1">
                    <Pin className="w-3 h-3 text-[#38bdf8] fill-[#38bdf8]" />
                    <span>Pinned Note</span>
                  </div>
                  {pinnedNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => handleOpenNote(note)}
                      className="bg-[#fefcf8] border-2 border-[#d6cfc4] rounded-[20px] p-4 shadow-xs select-all cursor-pointer transition-all hover:bg-[#fcf9f1]"
                    >
                      <h3 className="font-serif font-bold text-sm text-[#4a4a40] mb-1">
                        {note.title || 'Untitled Note'}
                      </h3>
                      {/* DISPLAY FULLY without lines clamping! */}
                      <p className="text-[12px] text-[#5a5a40] leading-relaxed whitespace-pre-wrap break-words">
                        {note.content || 'No content.'}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Normal/Auto-saved Notes container */}
              <div className="space-y-2 pt-2">
                {normalNotes.length > 0 && (
                  <div className="text-[9.5px] uppercase font-bold tracking-wider text-[#5a5a40]/70 pl-1">
                    <span>Recent Notes</span>
                  </div>
                )}
                {normalNotes.length === 0 ? (
                  <div className="py-12 text-center text-[11px] text-[#5a5a40]/50 font-medium">
                    No other notes yet. Tap + to draft one.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {normalNotes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => handleOpenNote(note)}
                        className="bg-white border border-[#e0dad0] rounded-xl p-3.5 shadow-2xs cursor-pointer select-all transition-all hover:bg-[#fbf9f5] flex items-start justify-between gap-2"
                      >
                        <div className="flex-1 min-w-0 pr-1">
                          <h4 className="font-bold text-[12.5px] text-[#4a4a40] truncate mb-0.5">
                            {note.title || 'Untitled Draft'}
                          </h4>
                          <p className="text-[11px] text-[#5a5a40]/80 line-clamp-2 leading-relaxed break-words">
                            {note.content || 'Empty note.'}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteNote(note.id, e)}
                          className="p-1.5 hover:bg-rose-50 text-stone-400 hover:text-stone-600 rounded-lg transition-colors flex-shrink-0"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom floating + create button */}
            <div className="absolute bottom-5 right-5 z-30">
              <button
                onClick={handleCreateNote}
                className="w-12 h-12 rounded-full bg-[#4a4a40] hover:bg-[#3d3d33] text-white flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95 cursor-pointer transition-all duration-150"
                title="Create new note"
              >
                <Plus className="w-5.5 h-5.5" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* ACTIVE EDITOR MODEL VIEWPORT */
          <motion.div
            key="editor-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col h-full bg-[#faf8f5]"
          >
            {/* Editor Action sticky top header bar */}
            <div className="h-14 bg-[#faf8f5] border-b border-[#e0dad0] flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 border border-[#e0dad0] hover:bg-[#5a5a40]/5 rounded-full text-[#5a5a40] hover:text-[#4a4a40] flex items-center justify-center flex-shrink-0 transition-colors"
                  title="Back to list"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#5a5a40]/60 flex items-center gap-1.5 pl-1">
                  {saveStatus === 'saving' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
                  )}
                  {saveStatus === 'saved' && (
                    <Check className="w-3 h-3 text-emerald-500" />
                  )}
                  <span>
                    {saveStatus === 'saving' ? 'Auto-saving...' : saveStatus === 'saved' ? 'Saved' : 'Drafting'}
                  </span>
                </div>
              </div>
              
              {activeNoteId !== 'pinned-hbd' && (
                <button
                  onClick={() => handleDeleteNote(activeNoteId!)}
                  className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Input area scroll container */}
            <div className="flex-1 p-5 space-y-4 overflow-y-auto no-scrollbar flex flex-col">
              <input
                type="text"
                value={editorTitle}
                onChange={(e) => handleNoteInputChange(e.target.value, editorContent)}
                placeholder="Title"
                className="w-full bg-transparent border-none text-[#4a4a40] font-serif font-extrabold text-base focus:outline-none placeholder-stone-450 focus:ring-0 p-0"
              />
              <div className="w-full h-px bg-[#e0dad0]/60" />
              <textarea
                value={editorContent}
                onChange={(e) => handleNoteInputChange(editorTitle, e.target.value)}
                placeholder="Start writing..."
                className="w-full bg-transparent border-none text-[#5a5a40] text-xs focus:outline-none placeholder-stone-400 leading-relaxed resize-none flex-1 focus:ring-0 p-0 min-h-[350px]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
