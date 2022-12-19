import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { IPartyCif, PartyCif } from '../party-cif/party-cif.model';
import { PartyCifService } from '../party-cif/party-cif.service';
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
  @Input() collateralAppraisal;

  public tipeNasabah: string;
  public accNo: string;

  public item: IPartyCif;

  constructor(private partyCifService: PartyCifService) {
    this.tipeNasabah = 'individu';
    this.item = new PartyCif();
  }
  ngOnInit(): void {
    this.loadData();
    console.log(this.item);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      this.loadData();
    }
  }

  private loadData(): void {
    this.partyCifService.find(this.id).subscribe(res => {
      this.item = res.body;
      console.log('cek', this.item);
    });
  }
}
