export interface IMenuAccess {
  [obj: string]: any;
  code?: string;
  description?: string;
  icon?: string;
  id?: string;
  parentId?: string;
  parentDescription?: string;
  positions?: IPositionAccess;
}

export class MenuAccess implements IMenuAccess {
  constructor(
    public code?: string,
    public description?: string,
    public icon?: string,
    public id?: string,
    public parentId?: string,
    public parentDescription?: string,
    public positions?: IPositionAccess
  ) {}
}

export interface IPositionAccess {
  id?: number;
  menuItemDescription?: string;
  menuItemIcon?: string;
  menuItemId?: string;
  menuItemcode?: string;
  parentMenuItemCode?: string;
  parentMenuItemDescription?: string;
  parentMenuItemIcon?: string;
  parentMenuItemId?: string;
  positionDescription?: string;
  positionId?: string;
}

export class PositionAccess implements IPositionAccess {
  constructor(
    public id?: number,
    public menuItemDescription?: string,
    public menuItemIcon?: string,
    public menuItemId?: string,
    public menuItemcode?: string,
    public parentMenuItemCode?: string,
    public parentMenuItemDescription?: string,
    public parentMenuItemIcon?: string,
    public parentMenuItemId?: string,
    public positionDescription?: string,
    public positionId?: string
  ) {}
}
