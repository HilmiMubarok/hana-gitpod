import { Component, Input } from '@angular/core';

@Component({
  selector: 'jhi-debtor-information',
  templateUrl: './debtor-information.component.html',
  styleUrls: ['../party-cif/party-cif.style.scss', './debtor-information.component.css'],
})
export class DebtorInformationComponent {
  @Input() cifNumber;
  @Input() customerName;
}
