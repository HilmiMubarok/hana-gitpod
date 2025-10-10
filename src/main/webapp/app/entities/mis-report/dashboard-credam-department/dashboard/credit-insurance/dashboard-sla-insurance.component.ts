import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MisCpSlaloanopsProductivityService } from 'app/entities/mis-report/mis-cp-slaloanops-report/mis-cp-slaloanops-productivity.service';
import { DashboardData } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.model';
import { MisDashboardService } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-mis-dashboard-credit-insurance',
  template: `
    <jhi-mis-dashboard-card title="SERVICE LEVEL AGREEMENT" [content]="statistic"></jhi-mis-dashboard-card>
    <div class="d-flex flex-row-reverse">
      <div class="form-container">
        <mat-form-field [formGroup]="dateForm" appearance="outline">
          <mat-label>Select Month</mat-label>
          <input matInput formControlName="date" [matDatepicker]="picker" />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker startView="year"></mat-datepicker>
        </mat-form-field>
      </div>
    </div>
    <jhi-mis-dashboard-card title="BY TRANSACTION" [content]="transaction"></jhi-mis-dashboard-card>
    <jhi-mis-dashboard-card title="BY USER CREDIT INSURANCE" [content]="user"></jhi-mis-dashboard-card>
    <jhi-mis-dashboard-card title="PRODUCTIVITY" [content]="productivity"></jhi-mis-dashboard-card>

    <ng-template #statistic>
      <div class="row">
        <ng-container *ngFor="let data of chartStatisticData">
          <div class="col-md-3 my-2">
            <jhi-mis-dashboard-card-statistic [title]="data.statusDescription" [count]="data.total"></jhi-mis-dashboard-card-statistic>
          </div>
        </ng-container>
      </div>
    </ng-template>
    <ng-template #transaction>
      <jhi-mis-dashboard-bar-chart
        [legendPosition]="'top'"
        [data]="chartData"
        [date]="dateForm.get('date')?.value"
        title="Credit Insurance"
      ></jhi-mis-dashboard-bar-chart>
    </ng-template>
    <ng-template #user>
      <jhi-mis-dashboard-bar-chart
        [legendPosition]="'top'"
        type="user"
        [data]="chartUserData"
        [date]="dateForm.get('date')?.value"
      ></jhi-mis-dashboard-bar-chart>
    </ng-template>
    <ng-template #productivity>
      <h3 class="productivity-title">Productivity Credit Insurance</h3>
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
          <ng-container *matCellDef="let element">
            <td *ngIf="element.rowSpan > 0" mat-cell [attr.rowspan]="element.rowSpan">
              {{ element.existing }}
            </td>
          </ng-container>
        </ng-container>

        <ng-container matColumnDef="shortOver">
          <th mat-header-cell *matHeaderCellDef>Short/Over</th>
          <ng-container *matCellDef="let element">
            <td *ngIf="element.rowSpan > 0" mat-cell [attr.rowspan]="element.rowSpan">
              {{ element.shortOver }}
            </td>
          </ng-container>
        </ng-container>

        <thead>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        </thead>
        <tbody>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </tbody>
      </table>
    </ng-template>
  `,
  styles: [
    `
      .form-controls {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      .productivity-title {
        text-align: center;
        font-weight: bold;
        color: #257e79;
        font-size: 1.2rem;
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
        border-right: 1px solid #e0e0e0;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-aveTrx {
        width: 32px;
        border-right: 1px solid #e0e0e0;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-aveInDay {
        width: 32px;
        border-right: 1px solid #e0e0e0;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-slaStandard {
        width: 32px;
        border-right: 1px solid #e0e0e0;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-staffNeeds {
        width: 32px;
        border-right: 1px solid #e0e0e0;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-totalStaffNeeds {
        width: 32px;
        border-right: 1px solid #e0e0e0;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-existing {
        width: 32px;
        border-right: 1px solid #e0e0e0;
        padding-right: 24px;
        text-align: center;
      }

      .mat-column-shortOver {
        width: 32px;
        border-right: 1px solid #e0e0e0;
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

  constructor(
    private dashboardService: MisDashboardService,
    public messageService: MessageService,
    private productivityService: MisCpSlaloanopsProductivityService
  ) {
    this.initializeForm();
  }

  chartStatisticData;
  chartUserData;
  statuses = ['INSURANCE_CHECKING', 'INSURANCE_REVIEW', 'INSURANCE_COMPLETE'];

  ngOnInit(): void {
    // const positionTypeIds = this.getLocStor('POSO');
    // this._fetchAllData(this.dateForm.get('date')?.value);
    // this.getExisting(positionTypeIds);
    this.getSlaStandardData();
  }

  private getLocStor(cookieName: string): string | null {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }

  getExisting(positionTypeIds: string): void {
    this.productivityService.getExisting(positionTypeIds).subscribe({
      next: res => {
        this.existingValue = Array.isArray(res) ? res.length : 0;

        this._fetchAllData(this.dateForm.get('date')?.value);
      },
      error: err => {
        console.error('[getExisting] Error:', err);
        this.existingValue = 0;
        this._fetchAllData(this.dateForm.get('date')?.value);
      },
    });
  }

  public slaStandardValue = 0;
  public existingValue = 0;

  public getSlaStandardData(): void {
    this.dashboardService.getSlaStandart().subscribe({
      next: res => {
        const slaStandardInsurance = res.find((item: any) => item.id === 'SLA_STANDARD_INSURANCE');
        this.slaStandardValue = slaStandardInsurance ? slaStandardInsurance.value : 0;

        const positionTypeIds = 'LOAN_OPS_OFFICER';
        this.getExisting(positionTypeIds);

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

    return total / 3;
  }

  public aveInDay(chartData: DashboardData[], applicationType: string): number {
    const rawAverage = this.calculateAveTrx(chartData, applicationType) / 22;
    return Math.ceil(rawAverage);
  }

  private roundToDecimals(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.ceil(value * factor) / factor;
  }

  public staffNeeds(applicationType: string): number {
    const slaStandard = parseFloat(this.slaStandardValue?.toString() || '0') || 0;
    const aveInDay = this.aveInDay(this.chartData, applicationType);
    const rawNeeds = (slaStandard * aveInDay) / 420;
    const rounded = this.roundToDecimals(rawNeeds, 2);
    const finalResult = Math.ceil(rounded);

    return finalResult;
  }

  public getShortOver(data: any[]): number {
    const totalStaffNeeds = data.reduce((sum, row) => sum + (Number(row.staffNeeds) || 0), 0);
    const existing = parseFloat(this.existingValue?.toString() || '0') || 0;
    return totalStaffNeeds - existing;
  }

  public totalStaffNeeds(data: any[]): number {
    return data.reduce((sum, row) => sum + (Number(row.staffNeeds) || 0), 0);
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
  }

  _fetchAllData(date): void {
    const positionId = this.getLocStor('POS');
    this.dashboardService.getStatisticLoanOps(positionId).subscribe(res => {
      const filteredData = res?.filter(d => this.statuses.includes(d.statusId)) || [];
      this.chartStatisticData = filteredData;

      if (this.chartStatisticData.length > 0) {
        this.chartStatisticData.sort((a, b) => this.statuses.indexOf(a.statusId) - this.statuses.indexOf(b.statusId));
      }
    });

    this.dashboardService.getBarChartData(date, 'insurance').subscribe(res => {
      const data = [...res].reverse();
      this.chartData = data;
      this.processChartData();
    });

    this.dashboardService.getBarChartData(date, 'by-insurance').subscribe(res => {
      const data = [...res].reverse();
      this.chartUserData = data;
    });
  }

  public getChartData(): void {
    this.dateForm.valueChanges.subscribe(value => {
      const formattedDate = value.date?.format('YYYY-MM-DD');
      this._fetchAllData(formattedDate);
    });
  }

  private processChartData(): void {
    if (this.chartData?.length && this.existingValue !== undefined) {
      const processedData = ['Active', 'Existing', 'New', 'To Be Released'].map(applicationType => {
        const aveTrx = this.calculateAveTrx(this.chartData, applicationType);
        const aveInDay = this.aveInDay(this.chartData, applicationType);
        const slaStandard = this.slaStandardValue;
        const staffNeeds = this.staffNeeds(applicationType);

        return {
          applicationType,
          aveTrx,
          aveInDay,
          slaStandard,
          staffNeeds,
        };
      });

      const totalStaffNeedsValue = this.totalStaffNeeds(processedData);
      const shortOver = parseFloat(this.existingValue?.toString() || '0') - totalStaffNeedsValue;

      this.dataSource = this.calculateRowSpan(
        processedData.map(row => ({
          ...row,
          existing: this.existingValue,
          shortOver,
          totalStaffNeeds: totalStaffNeedsValue,
        }))
      );
    }
  }
}
