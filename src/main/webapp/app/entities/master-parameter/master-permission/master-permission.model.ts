export interface IAppMenuPermission {
  id?: number;
  menuStatusItem?: IMenuStatusItem;
  positionType?: IPositionTypePermission;
  permission?: string;
}

export interface IMenuStatusItem {
  id?: number;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  menuItemId?: string;
  menuItemDescription?: string;
}

export interface IPositionTypePermission {
  id?: string;
  description?: string;
  title?: string;
  numOfPosition?: number;
  parentId?: string;
  parentDescription?: string;
  internalTypeId?: string;
  internalTypeDescription?: string;
  authorities?: [
    {
      name?: string;
    }
  ];
}

export class AppMenuPermission implements IAppMenuPermission {
  constructor(
    public id?: number,
    public menuStatusItem?: IMenuStatusItem,
    public positionType?: IPositionTypePermission,
    public permission?: string
  ) {
    this.menuStatusItem = new MenuStatusItem();
    this.positionType = new PositionType();
    this.permission = 'EDIT';
  }
}

export class MenuStatusItem implements IMenuStatusItem {
  constructor(
    public id?: number,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public menuItemId?: string,
    public menuItemDescription?: string
  ) {}
}

export class PositionType implements IPositionTypePermission {
  constructor(
    public id?: string,
    public description?: string,
    public title?: string,
    public numOfPosition?: number,
    public parentId?: string,
    public parentDescription?: string,
    public internalTypeId?: string,
    public internalTypeDescription?: string,
    public authorities?: [
      {
        name?: string;
      }
    ]
  ) {}
}
