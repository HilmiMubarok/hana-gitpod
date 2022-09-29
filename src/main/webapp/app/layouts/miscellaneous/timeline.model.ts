export interface ITimeline {
  title?: string;
  text?: string;
  date?: Date;
  createdBy?: String;
}

export class Timeline implements ITimeline {
  constructor(public title?: string, public text?: string, public date?: Date, public createdBy?: String) {}
}
