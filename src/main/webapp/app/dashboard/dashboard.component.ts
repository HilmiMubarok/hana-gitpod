import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { DashboardLayoutComponent, PanelModel } from '@syncfusion/ej2-angular-layouts';
import { Browser } from '@syncfusion/ej2-base';
import { IMenuAccess } from 'app/entities/menu-access/menu-access.model';
import { MenuAccessService } from 'app/entities/menu-access/menu-access.service';
import { TemplateService } from 'app/layouts/template/template.service';

export interface IChartData {
  chartsTitle?: string;
  chartData?: IMenuAccess[];
}

@Component({
  selector: 'jhi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.style.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  public availableStatus: IMenuAccess[];
  // private availableChartDueDate: IMenuAccess[];
  // private availableChartStatus: IMenuAccess[];
  // private availableChartProgress: IMenuAccess[];

  public mergedChartData: IChartData[];

  constructor(private menuAccessService: MenuAccessService, private templateService: TemplateService) {}

  ngOnInit(): void {
    this.preLoadData();
  }

  private preLoadData(): void {
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe(newPos => {
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
    this.availableStatus = allowedDashboard.filter(obj => !obj.menuItemId.includes('DASHBOARD_CHART_'));

    // const availableChartDueDate = allowedDashboard.filter(obj => obj.menuItemId.includes('_DUEDATE'));
    // const availableChartStatus = allowedDashboard.filter(
    //   obj => obj.menuItemId.includes('DASHBOARD_CHART_') && obj.menuItemId.includes('STATUS')
    // );
    // const availableChartProgress = allowedDashboard.filter(obj => obj.menuItemId.includes('_PROGRESS'));

    const tempData: any = allowedDashboard.filter(obj => obj.menuItemId.includes('DASHBOARD_CHART_'));
    this.categorizedChartsData(tempData);
  }

  public categorizedChartsData(tempData: any): void {
    if (tempData.length > 0) {
      const creditProposalFilter = tempData.filter(obj => obj.menuItemId.includes('_CREDIT_PROPOSAL_'));
      const creditProposalData =
        creditProposalFilter.length > 0 ? { chartsTitle: 'Charts Credit Proposal', chartData: creditProposalFilter } : {};

      const appraisalFilter = tempData.filter(obj => obj.menuItemId.includes('_APPRAISAL_'));
      const appraisalData = appraisalFilter.length > 0 ? { chartsTitle: 'Charts Appraisal', chartData: appraisalFilter } : {};

      this.mergedChartData.push(creditProposalData, appraisalData);
    } else {
      this.mergedChartData = null;
    }
  }
}
