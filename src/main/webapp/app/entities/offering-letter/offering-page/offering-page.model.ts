import * as uuid from 'uuid';

export interface IOfferingLetter {
  id?: number;
  debitorNameGroup?: string;
  debitorNamePerson?: string;
  debitorType?: string;
}

export class OfferingLetter implements IOfferingLetter {
  constructor(public id?: number, public noLetter?: string, public dateOffering?: string, public debitorNameGroup?: string, public debitorNamePerson?: string, public debitorType?: string) {
    this.id = uuid.v4();
    this.debitorNameGroup = '';
    this.debitorNamePerson = '';
    this.debitorType = '';
  }
}


export interface IOfferingLetterPreparation {
  id?: number;
  // idOfferingLetterSigner?: IOfferingLetter;
  noLettter?: string;
  dateOffering?: string;
  noLetter?: string;
  debitorName?: string;
  address?:string
}

export class OfferingLetterPreparation implements IOfferingLetterPreparation {
  constructor(public id?: number, public noLetter?: string, public dateOffering?: string, public debitorName?: string, public address?: string) {
    this.id = uuid.v4();
    // this.idOfferingLetterSigner = new OfferingLetter(id);pre
    this.debitorName = '';
    this.address = '';
    this.noLetter = '';
    this.dateOffering = '';
  }
}