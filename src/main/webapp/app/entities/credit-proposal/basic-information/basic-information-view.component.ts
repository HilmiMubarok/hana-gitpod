import { Component, EventEmitter, SimpleChanges, Output, Input, OnChanges, OnInit } from '@angular/core';
import { IPartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
import { ICreditProposal, CreditProposal } from '../credit-proposal.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'jhi-credit-proposal-basic-information',
  templateUrl: './basic-information-view.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class ProposalBasicInformationViewComponent implements OnInit {
  private _creditProposal: ICreditProposal;
  constructor(public router: Router) {}
  public useRoute = this.router.url.split('/')[2] === 'list' ? 'view' : 'edit';

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }
  public postalAdresss: IPartyPostalAddress;
  public generalLocation: IPartyPostalAddress;

  public gridCreditProposal: any = [];

  ngOnInit() {
    this.postalAdresss = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'PRIMARY_LOCATION';
    });

    this.generalLocation = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'GENERAL_LOCATION';
    });
  }
}
