import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { CollateralProperty, ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CollateralBuildingDetailDialogComponent } from './dialogs/collateral-building-detail-dialog.component';
import lodash from 'lodash';
import { CollateralBuildingFloorDialogComponent } from './dialogs/collateral-building-floor-dialog.component';
import { CollateralLandDialogComponent } from './dialogs/collateral-land-dialog.component';
import { CollateralAttribute, ICollateral } from 'app/entities/collateral/collateral.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { STATUS } from 'app/shared/constants/status.constants';
import { ICollateralAppraisal } from '../collateral-appraisal.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
@Component({
  selector: 'jhi-collateral-appraisal-process-detail-real-estate',
  templateUrl: './collateral-appraisal-process-detail-real-estate.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-real-estate.css'],
})
export class CollateralAppraisalDetailProcessRealEstateComponent implements OnChanges {
  private _collateral: ICollateral;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }
  @Input()
  public collateralAppraisal: ICollateralAppraisal;

  @Input()
  public collateralAppraisalId: number;

  @Output() actionSelectionMenuProperty = new EventEmitter<string>();

  public totalLandArea: Number = 0;
  public displayedColumns: string[] = ['no', 'buildingSpec', 'floors', 'physicalArea', 'action'];
  public account: Account;
  public hiddenRmAdmin: boolean;

  public items: ICollateralProperty[] = new Array<ICollateralProperty>();
  public selectedMenuId = 'land-condition';
  public menuItems: MenuItemModel[] = [
    {
      id: 'certificate-info',
      text: 'Certificate Info',
    },
    {
      id: 'land-condition',
      text: 'Land Condition',
    },
    {
      id: 'building-condition',
      text: 'Building Condition',
    },
  ];

  public animationSettings = {
    effect: 'Zoom',
    duration: 400,
    delay: 0,
  };

  constructor(
    public dialog: MatDialog,
    private collateralPropertyService: CollateralPropertyService,
    private accountService: AccountService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral'] && changes['collateralAppraisalId']) {
      this.getData();
      this.setAttribute();
      this.actionSelectionMenuProperty.emit(this.selectedMenuId);
    }

    this.checkLogin();
    this.hiddenTombol();
  }

  private setAttribute(): void {
    if (this.selectedMenuId === 'building-condition') {
      if (!lodash.has(this.collateral.attributes, 'buildingFacElectricity')) {
        const attr: object = this.collateral.attributes;
        this.collateral.attributes = lodash.merge({}, attr, new CollateralAttribute());
      }
    }
  }

  private getData(): void {
    if (this.selectedMenuId === 'building-condition') {
      this.collateralPropertyService
        .queryFilterBy({
          idCollateral: this.collateral.id,
          size: 9999,
          idPropertyType: CollateralPropertyType.BUILDING,
        })
        .subscribe(res => {
          this.items = res.body;
        });
    }
  }

  public openDialogBuilding(property: ICollateralProperty = null): void {
    const predicate = {
      width: '80vw',
    };

    // init variable collateralproperty
    if (property) {
      predicate['data'] = {
        collateralProperty: property,
        collateralAppraisal: this.collateralAppraisal,
      };
    } else {
      const colProp: ICollateralProperty = new CollateralProperty();
      colProp.collateralId = this.collateral.id;
      colProp.propertyType = CollateralPropertyType.BUILDING;
      colProp.attributes = {
        floors: [],
      };
      predicate['data'] = {
        collateralProperty: colProp,
        collateralAppraisal: this.collateralAppraisal,
      };
    }

    const dialogRef = this.dialog.open(CollateralBuildingDetailDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
      }
    });
  }

  public openDialogFloor(data: ICollateralProperty): void {
    const dialogRef = this.dialog.open(CollateralBuildingFloorDialogComponent, {
      width: '80vw',
      data: {
        collateralProperty: data,
        collateralAppraisal: this.collateralAppraisal,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
      }
    });
  }

  public countTotalArea(data: string): Number {
    let total: number;
    total = 0;

    if (data) {
      const _data = JSON.parse(data);
      if (_data.length > 0) {
        for (let i = 0; i < _data.length; i++) {
          total = total + parseInt(_data[i]['area'], 10);
        }
      }
    }

    return total;
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.items = new Array<ICollateralProperty>();
    this.selectedMenuId = args.item.id;
    this.getData();
    this.actionSelectionMenuProperty.emit(this.selectedMenuId);
  }

  public deleteBuilding(element) {
    this.collateralPropertyService.delete(element.id).subscribe(() => {
      this.getData();
    });
  }

  public deleteLand(element) {
    this.collateralPropertyService.delete(element.id).subscribe(() => {
      this.getData();
    });
  }

  public changeBuildingFacility(event: MatCheckboxChange, facilityType: string): void {
    const value: boolean = event.checked;
    if (facilityType === 'electricity') {
      this.collateral.attributes['buildingFacElectricity'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'telephone') {
      this.collateral.attributes['buildingFacTelephone'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'ac') {
      this.collateral.attributes['buildingFacAc'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'wh') {
      this.collateral.attributes['buildingFacWaterHeater'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'pam') {
      this.collateral.attributes['buildingFacCleanWater'] = value === true ? 'yes' : 'no';
    }

    console.log('xxx', this.collateral);
  }
  public print() {
    console.log(this.items);
  }
  gakbisa() {
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
