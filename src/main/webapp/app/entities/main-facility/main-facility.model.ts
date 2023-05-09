export interface IMainFacility {
  id?: number;
  applicationId?: number;
  partyId?: string;
  approvalNumber?: string;
  currency?: string;
  changes?: number;
  mainPlafond?: number;
  outstanding?: number;
  availableLimit?: number;
  maturityDate?: Date;
  newMaturityDate?: Date;
  totalPlafond?: number;
  categoryListDTO?: ICategoryList[];
}

export class MainFacility implements IMainFacility {
  constructor(
    public id?: number,
    public applicationId?: number,
    public partyId?: string,
    public approvalNumber?: string,
    public currency?: string,
    public changes?: number,
    public mainPlafond?: number,
    public outstanding?: number,
    public availableLimit?: number,
    public maturityDate?: Date,
    public newMaturityDate?: Date,
    public totalPlafond?: number,
    public categoryListDTO?: ICategoryList[]
  ) {
    this.categoryListDTO = [new CategoryList()];
  }
}

export interface ICategoryList {
  categoryId?: string;
  changes?: number;
  plafond?: number;
  mainPlafond?: number;
  outstanding?: number;
  totalPlafond?: number;
}

export class CategoryList implements ICategoryList {
  constructor(public categoryId?: string, public plafond?: number, public outsanding?: number) {}
}
