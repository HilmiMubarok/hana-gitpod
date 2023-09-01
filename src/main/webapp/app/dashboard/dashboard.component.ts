import { Component, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { DashboardLayoutComponent, PanelModel } from '@syncfusion/ej2-angular-layouts';
import { Browser } from '@syncfusion/ej2-base';

@Component({
  selector: 'jhi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.style.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  @ViewChild('predefine_dashboard')
  public dashboard: DashboardLayoutComponent;
  public panels: any[];
  public layoutColor: string;
  public cellSpacing: number[] = [15, 15];
  public cellAspectRatio: number = Browser.isDevice ? 1 : 0.8;
  public columns: number = Browser.isDevice ? 2 : 8;
  public columnSizeX: number = Browser.isDevice ? 1 : 5;
  public columnSizeY: number = Browser.isDevice ? 1 : 2;
  public pieColumn: number = Browser.isDevice ? 1 : 5;
  public pieSizeX: number = Browser.isDevice ? 1 : 3;
  public pieSizeY: number = Browser.isDevice ? 1 : 2;
  public splineRow: number = Browser.isDevice ? 1 : 4;
  public splineSizeX: number = Browser.isDevice ? 2 : 8;
  public splineSizeY: number = Browser.isDevice ? 1 : 3;
  public chartArea: Object = {
    border: { width: 0 },
  };

  public aspectRatio: any = 100 / 85;
  public headerCount = 1;
  constructor() {
    // code
  }

  public count = 8;

  onButtonClick(): void {
    const selectedElement: HTMLCollection = document.getElementsByClassName('e-selected-style');
    this.dashboard.removeAll();
    this.initializeTemplate(<HTMLElement>selectedElement[0]);
  }
  onTemplateClick(args: any): void {
    const target: any = args.target;
    const selectedElement: any = document.getElementsByClassName('e-selected-style');
    if (selectedElement.length) {
      selectedElement[0].classList.remove('e-selected-style');
    }
    if ((<HTMLElement>target).className === 'image-pattern-style') {
      this.dashboard.removeAll();
      this.initializeTemplate(<HTMLElement>args.target);
    }
    (<HTMLElement>target).classList.add('e-selected-style');
  }
  public initializeTemplate(element: HTMLElement): void {
    const updatedPanels: PanelModel[] = [];
    const index: number = parseInt(element.getAttribute('data-id'), 10) - 1;
    const panel: any = Object.keys(this.panels[index]).map((panelIndex: string) => this.panels[index][panelIndex]);
    for (let i = 0; i < panel.length; i++) {
      const panelModelValue: PanelModel = {
        row: panel[i].row,
        col: panel[i].col,
        sizeX: panel[i].sizeX,
        sizeY: panel[i].sizeY,
        header: '<div class="e-header-text">Header Area</div><div class="header-border"></div>',
        content: '<div class="panel-content">Content Area</div>',
      };
      updatedPanels.push(panelModelValue);
    }
    this.dashboard.panels = updatedPanels;
  }
}
