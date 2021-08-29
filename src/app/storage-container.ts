export enum CellNaming {
  ALPHA,
  ALPHA_NUMERIC,
  NUMERIC
}

// TODO fix the topLevel, allowsSamples, samplePositions, containerPositions
export class StorageContainer {

  id: string;
  name: string;
  cellNaming?: CellNaming;
  fullPath?: string;
  capacity?: number;
  rows?: number;
  columns?: number;
  immutable?: boolean;
  columnIndex?: number;
  rowIndex?: number;
  topLevel?: boolean;
  allowsSamples: boolean;
  samplePositions?: any[]; // SampleContainer[];
  barcode?: string;
  containerPositions?: StorageContainer[];

}