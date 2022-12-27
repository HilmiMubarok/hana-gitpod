import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IPartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';

@Component({
  selector: 'jhi-dialog-collateral-appraisal-cif',
  templateUrl: './dialog-collateral-appraisal-cif.component.html',
  styleUrls: ['./collateral-appraisal-data-nasabah.css'],
})
export class DialogCollateralAppraisalCifComponent {
  public collateral: ICollateral;
  public partyId: string;
  public dialogSection: string;
  public customerType: string;
  public postalAddress: IPartyPostalAddress;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateral: ICollateral;
      partyId: string;
      dialogSection: string;
      customerType: string;
      postalAddress: IPartyPostalAddress;
    },
    private _dialog: MatDialogRef<DialogCollateralAppraisalCifComponent>
  ) {
    this.collateral = this.data.collateral;
    this.partyId = this.data.partyId;
    this.dialogSection = this.data.dialogSection;
    this.customerType = this.data.customerType;
    this.postalAddress = this.data.postalAddress;
  }
}
