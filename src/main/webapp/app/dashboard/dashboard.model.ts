import { IMenuAccess } from 'app/entities/menu-access/menu-access.model';

export interface IChartData {
  chartsTitle?: string;
  accessibleMenu?: IMenuAccess[];
  groupByStatus?: IGroupByStatus[];
}

export interface IGroupByStatus {
  statusId?: string;
  statusDescription?: string;
  total?: number;
}

export interface IInterval {
  id?: string;
  label?: string;
}

export const utilityIcon: any = [
  'envelope-open',
  'wallet',
  'tasks',
  'calendar-plus',
  'calendar-check',
  'minus-square',
  'print',
  'print',
  'print',
  'print',
  'print',
  'print',
  'print',
];
