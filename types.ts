
export interface Employee {
  id: string;
  name: string;
}

export interface Group {
  id: number;
  name: string;
  members: string[];
  theme?: string;
}

export enum AppMode {
  SETUP = 'SETUP',
  LUCKY_DRAW = 'LUCKY_DRAW',
  GROUPING = 'GROUPING'
}
