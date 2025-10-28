import { map } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
import { CpMemoBandingService } from '../../services/cp-memo-banding.service';
import { ICovenant, statusCovenantNotRefreshedFromMaster } from 'app/entities/credit-proposal/convenant/convenant.constant';
import { replaceConvenantFromMaster } from 'app/entities/credit-proposal/convenant/convenant.helper';

@Component({
  selector: 'jhi-cp-memo-banding-covenant-below',
  templateUrl: './cp-memo-banding-covenant-below.component.html',
  styleUrls: ['../../../convenant/back-to-back/covenant-backtoback.css'],
})
export class CPMemoBandingCovenantBelowComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  // public standardCovenant: any = dataCovenantBelow;
  public standardCovenant: any = [];

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  @Input() isViewMode: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  constructor(private generalParameterService: GeneralParameterService, private cpMemoBandingservice: CpMemoBandingService) {
    this.LovCovenantBelow();
  }

  ngOnInit(): void {
    this.LovCovenantBelow();
    // console.log('proposal-type', this.creditProposalItem[])
  }

  data;
  getData() {
    console.log('ASDHSADAS', {
      // compared,
      oriBefore: this.data,
      oriAfter: this.creditProposalItem.attributes,
    });

    return {};
  }

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

  public getStandardDataGridBelow() {
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

  public cleanData(data: ICovenant[]) {
    return data.map(item => {
      const { justification, deviation, ...rest } = item;
      return {
        ...rest,
        ...(justification !== undefined && { justification }),
        ...(deviation !== undefined && { deviation }),
      };
    });
  }

  public LovCovenantBelow() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_BELOW_STANDARD',
        page: 0,
        size: 9999,
        sort: ['id,asc'],
      })
      .subscribe(res => {
        const data = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });

        const dataLength = !statusCovenantNotRefreshedFromMaster.includes(this.creditProposalItem.statusId)
          ? data
          : this.creditProposalItem.attributes['convenant'].standardCovenant.length === 0
          ? data
          : this.creditProposalItem.attributes['convenant'].standardCovenant;

        const gridBelow = [];
        for (let i = 0; i < dataLength.length; i++) {
          const num = i;
          gridBelow[i] = { id: num, covenant: data[i].value, status: 'Applied', deviation: '', justification: '' };
        }
        this.standardCovenant = gridBelow;

        if (!statusCovenantNotRefreshedFromMaster.includes(this.creditProposalItem.statusId)) {
          this.creditProposalItem.attributes['convenant'].standardCovenant = replaceConvenantFromMaster(
            this.standardCovenant,
            this.creditProposalItem.attributes['convenant'].standardCovenant
          );
        }

        this.getStandardDataGridBelow();

        if (this.creditProposalItem.attributes['convenant'].standardCovenant.length === 0) {
          this.creditProposalItem.attributes['convenant'].standardCovenant = this.standardCovenant;
        } else {
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardCovenant.length; i++) {
            this.standardCovenant = this.creditProposalItem.attributes['convenant'].standardCovenant;
          }
        }

        this.data = this.cpMemoBandingservice.parsePrevOfferingLetter(this.creditProposalItem);
        const beforeCovenant: ICovenant[] = this.cleanData(lodash.cloneDeep(this.data.convenant['standardCovenant']));
        const afterCovenant: ICovenant[] = this.cleanData(
          lodash.cloneDeep(this.creditProposalItem.attributes['convenant']['standardCovenant'])
        );

        this.parsed = this.cpMemoBandingservice.compareDeepData(beforeCovenant, afterCovenant);
        console.log('Final Compare', {
          before: beforeCovenant,
          after: afterCovenant,
          result: this.parsed,
        });
      });
  }
  parsed;
}
