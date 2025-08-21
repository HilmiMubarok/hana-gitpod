import { Component, OnInit } from '@angular/core';
import { MisDashboardService } from '../mis-dashboard/mis-dashboard.service';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'jhi-mis-cp-slaloanops-dashboard',
  template: `
    <jhi-mis-dashboard-card title="SERVICE LEVEL AGREEMENT" [content]="statistic"></jhi-mis-dashboard-card>
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
    <jhi-mis-dashboard-card title="BY TRANSACTION" [content]="transaction" [defaultToggle]="false"></jhi-mis-dashboard-card>
    <jhi-mis-dashboard-card title="BY USER LOAN OPERATIONS" [content]="user" [defaultToggle]="false"></jhi-mis-dashboard-card>
    <jhi-mis-dashboard-card title="PRODUCTIVITY" [content]="productivity" [defaultToggle]="false"></jhi-mis-dashboard-card>

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
      <jhi-mis-cp-slaloanops-dashboard-transaction [date]="date"></jhi-mis-cp-slaloanops-dashboard-transaction>
    </ng-template>
    <ng-template #user>
      <jhi-mis-cp-slaloanops-dashboard-user [date]="date"></jhi-mis-cp-slaloanops-dashboard-user>
    </ng-template>
    <ng-template #productivity>
      <jhi-mis-cp-slaloanops-dashboard-productivity [date]="date"></jhi-mis-cp-slaloanops-dashboard-productivity>
    </ng-template>
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
      this.date = moment(date).format('YYYY-MM-DD');
    });
  }

  date = moment().format('YYYY-MM-DD');

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
  chartUserData;
  today = moment().format('YYYY-MM-DD');
  statuses = ['LOAN_OPS_DISTRIBUTION', 'LOAN_OPS_CHECKING', 'LOAN_OPS_REVIEW', 'CP_COMPLETE'];
  form: FormGroup;

  private initializeForm() {
    this.form = new FormGroup({
      date: new FormControl(this.today),
    });
  }

  ngOnInit(): void {
    this._fetchAllData(this.date);
  }

  _fetchAllData(date): void {
    const positionId = this.getLocStor('POS');
    this.dashboardService.getStatisticLoanOps(positionId).subscribe(res => {
      this.chartStatisticData = res.filter(d => this.statuses.includes(d.statusId));
      this.chartStatisticData.sort((a, b) => this.statuses.indexOf(a.statusId) - this.statuses.indexOf(b.statusId));
    });
  }
}
