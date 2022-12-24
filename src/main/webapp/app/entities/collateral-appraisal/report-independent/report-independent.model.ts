export interface IReportIndependent {
  tujuanPenilian?: String;
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
  apprReportNum?: String;
  apprDate?: Date;
  reviewedBy?: String;
}

export class ReportIndependent implements IReportIndependent {
  constructor(
    public tujuanPenilian?: string,
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
    public apprReportNum?: string,
    public apprDate?: Date,
    public reviewedBy?: String
  ) {}
}
