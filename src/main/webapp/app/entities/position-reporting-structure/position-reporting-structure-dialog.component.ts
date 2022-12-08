import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IInternal } from '../internal/internal.model';
import { InternalService } from '../internal/internal.service';
import { IPosition } from '../position/position.model';
import { PositionService } from '../position/position.service';
import { IPositionReportingStructure } from './position-reporting-structure.model';

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
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      positionReportingStructure: IPositionReportingStructure;
    },
    private _dialog: MatDialogRef<PositionReportingStructureDialogComponent>,
    protected internalService: InternalService,
    protected positionService: PositionService
  ) {
    this.positionReportingStructure = this.data.positionReportingStructure;
    this.internalFrom = [];
    this.internalTo = [];
    this.internalDelegation = [];
    this.positionListFrom = [];
    this.positionListTo = [];
    this.positionListDelegation = [];
  }
  ngOnInit(): void {
    this.loadInternal();
    this.checkInitialData();
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
}
