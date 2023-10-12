import { Component, Input, OnInit } from '@angular/core';

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

  // public setNumbers(): void {
  // const totalStatus = document.getElementById('total-count');

  // if (totalStatus != null) {
  //   totalStatus.style.setProperty('--num', this.dataSource.totalStatus);
  // }

  // const totalStatus = Array.from(document.getElementsByClassName('total-count') as HTMLCollectionOf<HTMLElement>);

  // totalStatus.forEach(item => {
  //   item.style.setProperty('--num', this.dataSource.totalStatus);
  // });
  // }
}
