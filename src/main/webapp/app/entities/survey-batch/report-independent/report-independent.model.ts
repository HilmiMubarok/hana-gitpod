export interface IReportIndependent {
  // Land
  totalLuasLandFisik?: number;
  appraisalValueLandPerMeter?: number;
  totalAppraisalValueLandFisik?: number;
  appraisalLiquidationLand?: number;
  totalLuasLandImb?: number;
  appraisalValueImbLandPerMeter?: number;
  totalAppraisalValueLandImb?: number;
  totalLuasLandTataKota?: number;
  appraisalValueTataKotaLandPerMeter?: number;
  totalAppraisalValueLandTataKota?: number;

  // Building
  totalLuasBuildingFisik?: number;
  appraisalValueBuildingPerMeter?: number;
  totalAppraisalValueBuildingFisik?: number;
  appraisalLiquidationBuilding?: number;
  totalLuasBuildingImb?: number;
  appraisalValueImbBuildingPerMeter?: number;
  totalAppraisalValueBuildingImb?: number;
  totalLuasBuildingTataKota?: number;
  appraisalValueTataKotaBuildingPerMeter?: number;
  totalAppraisalValueBuildingTataKota?: number;

  totalMarketValueLandBuilding?: number;
  totalLiquidationValueLandBuilding?: number;
  totalMarketValueImbLandBuilding?: number;
  totalMarketValueTataKotaLandBuilding?: number;

  tujuanPenilaian?: string;
  adequacy?: string;
  quantity?: string;
  remark?: string;
  reportDate?: Date;
  appraisalNumber?: string;
  apprDate?: Date;
  reviewedBy?: string;
  reviewOpinion?: string;
  kjppNo?: string;
}

export class ReportIndependent implements IReportIndependent {
  constructor(
    // Land
    public totalLuasLandFisik?: number,
    public appraisalValueLandPerMeter?: number,
    public totalAppraisalValueLandFisik?: number,
    public appraisalLiquidationLand?: number,
    public totalLuasLandImb?: number,
    public appraisalValueImbLandPerMeter?: number,
    public totalAppraisalValueLandImb?: number,
    public totalLuasLandTataKota?: number,
    public appraisalValueTataKotaLandPerMeter?: number,
    public totalAppraisalValueLandTataKota?: number,

    // Building
    public totalLuasBuildingFisik?: number,
    public appraisalValueBuildingPerMeter?: number,
    public totalAppraisalValueBuildingFisik?: number,
    public appraisalLiquidationBuilding?: number,
    public totalLuasBuildingImb?: number,
    public appraisalValueImbBuildingPerMeter?: number,
    public totalAppraisalValueBuildingImb?: number,
    public totalLuasBuildingTataKota?: number,
    public appraisalValueTataKotaBuildingPerMeter?: number,
    public totalAppraisalValueBuildingTataKota?: number,

    public totalMarketValueLandBuilding?: number,
    public totalLiquidationValueLandBuilding?: number,
    public totalMarketValueImbLandBuilding?: number,
    public totalMarketValueTataKotaLandBuilding?: number,

    public tujuanPenilaian?: string,
    public adequacy?: string,
    public quantity?: string,
    public remark?: string,
    public reportDate?: Date,
    public appraisalNumber?: string,
    public apprDate?: Date,
    public reviewedBy?: string,
    public reviewOpinion?: string,
    public kjppNo?: string
  ) {}
}
