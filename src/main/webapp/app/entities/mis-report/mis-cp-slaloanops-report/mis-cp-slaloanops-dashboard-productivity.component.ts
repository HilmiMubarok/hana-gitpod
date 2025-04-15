import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { map } from 'rxjs';
import { MisDashboardService } from '../mis-dashboard/mis-dashboard.service';
import { MisCpSlaloanopsProductivityService } from './mis-cp-slaloanops-productivity.service';

@Component({
  selector: 'jhi-mis-cp-slaloanops-dashboard-productivity',
  template: `
    <div class="mat-elevation-z8 table-container">
      <table mat-table [dataSource]="dataSource" class="application-table">
        <ng-container matColumnDef="applicationType">
          <th mat-header-cell *matHeaderCellDef>Application Type</th>
          <td mat-cell *matCellDef="let element">{{ element.applicationType }}</td>
        </ng-container>

        <ng-container matColumnDef="aveTrxMonth">
          <th mat-header-cell *matHeaderCellDef>Ave Trx/Month</th>
          <td mat-cell *matCellDef="let element">{{ element.aveTrxMonth }}</td>
        </ng-container>

        <ng-container matColumnDef="aveInDay">
          <th mat-header-cell *matHeaderCellDef>Ave in day</th>
          <td mat-cell *matCellDef="let element">{{ element.aveInDay }}</td>
        </ng-container>

        <ng-container matColumnDef="slaStandard">
          <th mat-header-cell *matHeaderCellDef>SLA Standard</th>
          <td mat-cell *matCellDef="let element">{{ element.slaStandard }}</td>
        </ng-container>

        <ng-container matColumnDef="staffNeeds">
          <th mat-header-cell *matHeaderCellDef>Staff Needs</th>
          <td mat-cell *matCellDef="let element">{{ element.staffNeeds }}</td>
        </ng-container>

        <ng-container matColumnDef="totalStaffNeeds">
          <th mat-header-cell *matHeaderCellDef>Total Staff Needs</th>
          <td
            mat-cell
            *matCellDef="let element; let i = index"
            [attr.rowspan]="getRowspan(i, 'totalStaffNeeds')"
            [style.display]="shouldHideCell(i, 'totalStaffNeeds') ? 'none' : ''"
          >
            {{ element.totalStaffNeeds }}
          </td>
        </ng-container>

        <ng-container matColumnDef="existing">
          <th mat-header-cell *matHeaderCellDef>Existing</th>
          <td mat-cell *matCellDef="let element">{{ element.existing }}</td>
        </ng-container>

        <ng-container matColumnDef="shortOver">
          <th mat-header-cell *matHeaderCellDef>Short/Over</th>
          <td mat-cell *matCellDef="let element">{{ element.shortOver }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns; let i = index"></tr>
      </table>
    </div>
  `,
  styles: [
    `
      .table-container {
        width: 100%;
        overflow-x: auto;
      }

      .application-table {
        width: 100%;
        background-color: white;
      }

      .mat-row {
        background-color: white;
      }

      .mat-header-cell {
        color: #333;
        font-weight: bold;
        padding: 12px 8px;
      }

      .mat-cell {
        padding: 12px 8px;
        border: 1px solid #e1e1e1;
      }

      .total-staff-needs-cell {
        border-top: none;
        border-bottom: none;
        position: relative;
        text-align: center;
        padding: 0 !important;
      }

      .total-staff-needs-cell:first-of-type {
        border-top: 1px solid rgba(0, 0, 0, 0.12);
        position: relative;
        height: 100%;
      }

      .total-staff-needs-cell:last-of-type {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }

      .total-staff-needs-content {
        position: absolute;
        top: 400%;
        left: 0;
        width: 100%;
        transform: translateY(-50%);
        z-index: 1;
      }

      .total-staff-needs-cell:first-of-type::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 800%;
        background-color: inherit;
        z-index: -1;
      }

      td[rowspan] {
        vertical-align: middle;
        text-align: center;
      }
    `,
  ],
})
export class MisCpSlaloanopsDashboardProductivityComponent implements OnInit, OnChanges {
  displayedColumns: string[] = [
    'applicationType',
    'aveTrxMonth',
    'aveInDay',
    'slaStandard',
    'staffNeeds',
    'totalStaffNeeds',
    'existing',
    'shortOver',
  ];

  dataSource = this.productivityService.processedRowsObservable$;
  totalRows = 0;
  mergedCellContent = '';
  @Input() data;

  private latestStandard: number | null = null;
  private latestStaff: number | null = null;
  private latestData: any = null;

  constructor(private dashboardService: MisDashboardService, private productivityService: MisCpSlaloanopsProductivityService) {}

  ngOnInit() {
    const filterId = ['STAFF_LOANOPS', 'SLA_STANDARD_LOANOPS'];
    this.dashboardService
      .getSlaStandart()
      .pipe(
        map(res => res.filter(e => filterId.includes(e.id))),
        map(res => {
          const { standard, staff } = res.reduce(
            (acc, curr) => {
              if (curr.id === 'SLA_STANDARD_LOANOPS') {
                acc.standard = Number(curr.value);
              } else if (curr.id === 'STAFF_LOANOPS') {
                acc.staff = Number(curr.value);
              }
              return acc;
            },
            { standard: null, staff: null }
          );
          return {
            standard,
            staff,
          };
        })
      )
      .subscribe(({ standard, staff }) => {
        this.latestStandard = standard;
        this.latestStaff = staff;
        this.tryProcessFacilityData();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.data = changes.data?.currentValue;
    this.latestData = this.data || [];
    this.tryProcessFacilityData();
  }

  private tryProcessFacilityData() {
    if (
      this.latestStandard !== null &&
      this.latestStaff !== null &&
      this.latestStandard !== 0 &&
      this.latestStaff !== 0 &&
      this.latestData
    ) {
      this.productivityService.processFacilityData(this.latestData, this.latestStandard, this.latestStaff);
    }
  }

  shouldHideCell(rowIndex: number, columnName: string): boolean {
    if (columnName === 'totalStaffNeeds' && rowIndex > 0) {
      return true;
    }
    return false;
  }

  getRowspan(rowIndex: number, columnName: string): number {
    if (rowIndex === 0 && columnName === 'totalStaffNeeds') {
      return this.totalRows;
    }
    return 1;
  }
}
