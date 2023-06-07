import { Component, Input } from '@angular/core';

@Component({
  selector: 'jhi-debtor-information',
  templateUrl: './debtor-information.component.html',
})
export class DebtorInformationComponent {
  @Input() cifNumber;
  @Input() customerName;
}
