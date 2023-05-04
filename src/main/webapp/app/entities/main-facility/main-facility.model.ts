export interface IMainFacility {
  id?: number;
  partyId?: string;
  approvalNumber?: string;
  currency?: string;
  mainPlafond?: number;
  availableLimit?: number;
  maturityDate?: Date;
  categoryListDTO?: ICategoryList[];
}

export class MainFacility implements IMainFacility {
  constructor(
    public id?: number,
    public partyId?: string,
    public approvalNumber?: string,
    public currency?: string,
    public mainPlafond?: number,
    public availableLimit?: number,
    public maturityDate?: Date,
    public categoryListDTO?: ICategoryList[]
  ) {
    this.categoryListDTO = [new CategoryList()];
  }
}

export interface ICategoryList {
  categoryId?: string;
  plafond?: number;
  outstanding?: number;
}

export class CategoryList implements ICategoryList {
  constructor(public categoryId?: string, public plafond?: number, public outsanding?: number) {}
}
