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

export interface IDueDate {
  noOverdue?: number;
  overDueLessThan?: number;
  overDueBetween?: number;
  moreThan?: number;
  date?: string;
}

// export interface IProgress{

// }

export const lineChartDummyData: any = [
  { data: 13, date: '2024/02/12' },
  { data: 23, date: '2024/03/19' },
  { data: 37, date: '2024/02/23' },
  { data: 44, date: '2024/02/10' },
  { data: 8, date: '2024/03/13' },
  { data: 25, date: '2024/03/27' },
  { data: 48, date: '2024/02/21' },
  { data: 2, date: '2024/02/18' },
  { data: 39, date: '2024/02/17' },
  { data: 33, date: '2024/02/22' },
  { data: 49, date: '2024/03/15' },
  { data: 46, date: '2024/03/07' },
  { data: 14, date: '2024/02/27' },
  { data: 47, date: '2024/03/10' },
  { data: 1, date: '2024/02/02' },
  { data: 8, date: '2024/02/05' },
  { data: 25, date: '2024/03/22' },
  { data: 14, date: '2024/03/04' },
  { data: 38, date: '2024/02/14' },
  { data: 25, date: '2024/02/24' },
  { data: 17, date: '2024/03/26' },
  { data: 48, date: '2024/02/13' },
  { data: 27, date: '2024/03/06' },
  { data: 25, date: '2024/02/27' },
  { data: 18, date: '2024/03/12' },
  { data: 5, date: '2024/03/18' },
  { data: 10, date: '2024/02/05' },
  { data: 6, date: '2024/03/20' },
  { data: 28, date: '2024/02/18' },
  { data: 28, date: '2024/03/29' },
  { data: 33, date: '2024/03/01' },
  { data: 14, date: '2024/02/06' },
  { data: 13, date: '2024/02/07' },
  { data: 46, date: '2024/03/26' },
  { data: 15, date: '2024/03/15' },
  { data: 40, date: '2024/03/25' },
  { data: 42, date: '2024/02/04' },
  { data: 34, date: '2024/02/14' },
  { data: 50, date: '2024/02/15' },
  { data: 41, date: '2024/03/04' },
  { data: 14, date: '2024/03/16' },
  { data: 10, date: '2024/03/23' },
  { data: 37, date: '2024/03/02' },
  { data: 34, date: '2024/02/19' },
  { data: 1, date: '2024/03/24' },
  { data: 42, date: '2024/02/24' },
  { data: 4, date: '2024/03/19' },
  { data: 32, date: '2024/02/16' },
  { data: 21, date: '2024/03/09' },
  { data: 20, date: '2024/02/03' },
  { data: 38, date: '2024/03/05' },
  { data: 30, date: '2024/02/28' },
  { data: 9, date: '2024/02/29' },
  { data: 16, date: '2024/03/28' },
  { data: 14, date: '2024/03/12' },
  { data: 43, date: '2024/02/27' },
  { data: 28, date: '2024/02/20' },
  { data: 28, date: '2024/03/17' },
  { data: 2, date: '2024/03/21' },
  { data: 39, date: '2024/03/08' },
  { data: 27, date: '2024/02/01' },
  { data: 26, date: '2024/03/11' },
  { data: 35, date: '2024/02/02' },
  { data: 30, date: '2024/03/14' },
  { data: 47, date: '2024/03/03' },
  { data: 21, date: '2024/02/07' },
];

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
