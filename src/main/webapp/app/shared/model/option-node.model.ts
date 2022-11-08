export interface IOptionNode {
  id?: string;
  label?: string;
}

export class OptionNode implements IOptionNode {
  constructor(public id?: string, public label?: string) {}
}

// ----------------------------------------------------------------------------------------------------
export interface IEJOptionNode {
  id?: string;
  text?: string;
}

export class EJOptionNode implements IEJOptionNode {
  constructor(public id?: string, public text?: string) {}
}
