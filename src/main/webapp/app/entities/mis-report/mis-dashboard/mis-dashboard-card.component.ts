import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'jhi-mis-dashboard-card',
  template: `
    <div class="chart-container my-4">
      <div class="chart-header">
        <div class="title">{{title}}</div>
        <button mat-icon-button class="expand-button" (click)="toggleExpand()">
          <mat-icon [@rotateIcon]="isExpanded ? 'expanded' : 'collapsed'"> expand_less </mat-icon>
        </button>
      </div>

      <div [@expandCollapse]="isExpanded ? 'expanded' : 'collapsed'" class="collapsible-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .chart-container {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .title {
        font-size: 16px;
        font-weight: 500;
        color: white;
        text-transform: uppercase;
      }

      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #5BAFAA;
        border-radius: 8px 8px 0 0;
      }

      .expand-button {
        color: white;
        line-height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .collapsible-content {
        overflow: hidden;
        padding: 20px;
      }

    `,
  ],
  animations: [
    trigger('expandCollapse', [
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
          willChange: 'height, opacity',
        })
      ),
      state('collapsed', style({ height: '0', opacity: 0 })),
      transition('expanded <=> collapsed', [animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')]),
    ]),
    trigger('rotateIcon', [
      state('expanded', style({ transform: 'rotate(0deg)' })),
      state('collapsed', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed', [animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')]),
    ]),
  ],
})
export class MisDashboardCardComponent {

  @Input() title: string;

  isExpanded = true;

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

}