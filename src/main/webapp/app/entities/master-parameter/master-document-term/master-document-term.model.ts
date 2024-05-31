export interface MasterDocumentTerm {
  id?: string;
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

export interface SchedulerParticipant {
  id?: number;
  schedulerId: string;
  employeeId: number;
}
