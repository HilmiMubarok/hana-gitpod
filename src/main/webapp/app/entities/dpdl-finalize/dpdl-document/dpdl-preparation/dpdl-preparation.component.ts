import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CashCreditProposalsService } from 'app/entities/cash-credit-proposal/cash-credit-proposals.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

export const MY_DATE_FORMAT = {
  parse: { dateInput: { month: 'numeric', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'numeric', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'numeric' },
  },
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'yyy/MM/dd', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'jhi-dpdl-preparation',
  templateUrl: './dpdl-preparation.component.html',
  styleUrls: ['../document.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DpdlPreparationComponent implements OnInit {
  public _creditProposal;

  @Input()
  get creditProposal(): ICreditProposal {
    return this._creditProposal;
  }

  set creditProposal(value: ICreditProposal) {
    this._creditProposal = value;
  }

  constructor(
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    protected cashCreditProposalService: CashCreditProposalsService
  ) {}

  ngOnInit(): void {
    if (this.creditProposal.entityProperties.length === 0) {
      this.getDpdlPreparation();
    }
  }
  public dpdlPic: string;

  public getDpdlPreparation() {
    this.cashCreditProposalService.getEntityPropResource(this.creditProposal.id, 'DPDL').subscribe(res => {
      this.creditProposal.entityProperties.push(res.body);
    });
  }

  onDpdlPicChange(newValue: string) {
    this.creditProposal.entityProperties[0].dpdlPic = newValue;
  }
}
