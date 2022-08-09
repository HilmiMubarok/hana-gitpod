import { IProcessTask } from 'app/shared/model/process-task.model';

export interface ICollateralAppraisal {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  applicationId?: number;
  collateralId?: number;
  partyId?: number;
  partyTypeId?: string;
  surveyorId?: number;
  apprType?: string;
  kjppNo?: string;
  branch?: string;
  reviewerTeam?: string;
  apprOfficer?: string;
  apprDate?: Date;
  collObj?: string;
  landSizeVal?: number;
  landVarketVal?: number; // Typo Wa2n???
  marketVal?: number;
  indicationVal?: number;
  percentageVal?: number;
  ttlLandMarketValue?: number;
  ttlLandLiqValIndication?: number;
  ttlLandroundMarketValue?: number;
  ttlLandroundLiqValIndication?: number;
  ttlBuildMarketValue?: number;
  ttlBuildLiqValIndication?: number;
  ttlBuildroundMarketValue?: number;
  ttlBuildroundLiqValIndication?: number;
  merkVal?: string;
  madeByVal?: string;
  mfgDateVal?: Date;
  ttlMarketVal?: number;
  ttlRandValue?: number;
  ttlLiqValIndication?: number;
  ttlRoundLiqValIndication?: number;
  ttlUnit?: number;
  collApprNotes?: string;
  marketability?: string;
  returnNotes?: string;
  apprValue?: number;
  apprValueImb?: number;
  quantity?: number;
  remark?: string;
  apprInstituion?: string;
  apprReportNum?: string;
  reviewedBy?: string;
  reviewedOpinion?: string;
  propertyType?: string;
  propertyLoc?: string;
  landSize?: number;
  buildingSize?: number;
  bidPrice?: number;
  transactionPrice?: number;
  sourcePhone?: string;
  sourceTitle?: string;
  compNotes?: string;
  compVehMerk?: string;
  compVehType?: string;
  collApprId?: string;
  negCriteria?: string;
  negConsType?: Boolean;
  totalPlafond?: number;
  tglJatuhTempo?: Date;
  tasks?: IProcessTask[];
  attributes?: any;
  source?: string;
}

export class CollateralAppraisal implements ICollateralAppraisal {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public applicationId?: number,
    public collateralId?: number,
    public partyId?: number,
    public partyTypeId?: string,
    public surveyorId?: number,
    public apprType?: string,
    public kjppNo?: string,
    public branch?: string,
    public reviewerTeam?: string,
    public apprOfficer?: string,
    public apprDate?: Date,
    public collObj?: string,
    public landSizeVal?: number,
    public landVarketVal?: number, // Typo Wa2n???
    public marketVal?: number,
    public indicationVal?: number,
    public percentageVal?: number,
    public ttlLandMarketValue?: number,
    public ttlLandLiqValIndication?: number,
    public ttlLandroundMarketValue?: number,
    public ttlLandroundLiqValIndication?: number,
    public ttlBuildMarketValue?: number,
    public ttlBuildLiqValIndication?: number,
    public ttlBuildroundMarketValue?: number,
    public ttlBuildroundLiqValIndication?: number,
    public merkVal?: string,
    public madeByVal?: string,
    public mfgDateVal?: Date,
    public ttlMarketVal?: number,
    public ttlRandValue?: number,
    public ttlLiqValIndication?: number,
    public ttlRoundLiqValIndication?: number,
    public ttlUnit?: number,
    public collApprNotes?: string,
    public marketability?: string,
    public returnNotes?: string,
    public apprValue?: number,
    public apprValueImb?: number,
    public quantity?: number,
    public remark?: string,
    public apprInstituion?: string,
    public apprReportNum?: string,
    public reviewedBy?: string,
    public reviewedOpinion?: string,
    public propertyType?: string,
    public propertyLoc?: string,
    public landSize?: number,
    public buildingSize?: number,
    public bidPrice?: number,
    public transactionPrice?: number,
    public sourcePhone?: string,
    public sourceTitle?: string,
    public compNotes?: string,
    public compVehMerk?: string,
    public compVehType?: string,
    public collApprId?: string,
    public negCriteria?: string,
    public negConsType?: Boolean,
    public totalPlafond?: number,
    public tglJatuhTempo?: Date,
    public tasks?: IProcessTask[],
    public attributes?: any,
    public source?: string
  ) {}
}
