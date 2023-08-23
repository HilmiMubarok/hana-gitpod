import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { CreditProposal, ICreditProposal } from '../credit-proposal.model';

import { PositionService } from '../../position/position.service';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { CreditProposalService } from '../credit-proposal.service';

import { GridComponent } from '@syncfusion/ej2-angular-grids';

import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { CreditProposalRiskAcceptanceCriteriaBelowComponent } from './below/credit-proposal-risk-acceptance-criteria-below-component';
import { CreditProposalAceptanceCriteriaBackToBackComponent } from './back-to-back/credit-proposal-risk-acceptance-criteria-back-to-back-component';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
@Component({
  selector: 'jhi-credit-proposal-risk-acceptance-criteria',
  templateUrl: './credit-proposal-risk-acceptance-criteria-component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalRiskAcceptanceCriteriaComponent implements OnInit {
  @ViewChild('creditProposalRiskAcceptanceCriteriaBelowComponent', {
    static: false,
  })
  creditProposalRiskAcceptanceCriteriaBelowComponent: CreditProposalRiskAcceptanceCriteriaBelowComponent;
  @ViewChild('creditProposalAceptanceCriteriaBackToBackComponent', {
    static: false,
  })
  creditProposalAceptanceCriteriaBackToBackComponent: CreditProposalAceptanceCriteriaBackToBackComponent;
  dataAttr: Object[];
  dataSave: any[];
  messageService: any;
  constructor(
    protected creditProposalService: CreditProposalService,
    protected generalParameterService: GeneralParameterService,
    protected positionService: PositionService,
    private router: Router
  ) {}

  private _creditProposal: ICreditProposal;
  get creditProposal() {
    return this._creditProposal;
  }
  public grid: GridComponent;
  public data = [];
  public dataAttrPass = [];

  public creditProposaldata: ICreditProposal = new CreditProposal();
  public value: string;

  public onSelect(value: string, data: any): void {
    this.dataAttrPass[data.No - 1].value = value;
    this.item.attributes['riksCriteria'].GeneralRiskAcceptanceCriteria = this.dataAttrPass;
  }

  public dialogVisible: boolean;
  public width?: string;
  public height?: string;
  public animationSettings?: Object;
  public closeOnEscape?: boolean;
  Dialog: any;

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }

  public btnAdd(): void {
    this.dialogVisible = true;
  }
  public dataGrid: any = [];
  public Value: string;
  public selectValue = [];
  public valueSelectect = [];
  public OnSelect(dataValue: string, data: any): void {
    this.item.attributes['riksCriteria'].RiskAcceptanceCriteria[data.id - 1].value = dataValue;
  }

  onselectValue() {}

  public parameter: string;
  public remarks: string;

  @ViewChild('ddposition')
  public dropDownListObject: DropDownListComponent;
  public dropdownSub: string[] = [];

  attributes: any;
  public _item: ICreditProposal;

  @Input()
  get item() {
    return this._item;
  }

  set item(item: ICreditProposal) {
    this._item = item;
  }

  public btnSave($event: any): void {
    this.item.attributes['riksCriteria'].RiskAcceptanceCriteria = [
      ...this.item.attributes['riksCriteria'].RiskAcceptanceCriteria,

      {
        id: this.item.attributes['riksCriteria'].RiskAcceptanceCriteria.length + 1,
        parameter: this.parameter,
        remarks: this.remarks,
        value: this.value,
      },
    ];
    this.clearTextBox();

    this.dialogVisible = false;
  }

  public clearTextBox(): void {
    this.parameter = '';
    this.remarks = '';
  }

  public deleteData(Id: any): void {
    const data = this.item.attributes['riksCriteria'].RiskAcceptanceCriteria.filter(({ id }) => id !== Id);
    this.item.attributes['riksCriteria'].RiskAcceptanceCriteria = data;
  }

  ngOnInit(): void {
    console.log('this.item', this.item);

    this.refreshRac();
    this.General();

    this.width = '50%';
    this.height = '80%';
  }

  public changeParameters(): void {
    const generalRiskCriteria = this.item.attributes['riksCriteria'].GeneralRiskAcceptanceCriteria;
    if (generalRiskCriteria.length > 0) {
      for (let i = 0; i < generalRiskCriteria.length; i++) {
        const element = generalRiskCriteria[i].Parameter;
        console.log('zzz', element);
      }
    }
  }
  public refreshRac() {
    if (this.item.id) {
      if (this.creditProposalRiskAcceptanceCriteriaBelowComponent) {
        this.creditProposalRiskAcceptanceCriteriaBelowComponent.refreshRacBelow();
      } else if (this.creditProposalAceptanceCriteriaBackToBackComponent) {
        this.creditProposalAceptanceCriteriaBackToBackComponent.refreshRacBackToBack();
      } else {
        this.refreshGeneralRiskAcceptanceCriteria();
      }
    }
  }

  public refreshGeneralRiskAcceptanceCriteria() {
    if (this.item.attributes['riksCriteria'].GeneralRiskAcceptanceCriteria.length === 0) {
      this.data = this.dataAttrPass;
      this.item.attributes['riksCriteria'].GeneralRiskAcceptanceCriteria = this.data;
    } else {
      this.data = this.item.attributes['riksCriteria'].GeneralRiskAcceptanceCriteria;
      this.dataAttrPass = this.item.attributes['riksCriteria'].GeneralRiskAcceptanceCriteria;
    }
  }

  public General() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RAC_ABOVE_GENERAL',
        page: 0,
        size: 9999,
        sort: ['id', 'desc'],
      })
      .subscribe(res => {
        const data = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });

        const dataGrid = [];
        for (let i = 0; i < data.length; i++) {
          const num = i + 1;
          dataGrid[i] = { No: num, parameter: data[i].value, value: '' };
        }
        this.dataAttrPass = dataGrid;

        if (this.item.attributes['riksCriteria'].GeneralRiskAcceptanceCriteria.length === 0) {
          this.item.attributes['riksCriteria'].GeneralRiskAcceptanceCriteria = this.dataAttrPass;
        } else {
          const generalRisk = this.item.attributes['riksCriteria'].GeneralRiskAcceptanceCriteria;
          for (let i = 0; i < generalRisk.length; i++) {
            this.dataAttrPass[i].No = generalRisk[i].No;
            if (generalRisk[i].parameter !== undefined) {
              this.dataAttrPass[i].parameter = generalRisk[i].parameter;
            } else {
              this.dataAttrPass[i].parameter = generalRisk[i].Parameter;
            }

            this.dataAttrPass[i].value = generalRisk[i].value;
          }
        }
      });
  }
}
