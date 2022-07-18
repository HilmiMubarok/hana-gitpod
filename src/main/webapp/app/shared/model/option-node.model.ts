export interface IOptionNode {
  id?: string;
  label?: string;
}

export class OptionNode implements IOptionNode {
  constructor(public id?: string, public label?: string) {}
}
