export interface IGroupCollateralTotal {
  totalLvKJJP?: number;
  totalMVKJJP?: number;
  totalMV?: number;
  totalLV?: number;
}

//
export class GroupCollateralTotal implements IGroupCollateralTotal {
  constructor(public totalLvKJJP?: number, public totalMVKJJP?: number, public totalMV?: number, public totalLV?: number) {
    this.totalLvKJJP = 0;
    this.totalMVKJJP = 0;
    this.totalMV = 0;
    this.totalLV = 0;
  }
}

export interface IGroupCollateralChecklis {
  cifNumber?: string;
  collateralId?: number;
  checklis?: boolean;
}

export class GroupCollateralChecklis implements IGroupCollateralChecklis {
  constructor(public cifNumber?: string, public collateralId?: number, public checklis?: boolean) {}
}
