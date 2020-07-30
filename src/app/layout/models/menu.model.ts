export interface Menu {
  path: string[];
  type: 'inner' | 'full';
  text: string;
  redirect?: boolean;
}
