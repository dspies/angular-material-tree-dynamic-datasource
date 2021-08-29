export class StorageContainerNode {
  id: string;
  name: string;
  allowsSamples: boolean;
  barcode?: string;
  containerPositions?: StorageContainerNode[];
  level: number;
  isLoading: boolean;

  constructor(
    id: string,
    name: string,
    allowsSamples: boolean,
    level: number,
    barcode?: string,
    containerPositions?: StorageContainerNode[],
    isLoading?: boolean
  ) {
    this.id = id;
    this.name = name;
    this.allowsSamples = allowsSamples;
    this.containerPositions = containerPositions;
    this.isLoading = isLoading || false;
    this.level = level;
  }
}
