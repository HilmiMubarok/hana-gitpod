export interface ICreditRating {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  partyName?: string;
  partyId?: string;
  applicationId?: number;
  creditRating?: string;
  internalMaxLLL?: number;
  equityPosition?: string;
  idrMioLLL?: number;
  pefindo?: string;
  snp?: string;
  fitch?: string;
  moodys?: string;
  equityPositionDate?: Date;
  externalRatingDate?: Date;
  pefindoDate?: Date;
  snpDate?: Date;
  fitchDate?: Date;
  moodysDate?: Date;
  attributes?: any;
}

// export class CreditRating implements ICreditRating {
//   constructor(
//     public creditRating?: string,
//     public partyId?: string,
//     public applicationId?: number,

//   ) {
//     this.creditRating = '';
//     this.partyId = '';
//     // this.applicationId = '';

//   }
// }

export class CreditRating implements ICreditRating {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public partyName?: string,
    public partyId?: string,
    public applicationId?: number,
    public creditRating?: string,
    public internalMaxLLL?: number,
    public equityPosition?: string,
    public idrMioLLL?: number,
    public pefindo?: string,
    public snp?: string,
    public fitch?: string,
    public moodys?: string,
    public equityPositionDate?: Date,
    public externalRatingDate?: Date,
    public pefindoDate?: Date,
    public snpDate?: Date,
    public fitchDate?: Date,
    public moodysDate?: Date,
    public attributes?: any
  ) {
    this.internalMaxLLL = 0;
    this.equityPosition = '0';
  }
}
