export interface IProgress {
  description?: string;
  totalDraft?: number;
  totalReject?: number;
  totalComplete?: number;
  fromDate?: Date;
  thruDate?: Date;
}
