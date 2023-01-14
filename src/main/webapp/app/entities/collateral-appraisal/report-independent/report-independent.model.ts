export interface IReportIndependent {
  tujuanPenilaian?: String;
  totalLuasTanahFisik?: String;
  totalLuasBangunanFisik?: String;
  appraisalvalueImbTataKota?: String;
  totalLuasTanahImbTataKota?: String;
  totalLuasBangunanImbTataKota?: String;
  adequacy?: String;
  quantity?: String;
  marketValue?: Number;
  remark?: String;
  reportDate?: Date;
  appraisalNumber?: String;
  apprDate?: Date;
  reviewedBy?: String;
  reviewOpinion?: String;
  totalLiquidationValue?: Number;
}

export class ReportIndependent implements IReportIndependent {
  constructor(
    public tujuanPenilaian?: string,
    public totalLuasTanahFisik?: string,
    public totalLuasBangunanFisik?: string,
    public appraisalvalueImbTataKota?: string,
    public totalLuasTanahImbTataKota?: string,
    public totalLuasBangunanImbTataKota?: string,
    public adequacy?: string,
    public quantity?: string,
    public marketValue?: number,
    public remark?: string,
    public reportDate?: Date,
    public appraisalNumber?: string,
    public apprDate?: Date,
    public reviewedBy?: String,
    public reviewOpinion?: String,
    public totalLiquidationValue?: Number
  ) {}
}
