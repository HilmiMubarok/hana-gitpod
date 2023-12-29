import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeveloperShowDiagramStateMultipleDialogComponent } from './dialog/diagram-state-multiple-dialog.component';

@Component({
  selector: 'jhi-developer-area-show-diagram-state-multiple',
  templateUrl: './diagram-state-multiple.component.html',
})
export class DeveloperShowDiagramStateMultipleComponent {
  public diagramData: any;
  private path: string;

  @Input()
  get elementData() {
    return this.diagramData;
  }

  set elementData(data: any) {
    this.diagramData = data;
  }

  @Input()
  get parentPath() {
    return this.path;
  }

  set parentPath(path: string) {
    this.path = path;
  }
  constructor(private dialog: MatDialog) {}

  public showDiagram(param: any): void {
    let _type: string;
    switch (this.path) {
      case 'insurance-check':
        _type = 'insurance';
        break;

      case 'insurance-review':
        _type = 'insurance';
        break;

      default:
        _type = !param.appraisalNumber ? 'cp' : 'appraisal';
        break;
    }

    this.dialog.open(DeveloperShowDiagramStateMultipleDialogComponent, {
      data: {
        id: param.id,
        type: _type,
      },
    });
  }
}
