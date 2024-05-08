import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { EntityProperties, IEntityProperties } from 'app/entities/entity-properties/entity-properties.model';
import { EntitiyPropertiesService } from 'app/entities/entity-properties/entity-properties.service';

@Component({
  selector: 'jhi-dppk-preparation',
  templateUrl: './dppk-preparation.component.html',
  styleUrls: ['./dppk-preparation.component.scss'],
})
export class DppkPreparationComponent {
  public _creditProposal: ICreditProposal;
  public entityDppk: IEntityProperties = new EntityProperties();
  public _dppkNumber: String = '';

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  @Input()
  get dppkNumber() {
    return this._dppkNumber;
  }

  set dppkNumber(item: String) {
    this._dppkNumber = item;
  }

  constructor() {}
}
