import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventManager } from 'app/core/util/event-manager.service';
import { CollateralProperty, ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import lodash from 'lodash';
import { CollateralAppraisalService } from '../collateral-appraisal.service';
import { CollateralMachineDialogComponent } from './dialogs/collateral-machine-dialog.component';
import { STATUS } from 'app/shared/constants/status.constants';
import { ICollateralAppraisal } from '../collateral-appraisal.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
@Component({
  selector: 'jhi-collateral-appraisal-process-detail-mesin',
  templateUrl: './collateral-appraisal-process-detail-mesin.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-mesin.css'],
})
export class CollateralAppraisalDetailProcessMesinComponent implements OnChanges {
  @Input()
  public collateralId: number;

  @Input()
  public collateralAppraisalId: number;
  @Input()
  public collateralAppraisal: ICollateralAppraisal;
  public displayColumns: string[] = ['no', 'machineName', 'documentType', 'noDocument', 'date', 'from', 'amount', 'action'];
  public items: ICollateralProperty[];
  public account: Account;
  // public hideordisable: boolean;
  // public hiddenRmAdmin: boolean;
  public hiddenRmAdmin: boolean;
  constructor(
    public dialog: MatDialog,
    private collateralPropertyService: CollateralPropertyService,
    private eventManager: EventManager,
    private collateralAppraisalService: CollateralAppraisalService,
    private accountService: AccountService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateralId'] && changes['collateralAppraisalId']) {
      this.getData();
    }
    this.checkLogin();
    this.hiddenTombol();
    // console.log('hiddenAdmin', this.hiddenRmAdmin);
  }

  private getData(): void {
    this.collateralPropertyService
      .queryFilterBy({ idCollateral: this.collateralId, page: 0, size: 9999, idPropertyType: CollateralPropertyType.MACHINE })
      .subscribe(res => {
        this.items = res.body;
        this.collateralAppraisalService.totalDataDetailMachine = res.body;
      });
  }

  public collateralProperties(collateralId: number): void {
    this.collateralPropertyService
      .queryFilterBy({ idCollateral: collateralId, page: 0, size: 9999, idPropertyType: CollateralPropertyType.MACHINE })
      .subscribe(res => {
        this.collateralAppraisalService.totalDataDetailMachine = res.body;
      });
  }

  public openDialog(property: ICollateralProperty = null): void {
    const predicate = {
      width: '80vw',
    };

    // init variable collateralproperty
    if (property) {
      predicate['data'] = { collateralProperty: property, collateralAppraisal: this.collateralAppraisal };
    } else {
      const colProp: ICollateralProperty = new CollateralProperty();
      colProp.collateralId = this.collateralId;
      colProp.propertyType = CollateralPropertyType.MACHINE;
      predicate['data'] = { collateralProperty: colProp, collateralAppraisal: this.collateralAppraisal };
    }

    const dialogRef = this.dialog.open(CollateralMachineDialogComponent, predicate);

    dialogRef.afterClosed().subscribe(res => {
      this.getData();
    });
  }

  public deleteMchine(element): void {
    this.collateralPropertyService.delete(element.id).subscribe(() => {
      this.getData();
    });
  }
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
