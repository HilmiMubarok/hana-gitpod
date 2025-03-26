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
  newMaturityDate?: string;
  totalPlafond?: number;
  endPeriodDate?: string | Date;
  kurs?: number;
  lastAgreementDate?: Date;
  startPeriodDate?: string | Date;
  categoryListDTO?: ICategoryList[];
  endPeriodRemark?: string;
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
    public newMaturityDate?: string,
    public totalPlafond?: number,
    public endPeriodDate?: string | Date,
    public kurs?: number,
    public lastAgreementDate?: Date,
    public startPeriodDate?: string | Date,
    public categoryListDTO?: ICategoryList[],
    public endPeriodRemark?: string
  ) {
    this.changes = 0;
    this.mainPlafond = 0;
    this.outstanding = 0;
    this.availableLimit = 0;
    this.totalPlafond = 0;
    this.kurs = 0;
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
    this.plafond = 0;
    this.outsanding = 0;
    this.changes = 0;
    this.totalPlafond = 0;
    this.mainPlafond = 0;
  }
}
