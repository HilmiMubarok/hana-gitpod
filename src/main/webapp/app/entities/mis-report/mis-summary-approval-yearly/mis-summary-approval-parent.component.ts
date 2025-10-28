import { Component } from '@angular/core';

@Component({
  selector: 'jhi-mis-summary-approval-parent',
  templateUrl: './mis-summary-approval-parent.component.html',
  styleUrls: ['./mis-summary-approval-parent.component.css'],
  styles: [
    `
      .mat-button-toggle-group-appearance-standard {
        border: none !important;
        box-shadow: none !important;
      }

      .mat-button-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 4px;
        border-radius: 6px !important;
        font-weight: 500;
        font-size: 13px;
        text-transform: none;
        min-width: 110px;
        height: 36px;
        border: none !important;
        background: #dcdcdc;
        color: #333;
        box-shadow: none;
      }

      .mat-button-toggle-checked {
        background-color: #48a5a0 !important;
        color: white !important;
        border: none !important;
      }

      .row {
        border: none !important;
      }

      .department-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        border-radius: 12px;
        height: 74px;
        margin-bottom: 3px;
        margin-top: 25px;
      }

      .department-name {
        font-weight: bold;
        color: #5bafaa;
      }
    `,
  ],
})
export class MisSummaryApprovalParentComponent {
  activeTab: 'yearly' | 'monthly' = 'yearly';

  setTab(tab: 'yearly' | 'monthly'): void {
    this.activeTab = tab;
  }

  isActive(tab: 'yearly' | 'monthly'): boolean {
    return this.activeTab === tab;
  }
}
