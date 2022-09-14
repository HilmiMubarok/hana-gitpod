import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PositionService } from 'app/entities/position/position.service';
import { IDocumentChecklist } from './document-checklist.model';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { StorageService } from 'app/entities/storage/storage.service';
import moment from 'moment';

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
  selector: 'jhi-document-checklist-dialog',
  templateUrl: './document-checklist-dialog.component.html',
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DocumentChecklistDialogComponent implements OnInit {
  public documentChecklist: IDocumentChecklist;
  public file: File;
  public documentTypes: any;

  public view: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      documentChecklist: IDocumentChecklist;
      view: boolean;
    },
    private _dialog: MatDialogRef<DocumentChecklistDialogComponent>,
    private storageService: StorageService
  ) {
    this.view = this.data.view;
    this.documentChecklist = this.data.documentChecklist;
    this.file = null;
  }

  ngOnInit() {
    console.log('OK');
  }

  public save(): void {
    // const metaData = { objectName: null, entityId: null, docType: null, docDate: null, docNo: null, createdDate: null, createdBy: null };
    // const currentDate = moment().format('YYYYMMDDHHMMSSMS');
    // this._dialog.close(this.documentChecklist);
  }

  public onSelect(event: any) {
    this.file = event['addedFiles'][0];
    console.log(this.file);
  }

  public onRemove(event: any) {
    this.file = null;
  }
}
