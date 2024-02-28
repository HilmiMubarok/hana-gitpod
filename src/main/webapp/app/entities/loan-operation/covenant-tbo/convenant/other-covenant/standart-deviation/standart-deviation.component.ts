import { Component } from '@angular/core';

@Component({
  selector: 'jhi-standart-deviation-loan',
  templateUrl: './standart-deviation.component.html',
  styleUrls: ['../other-covenant.css'],
})
export class StandartLoanDeviationComponent {
  public displayColumns: any[] = ['no', 'convenant', 'status', 'deviation', 'justification'];
}
