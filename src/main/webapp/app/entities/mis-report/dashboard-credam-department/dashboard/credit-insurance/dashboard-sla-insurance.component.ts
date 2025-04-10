import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DashboardData } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.model';
import { MisDashboardService } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-mis-dashboard-credit-insurance',
  template: `
    <jhi-mis-dashboard-card title="SERVICE LEVEL AGREEMENT">
      <jhi-mis-dashboard-card-statistic></jhi-mis-dashboard-card-statistic>
    </jhi-mis-dashboard-card>

    <jhi-mis-dashboard-card title="BY TRANSACTION">
      <div class="form-controls">
        <mat-form-field [formGroup]="dateForm" appearance="outline">
          <mat-label>Select Month</mat-label>
          <input matInput formControlName="date" [matDatepicker]="picker" />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker startView="year"></mat-datepicker>
        </mat-form-field>
      </div>
      <jhi-mis-dashboard-bar-chart
        [legendPosition]="'top'"
        [data]="chartData"
        [date]="dateForm.get('date')?.value"
        title="Credit Admin"
      ></jhi-mis-dashboard-bar-chart>
    </jhi-mis-dashboard-card>

    <!-- <jhi-mis-dashboard-card title="BY User Credit Insurance">
      <div class="form-controls">
        <mat-form-field [formGroup]="dateForm" appearance="outline">
          <mat-label>Select Month</mat-label>
          <input matInput formControlName="dateUserInsurance" [matDatepicker]="picker" />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker startView="year"></mat-datepicker>
        </mat-form-field>
      </div>
      <jhi-mis-dashboard-bar-chart
        [legendPosition]="'top'"
        [data]="chartData"
        [date]="dateForm.get('dateUserInsurance')?.value"
        title="Credit Admin"
      ></jhi-mis-dashboard-bar-chart>
    </jhi-mis-dashboard-card> -->

    <jhi-mis-dashboard-card title="PRODUCTIVITY">
      <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">
        <ng-container matColumnDef="applicationType">
          <th mat-header-cell *matHeaderCellDef>Application Type</th>
          <td mat-cell *matCellDef="let element">{{ element.applicationType }}</td>
        </ng-container>

        <ng-container matColumnDef="aveTrx">
          <th mat-header-cell *matHeaderCellDef>Ave Trx/Month</th>
          <td mat-cell *matCellDef="let element">{{ element.aveTrx }}</td>
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
          <ng-container *matCellDef="let element">
            <td *ngIf="element.rowSpan > 0" mat-cell [attr.rowspan]="element.rowSpan">
              {{ element.totalStaffNeeds }}
            </td>
          </ng-container>
        </ng-container>

        <ng-container matColumnDef="existing">
          <th mat-header-cell *matHeaderCellDef>Existing</th>
          <td mat-cell *matCellDef="let element">{{ element.existing }}</td>
        </ng-container>

        <ng-container matColumnDef="shortOver">
          <th mat-header-cell *matHeaderCellDef>Short/Over</th>
          <td mat-cell *matCellDef="let element">{{ element.shortOver }}</td>
        </ng-container>

        <thead>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        </thead>
        <tbody>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </tbody>
      </table>
    </jhi-mis-dashboard-card>
  `,
  styles: [
    `
      .form-controls {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      :host ::ng-deep .mat-mdc-form-field {
        width: 140px;
        margin-bottom: -1.25em;
      }

      :host ::ng-deep .mat-mdc-form-field-wrapper {
        padding-bottom: 0;
      }

      :host ::ng-deep .mat-form-field-wrapper {
        padding: 0 !important;
      }

      :host ::ng-deep .mat-mdc-text-field-wrapper {
        background-color: white !important;
        border-radius: 4px;
      }

      :host ::ng-deep .mdc-text-field--outlined {
        --mdc-outlined-text-field-container-height: 36px;
      }

      :host ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th {
        background-color: #a9d6c6;
        font-weight: bold;
        text-align: left;
      }

      td,
      th {
        padding: 12px;
        border-bottom: 1px solid #ddd;
      }

      // css grid
      .mat-column-applicationType {
        width: 32px;
        border-right: 1px solid currentColor;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-aveTrx {
        width: 32px;
        border-right: 1px solid currentColor;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-aveInDay {
        width: 32px;
        border-right: 1px solid currentColor;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-slaStandard {
        width: 32px;
        border-right: 1px solid currentColor;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-staffNeeds {
        width: 32px;
        border-right: 1px solid currentColor;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-totalStaffNeeds {
        width: 32px;
        border-right: 1px solid currentColor;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-existing {
        width: 32px;
        border-right: 1px solid currentColor;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-shortOver {
        width: 32px;
        border-right: 1px solid currentColor;
        padding-right: 24px;
        text-align: center;
      }
    `,
  ],
})
export class MisDashboardInsuranceComponent implements OnInit {
  dateForm: FormGroup;
  dateUserInsurance: FormGroup;
  chartData: DashboardData[] = [];
  // chartDataUserInsurance: DashboardData[] = [];
  displayedColumns: string[] = [
    'applicationType',
    'aveTrx',
    'aveInDay',
    'slaStandard',
    'staffNeeds',
    'totalStaffNeeds',
    'existing',
    'shortOver',
  ];

