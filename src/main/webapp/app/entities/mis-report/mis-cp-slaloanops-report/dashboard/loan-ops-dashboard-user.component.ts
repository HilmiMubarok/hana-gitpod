import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MisDashboardService } from '../../mis-dashboard/mis-dashboard.service';
import * as moment from 'moment';

@Component({
  selector: 'jhi-mis-cp-slaloanops-dashboard-user',
  template: `
    <jhi-mis-dashboard-bar-chart [legendPosition]="'top'" type="user" [data]="chartUserData" [date]="date"></jhi-mis-dashboard-bar-chart>
  `,
})
export class MisCpSlaloanopsDashboardUserComponent implements OnInit, OnChanges {
  constructor(private dashboardService: MisDashboardService) {}
  
  chartUserData: any[] = [];
  _date: string;

  @Input()
  get date() {
    return this._date;
  }
  set date(value) {
    this._date = value;
  }

  ngOnInit(): void {
    this._fetchAllData(this.date);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date'] && changes['date'].firstChange === false) {
      if (moment.isMoment(changes['date'].currentValue)) {
        this.date = changes['date'].currentValue.format('YYYY-MM-DD');
      } else {
        this.date = changes['date'].currentValue;
      }
      this._fetchAllData(this.date);
    }
  }

  _fetchAllData(date: string) {
    this.dashboardService.getBarChartData(date, 'by-user-loan-ops').subscribe(res => {
      const data = [...res].reverse();
      this.chartUserData = data;
    });
  }
}
