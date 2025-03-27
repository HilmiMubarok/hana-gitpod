import { Component, OnInit } from '@angular/core';
import { MisDashboardService } from '../mis-dashboard/mis-dashboard.service';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'jhi-mis-cp-slaloanops-dashboard',
  template: `
    <div class="d-flex flex-row-reverse">
      <div class="form-container">
        <mat-form-field [formGroup]="form" appearance="outline">
          <mat-label>Select Month</mat-label>
          <input matInput formControlName="date" [matDatepicker]="picker" />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker startView="year"></mat-datepicker>
        </mat-form-field>
      </div>
    </div>
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
      <jhi-mis-dashboard-bar-chart
        [legendPosition]="'top'"
        [data]="chartTransactionsData"
        [date]="form.get('date')?.value"
        title="LOAN OPERATIONS"
      ></jhi-mis-dashboard-bar-chart>
    </jhi-mis-dashboard-card>
    <jhi-mis-dashboard-card title="BY USER LOAN OPERATIONS">
      <jhi-mis-dashboard-bar-chart [legendPosition]="'top'" type="user" [data]="chartUserData" [date]="form.get('date')?.value"></jhi-mis-dashboard-bar-chart>
    </jhi-mis-dashboard-card>
    <jhi-mis-dashboard-card title="PRODUCTIVITY"></jhi-mis-dashboard-card>
  `,
  styles: [
    `
      .form-container {
        background-color: white;
        border-radius: 4px;
        padding: 5px 10px 5px 10px;
        margin: 0 10px 10px 10px;
      }
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
export class MisCpSlaLoanOpsDashboardComponent implements OnInit {
  constructor(private dashboardService: MisDashboardService) {
    this.initializeForm();

    this.form.get('date').valueChanges.subscribe(date => {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      this._fetchAllData(formattedDate);
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

  chartStatisticData;
  chartTransactionsData;
  chartUserData
  today = moment().format('YYYY-MM-DD');
  statuses = ['LOAN_OPS_CHECKING', 'LOAN_OPS_DISTRIBUTION', 'LOAN_OPS_REVIEW', 'CP_COMPLETE'];
  form: FormGroup;

  private initializeForm() {
    this.form = new FormGroup({
      date: new FormControl(this.today),
    });
  }

  ngOnInit(): void {
    this._fetchAllData(this.form.get('date')?.value);
  }

  _fetchAllData(date): void {
    const positionId = this.getLocStor('POS');
    this.dashboardService
      .getStatisticLoanOps(positionId)
      .subscribe(res => (this.chartStatisticData = res.filter(d => this.statuses.includes(d.statusId))));
    this.dashboardService.getBarChartData(date, 'loan-ops').subscribe(res => this.chartTransactionsData = res);
    this.dashboardService.getBarChartData(date, 'by-user-loan-ops').subscribe(res => this.chartUserData = res);
  }
}
