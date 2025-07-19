export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  summary: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookFormData {
  title: string;
  author: string;
  genre: string;
  rating: number;
  summary: string;
  coverImage?: string;
}

export const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Democracy",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Computers",
  "Technology",
  "Health",
  "Travel",
  "Art",
  "Poetry",
] as const;

export type Genre = (typeof GENRES)[number];
