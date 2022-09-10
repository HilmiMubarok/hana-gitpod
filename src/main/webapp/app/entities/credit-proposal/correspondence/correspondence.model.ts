import * as uuid from 'uuid';

export interface ICorrespondence {
  id?: string;
  name?: string;
  position?: string;
  date?: Date;
  notes?: string;
}

export class Correspondence {
  constructor(public id?: string, public name?: string, public position?: string, public date?: Date, public notes?: string) {
    this.id = uuid.v4();
    this.name = '';
    this.date = new Date();
    this.position = '';
    this.notes = '';
  }
}
