import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';

import { IOrganizationLegal } from '../organization-legal/organization-legal.model';
import { OrganizationLegalService } from '../organization-legal/organization-legal.service';

@Component({
  selector: 'jhi-credit-proposal-management-info',
  templateUrl: './credit-proposal-tab-management-info.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposaTabManagementInfoComponent implements OnChanges {
  @Input() creditProposalItem: ICreditProposal = new CreditProposal();
  public dataItem: ICreditProposal = new CreditProposal();
  private _Info: ICreditProposal[];
  private _organizationLegal: IOrganizationLegal[];

  public data: any = [];

  constructor(
    private creditProposalService: CreditProposalService,

    private organizationLegalService: OrganizationLegalService
  ) {
    this.dataItem;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataItem = changes.creditProposalItem.currentValue;
    if (this.dataItem !== undefined) {
      this.data.push(this.dataItem);
    }
    console.log('data item', this.data);
  }

  initialize() {}

  getPerson(): void {
    this.creditProposalService.loadCacheAll().subscribe((res: ICreditProposal[]) => {
      this._Info = res || [];
      console.log('response data', res);
      this.setData();
    });
  }

  getOrganizationLegal(): void {
    this.organizationLegalService.loadCacheAll().subscribe((res: IOrganizationLegal[]) => {
      this._organizationLegal = res || [];
    });
  }

  setData() {
    this._Info.map(item => {
      this.data = [
        ...this.data,
        {
          name: item.prospectPerson.name,
          personalIdNumber: item.prospectPerson.personalIdNumber,
          taxIdNumber: item.prospectPerson.taxIdNumber,
          customerNumber: item.customerNumber,
          dob: item.prospectPerson.dob,
        },
      ];
      console.log(this.data);
    });
  }
}
