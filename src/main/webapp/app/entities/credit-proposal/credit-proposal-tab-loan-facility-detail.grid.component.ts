import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import {
  IApplicationProduct,
  ApplicationProduct,
  ApplicationProductAttribute,
  IApplicationProductAttribute,
} from '../application-product/application-product.model';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail-grid',
  templateUrl: './credit-proposal-tab-loan-facility-detail.grid.component.html',
  styleUrls: ['./credit-proposal-tab-loan-facility-detail.scss'],
})
export class CreditProposalTabLoanFacilityDetailGridComponent implements OnInit {
  private _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('grid') grid: GridComponent;
  public visibleDialog: boolean;
  public applicationProduct: IApplicationProduct;

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

  public stateOfAction?: string;
  public format = { format: 'R$ #. ## 0,00' };
  public numericFormatOptions: Object;
  public loading: boolean;

  constructor() {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();

    this.loading = false;
    this.visibleDialog = false;
  }

  ngOnInit(): void {
    this.numericFormatOptions = { format: 'N' };
  }

  public onAdd(): void {
    this.applicationProduct = new ApplicationProduct();

    const attr: IApplicationProductAttribute = new ApplicationProductAttribute();
    attr.nomorUrutFasilitas = this.creditProposal.products.length + 1;
    this.applicationProduct.attributes = attr;

    this.ejDialog.show();
  }

  public onSave(): void {
    // add new
    const appProduct: IApplicationProduct = this.applicationProduct;
    let idx: number;
    if (!this.applicationProduct.id) {
      idx = lodash.findIndex(this.creditProposal.products, function (o) {
        return o.uniqueKey === appProduct.uniqueKey;
      });

      if (idx === -1) {
        // kalau tidak pernah add baru
        const copyApplicationProduct: IApplicationProduct = Object.assign({}, this.applicationProduct);
        copyApplicationProduct.applicationId = this.creditProposal.id;

        this.creditProposal.products = [...this.creditProposal.products, this.applicationProduct];
      } else {
        this.creditProposal.products[idx] = appProduct;
      }
    } else {
      idx = lodash.findIndex(this.creditProposal.products, function (o) {
        return o.id === appProduct.id;
      });
      this.creditProposal.products[idx] = appProduct;
    }

    this.ejDialog.hide();
  }

  public onEdit(state: string, data: IApplicationProduct): void {
    this.applicationProduct = data;

    if (this.applicationProduct.attributes && typeof this.applicationProduct.attributes !== 'object') {
      this.applicationProduct.attributes = JSON.parse(this.applicationProduct.attributes);
    }
    this.ejDialog.show();
  }

  public onDelete(element: IApplicationProduct) {
    const dataGrid = this.creditProposal.products.filter(({ attributes }) => attributes !== element.attributes);
    this.creditProposal.products = dataGrid;
  }

  public parseStringToInt(data: string): number {
    return parseInt(data, 10);
  }

  print() {
    console.log(this._creditProposal);
  }
}
