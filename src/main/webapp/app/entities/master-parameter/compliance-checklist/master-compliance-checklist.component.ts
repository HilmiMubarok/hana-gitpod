import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { IMasterComplianceChecklist, MasterComplianceChecklist } from './master-compliance-checklist.model';
import { Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterComplianceChecklistService } from './master-compliance-checklist.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MasterComplianceChecklistDialogComponent } from './master-compliance-checklist-dialog.component';
import { ComplianceChecklistCriteriaService } from './compliance-checklist-criteria/compliance-checklist-criteria.service';
import {
  ComplianceChecklistCriteria,
  IComplianceChecklistCriteria,
} from './compliance-checklist-criteria/compliance-checklist-criteria.model';
import { ComplianceChecklistCriteriaDialogAddComponent } from './compliance-checklist-criteria/compliance-checklist-criteria-dialog.component';

@Component({
  selector: 'jhi-master-compliance-checklist',
  templateUrl: './master-compliance-checklist.component.html',
  styleUrls: ['./master-compliance-checklist.css'],
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
export class MasterComplianceChecklistComponent extends AbstractEntityMaterialComponent<IMasterComplianceChecklist> implements OnInit {
  public displayedColumns: string[] = ['no', 'regulationName', 'status', 'action'];
  public displayColumns: string[] = ['noCriteria', 'criteria', 'status', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];

  public typeID: string;
  public regId: number;
  public selectedReg: IMasterComplianceChecklist;
  private _dataSourceCriteria: IComplianceChecklistCriteria[];
  private _regulationParam: IMasterComplianceChecklist;

  @Input()
  get masterComplianceParam() {
    return this._regulationParam;
  }
  set masterComplianceParam(param: IMasterComplianceChecklist) {
    this._regulationParam = param;
  }

  @Input()
  get dataSourceCriteria() {
    return this._dataSourceCriteria;
  }
  set dataSourceCriteria(param: IComplianceChecklistCriteria[]) {
    this._dataSourceCriteria = param;
  }

  constructor(
    protected _snackbar: MatSnackBar,
    protected masterComplianceChecklistService: MasterComplianceChecklistService,
    protected complianceChecklistCriteriaService: ComplianceChecklistCriteriaService,
    protected dialog: MatDialog
  ) {
    super(_snackbar, masterComplianceChecklistService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }

  ngOnInit(): void {
    this.loadAll();
  }
  private loadAll(): void {
    this.masterComplianceChecklistService
      .queryFilterBy({
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id', 'asc'],
      })
      .subscribe({
        next: (res: HttpResponse<IMasterComplianceChecklist[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public openDialog(element: IMasterComplianceChecklist = null): void {
    let predicate: IMasterComplianceChecklist;
    predicate = new MasterComplianceChecklist();

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MasterComplianceChecklistDialogComponent, {
      width: '100%',
      data: {
        masterComplianceCheklist: predicate,
      },
    });
    dialogRef.afterClosed().subscribe((res: IMasterComplianceChecklist) => {
      if (res) {
        if (res.id) {
          this.masterComplianceChecklistService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.masterComplianceChecklistService.create(res).subscribe(_res => {
            this.loadAll();
          });
        }
      }
    });
  }

  //  Grid Collateral Propose Pricingthis.
  public expandData(param: IMasterComplianceChecklist): void {
    this.selectedReg = param;
    this.complianceChecklistCriteriaService
      .filterTableData({
        regId: param.id,
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id', 'asc'],
      })
      .subscribe(res => {
        this.dataSourceCriteria = res.body;
      });
  }

  // Add Criteria
  public openDialogAddCriteria(element: IComplianceChecklistCriteria = null): void {
    let predicate: IComplianceChecklistCriteria;
    predicate = new ComplianceChecklistCriteria();

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(ComplianceChecklistCriteriaDialogAddComponent, {
      width: '100%',
      data: {
        complianceChecklistCriteria: predicate,
        dataRegulationCompliance: this.selectedReg,
      },
    });
    dialogRef.afterClosed().subscribe((res: IComplianceChecklistCriteria) => {
      if (res) {
        if (res.id) {
          this.complianceChecklistCriteriaService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.complianceChecklistCriteriaService.create(res).subscribe(_res => {
            this.loadAll();
          });
        }
      }
    });
  }

  // Edit Criteria
  public openDialogEditCriteria(element: IComplianceChecklistCriteria = null, view: string): void {
    let predicate: IComplianceChecklistCriteria;
    predicate = new ComplianceChecklistCriteria();

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(ComplianceChecklistCriteriaDialogAddComponent, {
      width: '100%',
      data: {
        complianceChecklistCriteria: predicate,
        dataRegulationCompliance: this.selectedReg,
        mode: view,
      },
    });
    dialogRef.afterClosed().subscribe((res: IComplianceChecklistCriteria) => {
      if (res) {
        if (res.id) {
          this.complianceChecklistCriteriaService.update(res).subscribe(_res => {
            this.loadAll();
          });
        }
      }
    });
  }

  previousState(): void {
    window.history.back();
  }
}
