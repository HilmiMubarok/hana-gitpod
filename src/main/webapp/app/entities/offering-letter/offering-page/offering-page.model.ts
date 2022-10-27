import * as uuid from 'uuid';

export interface IOfferingLetter {
  id?: number;
  debitorNameGroup?: string;
  debitorNamePerson?: string;
  debitorType?: string;
  noLetter?: string;
  dateOffering?: string;
}

export class OfferingLetter implements IOfferingLetter {
  constructor(public id?: number, public noLetter?: string, public dateOffering?: string, public debitorNameGroup?: string, public debitorNamePerson?: string, public debitorType?: string) {
    this.id = uuid.v4();
    this.debitorNameGroup = '';
    this.debitorNamePerson = '';
    this.debitorType = '';
    this.noLetter = '';
    this.dateOffering = '';
  }
}
