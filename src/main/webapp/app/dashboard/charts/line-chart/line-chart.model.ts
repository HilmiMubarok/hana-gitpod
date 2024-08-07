export interface IProgress {
  description?: string;
  totalCancel?: number;
  totalDraft?: number;
  totalReject?: number;
  totalComplete?: number;
  fromDate?: Date;
  thruDate?: Date;
}
