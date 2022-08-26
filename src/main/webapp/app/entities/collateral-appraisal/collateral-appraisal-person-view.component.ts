import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';

import { ICif, Cif } from '../cif/cif.model';
import { IPartyPostalAddress, PartyPostalAddress } from '../party-postal-address/party-postal-address.model';
import { IFinServiceAccount, FinServiceAccount } from '../fin-service-account/fin-service-account.model';

import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';

@Component({
  selector: 'jhi-collateral-appraisal-person-view',
  templateUrl: './collateral-appraisal-person-view.component.html',
  styleUrls: ['./collateral-appraisal-person-view.css'],
})
export class CollateralAppraisalPersonViewComponent implements OnChanges {
  public _cif?: ICif;
  public partyPostalAddress?: IPartyPostalAddress;
  public postalAddress?: IPostalAddress;
  public accountFin?: FinServiceAccount;

  @Input()
  public mode?: string;

  @Input()
  get cif() {
    return this._cif;
  }

  set cif(cif: ICif) {
    this._cif = cif;
  }

  constructor() {
    this._cif = new Cif();

    this.partyPostalAddress = new PartyPostalAddress();
    this.postalAddress = new PostalAddress();
    this.partyPostalAddress.address = this.postalAddress;
    this.accountFin = new FinServiceAccount();

    this._cif.addresses.push(this.partyPostalAddress);
    this._cif.accounts.push(this.accountFin);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes @ngOnChanges person : ', changes);
    if (changes['cif']) {
      if (this._cif['addresses'] === []) {
        this.partyPostalAddress = new PartyPostalAddress();
        this.postalAddress = new PostalAddress();
        this.partyPostalAddress.address = this.postalAddress;
        this._cif.addresses.push(this.partyPostalAddress);
      }
      if (this._cif['accounts'] === []) {
        this.accountFin = new FinServiceAccount();
        this._cif.accounts.push(this.accountFin);
      }
    }
  }
}
