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
  reportDate?: String;
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
    public reportDate?: string
  ) {}
}
