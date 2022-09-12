import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PositionService } from 'app/entities/position/position.service';
import { ICorrespondence } from './correspondence.model';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';

export const MY_DATE_FORMAT = {
  parse: { dateInput: { month: 'numeric', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'numeric', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'numeric' },
  },
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'yyy/MM/dd', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'jhi-correspondece-dialog',
  templateUrl: './correspondence-dialog.component.html',
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class CorrespondenceDialogComponent implements OnInit {
  public correspondence: ICorrespondence;
  public _position = [];

  public view: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      correspondence: ICorrespondence;
      view: boolean;
    },

    private _dialog: MatDialogRef<CorrespondenceDialogComponent>,
    private positionService: PositionService
  ) {
    this.view = this.data.view;
    this.correspondence = this.data.correspondence;
  }

  private getPositionData(): void {
    this.positionService.loadCacheAll().subscribe(res => {
      res.map(position => {
        this._position = [...this._position, position.positionTypeId];
        this._position = [...new Set(this._position)];
      });
    });
  }

  ngOnInit() {
    this.getPositionData();
  }

  public save(): void {
    this._dialog.close(this.correspondence);
  }
}
