import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { DashboardLayoutComponent, PanelModel } from '@syncfusion/ej2-angular-layouts';
import { Browser } from '@syncfusion/ej2-base';
import moment from 'moment';

@Component({
  selector: 'jhi-charts-layout',
  templateUrl: './charts-layout.component.html',
  styleUrls: ['./charts-layout.style.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ChartsLayoutComponent implements OnInit {
  public mediaQuery = window.matchMedia('(max-width: 1282px)');

  @ViewChild('predefine_dashboard')
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

  public columnSizeX: number;
  public columnSizeY: number;
  public pieSizeX: number;
  public pieSizeY: number;
  public splineSizeX: number;
  public splineSizeY: number;

  // public status: string[] = ['status1', 'status2', 'status3'];
  // public dates: string[] = ['senin', 'selasa', 'rabu', 'kamis', "jum'at", 'sabtu', 'minggu'];

  public aspectRatio: any = 100 / 85;
  public headerCount = 1;
  public count = 8;

  // public selectedStatus: string;

  dateRange: any[] | undefined;
  SelectedDateRange: any | undefined;

  status: any[] | undefined;
  selectedStatus: any | undefined;

  public filterRange = [];

  private dummyData: any = [
    { data: 13, date: '2024/02/12' },
    { data: 23, date: '2024/03/19' },
    { data: 37, date: '2024/02/23' },
    { data: 44, date: '2024/02/10' },
    { data: 8, date: '2024/03/13' },
    { data: 25, date: '2024/03/27' },
    { data: 48, date: '2024/02/21' },
    { data: 2, date: '2024/02/18' },
    { data: 39, date: '2024/02/17' },
    { data: 33, date: '2024/02/22' },
    { data: 49, date: '2024/03/15' },
    { data: 46, date: '2024/03/07' },
    { data: 14, date: '2024/02/27' },
    { data: 47, date: '2024/03/10' },
    { data: 1, date: '2024/02/02' },
    { data: 8, date: '2024/02/05' },
    { data: 25, date: '2024/03/22' },
    { data: 14, date: '2024/03/04' },
    { data: 38, date: '2024/02/14' },
    { data: 25, date: '2024/02/24' },
    { data: 17, date: '2024/03/26' },
    { data: 48, date: '2024/02/13' },
    { data: 27, date: '2024/03/06' },
    { data: 25, date: '2024/02/27' },
    { data: 18, date: '2024/03/12' },
    { data: 5, date: '2024/03/18' },
    { data: 10, date: '2024/02/05' },
    { data: 6, date: '2024/03/20' },
    { data: 28, date: '2024/02/18' },
    { data: 28, date: '2024/03/29' },
    { data: 33, date: '2024/03/01' },
    { data: 14, date: '2024/02/06' },
    { data: 13, date: '2024/02/07' },
    { data: 46, date: '2024/03/26' },
    { data: 15, date: '2024/03/15' },
    { data: 40, date: '2024/03/25' },
    { data: 42, date: '2024/02/04' },
    { data: 34, date: '2024/02/14' },
    { data: 50, date: '2024/02/15' },
    { data: 41, date: '2024/03/04' },
    { data: 14, date: '2024/03/16' },
    { data: 10, date: '2024/03/23' },
    { data: 37, date: '2024/03/02' },
    { data: 34, date: '2024/02/19' },
    { data: 1, date: '2024/03/24' },
    { data: 42, date: '2024/02/24' },
    { data: 4, date: '2024/03/19' },
    { data: 32, date: '2024/02/16' },
    { data: 21, date: '2024/03/09' },
    { data: 20, date: '2024/02/03' },
    { data: 38, date: '2024/03/05' },
    { data: 30, date: '2024/02/28' },
    { data: 9, date: '2024/02/29' },
    { data: 16, date: '2024/03/28' },
    { data: 14, date: '2024/03/12' },
    { data: 43, date: '2024/02/27' },
    { data: 28, date: '2024/02/20' },
    { data: 28, date: '2024/03/17' },
    { data: 2, date: '2024/03/21' },
    { data: 39, date: '2024/03/08' },
    { data: 27, date: '2024/02/01' },
    { data: 26, date: '2024/03/11' },
    { data: 35, date: '2024/02/02' },
    { data: 30, date: '2024/03/14' },
    { data: 47, date: '2024/03/03' },
    { data: 21, date: '2024/02/07' },
  ];

  public filteredLineChartData = this.dummyData.sort(this.sortByDateAsc);

  constructor() {}

  ngOnInit(): void {
    this.initSize();
    this.filterRange = [];
    this.status = [
      { statusId: 'draft', statusDesc: 'Draft' },
      { statusId: 'returnBU', statusDesc: 'Return to BU' },
      { statusId: 'asigned', statusDesc: 'Asigned' },
      { statusId: 'darFinal', statusDesc: 'Dar Final' },
      { statusId: 'loancomap', statusDesc: 'Loan Committee Approval' },
    ];
    this.dateRange = [
      { rangeId: '1', rangeDesc: 'weekly' },
      { rangeId: '2', rangeDesc: 'montlhy' },
      { rangeId: '3', rangeDesc: 'yearly' },
    ];
  }

  public initSize(): void {
    this.columnSizeX = 3;
    this.columnSizeY = 2;
    this.pieSizeX = 3;
    this.pieSizeY = 2;
    this.splineSizeX = 6;
    this.splineSizeY = 2;
    // if (this.mediaQuery.matches) {
    //   this.columnSizeX = 3;
    //   this.columnSizeY = 3;
    //   this.pieSizeX = 3;
    //   this.pieSizeY = 3;
    //   this.splineSizeX = 6;
    //   this.splineSizeY = 3;
    // } else {
    //   this.columnSizeX = 3;
    //   this.columnSizeY = 2;
    //   this.pieSizeX = 3;
    //   this.pieSizeY = 2;
    //   this.splineSizeX = 6;
    //   this.splineSizeY = 2;
    // }
  }

  onButtonClick(): void {
    const selectedElement: HTMLCollection = document.getElementsByClassName('e-selected-style');
    this.dashboard.removeAll();
    this.initializeTemplate(<HTMLElement>selectedElement[0]);
  }
  onTemplateClick(args: any): void {
    const target: any = args.target;
    const selectedElement: any = document.getElementsByClassName('e-selected-style');
    if (selectedElement.length) {
      selectedElement[0].classList.remove('e-selected-style');
    }
    if ((<HTMLElement>target).className === 'image-pattern-style') {
      this.dashboard.removeAll();
      this.initializeTemplate(<HTMLElement>args.target);
    }
    (<HTMLElement>target).classList.add('e-selected-style');
  }
  public initializeTemplate(element: HTMLElement): void {
    const updatedPanels: PanelModel[] = [];
    const index: number = parseInt(element.getAttribute('data-id'), 10) - 1;
    const panel: any = Object.keys(this.panels[index]).map((panelIndex: string) => this.panels[index][panelIndex]);
    for (let i = 0; i < panel.length; i++) {
      const panelModelValue: PanelModel = {
        row: panel[i].row,
        col: panel[i].col,
        sizeX: panel[i].sizeX,
        sizeY: panel[i].sizeY,
        header: '<div class="e-header-text">Header Area</div><div class="header-border"></div>',
        content: '<div class="panel-content">Content Area</div>',
      };
      updatedPanels.push(panelModelValue);
    }
    this.dashboard.panels = updatedPanels;
  }

  public convertDate() {
    if (this.filterRange[1] !== null) {
      const startDate = moment(this.filterRange[0]).format('YYYY/MM/DD').toString();
      const endDate = moment(this.filterRange[1]).format('YYYY/MM/DD').toString();

      this.filteredLineChartData = this.dummyData.filter(obj => obj.date >= startDate && obj.date <= endDate);
    }
  }

  // for demo purposes only
  private sortByDateAsc(a: any, b: any): number {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  }
}
