import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DashboardData } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.model';
import { MisDashboardService } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.service';

interface CollateralData {
  activeCollateralStatus: number;
  existingCollateralStatus: number;
  newCollateralStatus: number;
  toBeReleaseCollateralStatus: number;
  date: string;
}

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
    `,
  ],
})
export class MisDashboardInsuranceComponent implements OnInit {
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

  // dataSource = [
  //   {
  //     applicationType: 'Active',
  //     aveTrx: this.calculateAveTrx(this.chartData, 'Active'),
  //     aveInDay: 13.63,
  //     slaStandard: 120,
  //     staffNeeds: '-',
  //     totalStaffNeeds: '-',
  //     existing: '-',
  //     shortOver: '-',
  //   },
  //   {
  //     applicationType: 'Existing',
  //     aveTrx: this.calculateAveTrx(this.chartData, 'Existing'),
  //     aveInDay: 13.63,
  //     slaStandard: 4,
  //     staffNeeds: '-',
  //     totalStaffNeeds: '-',
  //     existing: '-',
  //     shortOver: '-',
  //   },
  //   {
  //     applicationType: 'New',
  //     aveTrx: this.calculateAveTrx(this.chartData, 'New'),
  //     aveInDay: 13.63,
  //     slaStandard: 4,
  //     staffNeeds: '-',
  //     totalStaffNeeds: '-',
  //     existing: '-',
  //     shortOver: '-',
  //   },
  //   {
  //     applicationType: 'To Be Released',
  //     aveTrx: this.calculateAveTrx(this.chartData, 'To Be Released'),
  //     aveInDay: 13.63,
  //     slaStandard: 4,
  //     staffNeeds: '-',
  //     totalStaffNeeds: '-',
  //     existing: '-',
  //     shortOver: '-',
  //   },
  // ];
  constructor(private dashboardService: MisDashboardService) {
    this.initializeForm();

    this.dateForm.valueChanges.subscribe(value => {
      this.dashboardService.getBarChartData(value.date.format('YYYY-MM-DD')).subscribe(res => {
        this.chartData = res;
      });
      this.getChartData();
    });

    this.dateForm2.valueChanges.subscribe(value => {
      this.dashboardService.getBarChartData(value.date2.format('YYYY-MM-DD')).subscribe(res => {
        this.chartData2 = res;
      });
    });
  }

  public slaStandardValue = 0; // Simpan SLA Standard di variabel global

  public slaStandart(): void {
    this.dashboardService.getSlaStandart().subscribe({
      next: response => {
        if (response.body && Array.isArray(response.body)) {
          const slaStandardData = response.body.find(item => item.id === 'SLA_STANDARD_INSURANCE');
          this.slaStandardValue = slaStandardData ? Number(slaStandardData.value) : 0;
        } else {
          console.error('Invalid response format:', response.body);
          this.slaStandardValue = 0; // Set default jika data tidak valid
        }

        console.log('SLA Standard Value:', this.slaStandardValue);

        // Panggil getChartData setelah slaStandardValue diperbarui
        this.getChartData();
      },
      error: error => {
        console.error('Error fetching SLA Standard:', error);
        this.slaStandardValue = 0; // Pastikan default tetap 0 jika terjadi error
      },
    });
  }

  public calculateAveTrx(chartData: DashboardData[], applicationType: string): number {
    if (!chartData || chartData.length === 0) {
      console.warn('chartData is empty, returning 0');
      return 0;
    }

    console.log('Data:', chartData);

    const columnKey = {
      Active: 'activeCollateralStatus',
      Existing: 'existingCollateralStatus',
      New: 'newCollateralStatus',
      'To Be Released': 'toBeReleaseCollateralStatus',
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

    this.dashboardService.getBarChartData(this.dateForm.get('date')?.value).subscribe(res => {
      this.chartData = res;
      console.log('Updated chartData:', this.chartData); // Debugging

      // Daftar applicationType yang ingin dihitung
      const applicationTypes = ['Active', 'Existing', 'New', 'To Be Released'];

      // Loop untuk menghitung rata-rata tiap applicationType
      const averages = applicationTypes.map(type => ({
        type,
        average: this.calculateAveTrx(this.chartData, type),
      }));

      console.log('Averages:', averages);
    });

    this.getChartData();
    this.slaStandart();
  }

  // Deklarasi awal tanpa data

  getChartData() {
    const rawDate = this.dateForm.get('date')?.value;
    const formattedDate = rawDate ? new Date(rawDate).toISOString().split('T')[0] : '';

    this.dashboardService.getBarChartData(formattedDate).subscribe(res => {
      this.chartData = res;
      console.log('Updated chartData:', this.chartData); // Debugging

      this.dataSource = [
        {
          applicationType: 'Active',
          aveTrx: this.calculateAveTrx(this.chartData, 'Active'),
          aveInDay: this.aveInDay(this.chartData, 'Active'),
          slaStandard: this.slaStandardValue,
          staffNeeds: '-',
          totalStaffNeeds: '-',
          existing: '-',
          shortOver: '-',
        },
        {
          applicationType: 'Existing',
          aveTrx: this.calculateAveTrx(this.chartData, 'Existing'),
          aveInDay: this.aveInDay(this.chartData, 'Existing'),
          slaStandard: 4,
          staffNeeds: '-',
          totalStaffNeeds: '-',
          existing: '-',
          shortOver: '-',
        },
        {
          applicationType: 'New',
          aveTrx: this.calculateAveTrx(this.chartData, 'New'),
          aveInDay: this.aveInDay(this.chartData, 'New'),
          slaStandard: 4,
          staffNeeds: '-',
          totalStaffNeeds: '-',
          existing: '-',
          shortOver: '-',
        },
        {
          applicationType: 'To Be Released',
          aveTrx: this.calculateAveTrx(this.chartData, 'To Be Released'),
          aveInDay: this.aveInDay(this.chartData, 'To Be Released'),
          slaStandard: 4,
          staffNeeds: '-',
          totalStaffNeeds: '-',
          existing: '-',
          shortOver: '-',
        },
      ];

      console.log('Updated dataSource:', this.dataSource); // Debugging
    });
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
