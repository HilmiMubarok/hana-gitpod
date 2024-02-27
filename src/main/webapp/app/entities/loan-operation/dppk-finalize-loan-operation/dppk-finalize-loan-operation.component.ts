import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IEntityProperties } from 'app/entities/entity-properties/entity-properties.model';

@Component({
  selector: 'jhi-dppk-finalize-loan-operation',
  templateUrl: './dppk-finalize-loan-operation.component.html',
  styleUrls: ['./dppk-finalize-loan-operation.component.scss'],
})
export class DppkFinalizeLoanOperationComponent implements OnInit, OnChanges {
  public _creditProposal: ICreditProposal;
  public entityDppk: IEntityProperties;

  @Input() isElement: Boolean = false;
  @Input() isLabel: Boolean = false;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isElement']) {
      this.isElement = changes['isElement'].currentValue;
    }

    if (changes['isLabel']) {
      this.isLabel = changes['isLabel'].currentValue;
    }
  }

  findEntityDppk() {
    this.entityDppk = this.creditProposal.entityProperties.find(obj => obj.entityPropertyTypeId === 'DPPK');
  }
}
