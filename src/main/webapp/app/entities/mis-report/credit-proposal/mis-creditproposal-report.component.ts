import { Component } from '@angular/core';

@Component({
  selector: 'jhi-mis-creditproposal-report',
  templateUrl: './mis-creditproposal-report.component.html',
  styleUrls: ['./mis-report-credit-proposal.css'],
})
export class MisCreditProposalReportComponent {
  data = '';
  date1: any;
  date2: any;
  listOfValue = [];
  changeOption(event) {
    console.log('test');
  }
}
