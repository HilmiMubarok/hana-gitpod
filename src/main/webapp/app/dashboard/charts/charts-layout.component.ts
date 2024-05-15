import { Component, ViewEncapsulation, ViewChild, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { DashboardLayoutComponent, PanelModel } from '@syncfusion/ej2-angular-layouts';
import { Browser } from '@syncfusion/ej2-base';
import moment from 'moment';
import { IGroupByStatus, IInterval } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';
import { IMenuAccess } from 'app/entities/menu-access/menu-access.model';
import { MessageService } from 'primeng/api';
import { MasterPermissionService } from 'app/entities/master-parameter/master-permission/master-permission.service';
import { IDueDate } from './bar-chart/bar-chart.model';
import { IProgress } from './line-chart/line-chart.model';

@Component({
  selector: 'jhi-charts-layout',
  templateUrl: './charts-layout.component.html',
  styleUrls: ['./charts-layout.style.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ChartsLayoutComponent implements OnInit, OnChanges {
  private _chartsAvailability: IMenuAccess[];
  private _idPosition: number;
  private _positionType: string;
  private _applyFilter: boolean;
  private _proposalTypes: string[];
  private _segments: string[];

  @Input()
  get idPosition() {
    return this._idPosition;
  }

  set idPosition(param: number) {
    this._idPosition = param;
  }

  @Input()
  get positionType() {
    return this._positionType;
  }

  set positionType(param: string) {
    this._positionType = param;
  }

  @Input()
  get chartsAvailability() {
    return this._chartsAvailability;
  }

  set chartsAvailability(param: IMenuAccess[]) {
    this._chartsAvailability = param;
  }

  @Input()
  get applyFilter() {
    return this._applyFilter;
  }

  set applyFilter(param: boolean) {
    this._applyFilter = param;
  }

  @Input()
  get proposalTypes() {
    return this._proposalTypes;
  }

  set proposalTypes(param: string[]) {
    this._proposalTypes = param;
  }

  @Input()
  get segments() {
    return this._segments;
  }

  set segments(param: string[]) {
    this._segments = param;
  }

  @Output() loading = new EventEmitter<boolean>();

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

  public aspectRatio: any = 100 / 85;
  public headerCount = 1;
  public count = 8;

  public creditProposalFilter: string[] = [];
  public appraisalFilter: string[] = [];

  public intervalList: IInterval[] = [];
  public statusList: any[] = [];
  public statusListField: Object = { text: 'statusDescription', value: 'statusId' };

  public summaryStatusDataSource: IGroupByStatus[] = [];

  public dueDateDataSource: IDueDate[] = [];
  public _dueDateDates: Date = new Date();
  public dueDateDates: string = moment(this._dueDateDates).format('YYYY-MM-DD').toString();
  public _selectedDuedateInterval: string;
  public selectedDuedateInterval = 'DAILY';

  public _startDateThruDate: string = moment(new Date()).format('YYYY-MM-DD').toString();
  public startDateThruDate: { startDate: string; thruDate: string } = {
    startDate: this._startDateThruDate,
    thruDate: this._startDateThruDate,
  };
  public progressDataSource: IProgress[] = [];
  public _selectedStatus: string;
  public selectedStatus = 'DRAFT';
  public _progressInterval: string;
  public progressInterval = 'DAILY';

  private pristine = true;

  constructor(
    protected dashboardService: DashboardService,
    protected messageService: MessageService,
    protected masterPermissionService: MasterPermissionService
  ) {}

  ngOnInit(): void {
    // this.loadStatus();
    this.loadInterval().then(() => {
      this.preLoadData();
    });
    this.initSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.pristine) {
      this.pristine = false;
    } else {
      if (changes['applyFilter']) {
        this.loading.emit(true);
        this.reloadAllData().then(() => {
          this.loading.emit(false);
        });
      }
    }
  }

  private reloadAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadDueDate().then(() => {
        this.loadSummaryStatus().then(() => {
          this.loadProgress().then(() => {
            resolve();
          });
        });
      });
    });
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

  public loadInterval(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dashboardService.getInterval().subscribe(res => {
        this.intervalList = res.body;
        resolve();
      });
    });
  }

  // public loadStatus(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     const menuItemId = 'CREDIT_PROPOSAL_STATUS';
  //     this.masterPermissionService.filterBy({ positionTypeId: this.positionType, menuItemId }).subscribe(res => {
  //       res.body.forEach(permissionList => {
  //         this.statusList.push({
  //           statusId: permissionList.menuStatusItem.statusId,
  //           statusDescription: permissionList.menuStatusItem.statusDescription,
  //         });
  //       });
  //       resolve();
  //     });
  //   });
  // }

  public preLoadData(): void {
    if (this.chartsAvailability.length > 0) {
      this.chartsAvailability.forEach(obj => {
        if (obj.menuItemId.includes('_CREDIT_PROPOSAL_')) {
          this.creditProposalFilter.push(obj.menuItemId);
        }
        if (obj.menuItemId.includes('_APPRAISAL_')) {
          this.appraisalFilter.push(obj.menuItemId);
        }
      });

      this.loadDueDate();
      this.loadSummaryStatus();
      this.loadProgress();
    }
  }

  public loadDueDate(): Promise<IDueDate[]> {
    return new Promise<IDueDate[]>((resolve, reject) => {
      if (this.creditProposalFilter.length > 0 && this.creditProposalFilter.some(item => item.includes('_DUEDATE'))) {
        this.dashboardService
          .creditProposals()
          .getDueDate({
            proposeType: this.proposalTypes,
            segment: this.segments,
            date: this.dueDateDates,
            idPosition: this.idPosition,
            interval: this.selectedDuedateInterval,
          })
          .subscribe(res => {
            this.dueDateDataSource = res.body;
            resolve(res.body);
          });
      }
      if (this.appraisalFilter.length > 0 && this.appraisalFilter.some(item => item.includes('_DUEDATE'))) {
        this.dashboardService
          .appraisal()
          .getDueDate({
            proposeType: this.proposalTypes,
            segment: this.segments,
            date: this.dueDateDates,
            idPosition: this.idPosition,
            interval: this.selectedDuedateInterval,
          })
          .subscribe(res => {
            this.dueDateDataSource = res.body;
            resolve(res.body);
          });
      }
    });
  }

  public loadSummaryStatus(): Promise<IGroupByStatus[]> {
    return new Promise<IGroupByStatus[]>((resolve, reject) => {
      if (this.creditProposalFilter.length > 0 && this.creditProposalFilter.some(item => item.includes('_STATUS'))) {
        this.dashboardService
          .creditProposals()
          .getSummaryStatus({ idPosition: this.idPosition, proposeType: this.proposalTypes, segment: this.segments })
          .subscribe(res => {
            this.summaryStatusDataSource = res.body;
            resolve(res.body);
          });
      }

      if (this.appraisalFilter.length > 0 && this.appraisalFilter.some(item => item.includes('_STATUS'))) {
        this.dashboardService
          .appraisal()
          .getSummaryStatus({ idPosition: this.idPosition, proposeType: this.proposalTypes, segment: this.segments })
          .subscribe(res => {
            this.summaryStatusDataSource = res.body;
            resolve(res.body);
          });
      }
    });
  }

  public loadProgress(): Promise<IProgress[]> {
    return new Promise<IProgress[]>((resolve, reject) => {
      if (this.creditProposalFilter.length > 0 && this.creditProposalFilter.some(item => item.includes('_PROGRESS'))) {
        this.dashboardService
          .creditProposals()
          .getProgress({
            proposeType: this.proposalTypes,
            segment: this.segments,
            fromDate: this.startDateThruDate.startDate,
            thruDate: this.startDateThruDate.thruDate,
            interval: this.progressInterval,
            idPosition: this.idPosition,
          })
          .subscribe(res => {
            this.progressDataSource = res.body;
            resolve(res.body);
          });
      }
      if (this.appraisalFilter.length > 0 && this.appraisalFilter.some(item => item.includes('_PROGRESS'))) {
        this.dashboardService
          .appraisal()
          .getProgress({
            proposeType: this.proposalTypes,
            segment: this.segments,
            fromDate: this.startDateThruDate.startDate,
            thruDate: this.startDateThruDate.thruDate,
            interval: this.progressInterval,
            idPosition: this.idPosition,
          })
          .subscribe(res => {
            this.progressDataSource = res.body;
            resolve(res.body);
          });
      }
    });
  }

  public recievedDate(event: string): void {
    this.dueDateDates = event;
  }

  public dueDateInterval(_selectedDuedateInterval): void {
    this.selectedDuedateInterval = _selectedDuedateInterval;
  }

  public recieveStartThruDate(event: any): void {
    this.startDateThruDate = event;
  }

  public progressIntervalOnChange(_progressInterval): void {
    this.progressInterval = _progressInterval;
  }

  public onchangeSelectStatus(_selectedStatus): void {
    this.selectedStatus = _selectedStatus;
  }
}
