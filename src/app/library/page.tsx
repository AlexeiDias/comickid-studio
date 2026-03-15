'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { getUserComics, createComic, deleteComic, updateComic } from '@/lib/comicsService';
import { Comic, ComicStatus } from '@/types';
import BottomNav from '@/components/ui/BottomNav';
import toast from 'react-hot-toast';

const TABS: { key: ComicStatus; label: string; emoji: string; desc: string }[] = [
  { key: 'active', label: 'In Progress', emoji: '✏️', desc: "Comics you're working on" },
  { key: 'finished', label: 'Done!', emoji: '🏆', desc: 'Finished masterpieces' },
  { key: 'idea', label: 'Idea Vault', emoji: '💡', desc: 'Ideas to come back to' },
];

export default function LibraryPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ComicStatus>('active');
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStatus, setNewStatus] = useState<ComicStatus>('active');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    loadComics();
  }, [user]);

  async function loadComics() {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserComics(user.id);
      setComics(data);
    } catch (e) {
      console.error(e);
      toast.error('Could not load comics. Check console.');
    }
    setLoading(false);
  }

  async function handleCreate() {
    if (!user || !newTitle.trim() || creating) return;
    setCreating(true);
    try {
      const id = await createComic(user.id, user.creatorName, newTitle.trim(), newStatus);
      toast.success('Comic created! 🎉');
      setShowNewModal(false);
      setNewTitle('');
      setCreating(false);
      if (newStatus === 'active') router.push(`/editor/${id}`);
      else loadComics();
    } catch (e) {
      console.error(e);
      toast.error('Could not create comic');
      setCreating(false);
    }
  }

  async function handleDelete(comicId: string) {
    if (!confirm('Delete this comic? Cannot be undone!')) return;
    await deleteComic(comicId);
    toast.success('Deleted!');
    loadComics();
  }

  const filtered = comics.filter(c => c.status === activeTab);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-amber-400 border-b-4 border-amber-900 px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-amber-900">My Comics</h1>
            <p className="text-amber-800 font-bold text-sm">Hey, {user?.creatorName}! 👋</p>
          </div>
          <button onClick={logout} className="text-amber-800 font-bold text-sm border-2 border-amber-700 px-3 py-1 rounded-lg">
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-4 border-amber-900 bg-white">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 font-extrabold text-xs flex flex-col items-center gap-1 transition-all ${
              activeTab === tab.key ? 'bg-amber-400 text-amber-900' : 'text-gray-500'
            }`}>
            <span className="text-xl">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-12 font-display text-2xl text-amber-700 animate-pulse">Loading comics...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{TABS.find(t => t.key === activeTab)?.emoji}</div>
            <p className="font-bold text-amber-800 text-lg">No comics here yet!</p>
            <p className="text-amber-600 text-sm mt-1">{TABS.find(t => t.key === activeTab)?.desc}</p>
            <button onClick={() => setShowNewModal(true)}
              className="mt-4 btn-ink bg-orange-500 text-white px-6 py-3 rounded-xl font-extrabold">
              + Create one now!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map(comic => (
              <div key={comic.id} className="comic-panel bg-white overflow-hidden">
                <div className="h-28 flex items-center justify-center font-display text-4xl text-white cursor-pointer"
                  style={{ backgroundColor: comic.coverColor }}
                  onClick={() => router.push(`/editor/${comic.id}`)}>
                  {comic.title.charAt(0).toUpperCase()}
                </div>
                <div className="p-2">
                  <p className="font-extrabold text-amber-900 text-sm truncate">{comic.title}</p>
                  <p className="text-xs text-gray-500 font-bold">{comic.pageCount || 0} pages</p>
                  <div className="flex gap-1 mt-2">
                    <button onClick={() => router.push(`/editor/${comic.id}`)}
                      className="btn-ink bg-amber-400 text-amber-900 text-xs px-2 py-1 rounded flex-1">✏️ Edit</button>
                    <button onClick={() => handleDelete(comic.id)}
                      className="btn-ink bg-red-100 text-red-600 text-xs px-2 py-1 rounded">🗑</button>
                  </div>
                  {activeTab === 'active' && (
                    <button onClick={() => updateComic(comic.id, { status: 'finished' }).then(loadComics)}
                      className="w-full mt-1 btn-ink bg-green-100 text-green-700 text-xs px-2 py-1 rounded">✅ Mark Done</button>
                  )}
                  {activeTab === 'idea' && (
                    <button onClick={() => updateComic(comic.id, { status: 'active' }).then(loadComics)}
                      className="w-full mt-1 btn-ink bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">✏️ Start Working</button>
                  )}
                  {activeTab === 'finished' && (
                    <>
                      <button onClick={() => router.push(`/read/${comic.id}`)}
                        className="w-full mt-1 btn-ink bg-purple-500 text-white text-xs px-2 py-1 rounded">
                        📖 Read
                      </button>
                      <button onClick={() => updateComic(comic.id, { isPublic: !comic.isPublic }).then(loadComics)}
                        className={`w-full mt-1 btn-ink text-xs px-2 py-1 rounded ${comic.isPublic ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {comic.isPublic ? '🌍 Public' : '🔒 Make Public'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => setShowNewModal(true)}
        className="fixed bottom-24 right-4 w-14 h-14 btn-ink bg-orange-500 text-white rounded-full text-3xl z-40 flex items-center justify-center shadow-lg">
        +
      </button>

      {/* ✅ FIX 1: Modal now scrollable so button is always visible */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-50" onClick={() => setShowNewModal(false)}>
          <div className="bg-white rounded-t-3xl border-t-4 border-amber-900 w-full"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div className="p-6 pb-12">
              <div className="w-10 h-1 bg-gray-300 rounded mx-auto mb-4" />
              <h2 className="font-display text-3xl text-amber-900 mb-5">New Comic 🎨</h2>

              <label className="block font-extrabold text-amber-800 mb-2">Give it a title</label>
              <input
                type="text"
                placeholder="e.g. Super Dog vs The Cat Army"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                className="w-full rounded-xl px-4 py-3 font-bold text-lg mb-6 outline-none"
                style={{ border: '3px solid #78350f' }}
                autoFocus
              />

              <label className="block font-extrabold text-amber-800 mb-2">Where does it go?</label>
              <div className="grid grid-cols-3 gap-2 mb-8">
                {TABS.map(tab => (
                  <button key={tab.key} onClick={() => setNewStatus(tab.key)}
                    className={`py-3 rounded-xl font-bold text-sm btn-ink flex flex-col items-center gap-1 ${
                      newStatus === tab.key ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600'
                    }`}>
                    <span className="text-2xl">{tab.emoji}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ✅ Big visible button */}
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim() || creating}
                className="w-full btn-ink bg-orange-500 text-white py-5 rounded-2xl text-2xl font-extrabold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {creating ? '⏳ Creating...' : "🚀 Let's Go!"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
