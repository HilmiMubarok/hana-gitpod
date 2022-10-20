import { Component, Inject, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { Collateral, CollateralAttribute, ICollateral } from 'app/entities/collateral/collateral.model';
import lodash from 'lodash';
// import { ICreditProposal } from '../../credit-proposal.model';
// import

@Component({
  selector: 'jhi-signer-page-dialog',
  templateUrl: './signer-page-dialog.component.html',
  //   styleUrls: ['./dialog-facility.css'],
})
export class OfferingLetterSignerPageDialogComponent {
  public listOfValue = {
    signerList: ['Debitor', 'Pt. Bank Keb Hana Indonesia'],
  };

  constructor() {}

  public save(): void {
    // this._dialog.close(this.applicationProdCustom);
  }
}
