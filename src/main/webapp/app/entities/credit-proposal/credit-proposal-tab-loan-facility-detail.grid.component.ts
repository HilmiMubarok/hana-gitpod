import { Component, Input } from '@angular/core';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
// import { IApplicationProduct, ApplicationProduct } from '../application-product/application-product.model';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail-grid',
  templateUrl: './credit-proposal-tab-loan-facility-detail.grid.component.html',
  styleUrls: ['./credit-proposal-tab-loan-facility-detail.css'],
})
export class CreditProposalTabLoanFacilityDetailGridComponent {
  private _creditProposal: ICreditProposal = new CreditProposal();
  // private creditProposalProducts: IApplicationProduct[]  = new Array<IApplicationProduct>();
  public creditProposalProducts: any[];

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
    // this.creditProposalProducts = this.item.products;
  }

  public onAdd(): void {}
}
