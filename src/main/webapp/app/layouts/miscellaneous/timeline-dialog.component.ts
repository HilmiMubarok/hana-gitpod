import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITimeline } from './timeline.model';

@Component({
  selector: 'jhi-timeline-dialog',
  templateUrl: './timeline-dialog.component.html',
})
export class TimelineDialogComponent {
  public values: ITimeline[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { content: ITimeline[] }) {
    this.values = this.data.content;
  }

  public filterText(text: string): string {
    return text.replace(/_/g, ' ').replace('CP', '').toLowerCase();
  }
}