  chartDatas: any[] = [];

  dataSource: any[] = [];

  constructor(private dashboardService: MisDashboardService, public messageService: MessageService) {
    this.initializeForm();

    this.dateForm.valueChanges.subscribe(value => {
      this.dashboardService.getBarChartData(value.date.format('YYYY-MM-DD')).subscribe(res => {
        this.chartData = res;
      });
      this.getChartData();
    });
  }

  ngOnInit(): void {
    this.dashboardService.getBarChartData(this.dateForm.get('date')?.value).subscribe(res => {
      this.chartData = res;

      const applicationTypes = ['Active', 'Existing', 'New', 'To Be Released'];

      const averages = applicationTypes.map(type => ({
        type,
        average: this.calculateAveTrx(this.chartData, type),
      }));
    });

    this.slaStandart();
    this.existing();
  }

  public slaStandardValue = 0;

  public slaStandart(): void {
    this.dashboardService.getSlaStandart().subscribe({
      next: res => {
        const slaStandardInsurance = res.find((item: any) => item.id === 'SLA_STANDARD_INSURANCE');
        this.slaStandardValue = slaStandardInsurance ? slaStandardInsurance.value : 0;

        this.getChartData();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get SLA Standard',
        });
      },
    });
  }

  public existingValue = 0;

  existing() {
    this.dashboardService.getSlaStandart().subscribe({
      next: res => {
        const slaStandardInsurance = res.find((item: any) => item.id === 'STAFF_INSURANCE');
        this.existingValue = slaStandardInsurance ? slaStandardInsurance.value : '0';
        // this.getChartData();
      },
    });
  }

  public calculateAveTrx(chartData: DashboardData[], applicationType: string): number {
    if (!chartData || chartData.length === 0) {
      return 0;
    }

    const columnKey = {
      Active: 'activeCollateralStatus',
      Existing: 'existingCollateralStatus',
      New: 'newCollateralStatus',
      'To Be Released': 'toBeReleaseCollateralStatus',
    }[applicationType];

    if (!columnKey) {
      return 0;
    }

    let total = 0;

    for (let i = 0; i < chartData.length; i++) {
      const value = chartData[i][columnKey] ?? 0;
      total += value;
    }

    return total;
  }

  public aveInDay(chartData: DashboardData[], applicationType: string): number {
    return this.calculateAveTrx(chartData, applicationType) / 22;
  }

  public staffNeeds(applicationType: string): number {
    const slaStandard = parseFloat(this.slaStandardValue?.toString() || '0') || 0;

    const aveInDay = this.aveInDay(this.chartData, applicationType);

    return (slaStandard * aveInDay) / 420;
  }

  public getShortOver(applicationType: string): number {
    const staffNeeds = this.staffNeeds(applicationType);
    const existing = parseFloat(this.existingValue?.toString() || '0') || 0;

    return staffNeeds - existing;
  }

  public totalStaffNeeds(data: any[]): number {
    return data.reduce((sum, row) => sum + (Number(row.staffNeeds) || 0), 0);
  }

  public getChartData() {
    this.dateForm.valueChanges.subscribe(value => {
      const formattedDate = value.date?.format('YYYY-MM-DD');

      this.dashboardService.getBarChartData(formattedDate).subscribe(res => {
        this.chartData = res;

        const processedData = ['Active', 'Existing', 'New', 'To Be Released'].map(applicationType => {
          const aveTrx = this.calculateAveTrx(this.chartData, applicationType);
          const aveInDay = this.aveInDay(this.chartData, applicationType);
          const slaStandard = this.slaStandardValue;
          const staffNeeds = Number(this.staffNeeds(applicationType)).toFixed(2);
          const existing = this.existingValue;
          const shortOver = this.getShortOver(applicationType).toFixed(2);

          return {
            applicationType,
            aveTrx,
            aveInDay,
            slaStandard,
            staffNeeds,
            existing,
            shortOver,
          };
        });

        const totalStaffNeedsValue = this.totalStaffNeeds(processedData).toFixed(2);

        this.dataSource = this.calculateRowSpan(
          processedData.map(row => ({
            ...row,
            totalStaffNeeds: totalStaffNeedsValue,
          }))
        );
      });
    });
  }

  calculateRowSpan(data: any[]): any[] {
    const countMap: { [key: string]: number } = {};

    data.forEach(row => {
      if (row.totalStaffNeeds) {
        countMap[row.totalStaffNeeds] = (countMap[row.totalStaffNeeds] || 0) + 1;
      }
    });

    const processedRows: any[] = [];
    const addedTotalStaffNeeds: { [key: string]: boolean } = {};

    data.forEach(row => {
      if (row.totalStaffNeeds && !addedTotalStaffNeeds[row.totalStaffNeeds]) {
        row.rowSpan = countMap[row.totalStaffNeeds];
        addedTotalStaffNeeds[row.totalStaffNeeds] = true;
      } else {
        row.rowSpan = 0;
      }

      processedRows.push(row);
    });

    return processedRows;
  }

  private initializeForm() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    this.dateForm = new FormGroup({
      date: new FormControl(formattedDate),
    });
    // this.dateUserInsurance = new FormGroup({
    //   dateUserInsurance: new FormControl(formattedDate),
    // });
  }
}
