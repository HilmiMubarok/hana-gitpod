export interface MasterDocumentTerm {
  id?: number;
  name?: string;
  fromDays?: number;
  toDays?: number;
  daysTo?: number;
  emailTo?: string;
  interval?: string;
  schedulerCategoryId?: string;
  schedulerCategoryName?: string;
  statusId?: string;
}

export interface SchedulerType {
  id?: string;
  label?: string;
}
