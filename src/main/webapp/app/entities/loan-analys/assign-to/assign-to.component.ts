import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';
import lodash from 'lodash';
import { CreditProposal, ICreditProposal } from '../../credit-proposal/credit-proposal.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-assign-to',
  templateUrl: './assign-to.component.html',
})
export class AssignToComponent implements OnInit {
  constructor(
    private router: Router,
    private positionService: PositionService,
    public creditProposalService: CreditProposalService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.checkLogin();
  }

  public disabledData: boolean;
  public account: Account;
  public applicationRole;
  public applicationRoleId;
  public position: IPosition[];
  public _creditProposal: ICreditProposal = new CreditProposal();

  @Input() url: string;

  @Output() assignTo = new EventEmitter();

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: any) {
    this._creditProposal = item;

    if (this.router.url.split('/')[1] === 'la-distribution') {
      this.loadPosition(['CRO']);
    } else if (this.router.url.split('/')[1] === 'cc-distribution') {
      this.loadPosition(['CC_ANALYST']);
    } else if (this.router.url.split('/')[1] === 'distribution') {
      this.loadPosition(['LEGAL_OFFICER']);
    } else if (this.router.url.split('/')[1] === 'loan-ops-distribution') {
      this.loadPosition(['LOAN_OPS_OFFICER']);
    }
  }

  public loadPosition(positionTypeId: any): void {
    // Change endpoint position
    this.positionService.getPositionAssignTo(positionTypeId, this.creditProposal.internalId, { page: 0, size: 9999 }).subscribe(res => {
      let tempDataAssignTo = {};
      this.position = lodash.filter(res.body, function (o) {
        return o.partyId !== null;
      });

      if (this.router.url.split('/')[1] === 'la-distribution') {
        tempDataAssignTo = this._creditProposal.attributes['dataAssignToCRO'];
      } else if (this.router.url.split('/')[1] === 'cc-distribution') {
        tempDataAssignTo = this._creditProposal.attributes['dataAssignToCCAdmin'];
      } else if (this.router.url.split('/')[1] === 'distribution') {
        tempDataAssignTo = this._creditProposal.attributes['dataAssignToLegalOfficer'];
      } else if (this.router.url.split('/')[1] === 'loan-ops-distribution') {
        tempDataAssignTo = this._creditProposal.attributes['dataAssignToLoanOpsOfficer'];
      } else {
        tempDataAssignTo = this._creditProposal.attributes['dataAssignTo'];
      }

      this.applicationRoleId = tempDataAssignTo['id'];
      this.assignTo.emit(tempDataAssignTo);
    });
  }

  public onSelectAssignTo(event: any) {
    let dynAttr = 'dataAssignTo';
    for (let i = 0; i < this.position.length; i++) {
      if (event.value === this.position[i].id) {
        if (this.router.url.split('/')[1] === 'la-distribution') {
          dynAttr = 'dataAssignToCRO';
        } else if (this.router.url.split('/')[1] === 'cc-distribution') {
          dynAttr = 'dataAssignToCCAdmin';
        } else if (this.router.url.split('/')[1] === 'distribution') {
          dynAttr = 'dataAssignToLegalOfficer';
        } else if (this.router.url.split('/')[1] === 'loan-ops-distribution') {
          dynAttr = 'dataAssignToLoanOpsOfficer';
        }

        this.creditProposal.attributes[dynAttr].id = event.value;
        this.creditProposal.attributes[dynAttr].applicationId = this.creditProposal.id;
        this.creditProposal.attributes[dynAttr].partyId = this.position[i].partyId;
        this.creditProposal.attributes[dynAttr].partyName = this.position[i].employeeFirstName;
        this.creditProposal.attributes[dynAttr].roleId = this.position[i].positionTypeId;
        this.creditProposal.attributes[dynAttr].roleDescription = this.position[i].positionTypeDescription;
      }
    }
    this.assignTo.emit(this.creditProposal.attributes[dynAttr]);
  }

  private checkLogin() {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
        console.log('account', this.account);
        if (this.account.authorities.length <= 2) {
          if (this.account.authorities.includes('ROLE_CRC')) {
            this.disabledData = true;
          }
          if (this.account.authorities.includes('ROLE_HCR1')) {
            this.disabledData = true;
          }
        }
      }
    });
  }
}
