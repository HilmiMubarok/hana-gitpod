import { Component } from '@angular/core';

@Component({
  selector: 'jhi-mis-cp-slaloanops-report',
  templateUrl: './mis-cp-slaloanops-report.component.html',
  styles: [
    `
      .department-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        border-radius: 12px;
        height: 74px;
        margin-bottom: 24px;
      }

      .department-name {
        font-weight: bold;
        margin-top: 10px;
        color: #5BAFAA;
      }

      .nav-buttons {
        display: flex;
        gap: 12px;
      }

      .nav-button {
        min-width: 250px;
        min-height: 40px;
        border-radius: 10px;
        font-weight: bold;
        color: #9DCAC7;
      }

      .nav-button.active {
        background-color: #5BAFAA;
        color: white;
      }
      
      .chart-navigation {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 16px;
        margin: 16px 0;
      }

      .chart-navigation-button {
        border-radius: 12px;
        padding: 16px 24px;
        font-weight: bold;
        border: none;
        outline: none;
        background: #D4D4D4;
        color: white;
      }

      .chart-navigation-button.active {
        background: #3C958F;
        color: white;
      }
    `,
  ],
})
export class MisCpSlaloanopsReportComponent {

  page = 'dashboard';
  dashboardPage = 'credit-admin';

  setPage(page: string): void {
    this.page = page;
  }

  setDashboardPage(page: string): void {
    this.dashboardPage = page;
  }

}
