import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DashboardData } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.model';
import { MisDashboardService } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'jhi-mis-dashboard-credit-admin',
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
    <jhi-mis-dashboard-card title="BY USER CREDIT ADMIN" [content]="user"></jhi-mis-dashboard-card>
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
        title="Credit Admin"
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
            <td *ngIf="element.rowSpanTotal > 0" mat-cell [attr.rowspan]="element.rowSpanTotal">
              {{ element.totalStaffNeeds }}
            </td>
          </ng-container>
        </ng-container>

        <ng-container matColumnDef="existing">
          <th mat-header-cell *matHeaderCellDef>Existing</th>
          <ng-container *matCellDef="let element">
            <td *ngIf="element.rowSpanExisting > 0" mat-cell [attr.rowspan]="element.rowSpanExisting">
              {{ element.existing }}
            </td>
          </ng-container>
        </ng-container>

        <ng-container matColumnDef="shortOver">
          <th mat-header-cell *matHeaderCellDef>Short/Over</th>
          <ng-container *matCellDef="let element">
            <td *ngIf="element.rowSpanShortOver > 0" mat-cell [attr.rowspan]="element.rowSpanShortOver">
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
export class MisDashboardCredamComponent implements OnInit {
  dateForm: FormGroup;
  chartData: DashboardData[] = [];
  chartUserData: any;
  chartStatisticData: any;
  dataSource: any[] = [];
  slaStandardValue = 0;
  staffcredams = 0;

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

  statuses = ['DPPK_FINALIZE', 'DPPK_REVIEW'];

  constructor(private dashboardService: MisDashboardService, public messageService: MessageService) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this._fetchAllData(this.dateForm.get('date')?.value);
    this.loadSlaAndStaff();
  }

  private initializeForm(): void {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    this.dateForm = new FormGroup({
      date: new FormControl(formattedDate),
    });
  }

  private getLocStor(cookieName: string) {
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

  loadSlaAndStaff(): void {
    this.dashboardService.getSlaStandart().subscribe({
      next: res => {
        const slaStandard = res.find((item: any) => item.id === 'SLA_STANDARD_CREDAM');
        const staff = res.find((item: any) => item.id === 'STAFF_CREDAM');
        this.slaStandardValue = slaStandard ? slaStandard.value : 0;
        this.staffcredams = staff ? staff.value : 0;
        this.getChartData();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get SLA/Staff data',
        });
      },
    });
  }

  calculateAveTrx(chartData: DashboardData[], applicationType: string): number {
    const columnMap: { [key: string]: string } = {
      New: 'newFacility',
      'Additional / Top Up': 'additionalTopupFacility',
      Renewal: 'renewalFacility',
      Existing: 'existingFacility',
      Others: 'othersFacility',
      'Renewal + Additional': 'renewalAdditionalFacility',
      'Renewal + Decrease': 'renewalDecreaseFacility',
      Decrease: 'decreaseFacility',
      'Renewal + Others': 'renewalOthersFacility',
      'Additional + Others': 'additionalOthersFacility',
      'Decrease + Others': 'decreaseOthersFacility',
    };

    const columnKey = columnMap[applicationType];
    if (!columnKey || !chartData?.length) {
      return 0;
    }

    return chartData.reduce((sum, item) => sum + (item[columnKey] || 0), 0) / chartData.length;
  }

  aveInDay(chartData: DashboardData[], applicationType: string): number {
    return Math.ceil(this.calculateAveTrx(chartData, applicationType) / 22);
  }

  staffNeeds(applicationType: string): number {
    const sla = this.slaStandardValue;
    const ave = this.aveInDay(this.chartData, applicationType);
    return Math.ceil((sla * ave) / 420);
  }

  getShortOver(applicationType: string): number {
    return this.staffNeeds(applicationType) - this.staffcredams;
  }

  totalStaffNeeds(data: any[]): number {
    return data.reduce((sum, row) => sum + (Number(row.staffNeeds) || 0), 0);
  }

  calculateRowSpan(data: any[]): any[] {
    const totalMap: { [key: string]: number } = {};
    const existingMap: { [key: string]: number } = {};
    const shortOverMap: { [key: string]: number } = {};
    const addedTotal: { [key: string]: boolean } = {};
    const addedExisting: { [key: string]: boolean } = {};
    const addedShortOver: { [key: string]: boolean } = {};

    data.forEach(row => {
      totalMap[row.totalStaffNeeds] = (totalMap[row.totalStaffNeeds] || 0) + 1;
      existingMap[row.existing] = (existingMap[row.existing] || 0) + 1;
      shortOverMap[row.shortOver] = (shortOverMap[row.shortOver] || 0) + 1;
    });

    return data.map(row => {
      let rowSpanTotal = 0;
      let rowSpanExisting = 0;
      let rowSpanShortOver = 0;

      if (!addedTotal[row.totalStaffNeeds]) {
        rowSpanTotal = totalMap[row.totalStaffNeeds];
        addedTotal[row.totalStaffNeeds] = true;
      }

      if (!addedExisting[row.existing]) {
        rowSpanExisting = existingMap[row.existing];
        addedExisting[row.existing] = true;
      }

      if (!addedShortOver[row.shortOver]) {
        rowSpanShortOver = shortOverMap[row.shortOver];
        addedShortOver[row.shortOver] = true;
      }

      return {
        ...row,
        rowSpanTotal,
        rowSpanExisting,
        rowSpanShortOver,
      };
    });
  }

  getChartData(): void {
    this.dateForm.valueChanges.subscribe(value => {
      const formattedDate = value.date?.format('YYYY-MM-DD');
      this._fetchAllData(formattedDate);
    });
  }

  _fetchAllData(date: string): void {
    const positionId = this.getLocStor('POS');

    this.dashboardService
      .getStatisticLoanOps(positionId)
      .subscribe(res => (this.chartStatisticData = res.filter(d => this.statuses.includes(d.statusId))));

    this.dashboardService.getBarChartData(date, 'credit-admin').subscribe(res => {
      this.chartData = [...res].reverse();
      this.processChartData();
    });

    this.dashboardService.getBarChartData(date, 'by-user-credam').subscribe(res => {
      this.chartUserData = [...res].reverse();
    });
  }

  private processChartData(): void {
    if (!this.chartData?.length) {
      return;
    }

    const applicationTypes = [
      'New',
      'Additional / Top Up',
      'Renewal',
      'Existing',
      'Others',
      'Renewal + Additional',
      'Renewal + Decrease',
      'Decrease',
      'Renewal + Others',
      'Additional + Others',
      'Decrease + Others',
    ];

    const totalStaffNeedss = this.totalStaffNeeds(applicationTypes.map(type => ({ staffNeeds: this.staffNeeds(type) })));

    const processed = applicationTypes.map(applicationType => {
      const aveTrx = this.calculateAveTrx(this.chartData, applicationType);
      const aveInDay = this.aveInDay(this.chartData, applicationType);
      const slaStandard = this.slaStandardValue;
      const staffNeeds = this.staffNeeds(applicationType);
      const existing = this.staffcredams;
      const totalStaffNeeds = totalStaffNeedss;
      const shortOver = this.staffcredams - totalStaffNeedss;

      return {
        applicationType,
        aveTrx,
        aveInDay,
        slaStandard,
        staffNeeds,
        totalStaffNeeds,
        existing,
        shortOver,
      };
    });

    const total = this.totalStaffNeeds(processed).toFixed(2);

    this.dataSource = this.calculateRowSpan(
      processed.map(row => ({
        ...row,
        totalStaffNeeds: total,
        existing: row.existing,
        shortOver: row.shortOver,
      }))
    );
  }
}
