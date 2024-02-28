import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'jhi-progress-status-bar',
  templateUrl: './progress-status-bar.component.html',
  styleUrls: ['./progress-status-bar.style.css'],
})
export class ProgressStatusBarComponent {
  @Input()
  get dataSource() {
    return this._dataSource;
  }

  set dataSource(param: any) {
    this._dataSource = param;
  }

  public _dataSource: any;

  constructor() {}
}
