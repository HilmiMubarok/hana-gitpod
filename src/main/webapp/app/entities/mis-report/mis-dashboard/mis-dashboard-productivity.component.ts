import { Component, OnInit } from '@angular/core';
import { MisDashboardService } from './mis-dashboard.service';
import { map } from 'rxjs';
@Component({
    selector: 'jhi-mis-dashboard-productivity',
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
          <td mat-cell *matCellDef="let element">{{ element.totalStaffNeeds }}</td>
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
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
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

      .mat-header-row {
        background-color: #9DCAC7;
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
      }

      .mat-row:nth-child(2n+1) {
        background-color: #C5E5E3;
      }
    `,
    ],
})
export class MisDashboardProductivityComponent implements OnInit {
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

    dataSource

    constructor(private dashboardService: MisDashboardService) { }

    ngOnInit() {
        this.dataSource = this._processData();
        const filterId = ['STAFF_LOAN_OPS', 'SLA_STANDARD_LOAN_OPS']
        this.dashboardService.getSlaStandart()
            .pipe(
                map(res => res.filter(e => filterId.includes(e.id)))
            )
            .subscribe(data => console.log(data));
    }

    _processData() {
        const applicationTypes = ['New', 'Additional / Top Up', 'Renewal', 'Restructure', 'Existing', 'To Be Released', 'Existing', 'To Be Released'];
        return applicationTypes.map(applicationType => ({
            applicationType,
            aveTrxMonth: 300,
            aveInDay: 13.63636364,
            slaStandard: 120,
            staffNeeds: '-',
            totalStaffNeeds: '-',
            existing: '-',
            shortOver: '-',
        }))
    }
}
