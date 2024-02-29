import { Component, ViewEncapsulation, ViewChild, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DashboardLayoutComponent, PanelModel } from '@syncfusion/ej2-angular-layouts';
import { Browser } from '@syncfusion/ej2-base';
import moment from 'moment';
import { IGroupByStatus, lineChartDummyData } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';
import { IMenuAccess } from 'app/entities/menu-access/menu-access.model';

@Component({
  selector: 'jhi-charts-layout',
  templateUrl: './charts-layout.component.html',
  styleUrls: ['./charts-layout.style.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ChartsLayoutComponent implements OnInit {
  private _chartsAvailability: any;
  private _idPosition: string;

  @Input()
  get idPosition() {
    return this._idPosition;
  }

  set idPosition(param: any) {
    this._idPosition = param;
  }

  @Input()
  get chartsAvailability() {
    return this._chartsAvailability;
  }

  set chartsAvailability(param: any) {
    this._chartsAvailability = param;
  }

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
  public summaryStatusDataSource: IGroupByStatus[] = [];
  private lineChartData = lineChartDummyData;
  public filteredLineChartData = this.lineChartData.sort(this.sortByDateAsc);

  constructor(protected dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.initSize();
    this.filterRange = [];
    this.preLoadData();
  }

  public initSize(): void {
    this.columnSizeX = 3;
    this.columnSizeY = 2;
    this.pieSizeX = 3;
    this.pieSizeY = 2;
    this.splineSizeX = 6;
    this.splineSizeY = 2;
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

      this.filteredLineChartData = this.lineChartData.filter(obj => obj.date >= startDate && obj.date <= endDate);
    }
  }
  public preLoadData(): void {
    if (this.chartsAvailability.length > 0) {
      const creditProposalFilter: IMenuAccess[] = this.chartsAvailability.filter(obj => obj.menuItemId.includes('_CREDIT_PROPOSAL_'));
      const appraisalFilter: IMenuAccess[] = this.chartsAvailability.filter(obj => obj.menuItemId.includes('_APPRAISAL_'));

      // const availableChartDueDate = this.chartsAvailability.filter(obj => obj.menuItemId.includes('_DUEDATE'));
      // const availableChartProgress = this.chartsAvailability.filter(obj => obj.menuItemId.includes('_PROGRESS'));
      // this.loadDueDate(creditProposalFilter, appraisalFilter);
      this.loadSummaryStatus(creditProposalFilter, appraisalFilter);
      // this.loadProgress(creditProposalFilter, appraisalFilter);
    }
  }

  // loadDueDate(availableChartDueDate: any) {
  //   if (availableChartDueDate.length > 0) {
  //     const CP = availableChartDueDate.find(obj => obj.menuItemId.includes('_CREDIT_PROPOSAL_'));
  //     const appraisal = availableChartDueDate.find(obj => obj.menuItemId.includes('_APPRAISAL_'));

  //     if (CP) {
  //       this.dashboardService.creditProposals().getDueDate({ idPosition: this.idPosition });
  //     }
  //     if (appraisal) {
  //       this.dashboardService.appraisal().getDueDate({ idPosition: this.idPosition });
  //     }
  //   }
  // }
  public loadSummaryStatus(creditProposalFilter: IMenuAccess[], appraisalFilter: IMenuAccess[]) {
    if (creditProposalFilter.length > 0) {
      const cpStatusChart = creditProposalFilter.filter(
        obj => obj.menuItemId.includes('DASHBOARD_CHART_') && obj.menuItemId.includes('STATUS')
      );
      if (cpStatusChart.length > 0) {
        this.dashboardService
          .creditProposals()
          .getSummaryStatus({ idPosition: this.idPosition })
          .subscribe(res => {
            this.summaryStatusDataSource = res.body;
          });
      }
    }

    if (appraisalFilter.length > 0) {
      const appraisalStatusChart = appraisalFilter.filter(
        obj => obj.menuItemId.includes('DASHBOARD_CHART_') && obj.menuItemId.includes('STATUS')
      );
      if (appraisalStatusChart.length > 0) {
        this.dashboardService
          .appraisal()
          .getSummaryStatus({ idPosition: this.idPosition })
          .subscribe(res => {
            this.summaryStatusDataSource = res.body;
          });
      }
    }
  }
  // loadProgress(availableChartProgress: any) {
  //   if (availableChartProgress.length > 0) {
  //     const CP = availableChartProgress.find(obj => obj.menuItemId.includes('_CREDIT_PROPOSAL_'));
  //     const appraisal = availableChartProgress.find(obj => obj.menuItemId.includes('_APPRAISAL_'));
  //   }
  // }

  // for demo purposes only
  private sortByDateAsc(a: any, b: any): number {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  }
}
