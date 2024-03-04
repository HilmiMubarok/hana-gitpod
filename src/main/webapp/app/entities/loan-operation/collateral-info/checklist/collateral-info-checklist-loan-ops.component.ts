import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { PositionService } from 'app/entities/position/position.service';
import { Router } from '@angular/router';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';

@Component({
  selector: 'jhi-collateral-info-checklist-loan-ops',
  templateUrl: './collateral-info-checklist-loan-ops.component.html',
  styleUrls: ['./collateral-info-checklist-loan-ops.css'],
})
export class CollateralInfoChecklistLoanOpsComponent implements OnInit, OnChanges {
  public _creditProposal: ICreditProposal;
  attributes: any;
  public criteria: string;
  public value: string;
  public remarks: string;
  public patch: any;
  public view: boolean;
  public dataChecklist: any = [];
  @Input() isElement: Boolean = false;
  @Input() isLabel: Boolean = false;
  constructor(
    protected creditProposalService: CreditProposalService,
    protected positionService: PositionService,
    protected router: Router,
    protected generalParameterService: GeneralParameterService
  ) {}
  @Input() isViewMode?: Boolean = false;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public onSelect(value: string, data: any): void {
    console.log('dsdsds', this.dataChecklist[data.No - 1]);
    this.dataChecklist[data.No - 1].value = value;
    this.creditProposal.attributes['collateralChecklist'].checklistValue = this.dataChecklist;
    // checklistValue adlah model
    // dataChecklist data object
  }

  btnSave($event: any): void {
    this.creditProposal.attributes['collateralChecklist'].checklistValue = [
      ...this.creditProposal.attributes['collateralChecklist'].checklistValue,
      {
        criteria: this.criteria,
      },
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isElement']) {
      this.isElement = changes['isElement'].currentValue;
    }
    if (changes['isLabel']) {
      this.isLabel = changes['isLabel'].currentValue;
    }
  }
  ngOnInit(): void {
    this.getCollateralChecklist();
    // if (this.creditProposal.attributes['collateralChecklist'].checklistValue.length === 0) {
    //   this.creditProposal.attributes['collateralChecklist'].checklistValue = this.dataChecklist;
    // } else {
    //   this.dataChecklist = this.creditProposal.attributes['collateralChecklist'].checklistValue;
    // }
    this.refresh();
    // if (this.creditProposal.attributes['collateralChecklist'].checklistValue.length === 0) {
    //   this.creditProposal.attributes['collateralChecklist'].checklistValue = this.dataChecklist;
    // } else {
    //   for (let i = 0; i < this.creditProposal.attributes['collateralChecklist'].checklistValue.length; i++) {
    //     this.dataChecklist = this.creditProposal.attributes['collateralChecklist'].checklistValue;
    //   }
    // }
    this.removefield();
  }

  public refresh() {
    if (this.creditProposal.attributes['collateralChecklist'].checklistValue.length === 0) {
      this.creditProposal.attributes['collateralChecklist'].checklistValue = this.dataChecklist;
    } else {
      this.dataChecklist = this.creditProposal.attributes['collateralChecklist'].checklistValue;
    }
  }

  public getCollateralChecklist() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_CHECKLIST',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        console.log(res);
        const data = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        const gridChecklist = [];
        for (let i = 0; i < data.length; i++) {
          const no = i + 1;
          gridChecklist[i] = { No: no, criteria: data[i].value, value: 'No' };
        }
        this.dataChecklist = gridChecklist;
        this.refresh();
      });
  }

  public tools: object = {
    items: [
      'FontName',
      'FontSize',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontColor',
      'BackgroundColor',
      'OrderedList',
      'UnorderedList',
      'Indent',
      'Outdent',
      'SuperScript',
      'SubScript',
      'Alignments',
      'CreateLink',
    ],
  };

  public removefield() {
    this.patch = this.router.url.split('/')[1];
    if (this.patch === 'cp-status-approval') {
      this.view = true;
    }
  }
}
