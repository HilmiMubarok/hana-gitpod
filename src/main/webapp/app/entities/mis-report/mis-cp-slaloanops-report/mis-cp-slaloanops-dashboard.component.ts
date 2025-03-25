import { Component, OnInit } from '@angular/core';
import { MisDashboardService } from '../mis-dashboard/mis-dashboard.service';

@Component({
    selector: 'jhi-mis-cp-slaloanops-dashboard',
    template: `
    <jhi-mis-dashboard-card title="SERVICE LEVEL AGREEMENT">
      <div class="row">
        <ng-container *ngFor="let d of data">
          <div class="col-md-3 my-2">
            <jhi-mis-dashboard-card-statistic [title]="d.statusDescription" [count]="d.total"></jhi-mis-dashboard-card-statistic>
          </div>
        </ng-container>
      </div>
    </jhi-mis-dashboard-card>
  `,
    styles: [
        `
      .form-controls {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      :host ::ng-deep .mat-mdc-form-field {
        width: 140px;
        margin-bottom: -1.25em;
      }

      :host ::ng-deep .mat-mdc-form-field-wrapper {
        padding-bottom: 0;
      }

      :host ::ng-deep .mat-form-field-wrapper {
        padding: 0 !important;
      }

      :host ::ng-deep .mat-mdc-text-field-wrapper {
        background-color: white !important;
        border-radius: 4px;
      }

      :host ::ng-deep .mdc-text-field--outlined {
        --mdc-outlined-text-field-container-height: 36px;
      }

      :host ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }
    `,
    ],
})
export class MisCpSlaLoanOpsDashboardComponent implements OnInit {
    constructor(private dashboardService: MisDashboardService) { }

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

    data;

    statuses = ['LOAN_OPS_CHECKING', 'LOAN_OPS_DISTRIBUTION', 'LOAN_OPS_REVIEW', 'CP_COMPLETE'];

    ngOnInit(): void {
        const positionId = this.getLocStor('POS');
        this.dashboardService
            .getStatisticLoanOps(positionId)
            .subscribe(res => (this.data = res.filter(d => this.statuses.includes(d.statusId))));
    }
}
