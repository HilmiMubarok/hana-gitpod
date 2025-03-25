import { Component, Input } from '@angular/core';

@Component({
    selector: 'jhi-mis-dashboard-card-statistic',
    template: `
    <div class="statistic-card border-1 surface-border border-round px-2">
      <div class="status-card-headers title-center">{{ title }}</div>
      <div class="item-status-wrapper">
        <span class="total-status "> {{ count }} </span>
        <span class="staus-icons "><fa-icon icon="envelope"> </fa-icon></span>
      </div>
    </div>
  `,
    styles: [
        `
      .total-status {
        font-size: 3rem;
        color: rgb(94, 110, 130);
        padding-left: 0.4rem;
      }

      .item-status-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        background-color: #eaf1f0;
        border-radius: 0 0 20px 20px;
      }

      .item-status-wrapper .staus-icons {
        font-size: 4rem;
        color: rgb(94, 110, 130);
        padding-left: 1rem;
      }

      .status-card-headers {
        background-color: #5bafaa !important;
        border-top-left-radius: 20px !important;
        border-top-right-radius: 20px !important;
        justify-content: center;
        border: none !important;
        height: 50px !important;
        display: flex;
        align-items: center;
        margin: auto;
        font-weight: bold;
        color: white;
        font-size: 22px;
      }
      .title_center {
        display: flex;
        align-items: center;
        font-weight: 700;
      }
    `,
    ],
})
export class MisDashboardCardStatisticComponent {
    @Input() title: string;
    @Input() count: number;
}
