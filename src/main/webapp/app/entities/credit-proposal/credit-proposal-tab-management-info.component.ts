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
export class CreditProposaTabManagementInfoComponent implements OnChanges, OnInit {
  // @ViewChild('grid') public grid: GridComponent;
  // @ViewChild('findCifDialog')
  @Input() creditProposalItem: ICreditProposal = new CreditProposal();
  public dataItem: ICreditProposal = new CreditProposal();
  private _Info: ICreditProposal[];
  private _organizationLegal: IOrganizationLegal[];

  public data: any = [];
  public dataMgn: Object[];
  dataAttr: Object[];

  @Input()
  get item() {
    return this.creditProposalItem;
  }

  set item(item: any) {
    this.creditProposalItem = item;
  }

  // textRich = '<p>Healty of Management System</p><br/><p>Repatition</p><br/><p>Any Evidence of Shareholderes Support</p>';

  // atribut
  public dataAttrMgn = [
    {
      No: 1,
      Management: 'Year in Business with the same idustry / in the same company > 5 years',
      value: 'No',
    },
    {
      No: 2,
      Management: 'No major change in key management position in the last 3 years',
      value: 'No',
    },
    {
      No: 3,
      Management: 'The Business is managed / handled by owner of family',
      value: 'No',
    },
    {
      No: 4,
      Management: 'The Business is managed /handled by owner or family',
      value: 'No',
    },
    {
      No: 5,
      Management: 'Delinquency / DPD in the last 12 months for debtor /spouse / shaeholder < 50% / management',
      value: 'No',
    },
    {
      No: 6,
      Management: 'Bounce cheque due any reason',
      value: 'No',
    },
    {
      No: 7,
      Management: 'Credit Card Ultilization of debtor / spouse / shareholder  < 50% / management',
      value: 'No',
    },
    {
      No: 8,
      Management: 'Ownership of Business premise is self-owned',
      value: 'No',
    },
    {
      No: 9,
      Management: 'Number of buyer > 5 (no concentration in one or tow buyer)',
      value: 'No',
    },
    {
      No: 10,
      Management: '80% of Sales reflected in Bank Statement',
      value: 'No',
    },
    {
      No: 11,
      Management: 'Distance  from Business location to booking unit < 30 km ',
      value: 'No',
    },
    {
      No: 12,
      Management: 'Checking result  from google is positive & no issue',
      value: 'No',
    },
    {
      No: 13,
      Management: 'Relationship among shareholder is family (not patner)',
      value: 'No',
    },
    {
      No: 14,
      Management: 'The collateral is occupied by debitor / family / Shareholder',
      value: 'No',
    },
  ];

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
      // console.log('response data', res);
      this.setData();
    });
  }

  getOrganizationLegal(): void {
    this.organizationLegalService.loadCacheAll().subscribe((res: IOrganizationLegal[]) => {
      this._organizationLegal = res || [];

      this.setData();
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
          address: item.addresses[0].address.address1,
          managements: item.prospectOrganization,
          prospectOrganization: item.prospectOrganization.name ? item.prospectPerson.name : item.prospectOrganization.name,
          deedEstablishDate: item.legal,


        },
        console.log('cek data', this.data),
      ];
    });
  }

  ngOnInit(): void {
    if (this.item.attributes['managementInfo'].DebtorPerformentCriteria.length === 0) {
      this.dataMgn = this.dataAttrMgn;
    } else {
      this.dataMgn = this.item.attributes['managementInfo'].DebtorPerformentCriteria;
      this.dataAttr = this.item.attributes['managementInfo'].DebtorPerformentCriteria;
    }
  }

  public onSelect(value: string, data: any) {
    this.dataAttrMgn[data.No - 1].value = value;
  }
}
export const dataAttr: Object[] = [
  {
    No: 1,
    Management: 'Year in Business with the same idustry / in the same company > 5 years',
    Verified: !1,
    value: 'No',
  },
  {
    No: 2,
    Management: 'No major change in key management position in the last 3 years',
    Verified: !2,
    value: 'No',
  },
  {
    No: 3,
    Management: 'The Business is managed / handled by owner of family',
    Verified: !3,
    value: 'No',
  },
  {
    No: 4,
    Management: 'The Business is managed /handled by owner or family',
    Verified: !4,
    value: 'No',
  },
  {
    No: 5,
    Management: 'Delinquency / DPD in the last 12 months for debtor /spouse / shaeholder < 50% / management',
    Verified: !5,
    value: 'No',
  },
  {
    No: 6,
    Management: 'Bounce cheque due any reason',
    Verified: !6,
    value: 'No',
  },
  {
    No: 7,
    Management: 'Credit Card Ultilization of debtor / spouse / shareholder  < 50% / management',
    Verified: !7,
    value: 'No',
  },
  {
    No: 8,
    Management: 'Ownership of Business premise is self-owned',
    Verified: !8,
    value: 'No',
  },
  {
    No: 9,
    Management: 'Number of buyer > 5 (no concentration in one or tow buyer)',
    Verified: !9,
    value: 'No',
  },
  {
    No: 10,
    Management: '80% of Sales reflected in Bank Statement',
    Verified: !10,
    value: 'No',
  },
  {
    No: 11,
    Management: 'Distance  from Business location to booking unit < 30 km ',
    Verified: !11,
    value: 'No',
  },
  {
    No: 12,
    Management: 'Checking result  from google is positive & no issue',
    Verified: !12,
    value: 'No',
  },
  {
    No: 13,
    Management: 'Relationship among shareholder is family (not patner)',
    Verified: !13,
    value: 'No',
  },
  {
    No: 14,
    Management: 'The collateral is occupied by debitor / family / Shareholder',
    Verified: !14,
    value: 'No',
  },
];
