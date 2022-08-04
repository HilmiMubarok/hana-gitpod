export interface ICollateral {
  id?: number;
  party_id?: string;
  coll_detail_type?: string;
  qty_size?: string;
  guarantee_amount?: string;
  market_value?: string;
  guarantee_type?: string;
  guarantee_coverage?: string;
  certificate_num?: string;
  certificate_date_from?: Date;
  certificate_date_thru?: Date;
  country?: string;
  location?: string;
  issuer_customer?: string;
  bis_col_detail_type?: string;
  issuing_instution?: string;
  iss_inst_bic_co?: string;
  lg_applecant?: string;
  credit_rating_office?: string;
  approved_credit_line?: string;
  custodian?: string;
  machineName?: string;
  acc_officer?: string;
  collateral_id?: string;
  collateral_code?: string;
  coll_binding_type?: string;
  registration_date?: Date;
  contract_date?: Date;
  release_date?: Date;
  collateral_owner?: string;
  loan_customer?: string;
  facility_type?: string;
  collateral_status?: string;
  collateral_grading?: string;
  binding_date?: Date;
  paripasu_status?: string;
  coll_characteristic?: string;
  issuer?: string;
  rating_institution?: string;
  issuer_rating?: string;
  rating_date?: string;
  pic_name?: string;
  pic_phone?: string;
  truncated_area?: string;
  public_facilities?: string;
  property_usage?: string;
  land_shape?: string;
  land_elevation?: string;
  road_width?: string;
  unit_condition?: string;
  inhabited_by?: string;
  land_position?: string;
  facing_direction?: string;
  made_with?: string;
  obj_environment?: string;
  left_side?: string;
  right_side?: string;
  front_side?: string;
  back_side?: string;
  machine_name?: string;
  machine_doc_type?: string;
  machine_doc_num?: string;
  machine_date?: string;
  machine_date_from?: string;
  machine_amount?: string;
  machine_merk?: string;
  machine_made_by?: string;
  machine_year?: string;
  machine_model_type?: string;
  machine_type?: string;
  machine_mfg_date?: string;
  machine_spec?: string;
  machine_condition?: string;
  machine_notes?: string;
  bpkb_num?: string;
  bpkb_name?: string;
  veh_num?: string;
  veh_year?: string;
  stnk_num?: string;
  chassis_num?: string;
  veh_machine_num?: string;
  veh_inv_num?: string;
  veh_used_by?: string;
  veh_brand?: string;
  veh_type?: string;
  veh_category?: string;
  veh_model?: string;
  veh_cylinder?: string;
  veh_colour?: string;
  veh_fuel?: string;
  veh_transmission?: string;
  veh_wheels_ttl?: string;
  veh_unit_cond?: string;
  veh_notes?: string;
  coll_photo_category?: string;
  coll_photo?: string;

  numberId?: number;
  collDetailType?: string;
  qtySize?: number;
  guaranteeAmount?: number;
  marketValue?: number;
  guaranteType?: string;
  guaranteeCoverage?: string;
  certificateNum?: string;
  certificateDateFrom?: Date;
  certificateDateThru?: Date;

  issuerCustomer?: string;
  bisColDetailType?: string;
  issuingInstution?: string;
  issInstBicCod?: string;
  lgApplecant?: string;
  creditRatingOffice?: string;
  approvedCreditLine?: string;

  fromDate?: Date;
  thruDate?: Date;
  collateralTypeDescription?: string;
  collateralTypeId?: string;
  partyName?: string;
  partyId?: string;
  applicationId?: number;
  attributes?: any;

  managementBranch?: object;
  accOfficer?: number;
  collateralId?: string;
  collateralCode?: string;
  colBindingType?: string;
  registrationDate?: Date;
  contractDate?: Date;
  releaseDate?: Date;
  collateralOwner?: string;
  loanCustomer?: string;
  facilityType?: string;
  collateralStatus?: string;
  collateralGrading?: string;
  bindingDate?: Date;
  paripasuStatus?: string;
  collCharacteristic?: string;

  ratingInstitution?: string;
  issuerRating?: string;
  ratingDate?: Date;

  machineDocType?: string;
  machineDocNum?: string;
  machineDate?: Date;
  machineDateFrom?: Date;
  machineAmount?: string;
  machineMerk?: string;
  machineMadeBy?: string;
  machineYear?: number;
  machineModelType?: string;
  machineType?: string;
  machineMfgDate?: Date;
  machineSpec?: string;
  machineCondition?: string;
  machineNotes?: string;

  bpkbNum?: string;
  bpkbName?: string;
  vehNum?: string;
  vehYear?: number;
  stnkNum?: string;
  chassisNum?: string;
  vehMachineNum?: string;
  vehInvNum?: string;
  vehUsedBy?: string;
  vehBrand?: string;
  vehType?: string;
  vehCategory?: string;
  vehModel?: string;
  vehCylinder?: string;
  vehColour?: string;
  vehFuel?: string;
  vehtransmission?: string;
  vehWheelsTtl?: string;
  vehUnitCond?: string;
  vehNotes?: string;
}

