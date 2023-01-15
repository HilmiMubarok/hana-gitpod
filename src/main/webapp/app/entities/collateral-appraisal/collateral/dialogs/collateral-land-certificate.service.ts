import { Injectable } from '@angular/core';
import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CollateralLandCertificateService {
  public paramSource = new BehaviorSubject(null);

  public collateralCertificate: Object[];

  constructor() {}

  setparam(param: any[]) {
    this.collateralCertificate = param;
  }

  getparam() {
    return this.collateralCertificate;
  }
}
