import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DashboardData } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.model';
import { MisDashboardService } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.service';

@Component({
  selector: 'jhi-mis-dashboard-credit-admin',
  template: `
    <jhi-mis-dashboard-card title="SERVICE LEVEL AGREEMENT">
      <div class="row">
        <ng-container *ngFor="let data of chartStatisticData">
          <div class="col-md-3 my-2">
            <jhi-mis-dashboard-card-statistic [title]="data.statusDescription" [count]="data.total"></jhi-mis-dashboard-card-statistic>
          </div>
        </ng-container>
      </div>
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

    <jhi-mis-dashboard-card title="BY User Credit Admin">
      <div class="form-controls">
        <mat-form-field [formGroup]="dateCredam" appearance="outline">
          <mat-label>Select Month</mat-label>
          <input matInput formControlName="dateCredam" [matDatepicker]="picker" />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker startView="year"></mat-datepicker>
        </mat-form-field>
      </div>
      <jhi-mis-dashboard-bar-chart
        [legendPosition]="'top'"
        [data]="chartData2"
        [date]="dateForm.get('dateCredam')?.value"
        title="Credit Admin"
      ></jhi-mis-dashboard-bar-chart>
    </jhi-mis-dashboard-card>

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
export class MisDashboardCredamComponent implements OnInit {
  dateForm: FormGroup;
  dateCredam: FormGroup;
  chartData: DashboardData[] = [];
  chartData2: DashboardData[] = [];
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
  staffcredams: any;
  constructor(private dashboardService: MisDashboardService) {
    this.initializeForm();

    this.dateForm.valueChanges.subscribe(value => {
      this.getChartData();
    });

    this.dateCredam.valueChanges.subscribe(value => {
      this.dashboardService.getBarChartData(value.dateCredam.format('YYYY-MM-DD'), 'by-user-credam').subscribe(res => {
        this.chartData2 = res;
      });
    });
  }

  public slaStandardValue = 0; // Simpan SLA Standard di variabel global

  public slaStandart(): void {
    this.dashboardService.getSlaStandart().subscribe({
      next: response => {
        if (response && Array.isArray(response)) {
          const slaStandardData = response.find(item => item.id === 'SLA_STANDARD_CREDAM');
          this.slaStandardValue = slaStandardData ? slaStandardData.value : 0;
        } else {
          console.error('Invalid response format:', response);
          this.slaStandardValue = 0; // Set default jika data tidak valid
        }
        this.getChartData();
      },
      error: error => {
        console.error('Error fetching SLA Standard:', error);
        this.slaStandardValue = 0; // Pastikan default tetap 0 jika terjadi error
      },
    });
  }
  public existingDataStaff(): void {
    this.dashboardService.getSlaStandart().subscribe({
      next: response => {
        if (response && Array.isArray(response)) {
          const staffCredam = response.find(item => item.id === 'STAFF_CREDAM');
          this.staffcredams = staffCredam ? staffCredam.value : 0;
        } else {
          console.error('Invalid response format:', response);
          this.staffcredams = 0; // Set default jika data tidak valid
        }
        this.getChartData();
      },
      error: error => {
        console.error('Error fetching SLA Standard:', error);
        this.staffcredams = 0; // Pastikan default tetap 0 jika terjadi error
      },
    });
  }
  public calculateAveTrx(chartData: DashboardData[], applicationType: string): number {
    if (!chartData || chartData.length === 0) {
      console.warn('chartData is empty, returning 0');
      return 0;
    }

    const columnKey = {
      New: 'newFacility',
      'Additional / TopUp': 'additionalTopupFacility',
      Renewal: 'renewalFacility',
      Existing: 'existingFacility',
      Others: 'othersFacility',
      'Renewal + Additional': 'renewalAdditionalFacility',
      'Renewal + Decrease': 'renewalDecreaseFacility',
      Decrease: 'decreaseFacility',
      'Renewal + Others': 'renewalOthersFacility',
      'Additional + Others': 'additionalOthersFacility',
      'Decrease + Others': 'decreaseOthersFacility',
    }[applicationType];

    const total = chartData.reduce((sum, item) => sum + (item[columnKey] || 0), 0);

    return total / chartData.length;
  }

  public aveInDay(chartData: DashboardData[], applicationType: string): number {
    return this.calculateAveTrx(chartData, applicationType) / 22;
  }
  chartStatisticData;
  statuses = ['DPPK_FINALIZE', 'DPPK_REVIEW'];
  ngOnInit(): void {
    this.getChartData();
    this.slaStandart();
    this.existingDataStaff();
    const positionId = this.getLocStor('POS');
    this.dashboardService
      .getStatisticLoanOps(positionId)
      .subscribe(res => (this.chartStatisticData = res.filter(d => this.statuses.includes(d.statusId))));
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
  // Deklarasi awal tanpa data
  public staffneeds(chartData: DashboardData[], applicationType: string): number {
    return (this.slaStandardValue * this.aveInDay(chartData, applicationType)) / 420;
  }
  public sumStaffneeds(chartData: DashboardData[]): number {
    const applicationTypes = [
      'New',
      'Additional / TopUp',
      'Renewal',
      'Existing',
      'Others',
      'Restructure',
      'Renewal + Additional',
      'Renewal + Decrease',
      'Decrease',
      'Renewal + Others',
      'Additional + Others',
      'Decrease + Others',
    ];

    return applicationTypes.reduce((total, type) => total + this.staffneeds(chartData, type), 0);
  }

  getChartData() {
    const rawDate = this.dateForm.get('date')?.value;
    const formattedDate = rawDate ? new Date(rawDate).toISOString().split('T')[0] : '';
    this.dashboardService.getBarChartData(formattedDate, 'credit-admin').subscribe(res => {
      this.chartData = res;

      const applicationTypes = [
        'New',
        'Additional / Top Up',
        'Renewal',
        'Restructure',
        'Existing',
        'Others',
        'Renewal + Additional',
        'Renewal + Decrease',
        'Decrease',
        'Renewal + Others',
        'Additional + Others',
        'Decrease + Others',
      ];

      const processedData = applicationTypes.map(applicationType => ({
        applicationType,
        aveTrx: this.calculateAveTrx(this.chartData, applicationType),
        aveInDay: this.aveInDay(this.chartData, applicationType),
        slaStandard: this.slaStandardValue,
        staffNeeds: this.staffneeds(this.chartData, applicationType),
        totalStaffNeeds: this.sumStaffneeds(this.chartData),
        existing: this.staffcredams,
        shortOver: this.shortOver(this.chartData, applicationType),
      }));
      this.dataSource = this.calculateRowSpan(processedData);
    });
  }
  calculateRowSpan(data: any[]): any[] {
    const totalMap: { [key: string]: number } = {};
    const existingMap: { [key: string]: number } = {};

    // Hitung jumlah kemunculan untuk masing-masing nilai
    data.forEach(row => {
      const totalKey = row.totalStaffNeeds;
      const existingKey = row.existing;

      totalMap[totalKey] = (totalMap[totalKey] || 0) + 1;
      existingMap[existingKey] = (existingMap[existingKey] || 0) + 1;
    });

    const totalAdded: { [key: string]: boolean } = {};
    const existingAdded: { [key: string]: boolean } = {};

    return data.map(row => {
      const totalKey = row.totalStaffNeeds;
      const existingKey = row.existing;

      const rowSpanTotal = !totalAdded[totalKey] ? totalMap[totalKey] : 0;
      const rowSpanExisting = !existingAdded[existingKey] ? existingMap[existingKey] : 0;

      totalAdded[totalKey] = true;
      existingAdded[existingKey] = true;

      return {
        ...row,
        rowSpanTotal,
        rowSpanExisting,
      };
    });
  }

  public shortOver(chartData: DashboardData[], applicationType: string): number {
    const staffNeed = this.staffneeds(chartData, applicationType);
    const existing = this.staffcredams;

    if (isNaN(staffNeed) || isNaN(existing)) {
      console.warn(`shortOver NaN detected: staffNeed=${staffNeed}, existing=${existing}`);
      return 0;
    }

    return staffNeed - existing;
  }

  private initializeForm() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    this.dateForm = new FormGroup({
      date: new FormControl(formattedDate),
    });
    this.dateCredam = new FormGroup({
      dateCredam: new FormControl(formattedDate),
    });
  }
}
