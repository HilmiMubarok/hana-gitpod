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
export class DppkAssignToComponent implements OnInit {
  constructor(
    private router: Router,
    private positionService: PositionService,
    public creditProposalService: CreditProposalService,
    private accountService: AccountService
  ) {}

  public _creditProposal: ICreditProposal = new CreditProposal();
  public disabledData: boolean;
  public account: Account;
  public applicationRoleIdOne;
  public applicationRoleIdTwo;
  public positionCheckerOne: IPosition[];
  public positionCheckerTwo: IPosition[];
  public position: IPosition[];
  dataPositionCheckerTwo: any;
  dataPositionCheckerOne: any;
  dataPositionCheckerOnes: any;

  @Output() assignToOne = new EventEmitter();
  @Output() assignToTwo = new EventEmitter();
  public dataPosition = ['CREDIT_ADMIN_UNIT_HEAD', 'CREDIT_ADMIN_TEAM_LEAD', 'CREDIT_ADMIN_DIV_HEAD', 'CREDIT_ADMIN_DIV_HEAD'];

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: any) {
    this._creditProposal = item;
    this.loadPosition();
  }

  ngOnInit() {
    // Periksa apakah atribut dataAssignToDPPKReview1 dan dataAssignToDPPKReview2 sudah ada
    if (this.creditProposal.attributes['dataAssignToDPPKReview1']) {
      this.applicationRoleIdOne = this.creditProposal.attributes['dataAssignToDPPKReview1'].id;
    }

    if (this.creditProposal.attributes['dataAssignToDPPKReview2']) {
      this.applicationRoleIdTwo = this.creditProposal.attributes['dataAssignToDPPKReview2'].id;
    }
  }

  public loadPosition(): void {
    const idPositionTypes = ['CREDIT_ADMIN_UNIT_HEAD', 'CREDIT_ADMIN_TEAM_LEAD', 'CREDIT_ADMIN_DIV_HEAD', 'CREDIT_ADMIN_DEPT_HEAD'].join(
      ','
    );
    this.positionService.getPositionAssignToMultiplePosition(idPositionTypes, this.creditProposal.internalId).subscribe(res => {
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
      this.positionCheckerTwo = this.dataPositionCheckerTwo;
    });
  }

  public onSelectAssignOne(event: any) {
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
    if (selectedPosition && selectedPosition.positionTypeId === 'CREDIT_ADMIN_UNIT_HEAD') {
      // Jika posisi untuk Checker 1 adalah CREDIT_ADMIN_UNIT_HEAD, maka filter posisi untuk Checker 2
      this.positionCheckerTwo = lodash.filter(this.dataPositionCheckerTwo, o => o.positionTypeId !== 'CREDIT_ADMIN_UNIT_HEAD');
    } else {
      // Jika posisi untuk Checker 1 bukan CREDIT_ADMIN_UNIT_HEAD, tampilkan semua posisi untuk Checker 2
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

    // Reset data for Checker 1 based on the position selected for Checker 2
    if (selectedPosition && selectedPosition.positionTypeId === 'CREDIT_ADMIN_UNIT_HEAD') {
      // If the position for Checker 2 is CREDIT_ADMIN_UNIT_HEAD, filter positions for Checker 1
      this.positionCheckerOne = this.dataPositionCheckerOne;
    } else {
      // If the position for Checker 2 is not CREDIT_ADMIN_UNIT_HEAD, show all positions for Checker 1
      this.positionCheckerOne = this.dataPositionCheckerOnes;
    }
  }
}
