import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IEntityProperties } from 'app/entities/entity-properties/entity-properties.model';

@Component({
  selector: 'jhi-dppk-preparation',
  templateUrl: './dppk-preparation.component.html',
  styleUrls: ['./dppk-preparation.component.scss'],
})
export class DppkPreparationComponent implements OnInit {
  public _creditProposal: ICreditProposal;
  public entityDppk: IEntityProperties;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  constructor() {}
  ngOnInit(): void {
    this.findEntityDppk();
  }

  findEntityDppk() {
    this.entityDppk = this.creditProposal.entityProperties.find(obj => obj.entityPropertyTypeId === 'DPPK');
  }
}
