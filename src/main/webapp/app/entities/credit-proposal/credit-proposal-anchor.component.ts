import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ANIMATION } from 'app/shared/constants/base.constants';
import { ICollateral, Collateral } from '../collateral/collateral.model';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import * as _ from 'lodash';
import { IProcessTask, ITaskResult } from 'app/shared/model/process-task.model';
import { IPartyGroup } from '../party-group/party-group.model';

@Component({
  selector: 'jhi-credit-proposal-anchor',
  templateUrl: './credit-proposal-anchor.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CreditProposalAnchorComponent {
  @Input()
  public partyType: string;

  constructor(private creditProposalService: CreditProposalService, private route: ActivatedRoute, private router: Router) {}
}
