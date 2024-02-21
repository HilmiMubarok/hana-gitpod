import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import lodash from 'lodash';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { Subject, takeUntil } from 'rxjs';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-covenant-below-temp',
  templateUrl: './credit-proposal-covenant-below.component.html',
  styleUrls: ['../back-to-back/covenant-backtoback.css'],
})
export class CreditProposalCovenantBelowTempComponent implements OnInit, OnDestroy {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  public standardCovenant: any = [];

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() isViewMode: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  constructor(private generalParameterService: GeneralParameterService, private router: Router) {}

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.standardCovenant.length; i++) {
      if (i === Number(data.index)) {
        this.standardCovenant[i].status = input === 'status' ? event.value : this.standardCovenant[i].status;
        this.standardCovenant[i].deviation = input === 'deviation' ? event.target.value : this.standardCovenant[i].deviation;
        this.standardCovenant[i].justification = input === 'justification' ? event.target.value : this.standardCovenant[i].justification;
      } else {
        this.standardCovenant[i].status = this.statusValue[i];
        this.standardCovenant[i].deviation = this.deviation[i];
        this.standardCovenant[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardCovenant = lodash.clone(this.standardCovenant);
  }

  ngOnInit(): void {
    this.loadCovenantBelow();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public getStandardDataGridBelow() {
    if (!['CP_DAR_FINAL'].includes(this.creditProposalItem.statusId) && ['dar-final'].includes(this.router.url.split('/')[1])) {
      const parsed = parsePreviousAtrribute(this.creditProposalItem);
      const darRevHistory = parsed['darRevHistory']?.convenant?.standardCovenant;

      for (let i = 0; i < darRevHistory.length; i++) {
        this.statusValue[i] = darRevHistory[i].status;
        this.deviation[i] = darRevHistory[i].deviation;
        this.justification[i] = darRevHistory[i].justification;
      }
    } else {
      if (this.creditProposalItem.attributes['convenant'].standardCovenant.length !== 0) {
        for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardCovenant.length; i++) {
          this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].status;
          this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].deviation;
          this.justification[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].justification;
        }
      } else {
        for (let i = 0; i <= this.standardCovenant.length; i++) {
          this.statusValue[i] = 'Applied';
          this.creditProposalItem.attributes['convenant'].standardCovenant.status = this.statusValue[i];
        }
        this.creditProposalItem.attributes['convenant'].standardCovenant = this.standardCovenant;
      }
    }
  }

  public loadCovenantBelow() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_BELOW_STANDARD',
        page: 0,
        size: 9999,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        const activeData = res.body.filter(o => o.statusId === 'ACTIVE');
        const gridAbove = [];
        for (let i = 0; i < activeData.length; i++) {
          const num = i;
          gridAbove[i] = { id: num, covenant: activeData[i].value, status: 'Applied', deviation: '', justification: '' };
        }

        this.standardCovenant = gridAbove;
        this.getStandardDataGridBelow();

        if (!['CP_DAR_FINAL'].includes(this.creditProposalItem.statusId) && ['dar-final'].includes(this.router.url.split('/')[1])) {
          const parsed = parsePreviousAtrribute(this.creditProposalItem);
          const parsedConvenant = parsed['darRevHistory']?.convenant?.standardCovenant;
          this.standardCovenant = parsedConvenant;
        } else {
          if (this.creditProposalItem.attributes['convenant'].standardCovenant.length === 0) {
            this.creditProposalItem.attributes['convenant'].standardCovenant = this.standardCovenant;
          } else {
            for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardCovenant.length; i++) {
              this.standardCovenant = this.creditProposalItem.attributes['convenant'].standardCovenant;
            }
          }
          this.creditProposalItem.attributes['convenant'].standardCovenant = this.standardCovenant;
        }
      });
  }

  addBRBeforeDash(text: string): string {
    if (text === '' || text === undefined || text === null) {
      return text;
    } else {
      const hasil = text.replace(/\n/g, '<br/>');
      return hasil;
    }
  }
}
