import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { IPartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
import { ICreditProposal, CreditProposal } from '../credit-proposal.model';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { ActivatedRoute, Router } from '@angular/router';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import {
  IPartyPostalAddressWarehouse,
  PartyPostalAddressWarehouse,
} from 'app/entities/party-postal-address/party-postal-address-warehouse.model';
import { PURPOSE_TYPE } from 'app/shared/constants/base.constants';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import lodash from 'lodash';
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
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  @Input()
  public proposalType: string;

  public data: any[] = [];
  public watchList: any;
  public route: any;
  public partyCif: IPartyCif;

  constructor(protected activatedRoute: ActivatedRoute, private router: Router, private partyCifService: PartyCifService) {}

  ngOnInit() {
    this.data = this.creditProposal.attributes['basicInformation'].coborowed;
    this.postalAdresss = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'PRIMARY_LOCATION';
    });

    this.generalLocation = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'DOMICILE_LOCATION';
    });
    this.warehouseLocation = this.creditProposal.addresses.find(obj => obj.purposeTypeId === PURPOSE_TYPE.WAREHOUSE);
    if (this.warehouseLocation === undefined) {
      this.warehouseLocation = new PartyPostalAddressWarehouse();
      this.warehouseLocation.purposeTypeId = PURPOSE_TYPE.WAREHOUSE;
    } else {
      this.warehouseLocation = this.creditProposal.addresses.find(function (e) {
        return e.purposeTypeId === 'WAREHOUSE_LOCATION';
      });
    }

    this.watchListChange();
    this.hiddenData();
    this.setBusinessGroup();
  }

  public addItem(event: any) {
    const partyPostalAddress: IPartyPostalAddress = lodash.find(event[0].addresses, function (o) {
      return o.purposeTypeId === 'PRIMARY_LOCATION';
    });

    const nomer = this.data.length + 1;

    if (event[0].customerPerson === null) {
      const dataSet = {
        no: nomer,
        customerNumber: event[0].customerNumber,
        name: event[0].customerOrganization.name,
        taxIdNumber: event[0].customerOrganization.taxIdNumber,
        address: partyPostalAddress.address.address1,
      };

      this.data = [...this.data, dataSet];
    } else {
      const dataSet = {
        no: nomer,
        customerNumber: event[0].customerNumber,
        name: event[0].customerPerson.name,
        taxIdNumber: event[0].customerPerson.taxIdNumber,
        address: partyPostalAddress.address.address1,
      };

      this.data = [...this.data, dataSet];
    }

    this.creditProposal.attributes['basicInformation'].coborowed = this.data;
    this.ejDialog.hide();
  }

  public warehouseLocation: IPartyPostalAddressWarehouse;
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

  public displayedColumns: string[] = ['no', 'customerNumber', 'name', 'taxIdNumber', 'address', 'action'];

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

  public onDelete(element: any) {
    const dataGrid = this.data.filter(({ customerNumber }) => customerNumber !== element.customerNumber);
    this.data = dataGrid;
    this.creditProposal.attributes['basicInformation'].coborowed = dataGrid;
  }

  public setBusinessGroup() {
    const cifNumber = this.creditProposal?.customerNumber;
    this.partyCifService.getBusinessGroup(cifNumber).subscribe(res => {
      this.gridCreditProposal = res.body;
    });
  }
}
