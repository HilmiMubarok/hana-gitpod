import { IProcessTask } from 'app/shared/model/process-task.model';
import { Cif, ICif } from 'app/entities/cif/cif.model';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from '../collateral/collateral.model';
import { ApplicationRole, IApplicationRole } from '../application-role/application-role.model';
import { scoreCard } from '../collateral-appraisal/negative/score-card.constant';
import { IPerson } from '../person/person.model';
import { IPartyGroup } from '../party-group/party-group.model';

export interface ISurveyAppraisals {
  id?: number;
  appraisalNumber?: string;
  fromDate?: Date;
  thruDate?: Date;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  applicationId?: number;
  collateralId?: number;
  partyId?: string;
  partyTypeId?: string;
  surveyorId?: string;
  surveyorName?: string;
  apprType?: string;
  kjppNo?: string;
  branch?: string;
  reviewerTeam?: string;
  apprOfficer?: string;
  apprDate?: Date;
  collObj?: string;
  landSizeVal?: number;
  landVarketVal?: number;
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
  source?: string;
  sourcePhone?: string;
  sourceTitle?: string;
  compNotes?: string;
  compVehMerk?: string;
  compVehType?: string;
  collApprId?: string;
  negCriteria?: string;
  negConsType?: boolean;
  totalPlafond?: number;
  tglJatuhTempo?: Date;
  collateralTypeId?: string;
  collateralTypeDescription?: string;
  jpRenewal?: boolean;
  jpNew?: boolean;
  jpAdditional?: boolean;
  jpProgress?: boolean;
  jpOther?: boolean;
  facilityType?: string;
  objectType?: string;
  cif?: ICif;
  properties?: ICollateralProperty[];
  tasks?: IProcessTask[];
  collaterals?: ICollateral[];
  attributes?: any;
  surveyorArea?: string;
  rm?: IApplicationRole;
  prospectPerson?: IPerson;
  prospectOrganization?: IPartyGroup;
}

export class SurveyAppraisals implements ISurveyAppraisals {
  constructor(
    public id?: number,
    public appraisalNumber?: string,
    public fromDate?: Date,
    public thruDate?: Date,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public applicationId?: number,
    public collateralId?: number,
    public partyId?: string,
    public partyTypeId?: string,
    public surveyorId?: string,
    public surveyorName?: string,
    public apprType?: string,
    public kjppNo?: string,
    public branch?: string,
    public reviewerTeam?: string,
    public apprOfficer?: string,
    public apprDate?: Date,
    public collObj?: string,
    public landSizeVal?: number,
    public landVarketVal?: number,
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
    public source?: string,
    public sourcePhone?: string,
    public sourceTitle?: string,
    public compNotes?: string,
    public compVehMerk?: string,
    public compVehType?: string,
    public collApprId?: string,
    public negCriteria?: string,
    public negConsType?: boolean,
    public totalPlafond?: number,
    public tglJatuhTempo?: Date,
    public collateralTypeId?: string,
    public collateralTypeDescription?: string,
    public jpRenewal?: boolean,
    public jpNew?: boolean,
    public jpAdditional?: boolean,
    public jpProgress?: boolean,
    public jpOther?: boolean,
    public facilityType?: string,
    public objectType?: string,
    public cif?: ICif,
    public properties?: ICollateralProperty[],
    public tasks?: IProcessTask[],
    public collaterals?: ICollateral[],
    public attributes?: any,
    public rm?: IApplicationRole,
    public surveyorArea?: string,
    public prospectPerson?: IPerson,
    public prospectOrganization?: IPartyGroup
  ) {
    this.cif = new Cif();
    this.rm = new ApplicationRole();
    this.attributes = {};
    this.attributes['scoreCard'] = scoreCard;
    this.attributes['segmentProduct'] = '';
  }
}
