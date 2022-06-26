export interface IFuncSetting {
  id?: string;
  description?: string;
  sequence?: number;
  parentDescription?: string;
  parentId?: string;
}

export class FuncSetting implements IFuncSetting {
  constructor(
    public id?: string,
    public description?: string,
    public sequence?: number,
    public parentDescription?: string,
    public parentId?: string
  ) {}
}
