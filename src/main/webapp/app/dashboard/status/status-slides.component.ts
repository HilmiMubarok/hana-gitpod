import { Component } from '@angular/core';
import { DashboardLayoutComponent, PanelModel } from '@syncfusion/ej2-angular-layouts';
import { Browser } from '@syncfusion/ej2-base';

@Component({
  selector: 'jhi-status-slides',
  templateUrl: './status-slides.component.html',
  styleUrls: ['./status-slides.style.css'],
})
export class StatusSlidesComponent {
  constructor() {}
  public dashboard: DashboardLayoutComponent;
  public panels: any[];
  public layoutColor: string;
  public cellSpacing: number[] = [15, 15];
  public cellAspectRatio: number = Browser.isDevice ? 1 : 0.8;
  public columns: number = Browser.isDevice ? 2 : 8;
  public pieColumn: number = Browser.isDevice ? 1 : 5;
  public splineRow: number = Browser.isDevice ? 1 : 4;
  public chartArea: Object = {
    border: { width: 0 },
  };

  public aspectRatio: any = 100 / 85;
  public headerCount = 1;
  public count = 8;

  public passedData: any = [
    {
      totalStatus: 123,
      totalSumStatus: 45.12,
      icon: 'envelope-open',
    },
    {
      totalStatus: 23,
      totalSumStatus: 25.66,
      icon: 'wallet',
    },
    {
      totalStatus: 53,
      totalSumStatus: 15.49,
      icon: 'tasks',
    },
    {
      totalStatus: 23,
      totalSumStatus: 75.44,
      icon: 'calendar-plus',
    },
    {
      totalStatus: 9,
      totalSumStatus: 5.61,
      icon: 'calendar-check',
    },
    {
      totalStatus: 135,
      totalSumStatus: 120.12,
      icon: 'minus-square',
    },
    {
      totalStatus: 78,
      totalSumStatus: 88.47,
      icon: 'print',
    },
  ];
}
