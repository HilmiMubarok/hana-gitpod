import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICorrespondence } from './correspondence.model';
import { PositionService } from 'app/entities/position/position.service';

@Component({
  selector: 'jhi-correspondece-dialog',
  templateUrl: './correspondence-dialog.component.html',
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