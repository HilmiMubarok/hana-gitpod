import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolbarItems } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'jhi-credit-proposal-list',
  templateUrl: './credit-proposal-list-component.html',
})
export class CreditProposalListComponent implements OnInit {
  public data: object[];
  public toolbarOptions: ToolbarItems[];

  ngOnInit(): void {
    this.data = data;
    this.toolbarOptions = ['Search'];
  }
}

export const data: Object[] = [
  {
    no: 1,
    creditProposal: 'CP-1205202201',
    ProposalDate: '12/05/2022',
    debtorName: 'KRISNA RN',
    customerStatus: 'New/Back to Back',
    addressOfDomicille: 'Rungkut Industry III A No 15',
    nik: 357888999322,
    maturityDate: '25/7/2022',
    status: 'Draf',
  },
  {
    no: 2,
    creditProposal: 'CP-1205202205',
    ProposalDate: '12/10/2022',
    debtorName: 'DEVINA AUREL',
    customerStatus: 'Existing/<15',
    addressOfDomicille: 'Rungkut Industry II A No 12',
    nik: 357888999322,
    maturityDate: '30/7/2022',
    status: 'Draf',
  },
  {
    no: 3,
    creditProposal: 'CP-1205202207',
    ProposalDate: '12/07/2022',
    debtorName: 'AYUSITA HA',
    customerStatus: 'New/>15',
    addressOfDomicille: 'Rungkut Industry I A No 11',
    nik: 357888999322,
    maturityDate: '11/8/2022',
    status: 'Draf',
  },
];
