import { IProcessTask } from 'app/shared/model/process-task.model';
import { Cif, ICif } from 'app/entities/cif/cif.model';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from '../collateral/collateral.model';
import { ApplicationRole, IApplicationRole } from '../application-role/application-role.model';
// import { scoreCard } from '../collateral-appraisal/negative/score-card.constant';
import { IPerson } from '../person/person.model';
import { IPartyGroup } from '../party-group/party-group.model';
import { IPositions } from 'app/shared/integration/models/positions-page.model';

export interface ISurveyAppraisals {
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  id?: number;
  appraisalNumber?: string;
  fromDate?: Date;
  thruDate?: Date;
  reportDate?: Date;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  applicationId?: number;
  collateralId?: number;
  partyId?: string;
  partyTypeId?: string;
  surveyorId?: number;
  surveyorPersonId?: string;
  surveyorPositionId?: string;
  surveyorPositionInternalId?: string;
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
  jpReappraisal?: boolean;
  jpOther?: boolean;
  noteForRM?: string;
  facilityType?: string;
  objectType?: string;
  surveyCompanyId?: number;
  surveyCompanyName?: string;
  surveyBatchId?: number;
  latitude?: number;
  longitude?: number;
  totalMarketValue?: number;
  totalMarketValueIMB?: number;
  totalMarketValueTataKota?: number;
  totalLiquidationValue?: number;
  totalLiquidationValueIMB?: number;
  totalLiquidationValueTataKota?: number;
  cif?: ICif;
  properties?: ICollateralProperty[];
  tasks?: IProcessTask[];
  collateral?: ICollateral;
  attributes?: any;
  surveyorArea?: string;
  rm?: IApplicationRole;
  prospectPerson?: IPerson;
  prospectOrganization?: IPartyGroup;
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
  internalId?: string;
  ownerPosition?: IPositions;
}

export class SurveyAppraisals implements ISurveyAppraisals {
  constructor(
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
    public id?: number,
    public appraisalNumber?: string,
    public fromDate?: Date,
    public thruDate?: Date,
    public reportDate?: Date,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public applicationId?: number,
    public collateralId?: number,
    public partyId?: string,
    public partyTypeId?: string,
    public surveyorId?: number,
    public surveyorPersonId?: string,
    public surveyorPositionId?: string,
    public surveyorPositionInternalId?: string,
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
    public jpReappraisal?: boolean,
    public jpOther?: boolean,
    public noteForRM?: string,
    public facilityType?: string,
    public objectType?: string,
    public surveyCompanyId?: number,
    public surveyCompanyName?: string,
    public surveyBatchId?: number,
    public latitude?: number,
    public longitude?: number,
    public totalMarketValue?: number,
    public totalMarketValueIMB?: number,
    public totalLiquidationValue?: number,
    public cif?: ICif,
    public properties?: ICollateralProperty[],
    public tasks?: IProcessTask[],
    public collateral?: ICollateral,
    public attributes?: any,
    public rm?: IApplicationRole,
    public surveyorArea?: string,
    public prospectPerson?: IPerson,

    public prospectOrganization?: IPartyGroup,

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
    public internalId?: string
  ) {
    this.cif = new Cif();
    this.rm = new ApplicationRole();
    this.attributes = {};
    // this.attributes['scoreCard'] = scoreCard;
    this.attributes['segmentProduct'] = '';
  }
}
