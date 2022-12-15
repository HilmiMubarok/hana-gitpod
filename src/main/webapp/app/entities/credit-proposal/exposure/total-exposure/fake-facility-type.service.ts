import { Injectable } from '@angular/core';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import _ from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FakeFacilityService {
  constructor() {}

  // CashLoan: ['WCI', 'DL', 'MML', 'FL', 'IL', 'OD'],
  // NonCahsLoan: ['BG', 'LC'],

  public WciIds = ['030100001001', '030100001002', '030190001001'];
  public BgIds = [
    '030900001001',
    '030900002001',
    '030900003001',
    '030900004001',
    '030900005001',
    '030900006001',
    '030900007001',
    '030990001001',
    '030990002001',
    '030990003001',
    '030990004001',
    '030990005001',
    '030990006001',
    '030990007001',
  ];
  public DlIds = [
    '030100002001',
    '030100002002',
    '030100004001',
    '030100005001',
    '030100005002',
    '030190002001',
    '030190004001',
    '030190005001',
    '030190005002',
  ];
  public FlIds = ['030100003001', '030100003002', '030190003001', '030200002001', '030290002001'];
  public IlIds = ['030200001001', '030200001002', '030290001001', 'M154220011'];
  public MmlIds = ['030100002003'];
  public OdIds = [
    '010100001001',
    '010100001002',
    '010100001003',
    '010100001004',
    '010100001005',
    '010100001007',
    '010100001010',
    '010100001011',
    '010180001001',
    '010180001002',
    '010190001001',
    '010190001002',
    '010190001003',
  ];

  getFacilityType(Id) {
    // cash loan
    if (
      this.WciIds.includes(Id) ||
      this.DlIds.includes(Id) ||
      this.MmlIds.includes(Id) ||
      this.FlIds.includes(Id) ||
      this.IlIds.includes(Id) ||
      this.OdIds.includes(Id)
    ) {
      return 'Cash Loan';
    } else if (this.BgIds.includes(Id)) {
      return 'Non Cash Loan';
    } else {
      return 'Facility Type Undefined';
    }
  }
}
