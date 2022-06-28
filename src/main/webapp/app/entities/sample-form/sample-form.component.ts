import { Component } from '@angular/core';
import { ANIMATION } from 'app/shared/constants/base.constants';

@Component({
  selector: 'jhi-sample-form',
  templateUrl: './sample-form.component.html',
})
export class SampleFormComponent {
  public animation: object = ANIMATION;
}
