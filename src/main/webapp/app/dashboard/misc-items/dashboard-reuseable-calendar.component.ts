import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'jhi-dashboard-reuseable-calendar',
  templateUrl: './dashboard-reuseable-calendar.component.html',
})
export class DashboardReusableCalendarComponent implements OnChanges {
  public _mode: string;
  public startDateAndEndDate: any;
  public filterRange: any = [];
  public date: string;
  public _dueDateDates: string;
  public _type: string;
  public maxDateVal: Date;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode']) {
      if (this.type === 'progress') {
        if (this.mode === 'WEEKLY') {
          this.dueDateDates = new Date('2023-12-31T17:00:00.000Z');
          this.sendOutDate();
        } else if (this.mode === 'MONTHLY') {
          this.dueDateDates = new Date('2023-12-31T17:00:00.000Z');
          this.sendOutDate();
        }
      }
    }
  }

  public emitStartEndDate() {
    const _maxDateVal = new Date(this.filterRange[0]).setDate(this.filterRange[0].getDate() + 6);
    this.maxDateVal = new Date(_maxDateVal);
    const startDate = moment(this.filterRange[0]).format('YYYY-MM-DD').toString();
    if (this.filterRange[1] !== null) {
      const thruDate = moment(this.filterRange[1]).format('YYYY-MM-DD').toString();

      this.output.emit({ startDate, thruDate });
    } else {
      this.output.emit({ startDate, thruDate: startDate });
    }
  }

  public sendOutDate(): void {
    this.output.emit(this.dueDateDates);
  }
}
