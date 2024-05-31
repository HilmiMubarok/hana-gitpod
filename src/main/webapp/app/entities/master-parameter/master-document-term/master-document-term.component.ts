import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MasterDocumentTermService } from './master-document-term.service';
import { IMasterCompanyType } from '../master-company-type/master-company-type.model';
import { MasterDocumentTermDialogComponent } from './master-document-term-dialog.component';
import { MasterDocumentTerm, SchedulerType } from './master-document-term.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-master-document-term',
  template: `
    <div class="row remove-row-scroll">
      <div class="e-card">
        <div class="e-card-header">
          <div class="e-card-header-caption">
            <ejs-breadcrumb cssClass="margin: 1rem;">
              <e-breadcrumb-items>
                <e-breadcrumb-item iconCss="e-icons e-home" url="/"></e-breadcrumb-item>
                <e-breadcrumb-item text="Document Term" url="/master-document-term"> </e-breadcrumb-item>
              </e-breadcrumb-items>
            </ejs-breadcrumb>
            <div class="header-container">
              <div class="header-content">
                <img class="back-image" src="../../../content/images/back-icon.svg" (click)="previousState()" />
                <span class="back-prefix" (click)="previousState()">Back | </span>
              </div>
              <p class="e-card-sub-title">Document Term</p>
            </div>
          </div>
        </div>
        <mat-card style="margin: 1rem">
          <table mat-table [dataSource]="documentTerm" class="w-100">
            <ng-container matColumnDef="no">
              <th mat-header-cell *matHeaderCellDef width="5%" class="rounding-table-left grid-index-right">No</th>
              <td mat-cell *matCellDef="let element; let i = index" class="grid-index-right">{{ i + 1 }}.</td>
            </ng-container>

            <ng-container matColumnDef="reminderType">
              <th mat-header-cell *matHeaderCellDef class="grid-index-left">Reminder Type</th>
              <td mat-cell *matCellDef="let element" class="grid-index-left text-capitalize">{{ element.name }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="grid-index-left">Status</th>
              <td mat-cell *matCellDef="let element" class="grid-index-left text-capitalize">
                {{ element.statusId }}
              </td>
            </ng-container>

            <ng-container matColumnDef="action">
              <th mat-header-cell *matHeaderCellDef class="grid-index-left rounding-table-right">Action</th>
              <td mat-cell *matCellDef="let element" class="grid-index-left text-capitalize">
                <button mat-icon-button (click)="openDialog(element)">
                  <mat-icon>edit</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" [attr.colspan]="displayColumns.length">No records found.</td>
            </tr>
            <tr mat-header-row *matHeaderRowDef="displayColumns"></tr>
            <tr mat-row *matRowDef="let element; columns: displayColumns"></tr>
          </table>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['../master-company-type/master-company-type.css'],
})
export class MasterDocumentTermComponent implements OnInit {
  constructor(
    protected messageService: MessageService,
    protected masterDocumentTermService: MasterDocumentTermService,
    protected dialog: MatDialog
  ) {}

  public displayColumns: string[] = ['no', 'reminderType', 'status', 'action'];

  public documentTerm: MasterDocumentTerm;
  public schedulerTypes: SchedulerType;

  ngOnInit(): void {
    this.loadData();
    this.getSchedulerTypes();
  }

  getSchedulerTypes(): void {
    this.masterDocumentTermService.getSchedulerType().subscribe(res => {
      this.schedulerTypes = res.body;
    });
  }

  loadData(): void {
    this.masterDocumentTermService.getMasterDocumentTerm().subscribe(res => {
      this.documentTerm = res.body;
    });
  }

  public previousState(): void {
    window.history.back();
  }

  public openDialog(element: MasterDocumentTerm = null): void {
    let predicate: MasterDocumentTerm;

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MasterDocumentTermDialogComponent, {
      width: '100%',
      data: {
        documentTerm: predicate,
        schedulerTypes: this.schedulerTypes,
      },
    });
    dialogRef.afterClosed().subscribe((res: IMasterCompanyType) => {
      if (res) {
        this.loadData();
      }
    });
  }
}
