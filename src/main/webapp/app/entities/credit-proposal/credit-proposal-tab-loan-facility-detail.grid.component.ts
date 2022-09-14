import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { IApplicationProduct, ApplicationProduct } from '../application-product/application-product.model';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail-grid',
  templateUrl: './credit-proposal-tab-loan-facility-detail.grid.component.html',
  styleUrls: ['./credit-proposal-tab-loan-facility-detail.css'],
})
export class CreditProposalTabLoanFacilityDetailGridComponent {
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('grid') grid: GridComponent;
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
  public dataEdit?: any;
  public dataGrid: IApplicationProduct[];

  public dataBound(args: any) {
    // this.grid.autoFitColumns(["Name"]); // autoFit particular column
    this.grid.autoFitColumns(); // autofit all the columns
  }

  public onAction(state: string): void {
    this.stateOfAction = state;
    this.ejDialog.show();
  }

  public onEdit(state: string, data: IApplicationProduct, renday: string): void {
    this.stateOfAction = state;
    this.dataEdit = data;
    console.log('data item', this.dataEdit);
    this.ejDialog.show();
  }

  public onDelete(data: IApplicationProduct) {
    const dataGrid = this.creditProposal.products.filter(({ id }) => id !== data.id);
    this.creditProposal.products = dataGrid;
    console.log(dataGrid);
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
