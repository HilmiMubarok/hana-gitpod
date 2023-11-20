import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeveloperShowDiagramStateMultipleDialogComponent } from './dialog/diagram-state-multiple-dialog.component';

@Component({
  selector: 'jhi-developer-area-show-diagram-state-multiple',
  templateUrl: './diagram-state-multiple.component.html',
})
export class DeveloperShowDiagramStateMultipleComponent {
  public diagramData: any;

  @Input()
  get elementData() {
    return this.diagramData;
  }

  set elementData(data: any) {
    this.diagramData = data;
  }
  constructor(private dialog: MatDialog) {}

  public showDiagram(param: any): void {
    const _type: string = !param.appraisalNumber ? 'cp' : 'appraisal';

    this.dialog.open(DeveloperShowDiagramStateMultipleDialogComponent, {
      data: {
        id: param.id,
        type: _type,
      },
    });
  }
}
