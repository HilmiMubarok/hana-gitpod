import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { ICreditProposal } from '../credit-proposal.model';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
@Component({
  selector: 'jhi-credit-proposal-propose-pricing-loan-facility-detail',
  templateUrl: './propose-pricing-loan-facility-detail.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class ProposePricingLoanFacilityDetailComponent implements OnInit {
  private _creditProposal: ICreditProposal;
  public aplicationProducts: IApplicationProduct[];
  @ViewChild('grid') grid: GridComponent;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set crditProposal(item: ICreditProposal) {
    this._creditProposal = item;
    this.aplicationProducts = item.products;
  }
  public dataBound(args: any) {
    // this.grid.autoFitColumns(["Name"]); // autoFit particular column
    this.grid.autoFitColumns(); // autofit all the columns
  }
  ngOnInit(): void {
    console.log(this.creditProposal);
  }
}
