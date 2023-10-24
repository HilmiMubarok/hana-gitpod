import { Component } from '@angular/core';

@Component({
  selector: 'jhi-standart-covenant-temp',
  templateUrl: './standart-convenant.component.html',
  styleUrls: ['../other-covenant.css'],
})
export class StandartConvenantComponent {
  public displayColumns: any[] = ['no', 'convenant', 'status', 'deviation', 'justification'];

  public data: any[] = [
    {
      convenant: 'Description convenant bellow 1',
    },
    {
      convenant: 'Description convenant bellow 2',
    },
  ];
}
