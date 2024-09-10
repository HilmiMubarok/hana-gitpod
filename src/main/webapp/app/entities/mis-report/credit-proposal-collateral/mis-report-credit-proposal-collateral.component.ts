import { Component } from '@angular/core';

@Component({
  selector: 'jhi-mis-report-credit-proposal-collateral',
  templateUrl: './mis-report-credit-proposal-collateral.component.html',
  styleUrls: ['./mis-report-credit-proposal-collateral.css'],
})
export class MisReportCreditProposalCollateralComponent {
  status: '';
  date: any;
  listOfValue = [];

  changeOption(event) {
    console.log('data', event.value);
  }

  public previousState(): void {
    window.history.back();
  }
}
