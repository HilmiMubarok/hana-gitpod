import { IProcessTask } from 'app/shared/model/process-task.model';
import { ICollateral } from '../collateral/collateral.model';
import { scoreCard } from './negative/score-card.constant';

export interface ICollateralAppraisal {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  applicationId?: number;
  collateralId?: number;
  collateral?: ICollateral;
  collateralTypeId?: number;
  collateralTypeDescription?: string;
  partyId?: number;
  partyTypeId?: string;
  surveyorId?: number;
  surveyorName?: string;
  surveyorPersonId?: string;
  surveyCompanyId?: number;
  surveyCompanyName?: string;
  apprType?: string;
  appraisalNumber?: string;
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
  attributes?: Object;
  source?: string;
  surveyBatchId?: number;
  jpRenewal?: boolean;
  jpNew?: boolean;
  jpAdditional?: boolean;
  jpProgress?: boolean;
  jpOther?: boolean;
  surveyorArea?: number;

  // Nambah role
  divHeadId?: number;
  divHeadName?: string;
  divHeadPersonId?: string;
  deptHeadId?: number;
  deptHeadName?: string;
  deptHeadPersonId?: string;
  unitHeadId?: number;
  unitHeadName?: string;
  unitHeadPersonId?: string;
  teamLeadId?: number;
  teamLeadName?: string;
  teamLeadPersonId?: string;
  reportDate?: Date;
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
    public collateral?: ICollateral,
    public collateralTypeId?: number,
    public collateralTypeDescription?: string,
    public partyId?: number,
    public partyTypeId?: string,
    public surveyorId?: number,
    public surveyorName?: string,
    public surveyorPersonId?: string,
    public surveyCompanyId?: number,
    public surveyCompanyName?: string,
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
    public appraisalNumber?: string,
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
    public attributes?: Object,
    public source?: string,
    public surveyBatchId?: number,
    public jpRenewal?: boolean,
    public jpNew?: boolean,
    public jpAdditional?: boolean,
    public jpProgress?: boolean,
    public jpOther?: boolean,
    public surveyorArea?: number,

    // Nambah role
    public divHeadId?: number,
    public divHeadName?: string,
    public divHeadPersonId?: string,
    public deptHeadId?: number,
    public deptHeadName?: string,
    public deptHeadPersonId?: string,
    public unitHeadId?: number,
    public unitHeadName?: string,
    public unitHeadPersonId?: string,
    public teamLeadId?: number,
    public teamLeadName?: string,
    public teamLeadPersonId?: string,
	public reportDate?: Date
  ) {
    this.attributes = {};
    this.attributes['scoreCard'] = scoreCard;
    this.attributes['segmentProduct'] = '';
  }
}
