import * as uuid from 'uuid';

export interface IOfferingLetter {
  id?: number;
  debitorNameGroup?: string;
  debitorNamePerson?: string;
  debitorType?: string;
  noLetter?: string;
  dateOffering?: string;
  position?: string;
}

export class OfferingLetter implements IOfferingLetter {
  constructor(
    public id?: number,
    public noLetter?: string,
    public dateOffering?: string,
    public debitorNameGroup?: string,
    public debitorNamePerson?: string,
    public debitorType?: string,
    public position?: string
  ) {
    this.id = uuid.v4();
    this.debitorNameGroup = '';
    this.debitorNamePerson = '';
    this.debitorType = '';
    this.noLetter = '';
    this.dateOffering = '';
    this.position = '';
  }
}

export interface IOfferingLetterPreparation {
  id?: number;
  idOfferingLetterSigner?: IOfferingLetter;
  noLettter?: string;
  dateOffering?: string;
  noLetter?: string;
  debitorName?: string;
  address?: string;
}

export class OfferingLetterPreparation implements IOfferingLetterPreparation {
  constructor(
    public id?: number,
    public idOfferingLetterSigner?: IOfferingLetter,
    public noLetter?: string,
    public dateOffering?: string,
    public debitorName?: string,
    public address?: string
  ) {
    this.id = uuid.v4();
    this.idOfferingLetterSigner = new OfferingLetter(id);
    this.debitorName = '';
    this.address = '';
    this.noLetter = '';
    this.dateOffering = '';
  }
}
