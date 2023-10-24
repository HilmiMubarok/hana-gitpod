import { Component } from '@angular/core';

@Component({
  selector: 'jhi-standart-deviation',
  templateUrl: './standart-deviation.component.html',
  styleUrls: ['../other-covenant.css'],
})
export class StandartDeviationComponent {
  public displayColumns: any[] = ['no', 'convenant', 'status', 'deviation', 'justification'];
}
