export interface Iopinionhistory {
  message?: string;
  recomendation?: string;
  condition?: string;
}

export class IOpinionHistory implements Iopinionhistory {
  constructor(public message?: string, public recomendation?: string, public condition?: string) {
    this.message = '';
    this.recomendation = '';
    this.condition = '';
  }
}
