import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Comic, ComicStatus } from '@/types';

const COL = 'comics';

export async function getUserComics(userId: string): Promise<Comic[]> {
  // ✅ FIX: No orderBy — avoids needing a Firestore composite index
  const q = query(collection(db, COL), where('authorId', '==', userId));
  const snap = await getDocs(q);
  const comics = snap.docs.map(d => ({ id: d.id, ...d.data() } as Comic));
  // Sort client-side instead
  return comics.sort((a, b) => {
    const aTime = (a.updatedAt as any)?.seconds || 0;
    const bTime = (b.updatedAt as any)?.seconds || 0;
    return bTime - aTime;
  });
}

export async function getPublicComics(): Promise<Comic[]> {
  // ✅ FIX: Single where clause — no composite index needed
  const q = query(collection(db, COL), where('isPublic', '==', true));
  const snap = await getDocs(q);
  const comics = snap.docs.map(d => ({ id: d.id, ...d.data() } as Comic));
  return comics
    .filter(c => c.status === 'finished')
    .sort((a, b) => {
      const aTime = (a.updatedAt as any)?.seconds || 0;
      const bTime = (b.updatedAt as any)?.seconds || 0;
      return bTime - aTime;
    });
}

export async function getComic(comicId: string): Promise<Comic | null> {
  const docRef = doc(db, COL, comicId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Comic;
}

export async function createComic(
  userId: string,
  authorName: string,
  title: string,
  status: ComicStatus
): Promise<string> {
  const colors = ['#ff6b35', '#ffd23f', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff9ff3', '#54a0ff'];
  const coverColor = colors[Math.floor(Math.random() * colors.length)];
  const newComic = {
    title,
    coverColor,
    description: '',
    status,
    isPublic: false,
    authorId: userId,
    authorName,
    characters: [],
    pages: [],
    pageCount: 0,
    reactions: { heart: 0, laugh: 0, fire: 0, clap: 0 },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COL), newComic);
  return ref.id;
}

export async function updateComic(comicId: string, data: Partial<Comic>): Promise<void> {
  const docRef = doc(db, COL, comicId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteComic(comicId: string): Promise<void> {
  await deleteDoc(doc(db, COL, comicId));
}

export async function addReaction(
  comicId: string,
  reaction: 'heart' | 'laugh' | 'fire' | 'clap'
): Promise<void> {
  const comic = await getComic(comicId);
  if (!comic) return;
  const reactions = { ...comic.reactions, [reaction]: (comic.reactions[reaction] || 0) + 1 };
  await updateComic(comicId, { reactions });
}
