import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { DebtorData, IDebtorData } from '../debtor-data/debtor-data.model';
import { DebtorDataService } from '../debtor-data/debtor-data.service';
import { IPartyCif, PartyCif } from '../party-cif/party-cif.model';
import { PartyCifService } from '../party-cif/party-cif.service';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';
import { PartyGroupService } from '../party-group/party-group.service';
import { ISurveyAppraisals } from '../survey-appraisals/survey-appraisals.model';
import { SurveyAppraisalsService } from '../survey-appraisals/survey-appraisals.service';
import { ICollateralAppraisal } from './collateral-appraisal.model';

@Component({
  selector: 'jhi-collateral-appraisal-party-group-view',
  templateUrl: './collateral-appraisal-party-group-view.component.html',
  styleUrls: ['./collateral-appraisal-party-group-view.css'],
})
export class CollateralAppraisalPartyGroupViewComponent implements OnChanges, OnInit {
  @Input() collateralAppraisal;
  @Input()
  public partyId: string;

  @Input()
  public id: string;
  public item: IPartyGroup;
  public itemx: IPartyCif;
  public tipeNasabah: string;
  constructor(private partyGroupService: PartyGroupService, private partyCifService: PartyCifService) {
    this.item = new PartyGroup();
    this.itemx = new PartyCif();
    this.tipeNasabah = 'corporate';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      this.loadData();
    }
    if (changes['partyId']) {
      this.loadDataParty();
    }
  }
  ngOnInit(): void {
    this.loadData();
    this.loadDataParty();
  }

  private loadData(): void {
    this.partyCifService.find(this.id).subscribe(res => {
      this.itemx = res.body;
      console.log('cek2', this.itemx);
      // this.a = res.body.debtorData.pep
    });
  }
  private loadDataParty(): void {
    this.partyGroupService.find(this.partyId).subscribe(res => {
      this.item = res.body;
      console.log('cek', this.item);
    });
  }
}
