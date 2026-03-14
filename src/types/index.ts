export type ComicStatus = 'active' | 'finished' | 'idea';
export type CharacterPose = 'standing' | 'sitting' | 'lying' | 'running' | 'walking' | 'jumping' | 'crawling';
export type CharacterSpecies = 'human' | 'cat' | 'dog' | 'rabbit' | 'bear' | 'fox' | 'frog' | 'penguin';

export interface Character {
  id: string;
  name: string;
  species: CharacterSpecies;   // NEW
  bodyShape: 'round' | 'square' | 'tall' | 'small';
  skinColor: string;           // body color for animals
  hairColor: string;           // accent color for animals
  outfitColor: string;
  eyeStyle: 'happy' | 'cool' | 'surprised' | 'sleepy';
  accessory: 'none' | 'hat' | 'glasses' | 'cape' | 'crown';
}

export type BubbleType = 'speech' | 'shout' | 'thought' | 'whisper';

export interface TextBubble {
  id: string;
  type: BubbleType;
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
}

export interface PageCharacter {
  characterId: string;
  x: number;
  y: number;
  size: number;
  flipped: boolean;
  pose: CharacterPose;
}

export interface ComicPanel {
  id: string;
  layout: string;
  backgroundColor: string;
  backgroundPattern: string;
  characters: PageCharacter[];
  textBubbles: TextBubble[];
  soundEffects: Array<{ text: string; x: number; y: number; color: string }>;
  drawingData: string;
  pageNumber: number;
}

export interface Comic {
  id: string;
  title: string;
  coverColor: string;
  description: string;
  status: ComicStatus;
  isPublic: boolean;
  authorId: string;
  authorName: string;
  characters: Character[];
  pages: ComicPanel[];
  createdAt: Date;
  updatedAt: Date;
  pageCount: number;
  reactions: { heart: number; laugh: number; fire: number; clap: number };
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  creatorName: string;
  avatarColor: string;
}
