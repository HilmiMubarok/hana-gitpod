import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { IPerson, Person } from '../person/person.model';
import { PersonService } from '../person/person.service';

@Component({
  selector: 'jhi-collateral-appraisal-person-view',
  templateUrl: './collateral-appraisal-person-view.component.html',
  styleUrls: ['./collateral-appraisal-person-view.css'],
})
export class CollateralAppraisalPersonViewComponent implements OnChanges, OnInit {
  @Input()
  public id: string;

  public tipeNasabah: string;
  public accNo: string;
  public _person: IPerson;
  public itemCP: ICreditProposal;
  public item: IPerson;

  @Input()
  get person() {
    return this._person;
  }

  set person(data: IPerson) {
    this._person = data;
  }

  constructor(private personService: PersonService, private creditProposalService: CreditProposalService) {
    this.tipeNasabah = 'individu';
    this.item = new Person();
    this.itemCP = new CreditProposal();
  }
  ngOnInit(): void {
    this.loadData();
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
      this.itemCP = res.body;
    });
  }
}
