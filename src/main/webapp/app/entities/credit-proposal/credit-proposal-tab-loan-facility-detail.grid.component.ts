import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { IApplicationProduct, ApplicationProduct } from '../application-product/application-product.model';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail-grid',
  templateUrl: './credit-proposal-tab-loan-facility-detail.grid.component.html',
  styleUrls: ['./credit-proposal-tab-loan-facility-detail.css'],
})
export class CreditProposalTabLoanFacilityDetailGridComponent {
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  private _creditProposal: ICreditProposal;
  public creditProposalProducts?: IApplicationProduct[];
  private applicationProduct?: IApplicationProduct = new ApplicationProduct();

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
    this.creditProposalProducts = item.products;
  }

  @Output() outCreditProposal = new EventEmitter<ICreditProposal>();

  public initialState = false;
  public stateOfAction?: string;

  public onAction(state: string): void {
    this.stateOfAction = state;
    this.ejDialog.show();
  }

  public onOverlayClick(): void {
    this.stateOfAction = '';
    this.ejDialog.hide();
  }

  public onGetApplicationProduct(applicationProduct: any): void {
    this.creditProposalProducts = [...this.creditProposalProducts, applicationProduct];
    this._creditProposal.products = [...this._creditProposal.products, applicationProduct];
    this.outCreditProposal.emit(this._creditProposal);
    this.onOverlayClick();
  }
}
