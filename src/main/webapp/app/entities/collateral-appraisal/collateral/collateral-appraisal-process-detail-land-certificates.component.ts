import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CollateralAttribute,
  CollateralLandAttribute,
  ICollateral,
  ICollateralLandAttribute,
} from 'app/entities/collateral/collateral.model';
import { CollateralLandDialogComponent } from './dialogs/collateral-land-dialog.component';
import lodash from 'lodash';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { STATUS } from 'app/shared/constants/status.constants';
import { ICollateralAppraisal } from '../collateral-appraisal.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { CollateralLandCertificateService } from './dialogs/collateral-land-certificate.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-land-certificates',
  templateUrl: './collateral-appraisal-process-detail-land-certificates.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-real-estate.css'],
})
export class CollateralAppraisalDetailProcessLandCertificatesComponent implements OnChanges, OnInit {
  public displayedColumnsLand: string[] = [
    'no',
    'certificateNo',
    'certificateName',
    'issueDate',
    'dueDate',
    'suratUkurNum',
    'landArea',
    'action',
  ];
  @Input() public collateralAppraisal: ICollateralAppraisal;
  private _collateral: ICollateral;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  public totalCountAreaLand: number;
  public certificates: ICollateralLandAttribute[];
  public certoy: ICollateralLandAttribute[];
  public account: Account;
  public hiddenRmAdmin: boolean;
  constructor(
    private dialog: MatDialog,
    private collateralService: CollateralService,
    private accountService: AccountService,
    private collateralLandCertificateService: CollateralLandCertificateService
  ) {
    this.certificates = [];
  }
  ngOnInit(): void {
    this.cekData();
    console.log(this.collateralAppraisal);
    this.checkLogin();
    this.hiddenTombol();

    if (this.collateral.publicFacilities === null || this.collateral.truncatedArea === null) {
      if (this.collateral.publicFacilities === null) {
        this.collateral.publicFacilities = 0;
      }
      if (this.collateral.truncatedArea === null) {
        this.collateral.truncatedArea = 0;
      }
    }
  }

  public cekData() {
    if (typeof this.collateral.attributes['landCertificates'] === 'string') {
      let data = '';
      let i = 0;
      while (typeof data === 'string') {
        data = JSON.parse(this.collateral.attributes['landCertificates']);
        console.log(data, 'parse ke', i);
        i++;
        if (i > 1000) {
          this.collateral.attributes['landCertificates'] = [];
          this.certificates = this.collateral.attributes['landCertificates'];
          break;
        } else if (typeof data !== 'string') {
          if (JSON.parse(this.collateral.attributes['landCertificates']).length > 0) {
            this.certificates = data;
          } else {
            this.collateral.attributes['landCertificates'] = [];
            this.certificates = this.collateral.attributes['landCertificates'];
          }
        }
      }
    } else if (
      typeof this.collateral.attributes['landCertificates'] !== 'string' &&
      typeof this.collateral.attributes['landCertificates'] === 'object'
    ) {
      console.log(this.collateral.attributes['landCertificates']);
      this.certificates = this.collateral.attributes['landCertificates'];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral']) {
      const attr: object =
        typeof this.collateral.attributes === 'string' ? JSON.parse(this.collateral.attributes) : this.collateral.attributes;
      this.certificates = attr['landCertificates'];

      this.totalCountAreaLand = 0;
      this.getTotalArea();
    }
  }

  public countTotalLandArea(val1: number | 0, val2: number | 0, val3: number | 0): number {
    return val3 - val2 - val1;
  }

  public getTotalArea() {
    this.totalCountAreaLand = 0;
    if (this.certificates?.length > 0) {
      for (let j = 0; j < this.certificates.length; j++) {
        if (this.certificates.length !== undefined) {
          this.totalCountAreaLand = this.totalCountAreaLand + Number(this.certificates[j].certArea);
        }
      }
    }
    return this.totalCountAreaLand;
  }

