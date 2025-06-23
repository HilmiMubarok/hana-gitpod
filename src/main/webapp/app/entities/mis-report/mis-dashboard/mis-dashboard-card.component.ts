import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'jhi-mis-dashboard-card',
  template: `
    <div class="chart-container my-4">
      <div class="chart-header" (click)="toggleExpand()">
        <div class="title">{{ title }}</div>
        <button mat-icon-button class="expand-button">
          <mat-icon [@rotateIcon]="isExpanded ? 'expanded' : 'collapsed'"> expand_less </mat-icon>
        </button>
      </div>

      <div [@expandCollapse]="isExpanded ? 'expanded' : 'collapsed'" class="collapsible-content">
        <div *ngIf="isExpanded">
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </div>
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
        background: #5bafaa;
        border-radius: 8px 8px 0 0;
      }

      .chart-header:hover {
        cursor: pointer;
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
export class MisDashboardCardComponent implements OnInit {
  @Input() title: string;
  @Input() defaultToggle = true;
  @Input() content: TemplateRef<any>;

  isExpanded = true;

  ngOnInit(): void {
    this.isExpanded = this.defaultToggle;
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
}