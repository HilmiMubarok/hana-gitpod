import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';

@Component({
  selector: 'jhi-survey-batch-collateral-appraisal-party-group-view',
  templateUrl: './survey-batch-collateral-appraisal-party-group-view.component.html',
  styleUrls: ['./survey-batch-collateral-appraisal-party-group-view.css'],
})
export class SurveyBatchCollateralAppraisalPartyGroupViewComponent implements OnChanges {
  @Input()
  public id: string;

  public item: IPartyGroup;
  public tipeNasabah: string;
  constructor(private partyGroupService: PartyGroupService) {
    this.item = new PartyGroup();
    this.tipeNasabah = 'corporate';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      this.loadData(this.id);
    }
  }

  private loadData(id: string): void {
    this.partyGroupService.find(id).subscribe(res => {
      this.item = res.body;
    });
  }
}
