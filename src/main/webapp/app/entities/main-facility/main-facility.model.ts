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
  endPeriodDate?: Date;
  kurs?: number;
  lastAgreementDate?: Date;
  startPeriodDate?: Date;
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
    public endPeriodDate?: Date,
    public kurs?: number,
    public lastAgreementDate?: Date,
    public startPeriodDate?: Date,
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
  constructor(
    public categoryId?: string,
    public plafond?: number,
    public mainPlafond?: number,
    public changes?: number,
    public outsanding?: number,
    public totalPlafond?: number
  ) {
    (this.plafond = 0), (this.outsanding = 0), (this.changes = 0), (this.totalPlafond = 0);
    this.mainPlafond = 0;
  }
}
