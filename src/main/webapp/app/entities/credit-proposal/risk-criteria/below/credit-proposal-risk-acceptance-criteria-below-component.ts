import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';
import { PositionService } from '../../../position/position.service';
import { CreditProposalService } from '../../credit-proposal.service';

import lodash from 'lodash';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';

@Component({
  selector: 'jhi-credit-proposal-risk-acceptance-criteria-below',
  templateUrl: './credit-proposal-risk-acceptance-criteria-below-component.html',
  styleUrls: ['../../css/credit-proposal-basic-information.css'],
})
export class CreditProposalRiskAcceptanceCriteriaBelowComponent implements OnInit {
  attributes: any;
  public parameterBelow: string;
  public value: string;
  public statusValue: any = [];
  public remarks?: any = [];
  public remarksAm?: any = [];
  public remarksBf?: any = [];
  public remarksCsc?: any = [];
  public remarksColl?: any = [];
  public status: any = [];
  public dataInput: any = [];
  public collateralCoverages: string;

  public dataBelowChecklist = [];
  public dataBelowChecklistBot = [];
  public dataBelowChecklistBF = [];
  public dataBelowChecklistCollateral = [];
  public dataBelowChecklistExclusively = [];

  constructor(
    protected creditProposalService: CreditProposalService,
    protected positionService: PositionService,
    private generalParameterService: GeneralParameterService
  ) {}
  public _item: ICreditProposal;
  public data: Object[];
  public collateralStatuss: string;
  @Input()
  get item() {
    return this._item;
  }

  set item(item: ICreditProposal) {
    this._item = item;
  }

  public displayColumns: string[] = ['no', 'NilaiPembelian ', 'FacilityType', 'JenisJaminan', 'KeteranganJaminan', 'action'];
  public collateralInsurances: string;
  public onSelect(value: string, data: any): void {
    this.dataBelowChecklist[data.No - 1].value = value;
    this.item.attributes['cpRacBelow'].cpValueBot = this.dataBelowChecklist;
  }

  public OnSelect(value: string, data: any): void {
    this.dataBelowChecklistBot[data.No - 1].value = value;
    this.item.attributes['cpRacBelow'].cpValeuTwo = this.dataBelowChecklistBot;
  }

  public OnnSelect(value: string, data: any): void {
    this.dataBelowChecklistBF[data.No - 1].value = value;
    this.item.attributes['cpRacBelow'].cpValeuThere = this.dataBelowChecklistBF;
  }

  public OnNSelect(value: string, data: any): void {
    this.dataBelowChecklistCollateral[data.No - 1].value = value;
    this.item.attributes['cpRacBelow'].cpValeuFour = this.dataBelowChecklistCollateral;
  }

  public OnNSeleect(value: string, data: any): void {
    this.dataBelowChecklistExclusively[data.No - 1].value = value;
    this.item.attributes['cpRacBelow'].cpValeuFive = this.dataBelowChecklistExclusively;
  }

  onKeyUpEvent() {
    for (let h = 0; h < this.dataBelowChecklist.length; h++) {
      this.dataBelowChecklist[h].remarks = this.remarks[h];
    }

    this.item.attributes['cpRacBelow'].remarks = this.dataBelowChecklist;
  }

  onKeyUpEventt() {
    for (let h = 0; h < this.dataBelowChecklistBot.length; h++) {
      this.dataBelowChecklistBot[h].remarksAm = this.remarksAm[h];
    }
    this.item.attributes['cpRacBelow'].remarksAm = this.dataBelowChecklistBot;
    console.log(this.dataBelowChecklistBot);
  }

  onKeyUpEventtt() {
    for (let h = 0; h < this.dataBelowChecklistBF.length; h++) {
      this.dataBelowChecklistBF[h].remarksBf = this.remarksBf[h];
    }
    this.item.attributes['cpRacBelow'].remarksBf = this.dataBelowChecklistBF;
  }

  onKeyUpEventColl() {
    for (let h = 0; h < this.dataBelowChecklistCollateral.length; h++) {
      this.dataBelowChecklistCollateral[h].remarksColl = this.remarksColl[h];
    }
    this.item.attributes['cpRacBelow'].remarksColl = this.dataBelowChecklistCollateral;
  }

