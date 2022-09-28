import { Component, Input } from '@angular/core';
import { faSadTear, faCircleXmark } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'jhi-no-record-found',
  templateUrl: './no-record-found.component.html',
})
export class NoRecordFoundComponent {
  @Input()
  public moduleName: string;

  public icon: any;
  constructor() {
    this.icon = faCircleXmark;
  }
}
