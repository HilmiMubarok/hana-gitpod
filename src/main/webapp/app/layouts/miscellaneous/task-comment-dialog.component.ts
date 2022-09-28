import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProcessTask } from 'app/shared/model/process-task.model';

@Component({
  selector: 'jhi-task-comment-dialog',
  templateUrl: './task-comment-dialog.component.html',
})
export class TaskCommentDialogComponent {
  public processTask: IProcessTask;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { processTask: IProcessTask },
    private _dialog: MatDialogRef<TaskCommentDialogComponent>
  ) {
    this.processTask = this.data.processTask;
  }

  public save(): void {
    this._dialog.close(this.processTask);
  }
}
