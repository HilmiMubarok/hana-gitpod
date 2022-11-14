import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { IPerson, Person } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/person.service';
@Component({
  selector: 'jhi-survey-batch-collateral-appraisal-person-view',
  templateUrl: './survey-batch-collateral-appraisal-person-view.component.html',
  styleUrls: ['./survey-batch-collateral-appraisal-person-view.css'],
})
export class SurveyBatchCollateralAppraisalPersonViewComponent implements OnChanges {
  @Input()
  public id: string;

  public tipeNasabah: string;
  public accNo: string;
  public item: IPerson;
  public itemCP: ICreditProposal;

  constructor(private personService: PersonService, private creditProposalService: CreditProposalService) {
    this.tipeNasabah = 'individu';
    this.item = new Person();
    this.itemCP = new CreditProposal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      this.loadData();
    }
  }

  private loadData(): void {
    this.personService.find(this.id).subscribe(res => {
      this.item = res.body;
    });

    this.creditProposalService.findByCif(this.id).subscribe(res => {
      console.log('ini body', res.body);
      this.itemCP = res.body;
    });
  }
}
