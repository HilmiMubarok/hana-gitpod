export interface IMenuPermissions {
  id: number;
  menuStatusItem: MenuStatusItem;
  PositionType: PositionType;
  permission: string;
}

export interface MenuStatusItem {
  id: number;
  statusId: string;
  statusCode: string;
  statusDescription: string;
  menuItemId: string;
  menuItemDescription: string;
}

export interface PositionType {
  id: string;
  description: string;
  title: string;
  numOfPosition: number;
  parentId: string;
  parentDescription: string;
  internalTypeId: string;
  internalTypeDescription: string;
  authorities: [];
}
