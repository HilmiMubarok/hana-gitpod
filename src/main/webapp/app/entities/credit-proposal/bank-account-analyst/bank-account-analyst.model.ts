import * as uuid from 'uuid';

export interface IBankAccountAnalyst {
  id?: string;
  bank?: string;
  accNo?: string;
  accName?: string;
  limit?: number;
  ccy?: string;
  convert?: number;
  note?: string;
  detail?: IBankAccountAnalystDetail[];
  average?: IBankAccountAnalystAverage;
  average_other?: IBankAccountAnalystAverage;
  message?: string;
}

export interface IBankAccountAnalystAverage {
  debit?: number;
  fqDebit?: number;
  credit?: number;
  fqCredit?: number;
  lowest?: number;
  highest?: number;
  balance?: number;
}

export class BankAccountAnalystAverage implements IBankAccountAnalystAverage {
  constructor() {}
}

export interface IBankAccountAnalystDetail {
  id?: string;
  date?: string;
  debit?: number;
  fqDebit?: number;
  credit?: number;
  fqCredit?: number;
  lowest?: number;
  highest?: number;
  balance?: number;
}

export class BankAccountAnalystDetail implements IBankAccountAnalystDetail {
  constructor(
    public id?: string,
    public date?: string,
    public debit?: number,
    public fqDebit?: number,
    public credit?: number,
    public fqCredit?: number,
    public lowest?: number,
    public highest?: number,
    public balance?: number
  ) {
    this.date = '';
    this.debit = 0;
    this.fqDebit = 0;
    this.credit = 0;
    this.fqCredit = 0;
    this.lowest = 0;
    this.highest = 0;
    this.balance = 0;
  }
}

export class BankAccountAnalyst implements IBankAccountAnalyst {
  constructor(
    public id?: string,
    public bank?: string,
    public accNo?: string,
    public accName?: string,
    public limit?: number,
    public note?: string,
    public ccy?: string,
    public convert?: number,
    public detail?: IBankAccountAnalystDetail[],
    public average?: IBankAccountAnalystAverage,
    public average_other?: IBankAccountAnalystAverage,
    public message?: string
  ) {
    this.limit = 0;
    this.convert = 0;
    this.detail = new Array<IBankAccountAnalystDetail>();
    this.average = new BankAccountAnalystAverage();
    this.average_other = new BankAccountAnalystAverage();
    this.message = '';
  }
}

export interface IBankAccountAnalystMessage {
  id?: number;
  idBankAnalyst?: IBankAccountAnalyst;
  message?: string;
}

export class BankAccountAnalystMessage implements IBankAccountAnalystMessage {
  constructor(public id?: number, public idBankAnalyst?: IBankAccountAnalyst, public message?: string) {
    this.id = uuid.v4();
    this.idBankAnalyst = new BankAccountAnalyst();
    this.message = '';
  }
}
