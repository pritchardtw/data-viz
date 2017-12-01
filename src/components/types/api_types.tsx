export interface Tag {
  tagId: string;
  label: string;
  dataType: string;
  unit: string;
  isTransient: boolean;
  features: Array<string>;
}

export interface DataPoint {
  observationTS: Date;
  tagId: string;
  value: object;
  quality: object;
}
