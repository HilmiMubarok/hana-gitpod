export interface IRequestSlik {
  id?: number;
  requestNumber?: string;
  cif?: string;
  debtorName?: string;
  customerType?: string;
  segment?: string;
  requestDate?: string;
  status?: string;
}

export class RequestSlik implements IRequestSlik {
  constructor(
    public id?: number,
    public requestNumber?: string,
    public cif?: string,
    public debtorName?: string,
    public customerType?: string,
    public segment?: string,
    public requestDate?: string,
    public status?: string
  ) {}
}

export const requestSlikData = [
  {
    id: 1,
    requestNumber: '2023-000434',
    cif: '0000000102',
    debtorName: 'AJIS SUJAENI',
    customerType: 'Personal',
    segment: 'SME',
    requestDate: '2023-000434',
    status: 'Draft',
  },
  {
    id: 2,
    requestNumber: '2023-000434',
    cif: '0000000101',
    debtorName: 'JAYA MIMIKA LESTARI	',
    customerType: 'Corporate',
    segment: 'SME',
    requestDate: '2023-000434',
    status: 'Draft',
  },
];
