export interface ISidebarMenuModel {
  name?: string;
  route?: string;
  children?: ISidebarMenuModel[];
}

export interface FlatNode {
  expandable?: boolean;
  name?: string;
  level?: number;
}

export class SidebarMenuModel implements ISidebarMenuModel {
  constructor(public name?: string, public route?: string, public children?: ISidebarMenuModel[]) {}
}

/* export interface ISidebarMenuModel {
  name?: string;
  iconname?: string;
  route?: string;
  children?: ISidebarMenuModel[];
}

export interface FlatNode {
  expandable?: boolean;
  name?: string;
  iconname?: string;
  level?: number;
}

export class SidebarMenuModel implements ISidebarMenuModel {
  constructor(public name?: string, public iconname?: string, public route?: string, public children?: ISidebarMenuModel[]) {}
}*/
