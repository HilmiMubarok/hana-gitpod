import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollateralPropertyMarketValueDialogComponent } from 'app/entities/collateral-property/collateral-property-market-value-dialog.component';
import { Collateral, CollateralAttribute, ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';

import lodash, { update } from 'lodash';
import { IPartyCif } from '../party-cif.model';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';

import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { APPLICATION_TYPE, COLLATERAL_TYPE, POSITION_TYPE } from 'app/shared/constants/base.constants';
import { CollateralPropertyResultListComponent } from 'app/entities/collateral-property/collateral-property-result-list.component';
import { PartyCifService } from '../party-cif.service';
import { PageEvent } from '@angular/material/paginator';
import { PositionService } from 'app/entities/position/position.service';
import { IPosition, Position } from 'app/entities/position/position.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { MessageService } from 'primeng/api';
import { PartyCifCollateralInfoDialogComponent } from '../collateral-info/collateral-info-dialog.component';
import { PartyCifCollateralInfoPropertyGeneralDialogComponent } from '../collateral-info/collateral-info-property-general-dialog.component';

@Component({
  selector: 'jhi-group-collateral-info',
  templateUrl: './group-collateral-info.component.html',
  styleUrls: ['./group-collateral-list.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({
          height: '0px',
          minHeight: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupCollateralInfoComponent extends AbstractEntityMaterialComponent<ICollateral> implements OnChanges, OnInit {
  private _collateralAppraisal: ICollateralAppraisal;
  public selectedCollateral: ICollateral;
  public document: boolean;
  public _partyCif: IPartyCif;
  public collateral: ICollateral | null;
  public segments: IInternal[];
  public regionals: IInternal[];
  public branchs: IInternal[];
  public internals: IInternal[];
  public positionRM: IPosition[];
  public positionRMS: IPosition;
  public rmSegment: IInternal;
  public rmRegional: IInternal;
  public rmBranch: IInternal;
  public rmPosition: IPosition;
  public positionRms1 = 0;
  public dataPush: ICollateral;
  @Input() public partyId: string;
  groupCollaterals: any;

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(items: IPartyCif) {
    this._partyCif = items;
  }

  @Input()
  get collateralAppraisal() {
    return this._collateralAppraisal;
  }

  set collateralAppraisal(items: ICollateralAppraisal) {
    this._collateralAppraisal = items;
  }

  get dataSource() {
    return this.items;
  }
  set dataSource(param: any) {
    this.items = param;
  }
  private _pariPasu: string;
  @Input()
  get pariPasu() {
    return this._pariPasu;
  }
  set pariPasu(data: string) {
    this._pariPasu = data;
  }

  public displayedColumns: string[] = ['no', 'collateralInfo', 'collateralType', 'address', 'status', 'actions'];

  constructor(
    protected positionService: PositionService,
    private internalService: InternalService,
    protected collateralService: CollateralService,
    protected _snackbar: MatSnackBar,
    protected dialog: MatDialog,
    protected collateralPropertyService: CollateralPropertyService,
    protected partyCifService: PartyCifService,
    protected messageService: MessageService
  ) {
    super(_snackbar, collateralService, messageService);

    this.selectedCollateral = null;
    this.itemsPerPage = 10;
    this.page = 0;
    this.entityKeyName = 'id';
    this.predicate = 'id';
    this.document = false;
    this.collateral = null;

    this.rmPosition = new Position();
    this.positionRMS = new Position();
    this.rmBranch = new Internal();
    this.rmRegional = new Internal();
    this.rmSegment = new Internal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyId']) {
      this.loadByPartyId(this.partyId);
    }
  }

  ngOnInit() {
    this.loadPositionRM();
  }

  private loadPositionRM(): void {
    const tempName = this.partyCif.rm.firstName;
    this.positionService.queryFilterBy({ idPositionType: POSITION_TYPE.RM, size: 9999, page: 0 }).subscribe(res => {
      this.positionRM = lodash.filter(res.body, function (o) {
        return o.partyId !== null;
      });

      this.positionRMS = lodash.find(res.body, function (o) {
        return o.employeeFirstName === tempName;
      });

      if (this.positionRMS?.partyId !== undefined || this.positionRMS?.partyId !== null) {
        this.positionRms1 = this.positionRMS?.id;
        this.loadInternalInformationRM(this.positionRMS?.partyId);
      }
    });
  }

  private findPositionByIdParty(partyId: string): Promise<IPosition> {
    return new Promise<IPosition>((resolve, reject) => {
      if (this.partyCif.id) {
        this.positionService.queryFilterBy({ idParty: partyId, size: 1, page: 0 }).subscribe(res => {
          if (res.body.length > 0) {
            this.rmPosition = res.body[0];

            resolve(this.rmPosition);
          } else {
            resolve(null);
          }
        });
      }
    });
  }

  private loadInternalInformationRM(partyId: string): void {
    this.branchs = [];
    this.segments = [];
    this.regionals = [];
    this.findPositionByIdParty(partyId).then((res: IPosition) => {
      if (res) {
        this.loadInternalById(res.internalId).then((res2: IInternal) => {
          if (res2.parentId) {
            this.rmBranch = res2;
            this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
              this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
                if (res4.parentId) {
                  this.rmRegional = res4;
                  this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
                    this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
                      this.rmSegment = res6;
                      this.loadSegment();
                    });
                  });
                }
              });
            });
          } else {
            if (!res2.parentId) {
              this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
                if (res4.parentId) {
                  this.rmRegional = res4;
                  this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
                    this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
                      this.rmSegment = res6;
                      this.loadSegment();
                    });
                  });
                }
              });
            }
          }
        });
      } else {
        if (!res) {
          this.branchs = [];
          this.segments = [];
          this.regionals = [];
        }
      }
    });
  }

  private loadSegment(): void {
    this.internalService.queryFilterBy({ idInternalType: APPLICATION_TYPE.BUSINESS_UNIT, size: 9999, page: 0 }).subscribe(res => {
      this.segments = res.body;
    });
  }

  private loadRegional(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.regionals = res.body;
        resolve();
      });
    });
  }

  private loadInternalById(internalId: string): Promise<IInternal> {
    return new Promise<IInternal>((resolve, reject) => {
      this.internalService.find(internalId).subscribe(res => {
        if (res.body) {
          resolve(res.body);
        } else {
          resolve(null);
        }
      });
    });
  }

  public selectRM(event: any): void {
    const value: string = event['value'];
    if (value) {
      const position: IPosition = lodash.find(this.positionRM, function (o) {
        return o.id === parseInt(value, 10);
      });
      this.partyCif.rm.id = position.partyId;
      this.loadInternalInformationRM(position.partyId);
    } else {
      this.partyCif.rm.id = null;
    }
  }

  private loadBranch(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.branchs = res.body;
        resolve();
      });
    });
  }

  public openDocument(element: any) {
    this.collateral = element;
  }

  public expandData(element: ICollateral): void {
    this.selectedCollateral = element;
  }

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        page: this.page,
        idParty: param,
        isActive: true,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .pipe(map(res => this.preLoad(res)))
      .subscribe({
        next: res => this.initDataForMatTable(res, res.headers),
        error: res => this.onError(res.message),
      });
  }

  preLoad(res: HttpResponse<ICollateral[]>): HttpResponse<ICollateral[]> {
    if (res.body) {
      for (let i = 0; i < res.body.length; i++) {
        const item: ICollateral = res.body[i];
        if (!item.attributes) {
          item.attributes = new CollateralAttribute();
        }
      }
    }
    return res;
  }

  public openDialogPropertyGeneral(element: ICollateral): void {
    const dialogRef = this.dialog.open(PartyCifCollateralInfoPropertyGeneralDialogComponent, {
      width: '80vw',
      data: { collateral: element, partyCif: this.partyCif, rmBranchId: this.rmBranch.id, pariPasu: this.pariPasu },
    });
    dialogRef.afterClosed().subscribe((res: ICollateralProperty[]) => {
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          const collateralProperty: ICollateralProperty = res[i];
          if (collateralProperty.id !== undefined) {
            this.collateralPropertyService.update(collateralProperty).subscribe(res34 => {
              this.findCollateralProperty(res34.body);
            });
          } else {
            this.collateralPropertyService.create(collateralProperty).subscribe(res2 => {
              this.createcollateralProperty(res2.body);
            });
          }
        }
        this.loadByPartyId(this.partyId);
      }
    });
  }

  private createcollateralProperty(collateralProperty: ICollateralProperty) {
    this.partyCif.collateralProperties.push(collateralProperty);
  }

  private findCollateralProperty(collateralProperty: ICollateralProperty) {
    const index = this.partyCif.collateralProperties.findIndex(obj => obj.id === collateralProperty.id);
    this.partyCif.collateralProperties[index] = collateralProperty;
  }

  public openDialogMarketValue(element: ICollateral): void {
    const dialogRef = this.dialog.open(CollateralPropertyMarketValueDialogComponent, {
      width: '100%',
      maxWidth: '95%',
      data: { collateral: element },
    });
    dialogRef.afterClosed().subscribe(res => {});
  }

  public showDetail(element: ICollateral = null): boolean {
    if (element) {
      if ([COLLATERAL_TYPE['realestate'], COLLATERAL_TYPE['vehicle'], COLLATERAL_TYPE['machine']].indexOf(element.collateralTypeId) > -1) {
        return true;
      }
    }

    return false;
  }

  public openDialog(element: ICollateral = null): void {
    let _collateral: ICollateral;
    _collateral = new Collateral();
    _collateral.attributes = new CollateralAttribute();
    _collateral.partyId = this.partyId;
    if (element) {
      _collateral = element;
    }
    const dialogRef = this.dialog.open(PartyCifCollateralInfoDialogComponent, {
      width: '80vw',
      data: { collateral: _collateral, collateralAppraisal: this.collateralAppraisal, partyCif: this.partyCif },
    });
    dialogRef.afterClosed().subscribe((res: ICollateral) => {
      if (res) {
        if (res.id) {
          this.collateralService.save(this.collateralService.preSaveConvert(res)).subscribe(res2 => {
            this.loadByPartyId(this.partyId);
            this.updateCollateral(res2.body);
          });
        } else {
          this.collateralService.create(this.collateralService.preSaveConvert(res)).subscribe(res2 => {
            this.loadByPartyId(this.partyId);
            this.pushCollateral(res2.body);
          });
        }
      } else {
        this.loadByPartyId(this.partyId);
      }
    });
  }

  private updateCollateral(res: ICollateral) {
    const index = this.partyCif.collaterals.findIndex(obj => obj.id === res.id);
    this.partyCif.collaterals[index] = res;
  }

  private pushCollateral(data: ICollateral) {
    this.collateralService
      .queryFilterBy({
        page: this.page,
        idParty: this.partyId,
        isActive: true,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe(resi => {
        this.dataPush = resi.body.find(obj => (obj.id = data.id));
        this.partyCif.collaterals.push(this.dataPush);

        this.collateralPropertyService
          .queryFilterBy({
            page: 0,
            idCollateral: data.id,
            idPropertyType: CollateralPropertyType.GENERAL,
            size: 10,
          })
          .subscribe(res => {
            const collProp: ICollateralProperty[] = res.body;
            if (collProp.length > 0) {
              for (let i = 0; i < collProp.length; i++) {
                const item: ICollateralProperty = collProp[i];
                this.partyCif.collateralProperties.push(item);
              }
            }
          });
      });
  }

  public openResult(element: ICollateral) {
    const dialogRef = this.dialog.open(CollateralPropertyResultListComponent, {
      width: '80vw',
      data: { collateral: element },
    });
  }

  private cifNumber: string;

  public syncHobis(): void {
    this.loading = true;
    this.cifNumber = this.partyCif?.customerNumber;
    this.partyCifService.syncCollateralHobis(this.cifNumber).subscribe(res => {
      if (res.status === 200) {
        this.dataSource = res.body.collaterals;

        this.partyCif.collaterals = res.body.collaterals;
        this.partyCif.collateralProperties = res.body.collateralProperties;

        this.loading = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Update Data From HOBIS Successful!',
        });
      } else if (res.status === 500) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Update Data From HOBIS Failed!',
        });
      } else if (res.status === 404) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data From HOBIS Not Found!',
        });
      }
    });
  }

  loadDataLazy(event?: PageEvent) {
    this.items = null;
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.postLoadDataLazy();
  }

  protected postLoadDataLazy(): void {
    this.loadByPartyId(this.partyId);
  }
}
