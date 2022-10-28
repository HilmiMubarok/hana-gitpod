import * as uuid from 'uuid';
export interface ICollateralPrevious {
  id?: number;
  collateralType?: string;
  marketValue?: number;
  liquidValue?: number;
}

export class CollateralPrevious implements ICollateralPrevious {
  constructor(
    public id?: number,
    public collateralType?: string,
    public marketValue?: number,
    public liquidValue?: number // public attributes?: any,
  ) {
    this.id = uuid.v4();
    this.collateralType = '';
    // this.marketValue = 0;
    // this.liquidValue = 0;
  }
}
