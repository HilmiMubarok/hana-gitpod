export interface IStatusMenuAccess {
  code?: string;
  description?: string;
  icon?: string;
  id?: string;
  parentDescription?: string;
  parentId?: string;
  statuses?: IStatusAccess;
}

export class StatusMenuAccess implements IStatusMenuAccess {
  constructor(
    public code?: string,
    public description?: string,
    public icon?: string,
    public id?: string,
    public parentDescription?: string,
    public parentId?: string,
    public statuses?: IStatusAccess
  ) {}
}

export interface IStatusAccess {
  id?: number;
  menuItemDescription?: string;
  menuItemId?: string;
  statusCode?: string;
  statusDescription?: string;
  statusId?: string;
}

export class StatusAccess implements IStatusAccess {
  constructor(
    public id?: number,
    public menuItemDescription?: string,
    public menuItemId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public statusId?: string
  ) {}
}

export interface IMenuItem {
  id?: string;
  statusName?: string;
  sequence?: 0;
  statusCode?: string;
  description?: string;
  statusTypeId?: string;
  statusTypeDescription?: string;
  caption?: string;
  icon?: string;
}
