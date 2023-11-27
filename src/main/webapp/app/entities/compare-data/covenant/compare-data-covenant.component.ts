import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CompareDataService } from '../services/compare-data.service';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-compare-data-covenant',
  templateUrl: './compare-data-covenant.component.html',
  styleUrls: ['../../credit-proposal/css/credit-proposal-basic-information.css'],
})
export class CompareDataCovenantComponent implements OnDestroy, OnChanges {
  public creditProposal: ICreditProposal = new CreditProposal();
  public proposalType: string;
  @Input() setActiveMenu: string;
  @Input() dataFrom: string;

  constructor(private compareDataService: CompareDataService) {
    this.compareDataService.creditProposal.pipe(takeUntil(this.#destroy)).subscribe((creditProposal: ICreditProposal) => {
      this.creditProposal = creditProposal;
      this.proposalType = this.creditProposal.attributes['proposalType'];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.setActiveMenu && changes.setActiveMenu.currentValue) {
      this.setActiveMenu = changes.setActiveMenu.currentValue;
    }

    if (changes.dataFrom && changes.dataFrom.currentValue) {
      this.dataFrom = changes.dataFrom.currentValue;
    }
  }

  #destroy: Subject<boolean> = new Subject<boolean>();
  ngOnDestroy(): void {
    this.#destroy.next(true);
    this.#destroy.unsubscribe();
  }
}
