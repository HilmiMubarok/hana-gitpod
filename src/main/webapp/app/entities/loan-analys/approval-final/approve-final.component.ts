import { Component, ViewChild, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IApplicationRole } from 'app/entities/application-role/application-role.model';
import { ApplicationRoleService } from 'app/entities/application-role/application-role.service';
import lodash from 'lodash';
import { PositionReportingStructureService } from 'app/entities/position-reporting-structure/position-reporting-structure.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { LoanAnalysService } from '../loan-analys.service';
import { AccountService } from 'app/core/auth/account.service';
import { firstValueFrom } from 'rxjs';
import { Account } from 'app/core/auth/account.model';
import { PersonService } from 'app/entities/person/person.service';
import { IPerson } from 'app/entities/person/person.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

@Component({
  selector: 'jhi-approve-final',
  templateUrl: './approve-final.component.html',
  styleUrls: ['./approve-final.css'],
})
export class ApproveFinalComponent implements OnInit {
  public patch: any;
  public view: boolean;
  public _creditProposal: ICreditProposal;
  public disabled: boolean;
  public hidden: boolean;
  constructor(
    protected router: Router,
    protected loanAnalysService: LoanAnalysService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    public creditProposalService: CreditProposalService
  ) {}

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  ngOnInit(): void {
    this.sableFeild();
    this.disabledStatus();
    this.hidePleaseSelect();
  }
  public sableFeild() {
    this.patch = this.router.url.split('/')[1];
    if (
      this.patch === 'la-distribution' ||
      this.patch === 'la-analyst' ||
      this.patch === 'la-SME-CRC' ||
      this.patch === 'la-approval' ||
      this.patch === 'la-approval-inquiry'
    ) {
      this.view = true;
    }
  }
  public disabledStatus() {
    this.disabled = true;
    // this.patch = this.router.url.split('/')[1];
    // if (this.patch === 'dar-final' || this.patch === 'loan-committee-approval') {
    //   this.disabled = false;
    // } else {
    //   this.disabled = true;
    // }
  }
  public hidePleaseSelect() {
    this.patch = this.router.url.split('/')[1];
    if (this.patch === 'credit-proposal-status' || this.patch === 'cp-status-approval') {
      this.hidden = false;
    } else {
      this.hidden = true;
    }
  }
}
