import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'jhi-dashboard-reuseable-calendar',
  templateUrl: './dashboard-reuseable-calendar.component.html',
})
export class DashboardReusableCalendarComponent implements OnChanges {
  public _fiterData: any;
  public _mode: string;
  public startDateAndEndDate: any;
  public filterRange: any = [];
  public date: string;
  public _dueDateDates: string;

  @Input()
  get filterData() {
    return this._fiterData;
  }

  set filterData(param: any) {
    this._fiterData = param;
  }

  @Input()
  get dueDateDates() {
    return this._dueDateDates;
  }

  set dueDateDates(param: any) {
    this._dueDateDates = param;
  }

  @Input()
  get mode() {
    return this._mode;
  }

  set mode(param: any) {
    this._mode = param;
  }

  @Output() output = new EventEmitter<any>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['baseLineChartData'] || changes['dueDates']) {
      this.convertDate();
      this.sendOutDate();
    }
  }

  public convertDate() {
    if (this.filterRange[1] !== null) {
      const startDate = moment(this.filterRange[0]).format('YYYY-MM-DD').toString();
      const endDate = moment(this.filterRange[1]).format('YYYY-MM-DD').toString();
      this.output.emit(this.filterData.filter(obj => obj.date >= startDate && obj.date <= endDate));
    }
  }

  public sendOutDate(): void {
    const emitDate = moment(this.date).format('YYYY-MM-DD').toString();
    this.output.emit(emitDate);
  }
}
