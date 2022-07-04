export interface ICollateralType {
  id?: number;
  description?: string | null;
  parentId?: string | null;
  parentDescription?: string | null;
}

export class CollateralType implements ICollateralType {
  constructor(
    public id?: number,
    public description?: string | null,
    public parentId?: string | null,
    public parentDescription?: string | null
  ) {}
}

export function getCollateralTypeIdentifier(collateralType: ICollateralType): number | undefined {
  return collateralType.id;
}
