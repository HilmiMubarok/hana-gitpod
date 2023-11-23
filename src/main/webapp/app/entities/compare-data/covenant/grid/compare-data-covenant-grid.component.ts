import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CompareDataService } from '../../services/compare-data.service';
import { Subject, map, takeUntil } from 'rxjs';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';

type COVENANT_STATUSES = 'Applied' | 'To be waived' | 'Waived';
interface CovenantData {
  id: number;
  covenant: string;
  status: COVENANT_STATUSES;
  deviation: string;
  justification: string;
  formGroub?: any;
}

@Component({
  selector: 'jhi-compare-data-covenant-grid',
  templateUrl: './compare-data-covenant-grid.component.html',
  styleUrls: ['../../../credit-proposal/convenant/back-to-back/covenant-backtoback.css'],
})
export class CompareDataCovenantGridComponent implements OnInit, OnChanges, OnDestroy {
  public creditProposal: ICreditProposal;
  public proposalType: string;
  public status: COVENANT_STATUSES[] = ['Applied', 'To be waived', 'Waived'];
  public covenantData: CovenantData[] = [];
  public covenantAboveData: CovenantData[] = [];
  public covenantBelowData: CovenantData[] = [];
  public covenantBackToBackData: CovenantData[] = [];
  public cpDynamicAttributeData: any;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() dataFrom: string;

  constructor(private compareDataService: CompareDataService, private generalParameterService: GeneralParameterService) {
    this.compareDataService.creditProposal.pipe(takeUntil(this.destroy$)).subscribe(creditProposal => {
      this.creditProposal = creditProposal;
      this.proposalType = this.creditProposal.attributes['proposalType'];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataFrom && changes.dataFrom.currentValue) {
      this.dataFrom = changes.dataFrom.currentValue;
    }
  }

  ngOnInit(): void {
    this._getHistoryAttributes();
    this._identifyProposalType();
  }

  private _identifyProposalType(): void {
    switch (this.proposalType) {
      case 'Total Exposure > IDR 15 Bio':
        this._initCovenantAboveData();
        break;
      case 'Total Exposure <= IDR 15 Bio':
        this._initCovenantBelowData();
        break;
      default:
        this._initCovenantBackToBackData();
        break;
    }
  }

  private _getHistoryAttributes() {
    if (this.dataFrom === 'previousHistory') {
      this.cpDynamicAttributeData = this.creditProposal.attributes.previousHistory;
    } else if (this.dataFrom === 'previousReturn') {
      this.cpDynamicAttributeData = this.creditProposal.attributes.previousReturn;
    } else if (this.dataFrom === 'darRevHistory') {
      this.cpDynamicAttributeData = this.creditProposal.attributes.darRevHistory;
    } else {
      this.cpDynamicAttributeData = this.creditProposal;
    }
  }

  private _initCovenantAboveData(): void {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_ABOVE_STANDARD',
        page: 0,
        size: 9999,
      })
      .pipe(
        takeUntil(this.destroy$),
        map(filterActive => filterActive.body.filter(o => o.statusId === 'ACTIVE'))
      )
      .subscribe(res => {
        this._checkIfDataisAvailableInAttribute(this.proposalType, res);
      });
  }
  private _initCovenantBelowData(): void {}
  private _initCovenantBackToBackData(): void {}

  private _checkIfDataisAvailableInAttribute(proposalType: string, res: Array<any>): void {
    switch (proposalType) {
      case 'Total Exposure > IDR 15 Bio':
        if (this.cpDynamicAttributeData.attributes.convenant.standardDataGridAbove.length === 0) {
          // Create covenant data from res
          this.covenantData = res.map((item, index) => ({
            id: index,
            covenant: item.value,
            status: 'Applied',
            deviation: '',
            justification: '',
          }));
        } else {
          // Use attribute data to covenantData
          this.covenantData = this.cpDynamicAttributeData.attributes.convenant.standardDataGridAbove;
        }

        break;
      case 'Total Exposure <= IDR 15 Bio':
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
