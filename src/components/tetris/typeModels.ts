export type Cell = {
  background: string;
  settle: boolean;
}
export type ModelStage = Cell[][]

export type ModelScoreBoard = {
  score: number;
  rows: number;
  level: number
}

export interface ModelBlock {
  shape: boolean[][],
  background: string
}

export interface ModelUserBlock extends ModelBlock {
  standardPos: [number, number]
} 
