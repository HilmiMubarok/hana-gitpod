import { Component, Inject, Input } from '@angular/core';
import { PositionService } from 'app/entities/position/position.service';
import { APPLICATION_TYPE, POSITION_TYPE } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
// import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-signer-page',
  templateUrl: './signer-page.component.html',
  styleUrls: ['../offering-page.css'],
})
export class OfferingLetterSignerPageComponent {
  public displayColumns: string[] = ['no', 'name', 'debtor', 'action'];
  public loading: boolean;

  constructor(private positionService: PositionService) {
    this.loading = false;
  }

  openDialog() {}

  onDelete() {}
}
