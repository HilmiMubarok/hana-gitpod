import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { PARAMETER_TYPE } from 'app/shared/constants/base.constants';
import { GeneralParameter, IGeneralParameter } from '../general-parameter/general-parameter.model';
import { GeneralParameterService } from '../general-parameter/general-parameter.service';
import { MasterLovParameterDialogComponent } from './master-lov-parameter-dialog.component';

@Component({
  selector: 'jhi-master-lov-parameter',
  templateUrl: './master-lov-parameter.component.html',
  styleUrls: ['./master-lov-parameter.css'],
})
export class MasterLovParameterComponent extends AbstractEntityMaterialComponent<IGeneralParameter> implements OnInit {
  public displayColumns: string[] = ['no', 'code', 'value', 'status', 'action'];
  public listGeneralLov;
  public typeID: string;
  private paramType: any;
  public conditionButton: boolean;
  constructor(protected _snackbar: MatSnackBar, protected generalParameterService: GeneralParameterService, protected dialog: MatDialog) {
    super(_snackbar, generalParameterService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.items = [];
  }

  ngOnInit(): void {
    this.loadAll();
    this.getListType();
    this.test();
  }

  public getListType() {
    this.generalParameterService
      .getListTypeGeneral({
        page: 0,
        size: 9999,
        sort: ['desc'],
      })
      .subscribe(res => {
        this.listGeneralLov = res.body;
      });
  }

  public onSelect(element: any): void {
    this.items = [];
    this.page = 0;
    this.paramType = element;
    this.loadAll();
    this.paginator.firstPage();
    // Condition Select Show Button
    if (this.paramType === 'CREDIT_RATING' || this.paramType === 'PROPOSAL_TYPE') {
      this.conditionButton = true;
    } else {
      this.conditionButton = false;
    }
  }

  private loadAll(): void {
    this.generalParameterService.setPrameterType(this.paramType);
    const data = this.generalParameterService.paramTypeId.subscribe((message: any) => {
      this.typeID = message;
      this.generalParameterService
        .queryFilterBy({
          idParameterType: this.typeID,
          page: this.page,
          size: this.itemsPerPage,
          sort: ['code', 'asc'],
        })
        .subscribe({
          next: res => this.initDataForMatTable(res, res.headers),
          error: res => this.onError(res.message),
        });
    });
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public openDialog(element: IGeneralParameter = null): void {
    let predicate: IGeneralParameter;
    predicate = new GeneralParameter();
    const data = this.generalParameterService.paramTypeId.subscribe((message: any) => {
      this.typeID = message;
    });
    predicate.parameterTypeId = this.typeID;

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MasterLovParameterDialogComponent, {
      width: '100%',
      data: {
        generalParameter: predicate,
      },
    });
    dialogRef.afterClosed().subscribe((res: IGeneralParameter) => {
      if (res) {
        if (res.id) {
          this.generalParameterService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.generalParameterService.create(res).subscribe(_res => {
            this.loadAll();
          });
        }
      }
    });
  }

  public openDialogEdit(element: IGeneralParameter = null, view: string): void {
    let predicate: IGeneralParameter;
    predicate = new GeneralParameter();
    const data = this.generalParameterService.paramTypeId.subscribe((message: any) => {
      this.typeID = message;
    });
    predicate.parameterTypeId = this.typeID;

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MasterLovParameterDialogComponent, {
      width: '100%',
      data: {
        generalParameter: predicate,
        mode: view,
      },
    });
    dialogRef.afterClosed().subscribe((res: IGeneralParameter) => {
      if (res) {
        if (res.id) {
          this.generalParameterService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.generalParameterService.create(res).subscribe(_res => {
            this.loadAll();
          });
        }
      }
    });
  }
  previousState(): void {
    window.history.back();
  }

  public test() {
    console.log('zzz', this.listGeneralLov);
    console.log('parem', this.paramType);
  }
}
