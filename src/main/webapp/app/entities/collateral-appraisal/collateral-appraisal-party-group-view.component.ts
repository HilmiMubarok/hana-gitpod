import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class CollateralAppraisalPartyGroupViewComponent implements OnChanges {
  @Input() collateralAppraisal;

  public a: any;
  public b: any;

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
      // console.log("changed", {
      //   appraisal: this.collateralAppraisal,
      //   id : this.id
      // })
      this.loadDataParty(this.id);
      this.loadData(this.id);
    }
  }

  private loadData(id: string): void {
    this.partyCifService.find(id).subscribe(res => {
      this.itemx = res.body;

      // this.a = res.body.debtorData.pep
    });
  }
  private loadDataParty(id: string): void {
    this.partyGroupService.find(id).subscribe(res => {
      this.item = res.body;
      console.log('cek', this.item);
    });
  }
}
