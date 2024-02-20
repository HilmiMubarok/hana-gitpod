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
  selector: 'jhi-dppk-assign-to',
  templateUrl: './dppk-assign-to.component.html',
})
export class DppkAssignToComponent {
  constructor(
    private router: Router,
    private positionService: PositionService,
    public creditProposalService: CreditProposalService,
    private accountService: AccountService
  ) {}

  public disabledData: boolean;
  public account: Account;
  public applicationRoleIdOne;
  public applicationRoleIdTwo;
  public positionCheckerOne: IPosition[];
  public positionCheckerTwo: IPosition[];
  public position: IPosition[];

  public _creditProposal: ICreditProposal = new CreditProposal();
  @Output() assignToOne = new EventEmitter();
  @Output() assignToTwo = new EventEmitter();

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: any) {
    this._creditProposal = item;
    this.loadPosition();
  }

  dataPositionCheckerTwo: any;
  dataPositionCheckerOne: any;
  dataPositionCheckerOnes: any;
  public loadPosition(): void {
    this.positionService
      .queryFilterBy({
        page: 0,
        size: 9999,
        sort: ['id,asc'],
        idInternal: this.creditProposal.internalId,
      })
      .subscribe(res => {
        this.positionCheckerOne = res.body.filter(
          o => o.positionTypeId === 'CREDIT_ADMIN_TEAM_LEAD' || o.positionTypeId === 'CREDIT_ADMIN_UNIT_HEAD'
        );

        this.dataPositionCheckerOne = res.body.filter(o => o.positionTypeId === 'CREDIT_ADMIN_TEAM_LEAD');

        this.dataPositionCheckerOnes = res.body.filter(
          o => o.positionTypeId === 'CREDIT_ADMIN_TEAM_LEAD' || o.positionTypeId === 'CREDIT_ADMIN_UNIT_HEAD'
        );

        this.dataPositionCheckerTwo = res.body.filter(
          o =>
            o.positionTypeId === 'CREDIT_ADMIN_UNIT_HEAD' ||
            o.positionTypeId === 'CREDIT_ADMIN_DEPT_HEAD' ||
            o.positionTypeId === 'CREDIT_ADMIN_DIV_HEAD'
        );
      });
  }

  public onSelectAssignOne(event: any) {
    console.log('positionCheckerOne', this.positionCheckerOne);
    const dynAttr = 'dataAssignToDPPKReview1';
    const selectedPosition = this.positionCheckerOne.find(position => position.id === event.value);
    if (selectedPosition) {
      this.creditProposal.attributes[dynAttr] = {
        id: selectedPosition.id,
        applicationId: this.creditProposal.id,
        partyId: selectedPosition.partyId,
        partyName: selectedPosition.employeeFirstName,
        roleId: selectedPosition.positionTypeId,
        roleDescription: selectedPosition.positionTypeDescription,
      };
      this.assignToOne.emit(this.creditProposal.attributes[dynAttr]);
    }
    if (selectedPosition.positionTypeId === 'CREDIT_ADMIN_UNIT_HEAD') {
      this.positionCheckerTwo = lodash.filter(this.dataPositionCheckerTwo, o => o.positionTypeId !== 'CREDIT_ADMIN_UNIT_HEAD');
    } else {
      this.positionCheckerTwo = this.dataPositionCheckerTwo;
    }
  }

  public onSelectAssignTwo(event: any) {
    const dynAttr = 'dataAssignToDPPKReview2';
    const selectedPosition = this.positionCheckerTwo.find(position => position.id === event.value);

    if (selectedPosition) {
      this.creditProposal.attributes[dynAttr] = {
        id: selectedPosition.id,
        applicationId: this.creditProposal.id,
        partyId: selectedPosition.partyId,
        partyName: selectedPosition.employeeFirstName,
        roleId: selectedPosition.positionTypeId,
        roleDescription: selectedPosition.positionTypeDescription,
      };
      this.assignToTwo.emit(this.creditProposal.attributes[dynAttr]);
    }
    if (selectedPosition.positionTypeId === 'CREDIT_ADMIN_UNIT_HEAD') {
      this.positionCheckerOne = this.dataPositionCheckerOne;
    } else {
      this.positionCheckerOne = this.dataPositionCheckerOnes;
    }
  }
}
