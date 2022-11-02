import { retriveDataNew } from './retrive.constant';

export interface IRetrive {
  // id?: number;
  year?: number;
  account_code?: string;
  account_name?: string;
  currency?: string;
  amount?: number;
}

export class RetriveData implements IRetrive {
  constructor(
    public id?: number,
    public year?: number,
    public account_code?: string,
    public account_name?: string,
    public currency?: string,
    public amount?: number,
    public retriveData?: IRetrive[]
  ) {
    this.retriveData = [];
  }
}
