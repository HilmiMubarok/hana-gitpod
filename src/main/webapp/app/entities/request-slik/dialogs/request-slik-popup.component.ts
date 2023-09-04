import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'jhi-request-slik-popup',
  templateUrl: './request-slik-popup.component.html',
  styleUrls: ['./slik-file-dialog.css'],
})
export class RequestSlikPopupComponent {
  public businessKey: string;
  public status: any;
  public refKeyId: number;
  public userName: string;
  public note: string;
  public createdBy: string;
  public task: string;
  public isCrDeptHead: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IRequestSlikNote, private _dialog: MatDialogRef<RequestSlikPopupComponent>) {
    this.businessKey = this.data.businessKey;
    this.status = this.data.status;
    this.refKeyId = this.data.refKeyId;
    this.userName = this.data.userName;
    this.note = this.data.note;
    this.createdBy = this.data.createdBy;
    this.task = this.data.task;
    this.isCrDeptHead = this.data.isCrDeptHead;
  }

  public save(): void {
    const data = {
      businessKey: this.businessKey,
      status: this.status.status,
      refKeyId: this.refKeyId,
      userName: this.userName,
      note: this.note,
      createdBy: this.createdBy,
    };
    this._dialog.close(data);
  }
}

export interface IRequestSlikNote {
  businessKey: string;
  status: string;
  refKeyId: number;
  userName: string;
  note: string;
  createdBy: string;
  task: string;
  isCrDeptHead: boolean;
}
