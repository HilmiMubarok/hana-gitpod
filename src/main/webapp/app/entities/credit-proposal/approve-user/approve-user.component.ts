import { Component, Inject, Input } from '@angular/core';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { Collateral, CollateralAttribute, ICollateral } from 'app/entities/collateral/collateral.model';
import lodash from 'lodash';
// import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-approve-user',
  templateUrl: './approve-user.component.html',
  // styleUrls: ['./dialog-facility.css'],
})
export class CreditProposalApproveUserComponent {
  public displayColumns: string[] = ['no', 'position', 'name', 'remaks', 'available', 'alternatename'];
  public creditProposalStatusCodes = [
    'DRAFT',
    'RETURN TO CREDIT PROPOSAL (BU)',
    'APPROVAL SME HEAD',
    'APPROVAL BM',
    'APPROVAL SDH',
    'APPROVAL DIV HEAD',
    'CANCEL',
    'REJECT',
    'COMPLETE',
  ];

  constructor() {}
}
