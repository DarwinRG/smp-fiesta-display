export type ThemeKey =
  | 'thanksgiving_night'
  | 'farmers_night'
  | 'senior_citizens_day'
  | 'bingo_bonanza'
  | 'coronation_night'
  | 'binibining_san_manuel'
  | 'balligi_night';

export interface FiestaEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  themeKey: ThemeKey;
  accentColor: string;
  subtitle?: string;
}
