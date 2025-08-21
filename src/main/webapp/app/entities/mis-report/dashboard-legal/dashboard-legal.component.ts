import { Component } from "@angular/core";

@Component({
  selector: 'jhi-dashboard-legal',
  templateUrl: './dashboard-legal.component.html',
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
        color: #5bafaa;
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
        color: #9dcac7;
      }

      .nav-button.active {
        background-color: #5bafaa;
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
        background: #d4d4d4;
        color: white;
      }

      .chart-navigation-button.active {
        background: #3c958f;
        color: white;
      }
    `,
  ],
})
export class DashboardLegalComponent {
  constructor() {}
}