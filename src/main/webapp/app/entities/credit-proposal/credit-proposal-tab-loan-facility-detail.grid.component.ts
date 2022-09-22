import { Component, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { IApplicationProduct, ApplicationProduct } from '../application-product/application-product.model';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail-grid',
  templateUrl: './credit-proposal-tab-loan-facility-detail.grid.component.html',
  styleUrls: ['./credit-proposal-tab-loan-facility-detail.scss'],
})
export class CreditProposalTabLoanFacilityDetailGridComponent {

  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('grid') grid: GridComponent;
  private _creditProposal: ICreditProposal;
  public creditProposalProducts?: IApplicationProduct[];
  public temp?: IApplicationProduct[];
  public index = 1;
  public loading: boolean;

  public displayColumns: string[] = [
    'no',
    'applicationType',
    'facilityType',
    'subLimit',
    'currency',
    'initialLimit',
    'outstanding',
    'changes',
    'totalCreditLimit',
    'provitionFee',
    'tenor',
    'maturityDate',
    'action',
  ];


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
  public format = { format: 'R$ #. ## 0,00' }


  public dataBound(args: any) {
    // this.grid.autoFitColumns(["Name"]); // autoFit particular column
    this.grid.autoFitColumns(); // autofit all the columns
  }

  public onAction(state: string): void {
    this.initialState = true;
    this.stateOfAction = state;
    this.ejDialog.show();
  }

  public onEdit(state: string, data: IApplicationProduct): void {
    this.stateOfAction = state;
    this.dataEdit = data;
    console.log("data edit", this.dataEdit);
    this.ejDialog.show();
    this.initialState = true;
  }

  public onDelete(element: IApplicationProduct) {
    const dataGrid = this.creditProposal.products.filter(({ id }) => id !== element.id);
    this.creditProposal.products = dataGrid;
    this.creditProposalProducts = dataGrid;
    console.log(dataGrid);

  }

  public onOverlayClick(): void {
    this.stateOfAction = '';
    this.initialState = false;
    this.ejDialog.hide();
  }

  public onGetApplicationProduct(applicationProduct: any): void {
    for (let i = 0; i < this.creditProposalProducts.length; i++) {
      if (this.creditProposalProducts[i].attributes.nomorUrutFasilitas === applicationProduct.attributes.nomorUrutFasilitas) {
        this.creditProposalProducts[i].attributes = applicationProduct.attributes;
        this.onOverlayClick();
      }
    }
    if(this.stateOfAction === "add"){
      this.creditProposalProducts = [...this.creditProposalProducts, applicationProduct];
        this._creditProposal.products = [...this._creditProposal.products, applicationProduct];
        this.outCreditProposal.emit(this._creditProposal);
        this.onOverlayClick();
    }
  }

  print() {
    console.log(this._creditProposal);

  }
}
