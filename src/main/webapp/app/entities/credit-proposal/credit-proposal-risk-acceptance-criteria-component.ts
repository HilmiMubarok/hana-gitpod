import { Component, Input, ViewChild } from '@angular/core';

import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';

// ini import interface position
import { PositionService } from '../position/position.service';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { CreditProposalService } from './credit-proposal.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'jhi-credit-proposal-risk-acceptance-criteria',
  templateUrl: './credit-proposal-risk-acceptance-criteria-component.html',
  styleUrls: ['./credit-proposal-risk-acceptance-criteria.css'],
})
export class CreditProposalRiskAcceptanceCriteriaComponent extends AbstractEntityEj2GridComponent<ICreditProposal> {
  public _item: ICreditProposal = new CreditProposal();

  @Input()
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  dataAttr: Object[];
  dataSave: any[];
  constructor(protected creditProposalService: CreditProposalService, protected positionService: PositionService) {
    super(creditProposalService);
  }
  private _creditProposal: ICreditProposal;
  get creditProposal() {
    return this._creditProposal;
  }
  public grid: GridComponent;
  public data: Object[];
  public dataAttrPass = [
    {
      No: 1,
      Parameter: 'Debitur merupakah individu (Perorangan) , warga negara indonesia dan berdomisili indonesia',
      value: '',
    },
    {
      No: 2,
      Parameter: 'Age for individual debtors: Min. 24 years at the time of proposing loan, Max. 65 years at loan maturity date',
      value: '',
    },
    {
      No: 3,
      Parameter: 'Business location ≤ 30 KM from Hana Bank branch booking unit',
      value: '',
    },
    {
      No: 4,
      Parameter: 'Is the debtor industry included in the watch list industry?',
      value: '',
    },
    {
      No: 5,
      Parameter: 'Not included in the National Black List (DHN) of Bank Indonesia',
      value: '',
    },
    {
      No: 6,
      Parameter: 'The purpose of applying for credit is not for buying land',
      value: '',
    },
    {
      No: 7,
      Parameter: 'Not a Political Exposed Person (PEP) -> includes spouse, BOD & BOC debtors',
      value: '',
    },
  ];
  public creditProposaldata: ICreditProposal = new CreditProposal();

  public value: string;

  public onSelect(value: string, data: any): void {
    this.dataAttrPass[data.No - 1].value = value;
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

  public dataGrid?: any = [];

  public subParameter: string;
  public parameter: string;
  public remarks: string;
  public CollateralStatus: string;
  public CollateralInsurance: string;
  public CollateralBasedOnLv: string;

  @ViewChild('ddposition')
  public dropDownListObject: DropDownListComponent;
  public dropdownSub: string[] = [];

  attributes: any;

  public btnSave($event: any): void {
    this.dataAttrPass = [...this.dataAttrPass];
    this.dataGrid = [
      ...this.dataGrid,

      {
        subParameter: this.subParameter,
        parameter: this.parameter,
        remarks: this.remarks,

        CollateralStatus: this.CollateralStatus,
        CollateralInsurance: this.CollateralInsurance,
        CollateralBasedOnLv: this.CollateralBasedOnLv,
      },
    ];

    this._item.attributes = {
      GeneralRiskAcceptanceCriteria: JSON.stringify(this.dataAttrPass),
      RiskAcceptanceCriteria: JSON.stringify(this.dataGrid),
    };
  }

  // Coba Dummy Data Delete
  public deleteData(): void {
    const newData = this.dataGrid.splice(1, this.dataGrid.length);
    this.dataGrid = newData;
  }

  protected initialize(): void {
    this.data = dataAttr;

    this.dataGrid;
    this.width = '50%';
    this.height = '80%';
  }
}

export const dataAttr: Object[] = [
  {
    No: 1,
    Parameter: 'Debitur merupakah individu (Perorangan) , warga negara indonesia dan berdomisili indonesia',
    Verified: !0,
    value: 'individu',
  },
  {
    No: 2,
    Parameter: 'Age for individual debtors: Min. 24 years at the time of proposing loan, Max. 65 years at loan maturity date',
    Verified: !2,
    value: 'age',
  },
  {
    No: 3,
    Parameter: 'Business location ≤ 30 KM from Hana Bank branch booking unit',
    Verified: !3,
    value: 'location',
  },
  {
    No: 4,
    Parameter: 'Is the debtor industry included in the watch list industry?',
    Verified: !4,
    value: 'industry',
  },
  {
    No: 5,
    Parameter: 'Not included in the National Black List (DHN) of Bank Indonesia',
    Verified: !5,
    value: 'DHN',
  },
  {
    No: 6,
    Parameter: 'The purpose of applying for credit is not for buying land',
    Verified: !6,
    value: 'credit',
  },
  {
    No: 7,
    Parameter: 'Not a Political Exposed Person (PEP) -> includes spouse, BOD & BOC debtors',
    Verified: !7,
    value: 'PEP',
  },
];
