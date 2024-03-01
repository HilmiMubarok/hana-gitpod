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
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe(newPos => {
      this.positionId = newPos.id;
      this.menuAccessService
        .filterBy({
          positionTypeId: newPos.positionTypeId,
          page: 0,
          size: 999,
          sort: ['ASC'],
        })
        .subscribe(positionTypeList => {
          const allowedDashboard = positionTypeList.body.filter(obj => obj.menuItemId.includes('DASHBOARD_'));
          this.splitAvailableData(allowedDashboard);
        });
    });
  }

  private splitAvailableData(allowedDashboard): void {
    const availableStatus: IMenuAccess[] = allowedDashboard.filter(obj => !obj.menuItemId.includes('DASHBOARD_CHART_'));
    const tempData: IMenuAccess[] = allowedDashboard.filter(obj => obj.menuItemId.includes('DASHBOARD_CHART_'));

    const argCP: IMenuAccess[] = availableStatus.filter(item => item.menuItemId.includes('_CREDIT_PROPOSAL_'));
    const argsAppraisal: IMenuAccess[] = availableStatus.filter(item => item.menuItemId.includes('_APPRAISAL_'));

    const creditProposalFilter: IMenuAccess[] = tempData.filter(obj => obj.menuItemId.includes('_CREDIT_PROPOSAL_'));
    const appraisalFilter: IMenuAccess[] = tempData.filter(obj => obj.menuItemId.includes('_APPRAISAL_'));

    this.categorizedChartsData(creditProposalFilter, appraisalFilter);
    this.loadStatusData(argCP, argsAppraisal);
  }

  public categorizedChartsData(creditProposalFilter: IMenuAccess[], appraisalFilter: IMenuAccess[]): void {
    if (creditProposalFilter.length > 0) {
      this.mergedChartData.push({ chartsTitle: 'Charts Credit Proposal', accessibleMenu: creditProposalFilter });
    }
    if (appraisalFilter.length > 0) {
      this.mergedChartData.push({ chartsTitle: 'Charts Appraisal', accessibleMenu: appraisalFilter });
    }
  }

  public loadStatusData(argCP: IMenuAccess[], argsAppraisal: IMenuAccess[]): void {
    if (argCP.length > 0) {
      this.dashboardService
        .creditProposals()
        .getGroupByStatus({ idPosition: this.positionId })
        .subscribe(res => {
          if (res) {
            const menuItemDescription = argCP[0].menuItemDescription;
            this.groupByStatusDataSource.push({ menuItemDescription, chartsData: res.body });
          }
        });
    }

    if (argsAppraisal.length > 0) {
      this.dashboardService
        .appraisal()
        .getGroupByStatus({ idPosition: this.positionId })
        .subscribe(res => {
          if (res) {
            const menuItemDescription = argsAppraisal[0].menuItemDescription;
            this.groupByStatusDataSource.push({ menuItemDescription, chartsData: res.body });
          }
        });
    }
  }
}
