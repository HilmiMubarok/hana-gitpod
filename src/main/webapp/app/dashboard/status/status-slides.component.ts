import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IGroupByStatus, utilityIcon } from '../dashboard.model';

@Component({
  selector: 'jhi-status-slides',
  templateUrl: './status-slides.component.html',
  styleUrls: ['./status-slides.style.css'],
})
export class StatusSlidesComponent implements OnInit, OnChanges {
  private _chartsData: any;
  public responsiveOptions: any[] | undefined;
  public dataSource: IGroupByStatus[] = [];

  @Input()
  get chartsData() {
    return this._chartsData;
  }
  set chartsData(param: any) {
    this._chartsData = param;
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartsData']) {
      this.prepData();
    }
  }
  ngOnInit(): void {
    this.prepData();
  }

  public prepData(): void {
    if (this.chartsData !== undefined) {
      if (this.chartsData.length > 0) {
        for (let i = 0; i < this.chartsData.length; i++) {
          for (let y = 0; y < utilityIcon.length; y++) {
            if (i === y) {
              this.chartsData[i].icon = utilityIcon[i];
            }
          }
        }
      }
    }
  }
}
