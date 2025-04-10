import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DashboardData } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.model';
import { MisDashboardService } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.service';

@Component({
  selector: 'jhi-mis-dashboard-credit-admin',
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

      .merge-cell {
        text-align: center;
      }
    `,
  ],
})
export class MisDashboardCredamComponent implements OnInit {
  dateForm: FormGroup;
  dateForm2: FormGroup;
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
      this.dashboardService.getCredamData(value.date.format('YYYY-MM-DD')).subscribe(res => {
        this.chartData = res;
      });
      this.getChartData();
    });

    this.dateForm2.valueChanges.subscribe(value => {
      this.dashboardService.getCredamData(value.date2.format('YYYY-MM-DD')).subscribe(res => {
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

        // Panggil getChartData setelah slaStandardValue diperbarui
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

        // Panggil getChartData setelah slaStandardValue diperbarui
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

  ngOnInit(): void {
    // this.dashboardService.getBarChartData(this.dateForm.get('date')?.value).subscribe(res => {
    //   this.chartData = res;
    // });

    this.dashboardService.getCredamData(this.dateForm.get('date')?.value).subscribe(res => {
      this.chartData = res;

      // Daftar applicationType yang ingin dihitung
      const applicationTypes = [
        'New',
        'Additional / Topup',
        'Restructure',
        'Renewal',
        'Existing',
        'Others',
        'Renewal + Additional',
        'Renewal + Decrease',
        'Decrease',
        'Renewal + Others',
        'Additional + Others',
        'Additional + Others',
        'Decrease + Others',
      ];

      // Loop untuk menghitung rata-rata tiap applicationType
      const averages = applicationTypes.map(type => ({
        type,
        average: this.calculateAveTrx(this.chartData, type),
      }));
    });

    this.getChartData();
    this.slaStandart();
    this.existingDataStaff();
  }

  // Deklarasi awal tanpa data
  public staffneeds(chartData: DashboardData[], applicationType: string): number {
    return this.slaStandardValue * this.aveInDay(chartData, applicationType);
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

    this.dashboardService.getCredamData(formattedDate).subscribe(res => {
      this.chartData = res;
      this.dataSource = [
        {
          applicationType: 'New',
          aveTrx: this.calculateAveTrx(this.chartData, 'New'),
          aveInDay: this.aveInDay(this.chartData, 'New'),
          slaStandard: this.slaStandardValue,
          staffNeeds: this.staffneeds(this.chartData, 'New'),
          totalStaffNeeds: this.sumStaffneeds(this.chartData),
          existing: this.staffcredams,
          shortOver: this.shortOver(this.chartData, 'New'),
        },
        {
          applicationType: 'Additional / Top Up',
          aveTrx: this.calculateAveTrx(this.chartData, 'Additional / Top Up'),
          aveInDay: this.aveInDay(this.chartData, 'Additional / Top Up'),
          slaStandard: this.slaStandardValue,
          staffNeeds: this.staffneeds(this.chartData, 'Additonal / Top Up'),
          totalStaffNeeds: this.sumStaffneeds(this.chartData),
          existing: this.staffcredams,
          shortOver: this.shortOver(this.chartData, 'Additional / Top Up'),
        },
        {
          applicationType: 'Renewal',
          aveTrx: this.calculateAveTrx(this.chartData, 'Renewal'),
          aveInDay: this.aveInDay(this.chartData, 'Renewal'),
          slaStandard: this.slaStandardValue,
          staffNeeds: this.staffneeds(this.chartData, 'Renewal'),
          totalStaffNeeds: this.sumStaffneeds(this.chartData),
          existing: this.staffcredams,
          shortOver: this.shortOver(this.chartData, 'Renewal'),
        },
        {
          applicationType: 'Restructure',
          aveTrx: this.calculateAveTrx(this.chartData, 'Restructure'),
          aveInDay: this.aveInDay(this.chartData, 'Restructure'),
          slaStandard: this.slaStandardValue,
          staffNeeds: this.staffneeds(this.chartData, 'Restructure'),
          totalStaffNeeds: this.sumStaffneeds(this.chartData),
          existing: this.staffcredams,
          shortOver: this.shortOver(this.chartData, 'Restructure'),
        },
        {
          applicationType: 'Existing',
          aveTrx: this.calculateAveTrx(this.chartData, 'Existing'),
          aveInDay: this.aveInDay(this.chartData, 'Existing'),
          slaStandard: this.slaStandardValue,
          staffNeeds: this.staffneeds(this.chartData, 'Existing'),
          totalStaffNeeds: this.sumStaffneeds(this.chartData),
          existing: this.staffcredams,
          shortOver: this.shortOver(this.chartData, 'Existing'),
        },
        {
          applicationType: 'Others',
          aveTrx: this.calculateAveTrx(this.chartData, 'Others'),
          aveInDay: this.aveInDay(this.chartData, 'Others'),
          slaStandard: this.slaStandardValue,
          staffNeeds: this.staffneeds(this.chartData, 'Others'),
          totalStaffNeeds: this.sumStaffneeds(this.chartData),
          existing: this.staffcredams,
          shortOver: this.shortOver(this.chartData, 'Others'),
        },
        {
          applicationType: 'Renewal + Additional',
          aveTrx: this.calculateAveTrx(this.chartData, 'Renewal + Additional'),
          aveInDay: this.aveInDay(this.chartData, 'Renewal + Additional'),
          slaStandard: this.slaStandardValue,
          staffNeeds: this.staffneeds(this.chartData, 'Renewal + Additional'),
          totalStaffNeeds: this.sumStaffneeds(this.chartData),
          existing: this.staffcredams,
          shortOver: this.shortOver(this.chartData, 'Renewal + Additional'),
        },
        {
          applicationType: 'Renewal + Decrease',
          aveTrx: this.calculateAveTrx(this.chartData, 'Renewal + Decrease'),
          aveInDay: this.aveInDay(this.chartData, 'Renewal + Decrease'),
          slaStandard: this.slaStandardValue,
          staffNeeds: this.staffneeds(this.chartData, 'Renewal + Decrease'),
          totalStaffNeeds: this.sumStaffneeds(this.chartData),
          existing: this.staffcredams,
          shortOver: this.shortOver(this.chartData, 'Renewal + Decrease'),
        },
        {
          applicationType: 'Decrease',
          aveTrx: this.calculateAveTrx(this.chartData, 'Decrease'),
          aveInDay: this.aveInDay(this.chartData, 'Decrease'),
          slaStandard: this.slaStandardValue,
          staffNeeds: this.staffneeds(this.chartData, 'Decrease'),
          totalStaffNeeds: this.sumStaffneeds(this.chartData),
          existing: this.staffcredams,
          shortOver: this.shortOver(this.chartData, 'Decrease'),
        },
        {
          applicationType: 'Renewal + Others',
          aveTrx: this.calculateAveTrx(this.chartData, 'Renewal + Others'),
          aveInDay: this.aveInDay(this.chartData, 'Renewal + Others'),
          slaStandard: this.slaStandardValue,
          staffNeeds: this.staffneeds(this.chartData, 'Renewal + Others'),
          totalStaffNeeds: this.sumStaffneeds(this.chartData),
          existing: this.staffcredams,
          shortOver: this.shortOver(this.chartData, 'Renewal + Others'),
        },
        {
          applicationType: 'Additional + Others',
          aveTrx: this.calculateAveTrx(this.chartData, 'Additional + Others'),
          aveInDay: this.aveInDay(this.chartData, 'Additional + Others'),
          slaStandard: this.slaStandardValue,
          staffNeeds: this.staffneeds(this.chartData, 'Additional + Others'),
          totalStaffNeeds: this.sumStaffneeds(this.chartData),
          existing: this.staffcredams,
          shortOver: this.shortOver(this.chartData, 'Additional + Others'),
        },
        {
          applicationType: 'Decrease + Others',
          aveTrx: this.calculateAveTrx(this.chartData, 'Decrease + Others'),
          aveInDay: this.aveInDay(this.chartData, 'Decrease + Others'),
          slaStandard: this.slaStandardValue,
          staffNeeds: this.staffneeds(this.chartData, 'Decrease + Others'),
          totalStaffNeeds: this.sumStaffneeds(this.chartData),
          existing: this.staffcredams,
          shortOver: this.shortOver(this.chartData, 'Decrease + Others'),
        },
      ];
    });
  }
  public shortOver(chartData: DashboardData[], applicationType: string): number {
    return this.staffneeds(chartData, applicationType) - this.staffcredams;
  }
  private initializeForm() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    this.dateForm = new FormGroup({
      date: new FormControl(formattedDate),
    });
    this.dateForm2 = new FormGroup({
      date2: new FormControl(formattedDate),
    });
  }
}
