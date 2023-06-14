export interface IRequestSlik {
  id?: number;
  requestNumber?: string;
  cif?: string;
  debtorName?: string;
  customerType?: string;
  segment?: string;
  requestDate?: string;
  purposeCode?: string;
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
    public purposeCode?: string,
    public status?: string
  ) {}
}
