import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { IMenuAccess } from 'app/entities/menu-access/menu-access.model';
import { MenuAccessService } from 'app/entities/menu-access/menu-access.service';
import { IChartData } from './dashboard.model';
import { DashboardService } from './dashboard.service';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { IGeneralParameter } from 'app/entities/master-parameter/general-parameter/general-parameter.model';
import { InternalService } from 'app/entities/internal/internal.service';

@Component({
  selector: 'jhi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.style.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  private positionId: number;
  public positionTypeId: string;

  public mergedChartData: IChartData[] = [];
  public groupByStatusDataSource: any = [];

  public proposalTypeList: string[] = [];
  public proposalType: string[] = [];
  public segment: string[] = [];
  public segmentList: string[] = [];

  public filterApplied = false;

  public isLoading = false;

  public showFilter = false;

  constructor(
    private menuAccessService: MenuAccessService,
    private dashboardService: DashboardService,
    private generalParameterService: GeneralParameterService
  ) {}

  ngOnInit(): void {
    this.loadFilters();
    this.preLoadData();
  }

  public loadFilters(): void {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'PROPOSAL_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        const filters = res.body.filter(obj => obj.statusId === 'ACTIVE');
        filters.forEach(item => this.proposalTypeList.push(item.code));
        this.proposalType = this.proposalTypeList;
      });

    this.dashboardService
      .getSegment({
        page: 0,
        size: 999,
      })
      .subscribe(res => {
        const segment = res.body.filter(obj => obj.parentId === '10000');

        const _segmentList = [];
        segment.forEach(obj => {
          _segmentList.push(obj.facilityName);
        });
        this.segmentList = _segmentList;
        this.segment = this.segmentList;
      });
  }

  public applyFilters(): void {
    this.filterApplied = !this.filterApplied;
  }

  private preLoadData(): void {
    this.positionId = this.getLocStor('POS');
    this.positionTypeId = this.getLocStor('POSO');
    this.menuAccessService
      .filterBy({
        positionTypeId: this.getLocStor('POSO'),
        page: 0,
        size: 999,
        sort: ['ASC'],
      })
      .subscribe(positionTypeList => {
        const allowedDashboard = positionTypeList.body.filter(obj => obj.menuItemId.includes('DASHBOARD_'));
        this.categorizedCharts(allowedDashboard);
      });
  }

  private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }

  public categorizedCharts(allowedDashboard): void {
    if (allowedDashboard.length > 0) {
      const _tempData: IMenuAccess[] = allowedDashboard.filter(obj => obj.menuItemId.includes('DASHBOARD_'));
      const tempDataCP: any[] = [];
      const tempDataAppraisal: any[] = [];
      const menuItemCp: string[] = [];
      const accessibleMenuCP: IMenuAccess[] = [];
      const accessibleMenuAppraisal: IMenuAccess[] = [];
      const menuItemAppraisal: string[] = [];

      _tempData.forEach(obj => {
        if (obj.menuItemId.includes('_CREDIT_PROPOSAL_')) {
          menuItemCp.push(obj.menuItemId);
          accessibleMenuCP.push(obj);
        } else if (obj.menuItemId.includes('_APPRAISAL_')) {
          menuItemAppraisal.push(obj.menuItemId);
          accessibleMenuAppraisal.push(obj);
        }
      });

      tempDataCP.push({ menuItemCp, accessibleMenuCP });
      tempDataAppraisal.push({ menuItemAppraisal, accessibleMenuAppraisal });

      if (menuItemCp.length > 0) {
        this.loadDataCp(tempDataCP);
      }
      if (menuItemAppraisal.length > 0) {
        this.loadDataAppraisal(tempDataAppraisal);
      }
    }
  }

  public loadDataCp(tempDataCP): Promise<void> {
    return new Promise((resolve, reject) => {
      if (tempDataCP.some(item => !item.menuItemCp.includes('DASHBOARD_CHART'))) {
        this.dashboardService
          .creditProposals()
          .getGroupByStatus({ proposeType: this.proposalType, segment: this.segment, idPosition: this.positionId })
          .subscribe(res => {
            const groupByStatus = res.body;
            this.mergedChartData.push({
              chartsTitle: 'Charts Credit Proposal',
              accessibleMenu: tempDataCP[0].accessibleMenuCP,
              groupByStatus,
            });
            this.showFilter = true;
            resolve();
          });
      }
    });
  }

  public loadDataAppraisal(tempDataAppraisal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (tempDataAppraisal.some(item => !item.menuItemAppraisal.includes('DASHBOARD_CHART'))) {
        this.dashboardService
          .appraisal()
          .getGroupByStatus({ proposeType: this.proposalType, segment: this.segment, idPosition: this.positionId })
          .subscribe(res => {
            const groupByStatus = res.body;
            this.mergedChartData.push({
              chartsTitle: 'Charts Appraisal',
              accessibleMenu: tempDataAppraisal[0].accessibleMenuAppraisal,
              groupByStatus,
            });

            resolve();
          });
      }
    });
  }

  public changeLoading(event: boolean): void {
    this.isLoading = event;
    console.log('this.laoding', this.isLoading);
  }
}
