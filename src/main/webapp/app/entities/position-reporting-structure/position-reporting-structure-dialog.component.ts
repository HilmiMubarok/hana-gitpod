import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IInternal } from '../internal/internal.model';
import { InternalService } from '../internal/internal.service';
import { IPosition } from '../position/position.model';
import { PositionService } from '../position/position.service';
import { IPositionReportingStructure } from './position-reporting-structure.model';
import { RelationTypeService } from '../relation-type/relation-type.service';
import { IRelationType } from '../relation-type/relation-type.model';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-position-reporting-structure-dialog',
  templateUrl: './position-reporting-structure-dialog.component.html',
})
export class PositionReportingStructureDialogComponent implements OnInit {
  public positionReportingStructure: IPositionReportingStructure;
  public internalFrom: IInternal[];
  public internalTo: IInternal[];
  public internalDelegation: IInternal[];
  public positionListFrom: IPosition[];
  public positionListTo: IPosition[];
  public positionListDelegation: IPosition[];
  public relationTypes: IRelationType[];
  private LOS_REL = 'LOS_REL';
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      positionReportingStructure: IPositionReportingStructure;
    },
    private _dialog: MatDialogRef<PositionReportingStructureDialogComponent>,
    protected internalService: InternalService,
    protected positionService: PositionService,
    protected relationTypeService: RelationTypeService
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.positionReportingStructure = this.data.positionReportingStructure;
    this.internalFrom = [];
    this.internalTo = [];
    this.internalDelegation = [];
    this.positionListFrom = [];
    this.positionListTo = [];
    this.positionListDelegation = [];
    this.relationTypes = [];
  }
  ngOnInit(): void {
    this.loadInternal();
    this.checkInitialData();
    this.loadRelationType();
  }

  private checkInitialData(): void {
    if (this.positionReportingStructure.positionFromInternalId) {
      this.selectInternal(this.positionReportingStructure.positionFromInternalId, 'from');
    }

    if (this.positionReportingStructure.positionToInternalId) {
      this.selectInternal(this.positionReportingStructure.positionToInternalId, 'to');
    }

    if (this.positionReportingStructure.positionDelegationToInternalId) {
      this.selectInternal(this.positionReportingStructure.positionDelegationToInternalId, 'delegation');
    }
  }

  public selectInternal(val: string, target: string): void {
    this.positionService
      .queryFilterBy({
        page: 0,
        size: 9999,
        idInternal: val,
      })
      .subscribe(res => {
        if (target === 'from') {
          this.positionListFrom = res.body;
        } else if (target === 'to') {
          this.positionListTo = res.body;
        } else if (target === 'delegation') {
          this.positionListDelegation = res.body;
        }
      });
  }

  private loadInternal(): void {
    this.internalService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.internalFrom = res.body;
        this.internalTo = res.body;
        this.internalDelegation = res.body;
      });
  }

  public save(): void {
    this._dialog.close(this.positionReportingStructure);
  }

  private async loadRelationType(): Promise<void> {
    const predicate: object = {
      idParent: this.LOS_REL,
      page: 0,
      size: 9999,
    };
    this.relationTypes = (await firstValueFrom(this.relationTypeService.queryFilterBy(predicate))).body;
  }
  previousState(): void {
    window.history.back();
  }
  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