  onKeyUpEventCsc() {
    for (let h = 0; h < this.dataBelowChecklistExclusively.length; h++) {
      this.dataBelowChecklistExclusively[h].remarksCsc = this.remarksCsc[h];
    }
    this.item.attributes['cpRacBelow'].remarksCsc = this.remarksCsc;
  }

  public Cs: string;
  public collateralStatus = [];

  public Cv: string;
  public collateralCoverage = [];

  public Ci: string;
  public collateralInsurance = [];

  ngOnInit(): void {
    this.refreshRacBelow();
    this.loadLov();
    this.racbelon();
  }

  public refreshRacBelow() {
    if (this.item.attributes['cpRacBelow'].cpValueBot.length === 0) {
      this.item.attributes['cpRacBelow'].cpValueBot = this.dataBelowChecklist;
    } else {
      for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValueBot.length; i++) {
        this.dataBelowChecklist = this.item.attributes['cpRacBelow'].cpValueBot;
        this.remarks[i] = this.item.attributes['cpRacBelow'].cpValueBot[i].remarks;
      }
    }

    if (this.item.attributes['cpRacBelow'].cpValeuTwo.length === 0) {
      this.item.attributes['cpRacBelow'].cpValeuTwo = this.dataBelowChecklistBot;
    } else {
      for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValeuTwo.length; i++) {
        this.dataBelowChecklistBot = this.item.attributes['cpRacBelow'].cpValeuTwo;
        this.remarksAm[i] = this.item.attributes['cpRacBelow'].cpValeuTwo[i].remarksAm;
      }
    }

    // if (this.item.attributes['cpRacBelow'].cpValeuTwo.length !== 0) {
    //   for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValeuTwo.length; i++) {
    //     this.dataBelowChecklistBot = this.item.attributes['cpRacBelow'].cpValeuTwo;
    //   }
    // }

    if (this.item.attributes['cpRacBelow'].cpValeuThere.length === 0) {
      this.item.attributes['cpRacBelow'].cpValeuThere = this.dataBelowChecklistBF;
    } else {
      for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValeuThere.length; i++) {
        this.dataBelowChecklistBF = this.item.attributes['cpRacBelow'].cpValeuThere;
        this.remarksBf[i] = this.item.attributes['cpRacBelow'].cpValeuThere[i].remarksBf;
      }
    }

    if (this.item.attributes['cpRacBelow'].cpValeuFour.length === 0) {
      this.item.attributes['cpRacBelow'].cpValeuFour = this.dataBelowChecklistCollateral;
    } else {
      for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValeuFour.length; i++) {
        this.dataBelowChecklistCollateral = this.item.attributes['cpRacBelow'].cpValeuFour;
        this.remarksColl[i] = this.item.attributes['cpRacBelow'].cpValeuFour[i].remarksColl;
      }
    }

    if (this.item.attributes['cpRacBelow'].cpValeuFive.length === 0) {
      this.item.attributes['cpRacBelow'].cpValeuFive = this.dataBelowChecklistExclusively;
    } else {
      for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValeuFive.length; i++) {
        this.dataBelowChecklistExclusively = this.item.attributes['cpRacBelow'].cpValeuFive;
        this.remarksCsc[i] = this.item.attributes['cpRacBelow'].cpValeuFive[i].remarksCsc;
      }
    }
  }

  public loadLov() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_INSURANCE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.collateralInsurance = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        for (let i = 0; i < this.collateralInsurance.length; i++) {
          if (this.collateralInsurance[i].code === this.item.attributes['cpRacBelow'].Ci) {
            this.collateralInsurances = this.collateralInsurance[i].value;
          }
        }
      });
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_COVERAGE_BASED_ON_LV',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.collateralCoverage = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        for (let i = 0; i < this.collateralCoverage.length; i++) {
          if (this.collateralCoverage[i].code === this.item.attributes['cpRacBelow'].Cv) {
            this.collateralCoverages = this.collateralCoverage[i].value;
          }
        }
      });

    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RAC_COLLATERAL_STATUS',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.collateralStatus = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        for (let i = 0; i < this.collateralStatus.length; i++) {
          if (this.collateralStatus[i].code === this.item.attributes['cpRacBelow'].Cs) {
            this.collateralStatuss = this.collateralStatus[i].value;
          }
        }
      });
  }
  public racbelon() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RAC_BELOW_GENERAL',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        const data = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });

        const dataGrid = [];
        for (let i = 0; i < data.length; i++) {
          const num = i + 1;
          dataGrid[i] = { No: num, parameterBelow: data[i].value, value: '' };
        }
        this.dataBelowChecklist = dataGrid;

        if (this.item.attributes['cpRacBelow'].cpValueBot.length === 0) {
          this.item.attributes['cpRacBelow'].cpValueBot = this.dataBelowChecklist;
        } else {
          for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValueBot.length; i++) {
            this.dataBelowChecklist = this.item.attributes['cpRacBelow'].cpValueBot;
            this.remarks[i] = this.item.attributes['cpRacBelow'].cpValueBot[i].remarks;
          }
        }
      });
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RAC_BELOW_KYC_MANAGEMENT',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        const data = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });

        const dataGrid = [];
        for (let i = 0; i < data.length; i++) {
          const num = i + 1;
          dataGrid[i] = { No: num, parameterBelow: data[i].value, value: '' };
        }
        this.dataBelowChecklistBot = dataGrid;

        if (this.item.attributes['cpRacBelow'].cpValeuTwo.length === 0) {
          this.item.attributes['cpRacBelow'].cpValeuTwo = this.dataBelowChecklistBot;
        } else {
          for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValeuTwo.length; i++) {
            this.dataBelowChecklistBot = this.item.attributes['cpRacBelow'].cpValeuTwo;
            this.remarksAm[i] = this.item.attributes['cpRacBelow'].cpValeuTwo[i].remarksAm;
          }
        }
      });
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RAC_BELOW_BUSINESS_FINANCE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        const data = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });

        const dataGrid = [];
        for (let i = 0; i < data.length; i++) {
          const num = i + 1;
          dataGrid[i] = { No: num, parameterBelow: data[i].value, value: '' };
        }
        this.dataBelowChecklistBF = dataGrid;

        if (this.item.attributes['cpRacBelow'].cpValeuThere.length === 0) {
          this.item.attributes['cpRacBelow'].cpValeuThere = this.dataBelowChecklistBF;
        } else {
          for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValeuThere.length; i++) {
            this.dataBelowChecklistBF = this.item.attributes['cpRacBelow'].cpValeuThere;
            this.remarksBf[i] = this.item.attributes['cpRacBelow'].cpValeuThere[i].remarksBf;
          }
        }
      });
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RAC_BELOW_COLLATERAL',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        const data = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });

        const dataGrid = [];
        for (let i = 0; i < data.length; i++) {
          const num = i + 1;
          dataGrid[i] = { No: num, parameterBelow: data[i].value, value: '' };
        }
        this.dataBelowChecklistCollateral = dataGrid;

        if (this.item.attributes['cpRacBelow'].cpValeuFour.length === 0) {
          this.item.attributes['cpRacBelow'].cpValeuFour = this.dataBelowChecklistCollateral;
        } else {
          for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValeuFour.length; i++) {
            this.dataBelowChecklistCollateral = this.item.attributes['cpRacBelow'].cpValeuFour;
            this.remarksColl[i] = this.item.attributes['cpRacBelow'].cpValeuFour[i].remarksColl;
          }
        }
      });
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RAC_BELOW_EXCLUSIVELY_FOR_EXISTING',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        const data = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });

        const dataGrid = [];
        for (let i = 0; i < data.length; i++) {
          const num = i + 1;
          dataGrid[i] = { No: num, parameterBelow: data[i].value, value: '' };
        }
        this.dataBelowChecklistExclusively = dataGrid;
        console.log('coldplay', this.dataBelowChecklistExclusively);

        if (this.item.attributes['cpRacBelow'].cpValeuFive.length === 0) {
          this.item.attributes['cpRacBelow'].cpValeuFive = this.dataBelowChecklistExclusively;
        } else {
          for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValeuFive.length; i++) {
            this.dataBelowChecklistExclusively = this.item.attributes['cpRacBelow'].cpValeuFive;
            this.remarksCsc[i] = this.item.attributes['cpRacBelow'].cpValeuFive[i].remarksCsc;
          }
        }
      });
  }
}
