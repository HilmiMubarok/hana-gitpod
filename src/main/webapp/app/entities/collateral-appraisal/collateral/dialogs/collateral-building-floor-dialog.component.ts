import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CollateralProperty, ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { Floor, IFloor } from './dialog.model';
import lodash from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { clippingParents } from '@popperjs/core';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-collateral-building-floor-dialog',
  templateUrl: './collateral-building-floor-dialog.component.html',
  styleUrls: ['./collateral-dialog.css'],
})
export class CollateralBuildingFloorDialogComponent implements OnInit {
  public floor: IFloor = new Floor();
  public floors: any = new MatTableDataSource<object[]>();
  public collateralProp: ICollateralProperty = new CollateralProperty();
  public displayedColumns: string[] = ['no', 'floor', 'area', 'action'];
  collateralAppraisal: ICollateralAppraisal;

  public account: Account;
  public hiddenRmAdmin: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
      collateralAppraisal: ICollateralAppraisal;
    },
    private _snackBar: MatSnackBar,
    private _dialog: MatDialogRef<CollateralBuildingFloorDialogComponent>,
    private collateralPropertyService: CollateralPropertyService,
    private accountService: AccountService
  ) {
    this.collateralProp = this.data.collateralProperty;
    this.floor.area = 0;
    this.floor.floor = 1;
    this.collateralAppraisal = this.data.collateralAppraisal;
  }

  ngOnInit(): void {
    this.floors.data = JSON.parse(this.collateralProp.attributes['floors']);
    this.checkLogin();
    this.hiddenTombol();
  }

  public addFloor(): void {
    const floorNumber: number = this.floor.floor;
    const exist: object = lodash.find(this.floors.data, function (o) {
      return o['floor'] === floorNumber;
    });

    if (exist) {
      this._snackBar.open('This floor already exist', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
    } else {
      if (!this.floor.floor) {
        this._snackBar.open('Masukkan Floor Terlebih Dahulu', null, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
        });
        return;
      }
      if (!this.floor.area) {
        this._snackBar.open('Masukkan Area Terlebih Dahulu', null, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
        });
        return;
      }
      const _floors: object[] = this.floors.data;
      const _floor: IFloor = Object.assign({}, this.floor);
      _floors.push(_floor);

      this.floors.data = _floors;
    }
  }

  public deleteFloor(data): void {
    const deletedItem = this.floors.data.filter(item => item.floor !== data.floor);
    this.floors.data = deletedItem;
  }
  public close(): void {
    this._dialog.close(this.collateralProp);
  }
  public save(): void {
    this.collateralProp.attributes['floors'] = this.floors.data;
    this.collateralProp.attributes['floors'] = JSON.stringify(this.collateralProp.attributes['floors']);
    if (this.collateralProp.id) {
      // update
      this.collateralPropertyService.update(this.collateralProp).subscribe(res => {
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.collateralPropertyService.create(this.collateralProp).subscribe(res => {
        this._dialog.close(res.body);
      });
    }
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