  public openDialog(element: ICollateralLandAttribute = null): void {
    let predicate: ICollateralLandAttribute;

    predicate = new CollateralLandAttribute();

    if (element) {
      predicate = element;
    }

    if (!this.collateral.attributes) {
      this.collateral.attributes = new CollateralAttribute();
    } else {
      if (!lodash.has(this.collateral.attributes, 'landCertificates')) {
        this.collateral.attributes['landCertificates'] = new Array<ICollateralLandAttribute>();
      } else {
        if (typeof this.collateral.attributes['landCertificates'] === 'string') {
          if (this.collateral.attributes['landCertificates'] === '') {
            this.collateral.attributes['landCertificates'] = '[]';
            this.collateral.attributes['landCertificates'] = JSON.parse(this.collateral.attributes['landCertificates']);
          } else {
            this.collateral.attributes['landCertificates'] = JSON.parse(this.collateral.attributes['landCertificates']);
          }
        }
      }
    }

    const dialogRef = this.dialog.open(CollateralLandDialogComponent, {
      width: '80vw',
      data: {
        collateralAppraisal: this.collateralAppraisal,
        collateralLandAttribute: predicate,
        collateral: this.collateral,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collateral.attributes['landCertificates'] = lodash.cloneDeep(result.attributes['landCertificates']);
        this.certificates = lodash.cloneDeep(result.attributes['landCertificates']);
        this.collateralLandCertificateService.setparam(this.certificates);
        console.log('ini hasil log', this.certificates);
        this.getTotalArea();
      }
    });
  }
  // Delete Confirmation
  public delete(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Certificate',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const copyCertificates: ICollateralLandAttribute[] = lodash.clone(this.certificates);
        const idx: number = lodash.findIndex(copyCertificates, function (o: ICollateralLandAttribute) {
          return o.id === element.id;
        });

        if (idx > -1) {
          copyCertificates.splice(idx, 1);
        }
        this.certificates = lodash.cloneDeep(copyCertificates);
        this.collateral.attributes['landCertificates'] = lodash.cloneDeep(copyCertificates);
        if (this.collateral.attributes['landCertificates'].length < 1) {
          this.collateral.attributes['landCertificates'] = '';
        }
        this.getTotalArea();
        // this.collateralService.update(this.collateral);
      }
    });
  }

  // public delete(element: ICollateralLandAttribute): void {
  //   const copyCertificates: ICollateralLandAttribute[] = lodash.clone(this.certificates);
  //   const idx: number = lodash.findIndex(copyCertificates, function (o: ICollateralLandAttribute) {
  //     return o.id === element.id;
  //   });

  //   if (idx > -1) {
  //     copyCertificates.splice(idx, 1);
  //   }
  //   this.certificates = lodash.cloneDeep(copyCertificates);
  //   this.collateral.attributes['landCertificates'] = lodash.cloneDeep(copyCertificates);
  //   if (this.collateral.attributes['landCertificates'].length < 1) {
  //     this.collateral.attributes['landCertificates'] = '';
  //   }
  //   this.getTotalArea();
  //   // this.collateralService.update(this.collateral);
  // }

  hideordisable() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
  }

  private hiddenTombol() {
    if (this.isRm() || this.isAdminAppraisal()) {
      if (this.account.authorities.length <= 2) {
        if (
          this.collateralAppraisal.statusId === STATUS.ASSIGNED ||
          this.collateralAppraisal.statusId === STATUS.RETURN_TO_OFFICER ||
          this.collateralAppraisal.statusId === STATUS.APPROVAL_TL ||
          this.collateralAppraisal.statusId === STATUS.VISITED ||
          this.collateralAppraisal.statusId === STATUS.APPROVAL_DEPT_HEAD ||
          this.collateralAppraisal.statusId === STATUS.APPROVAL_DH
        ) {
          this.hiddenRmAdmin = true;
        }
      }
    }
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      this.hiddenRmAdmin = true;
    }
  }

  private checkLogin() {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  public isRm(): any {
    return this.account.authorities.includes('ROLE_RM');
  }

  public isAdminAppraisal(): any {
    return this.account.authorities.includes('ROLE_ADMIN_APPRAISER');
  }
}
