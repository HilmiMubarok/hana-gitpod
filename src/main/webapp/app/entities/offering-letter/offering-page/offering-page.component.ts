import { Component, Inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';

@Component({
  selector: 'jhi-offering-page',
  templateUrl: './offering-page.component.html',
  styleUrls: ['./offering-page.css'],
})
export class OfferingLetterOfferingPageComponent {
  private _creditProposal: ICreditProposal;
  private id: number;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(object: ICreditProposal) {
    this._creditProposal = object;
  }
  constructor(protected creditProposalService: CreditProposalService, protected activatedRoute: ActivatedRoute, protected router: Router) {
    this.creditProposal = this.activatedRoute.snapshot.data['offeringLetter'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
  }
}
