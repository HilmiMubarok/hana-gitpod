import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { DateTime } from '@syncfusion/ej2-angular-charts';

export interface ICollateral {
  numberId?: number;
  collDetailType?: string;
  qty_size?: number;
  guarantee_amount?: number;
  marketValue?: number;
  guarantee_type?: string;
  guarantee_coverage?: string;
  certificate_num?: string;
  certificate_date_from?: DateTime;
  certificate_date_thru?: DateTime;
  country?: string;
  location?: string;
  issuer_customer?: string;
  bis_col_detail_type?: string;
  issuing_instution?: string;
  iss_inst_bic_cod?: string;
  lg_applecant?: string;
  credit_rating_office?: string;
  approved_credit_line?: string;

  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  collateralTypeDescription?: string;
  collateralTypeId?: string;
  collateralAdressId?: string;
  collateralCityId?: string;
  partyName?: string;
  partyId?: string;
  applicationId?: number;
  attributes?: any;
}

export class Collateral implements ICollateral {
  constructor(
    public numberId?: number,
    public id?: number,
    public collDetailType?: string,
    public qty_size?: number,
    public guarantee_amount?: number,
    public marketValue?: number,
    public guarantee_type?: string,
    public guarantee_coverage?: string,
    public certificate_num?: string,
    public certificate_date_from?: DateTime,
    public certificate_date_thru?: DateTime,
    public country?: string,
    public location?: string,
    public issuer_customer?: string,
    public bis_col_detail_type?: string,
    public issuing_instution?: string,
    public iss_inst_bic_cod?: string,
    public lg_applecant?: string,
    public credit_rating_office?: string,
    public approved_credit_line?: string,

    public fromDate?: Date,
    public thruDate?: Date,
    public collateralTypeDescription?: string,
    public collateralTypeId?: string,
    public partyName?: string,
    public partyId?: string,
    public applicationId?: number,
    public attributes?: any
  ) {}
}
