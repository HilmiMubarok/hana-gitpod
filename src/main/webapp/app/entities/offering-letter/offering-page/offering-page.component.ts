import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { formatBytes } from 'app/shared/helper/utils';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-offering-page',
  templateUrl: './offering-page.component.html',
  styleUrls: ['./offering-page.css'],
})
export class OfferingLetterOfferingPageComponent implements OnChanges {
  private _creditProposal: ICreditProposal;
  private id: number;
  public field = false;
  @Input() fileSPPK: any;

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
      this.sableFeild();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Offering Latter Generate SPPK
    if (changes.fileSPPK) {
      this.data = this.fileSPPK;
      this.getDateSppkGenerate();
    }
  }

  public sableFeild() {
    if (this.creditProposal.statusId !== 'OL_ASSIGNED') {
      this.field = true;
    }
  }
  public data: object[];

  public getDateSppkGenerate(): void {
    if (this.data.length > 0) {
      const lastIndex = this.data.length - 1;
      const lastElement = this.data[lastIndex];
      const lastCreateDate = moment(lastElement['tags'].createDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY/MM/DD');

      this.creditProposal.attributes['offeringLetterPreparation'].dateOffering = lastCreateDate;
    }
  }
}
