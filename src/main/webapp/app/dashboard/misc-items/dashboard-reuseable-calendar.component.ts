import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'jhi-dashboard-reuseable-calendar',
  templateUrl: './dashboard-reuseable-calendar.component.html',
})
export class DashboardReusableCalendarComponent {
  public _mode: string;
  public startDateAndEndDate: any;
  public filterRange: any = [];
  public date: string;
  public _dueDateDates: string;
  public _type: string;
  public maxDateVal: Date;
  public progressDates: Date;

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

  set mode(param: string) {
    this._mode = param;
  }

  @Input()
  get type() {
    return this._type;
  }

  set type(param: string) {
    this._type = param;
  }

  @Output() output = new EventEmitter<any>();

  constructor() {}

  public emitStartEndDate(mode: string) {
    switch (mode) {
      case 'WEEKLY':
        this.sendOutWeekly();
        break;
      case 'MONTHLY':
        this.sendOutMonthly();
        break;
      default:
        this.sendOutDaily();

        break;
    }
  }

  public sendOutDaily(): void {
    const _maxDateVal = new Date(this.filterRange[0]).setDate(this.filterRange[0].getDate() + 6);
    this.maxDateVal = new Date(_maxDateVal);
    if (this.filterRange[1] !== null) {
      const startDate = moment(this.filterRange[0]).format('YYYY-MM-DD').toString();

      const thruDate = moment(this.filterRange[1]).format('YYYY-MM-DD').toString();
      this.output.emit({ startDate, thruDate });
    }
  }

  public sendOutWeekly(): void {
    const startDate = moment(this.progressDates).format('YYYY-MM-DD').toString();
    const thruDate = moment(new Date(this.progressDates.getFullYear(), this.progressDates.getMonth() + 1, 0))
      .format('YYYY-MM-DD')
      .toString();
    this.output.emit({ startDate, thruDate });
  }

  public sendOutMonthly(): void {
    const startDate = moment(this.progressDates).format('YYYY-MM-DD').toString();
    const thruDate = moment(new Date(this.progressDates.getFullYear(), 11, 31)).format('YYYY-MM-DD').toString();
    this.output.emit({ startDate, thruDate });
  }

  public sendOutDate(): void {
    this.output.emit(moment(this.dueDateDates).format('YYYY-MM-DD').toString());
  }
}
