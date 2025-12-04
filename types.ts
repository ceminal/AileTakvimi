export interface Person {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  relationship: string;
  avatarUrl: string;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export enum ViewState {
  HOME = 'HOME',
  ADD_PERSON = 'ADD_PERSON',
  LIST = 'LIST'
}

export const RELATIONSHIPS = [
  'Anne',
  'Baba',
  'Kardeş',
  'Eş',
  'Çocuk',
  'Büyükanne/Büyükbaba',
  'Arkadaş',
  'Kuzen',
  'Diğer'
];