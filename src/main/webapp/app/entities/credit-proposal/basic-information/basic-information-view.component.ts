import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { IPartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
import { ICreditProposal, CreditProposal } from '../credit-proposal.model';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { ActivatedRoute, Router } from '@angular/router';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
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
  public route: any;
  public partyCif: IPartyCif;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public addItem(event: any) {
    if (event[0].customerPerson === null) {
      const dataSet = {
        customerNumber: event[0].customerNumber,
        name: event[0].customerOrganization.name,
        taxIdNumber: event[0].customerOrganization.taxIdNumber,
      };

      this.data = [...this.data, dataSet];
    } else {
      const dataSet = {
        customerNumber: event[0].customerNumber,
        name: event[0].customerPerson.name,
        taxIdNumber: event[0].customerPerson.taxIdNumber,
      };

      this.data = [...this.data, dataSet];
    }

    this.creditProposal.attributes['basicInformation'].coborowed = this.data;
    this.ejDialog.hide();
  }

  public postalAdresss: IPartyPostalAddress;
  public generalLocation: IPartyPostalAddress;
  public domicileLocation: IPartyPostalAddress;
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

  constructor(protected activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    console.log('this adresess ', this.creditProposal.addresses);
    this.data = this.creditProposal.attributes['basicInformation'].coborowed;
    this.postalAdresss = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'PRIMARY_LOCATION';
    });

    this.generalLocation = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'DOMICILE_LOCATION';
    });

    this.watchListChange();
    this.hiddenData();
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
  }
  public view: boolean;
  public hiddenData() {
    const route = this.router.url.split('/')[1];

    if (route === 'cp-status-approval') {
      this.view = true;
    } else {
      this.view = false;
    }
  }
}
