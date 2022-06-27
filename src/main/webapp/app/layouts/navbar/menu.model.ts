export interface ICustomMatMenu {
  text?: String;
  fn?: any;
}

export class CustomMatMenu implements ICustomMatMenu {
  constructor(public text?: String, public fn?: any) {}
}
