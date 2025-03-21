import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DashboardData } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.model';
import { MisDashboardService } from 'app/entities/mis-report/mis-dashboard/mis-dashboard.service';

@Component({
  selector: 'jhi-mis-loan-ops-dashboard-credit-admin',
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

    <jhi-mis-dashboard-card title="BY TRANSACTION 2">
      <div class="form-controls">
        <mat-form-field [formGroup]="dateForm2" appearance="outline">
          <mat-label>Select Month</mat-label>
          <input matInput formControlName="date2" [matDatepicker]="picker2" />
          <mat-datepicker-toggle matSuffix [for]="picker2"></mat-datepicker-toggle>
          <mat-datepicker #picker2 startView="year"></mat-datepicker>
        </mat-form-field>
      </div>
      <jhi-mis-dashboard-bar-chart title="Credit Admin" [legendPosition]="'bottom'" [data]="chartData2" [date]="dateForm2.get('date2')?.value"></jhi-mis-dashboard-bar-chart>
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
    `,
  ],
})
export class MisLoanOpsDashboardCreditAdminComponent implements OnInit {

  dateForm: FormGroup;
  dateForm2: FormGroup;
  chartData: DashboardData[] = [];
  chartData2: DashboardData[] = [];
  constructor(private dashboardService: MisDashboardService) {
    this.initializeForm();

    this.dateForm.valueChanges.subscribe(value => {
      this.dashboardService.getBarChartData(value.date.format('YYYY-MM-DD')).subscribe(res => {
        this.chartData = res;
      });
    });

    this.dateForm2.valueChanges.subscribe(value => {
      this.dashboardService.getBarChartData(value.date2.format('YYYY-MM-DD')).subscribe(res => {
        this.chartData2 = res;
      });
    });
  }
  ngOnInit(): void {
    this.dashboardService.getBarChartData(this.dateForm.get('date')?.value).subscribe(res => {
      this.chartData = res;
    });
    this.dashboardService.getBarChartData(this.dateForm2.get('date2')?.value).subscribe(res => {
      this.chartData2 = res;
    });
  }
  private initializeForm() {
    this.dateForm = new FormGroup({
      date: new FormControl('2025-01-28'),
    });
    this.dateForm2 = new FormGroup({
      date2: new FormControl('2025-01-28'),
    });
  }
}
