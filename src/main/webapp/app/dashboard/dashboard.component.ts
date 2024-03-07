import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { IMenuAccess } from 'app/entities/menu-access/menu-access.model';
import { MenuAccessService } from 'app/entities/menu-access/menu-access.service';
import { TemplateService } from 'app/layouts/template/template.service';
import { IChartData } from './dashboard.model';
import { DashboardService } from './dashboard.service';

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

  constructor(
    private menuAccessService: MenuAccessService,
    private templateService: TemplateService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.preLoadData();
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
          .getGroupByStatus({ idPosition: this.positionId })
          .subscribe(res => {
            const groupByStatus = res.body;
            this.mergedChartData.push({
              chartsTitle: 'Charts Credit Proposal',
              accessibleMenu: tempDataCP[0].accessibleMenuCP,
              groupByStatus,
            });
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
          .getGroupByStatus({ idPosition: this.positionId })
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
}
