import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { IPartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
import { ICreditProposal, CreditProposal } from '../credit-proposal.model';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
@Component({
  selector: 'jhi-credit-proposal-basic-information',
  templateUrl: './basic-information-view.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class ProposalBasicInformationViewComponent implements OnInit {
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  // The Dialog shows within the target element.
  @ViewChild('container', { read: ElementRef, static: true }) container: ElementRef;
  private _creditProposal: ICreditProposal;
  public data = [];
  public watchList;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public addItem(event: any) {
    this.data = [...this.data, event[0]];
    this.creditProposal.attributes['basicInformation'].coborowed = this.data;
    this.ejDialog.hide();
  }

  public postalAdresss: IPartyPostalAddress;
  public generalLocation: IPartyPostalAddress;

  public gridCreditProposal: any = [];
  public dialogVisibility = false;
  // Sample level code to handle the button click action
  public onOpenDialog(event: any): void {
    // Call the show method to open the Dialog
    this.ejDialog.show();
  }
  // Sample level code to hide the Dialog when click the Dialog overlay
  public onOverlayClick: EmitType<object> = () => {
    this.ejDialog.hide();
  };

  ngOnInit() {
    this.data = this.creditProposal.attributes['basicInformation'].coborowed;
    this.postalAdresss = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'PRIMARY_LOCATION';
    });

    this.generalLocation = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'GENERAL_LOCATION';
    });

    this.watchListChange();
  }

  watchListChange() {
    if (
      this.creditProposal.attributes['basicInformation'].accountStatus.watchList === true ||
      this.creditProposal.attributes['basicInformation'].accountStatus.restructured === true
    ) {
      this.watchList = false;
    } else if (
      this.creditProposal.attributes['basicInformation'].accountStatus.watchList === false &&
      this.creditProposal.attributes['basicInformation'].accountStatus.restructured === false
    ) {
      this.watchList = true;
    }
    console.log(this.watchList);
  }
}
