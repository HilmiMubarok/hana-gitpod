import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { DashboardLayoutComponent, PanelModel } from '@syncfusion/ej2-angular-layouts';
import { Browser } from '@syncfusion/ej2-base';

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

  constructor() {}

  ngOnInit(): void {
    this.initSize();
    this.status = [
      { statusId: 'draft', statusDesc: 'Draft' },
      { statusId: 'returnBU', statusDesc: 'Return to BU' },
      { statusId: 'asigned', statusDesc: 'Asigned' },
      { statusId: 'darFinal', statusDesc: 'Dar Final' },
      { statusId: 'loancomap', statusDesc: 'Loan Committee Approval' },
    ];
    this.dateRange = [
      { rangeId: '1', rangeDesc: '1 Week' },
      { rangeId: '2', rangeDesc: '2 Week' },
      { rangeId: '3', rangeDesc: '3 Week' },
      { rangeId: '4', rangeDesc: '1 Month' },
      { rangeId: '5', rangeDesc: '2 Month' },
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
}
