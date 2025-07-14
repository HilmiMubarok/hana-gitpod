import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MisDashboardService } from '../../mis-dashboard/mis-dashboard.service';
import * as moment from 'moment';

@Component({
  selector: 'jhi-mis-cp-slaloanops-dashboard-transaction',
  template: `
    <jhi-mis-dashboard-bar-chart
      [legendPosition]="'top'"
      [data]="chartTransactionsData"
      [date]="date"
      title="LOAN OPERATIONS"
    ></jhi-mis-dashboard-bar-chart>
  `,
})
export class MisCpSlaloanopsDashboardTransactionComponent implements OnInit, OnChanges {
  constructor(private dashboardService: MisDashboardService) {}
  chartTransactionsData: any[] = [];
  _date: string;

  @Input()
  get date() {
    return this._date;
  }
  set date(value) {
    this._date = value;
  }

  ngOnInit(): void {
    this._fetchAllData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date'] && changes['date'].firstChange === false) {
      if (moment.isMoment(changes['date'].currentValue)) {
        this.date = changes['date'].currentValue.format('YYYY-MM-DD');
      } else {
        this.date = changes['date'].currentValue;  
      }
      this._fetchAllData();
    }
  }

  private _fetchAllData() {
    this.dashboardService.getBarChartData(this.date, 'loan-ops').subscribe(res => {
      const data = [...res].reverse();
      this.chartTransactionsData = data;
    });
  }
}
