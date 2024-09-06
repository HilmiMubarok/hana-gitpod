import { Component } from '@angular/core';

@Component({
  selector: 'jhi-mis-report-credit-proposal-facility',
  templateUrl: './mis-report-credit-proposal-facility.component.html',
  styleUrls: ['./mis-report.style.css'],
})
export class MisReportCreditProposalFacilityComponent {
  status: '';
  date: any;
  listOfValue = ['cp', 'cpFacility', 'cpFunding', 'cpRecovery'];

  changeOption(event) {
    console.log('data', event.value);
  }

  public previousState(): void {
    window.history.back();
  }
}
