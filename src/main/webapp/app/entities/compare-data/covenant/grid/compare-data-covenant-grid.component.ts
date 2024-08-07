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
  styleUrls: ['../../../credit-proposal/convenant/covenant-style.css'],
  styles: [
    `
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .loading {
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        border-top: 16px solid #3498db;
        width: 120px;
        height: 120px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
      }

      .loading-text {
        margin-top: 16px;
        font-size: 20px;
        color: #3498db;
      }

      /* Safari */
      @-webkit-keyframes spin {
        0% {
          -webkit-transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
        }
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class CompareDataCovenantGridComponent implements OnInit, OnChanges, OnDestroy {
  public creditProposal: ICreditProposal;
  public creditProposalPreviousDar: ICreditProposal;
  public proposalType: string;
  public proposalTypePreviousDar: string;
  public status: COVENANT_STATUSES[] = ['Applied', 'To be waived', 'Waived'];
  public covenantData: CovenantData[] = [];
  public covenantAboveData: CovenantData[] = [];
  public covenantBelowData: CovenantData[] = [];
  public covenantBackToBackData: CovenantData[] = [];
  public cpDynamicAttributeData: any;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() dataFrom: string;
  @Input() isDeviation: Boolean = false;

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
    this._identifyProposalType(this.dataFrom);
  }

  private _identifyProposalType(dataFrom: string): void {
    const proposalType = dataFrom === 'previousDar' ? this.proposalTypePreviousDar : this.proposalType;

    switch (proposalType) {
      case 'Total Exposure > IDR 15 Bio':
        this._initCovenantAboveData(proposalType);
        break;
      case 'Total Exposure <= IDR 15 Bio':
        this._initCovenantBelowData(proposalType);
        break;
      default:
        this._initCovenantBackToBackData(proposalType);
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
    } else if (this.dataFrom === 'previousDar') {
      this.compareDataService.creditProposalPreviousDar.pipe(takeUntil(this.destroy$)).subscribe(data => {
        this.cpDynamicAttributeData = data.attributes;
        this.proposalTypePreviousDar = data.attributes['proposalType'];
      });
    } else {
      this.cpDynamicAttributeData = this.creditProposal.attributes;
    }

    // check if type of cpDynamicAttributeData.convenant is array or string
    // if string, parse it to array
    if (typeof this.cpDynamicAttributeData.convenant === 'string') {
      this.cpDynamicAttributeData.convenant = JSON.parse(this.cpDynamicAttributeData.convenant);
    }
  }

  private _initCovenantAboveData(proposalType: string): void {
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
        this._checkIfDataisAvailableInAttribute(proposalType, res);
      });
  }
  private _initCovenantBelowData(proposalType: string): void {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_BELOW_STANDARD',
        page: 0,
        size: 9999,
      })
      .pipe(
        takeUntil(this.destroy$),
        map(filterActive => filterActive.body.filter(o => o.statusId === 'ACTIVE'))
      )
      .subscribe(res => {
        this._checkIfDataisAvailableInAttribute(proposalType, res);
      });
  }
  private _initCovenantBackToBackData(proposalType: string): void {}

  private _checkIfDataisAvailableInAttribute(proposalType: string, res: Array<any>): void {
    switch (proposalType) {
      case 'Total Exposure > IDR 15 Bio':
        if (this.cpDynamicAttributeData.convenant.standardDataGridAbove.length === 0) {
          // Create covenant data from res
          this.covenantData = this.isDeviation
            ? []
            : res.map((item, index) => ({
                id: index,
                covenant: item.value,
                status: 'Applied',
                deviation: '',
                justification: '',
              }));
        } else {
          // Use attribute data to covenantData
          this.covenantData = this.isDeviation
            ? this.cpDynamicAttributeData.convenant.standardDataGridAbove.filter(o => o.status !== 'Applied')
            : this.cpDynamicAttributeData.convenant.standardDataGridAbove;
        }

        break;
      case 'Total Exposure <= IDR 15 Bio':
        if (this.cpDynamicAttributeData.convenant.standardCovenant.length === 0) {
          // Create covenant data from res
          this.covenantData = this.isDeviation
            ? []
            : res.map((item, index) => ({
                id: index,
                covenant: item.value,
                status: 'Applied',
                deviation: '',
                justification: '',
              }));
        } else {
          // Use attribute data to covenantData
          this.covenantData = this.isDeviation
            ? this.cpDynamicAttributeData.convenant.standardCovenant.filter(o => o.status !== 'Applied')
            : this.cpDynamicAttributeData.convenant.standardCovenant;
        }
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