export class Collateral implements ICollateral {
  constructor(
    public party_id?: string,
    public coll_detail_type?: string,
    public qty_size?: string,
    public guarantee_amount?: string,
    public market_value?: string,
    public guarantee_type?: string,
    public guarantee_coverage?: string,
    public certificate_num?: string,
    public certificate_date_from?: Date,
    public certificate_date_thru?: Date,

    public issuer_customer?: string,
    public bis_col_detail_type?: string,
    public issuing_instution?: string,
    public iss_inst_bic_co?: string,
    public lg_applecant?: string,
    public credit_rating_office?: string,
    public approved_credit_line?: string,

    public machineName?: string,
    public acc_officer?: string,
    public collateral_id?: string,
    public collateral_code?: string,
    public coll_binding_type?: string,
    public registration_date?: Date,
    public contract_date?: Date,
    public release_date?: Date,
    public collateral_owner?: string,
    public loan_customer?: string,
    public facility_type?: string,
    public collateral_status?: string,
    public collateral_grading?: string,
    public binding_date?: Date,
    public paripasu_status?: string,
    public coll_characteristic?: string,
    public issuer?: string,
    public rating_institution?: string,
    public issuer_rating?: string,
    public rating_date?: string,
    public pic_name?: string,
    public pic_phone?: string,
    public truncated_area?: string,
    public public_facilities?: string,
    public property_usage?: string,
    public land_shape?: string,
    public land_elevation?: string,
    public road_width?: string,
    public unit_condition?: string,
    public inhabited_by?: string,
    public land_position?: string,
    public facing_direction?: string,
    public made_with?: string,
    public obj_environment?: string,
    public left_side?: string,
    public right_side?: string,
    public front_side?: string,
    public back_side?: string,
    public machine_name?: string,
    public machine_doc_type?: string,
    public machine_doc_num?: string,
    public machine_date?: string,
    public machine_date_from?: string,
    public machine_amount?: string,
    public machine_merk?: string,
    public machine_made_by?: string,
    public machine_year?: string,
    public machine_model_type?: string,
    public machine_type?: string,
    public machine_mfg_date?: string,
    public machine_spec?: string,
    public machine_condition?: string,
    public machine_notes?: string,
    public bpkb_num?: string,
    public bpkb_name?: string,
    public veh_num?: string,
    public veh_year?: string,
    public stnk_num?: string,
    public chassis_num?: string,
    public veh_machine_num?: string,
    public veh_inv_num?: string,
    public veh_used_by?: string,
    public veh_brand?: string,
    public veh_type?: string,
    public veh_category?: string,
    public veh_model?: string,
    public veh_cylinder?: string,
    public veh_colour?: string,
    public veh_fuel?: string,
    public veh_transmission?: string,
    public veh_wheels_ttl?: string,
    public veh_unit_cond?: string,
    public veh_notes?: string,
    public coll_photo_category?: string,
    public coll_photo?: string,

    public numberId?: number,
    public coolDetailType?: string,
    public qtySize?: number,
    public guaranteeAmount?: number,
    public marketValue?: number,
    public guaranteType?: string,
    public guaranteeCoverage?: string,
    public certificateNum?: string,
    public certificateDateFrom?: Date,
    public certificateDateThru?: Date,
    public country?: string,
    public location?: string,
    public issuerCustomer?: string,
    public bisColDetailType?: string,
    public issuingInstution?: string,
    public issInstBicCod?: string,
    public lgApplecant?: string,
    public creditRatingOffice?: string,
    public approvedCreditLine?: string,

    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public collateralTypeDescription?: string,
    public collateralTypeId?: string,
    public partyName?: string,
    public partyId?: string,
    public applicationId?: number,
    public attributes?: any,

    public custodian?: string,
    public managementBranch?: object,
    public accOfficer?: number,
    public collateralId?: string,
    public collateralCode?: string,
    public colBindingType?: string,
    public registrationDate?: Date,
    public contractDate?: Date,
    public releaseDate?: Date,
    public collateralOwner?: string,
    public loanCustomer?: string,
    public facilityType?: string,
    public collateralStatus?: string,
    public collateralGrading?: string,
    public bindingDate?: Date,
    public paripasuStatus?: string,
    public collCharacteristic?: string,

    public ratingInstitution?: string,
    public issuerRating?: string,
    public ratingDate?: Date,

    public machineDocType?: string,
    public machineDocNum?: string,
    public machineDate?: Date,
    public machineDateFrom?: Date,
    public machineAmount?: string,
    public machineMerk?: string,
    public machineMadeBy?: string,
    public machineYear?: number,
    public machineModelType?: string,
    public machineType?: string,
    public machineMfgDate?: Date,
    public machineSpec?: string,
    public machineCondition?: string,
    public machineNotes?: string,

    public bpkbNum?: string,
    public bpkbName?: string,
    public vehNum?: string,
    public vehYear?: number,
    public stnkNum?: string,
    public chassisNum?: string,
    public vehMachineNum?: string,
    public vehInvNum?: string,
    public vehUsedBy?: string,
    public vehBrand?: string,
    public vehType?: string,
    public vehCategory?: string,
    public vehModel?: string,
    public vehCylinder?: string,
    public vehColour?: string,
    public vehFuel?: string,
    public vehtransmission?: string,
    public vehWheelsTtl?: string,
    public vehUnitCond?: string,
    public vehNotes?: string
  ) {}
}
