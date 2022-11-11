import { Component, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ICreditProposal, CreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { IProcessTask } from 'app/shared/model/process-task.model';
import { CreditProposalProcessService } from '../credit-proposal/credit-proposal-process.service';
import { AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { MessageService } from 'primeng/api';
import lodash from 'lodash';
import { POSITION_TYPE } from 'app/shared/constants/base.constants';
import { PositionService } from '../position/position.service';
import { IPosition } from '../position/position.model';
import { SUBMENU_LOAN_ANALYS } from 'app/shared/constants/base.constants';
import { MatDialog } from '@angular/material/dialog';
import { TaskCommentDialogComponent } from 'app/layouts/miscellaneous/task-comment-dialog.component';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { INotes, Notes } from 'app/entities/notes/notes.model';

import { IApplicationRole, ApplicationRole } from '../application-role/application-role.model';
import { ApplicationRoleService } from '../application-role/application-role.service';
import _ from 'lodash';

@Component({
  selector: 'jhi-loan-analys-main',
  templateUrl: './loan-analys-main.component.html',
  styleUrls: ['./loan-analys-main.css'],
})
export class LoanAnalysMainComponent implements OnInit {
  private id: number;
  // private id: string;

  public url: string;
  public subMenu: object[];
  public tasks: IProcessTask[] = new Array<IProcessTask>();
  public postalAdresss;
  public selectedMenu: string;

  public creditProposal: ICreditProposal;
  public position: IPosition[];
  public currentAccount: Account;
  public applicationRoles: IApplicationRole[];
  public applicationRole: IApplicationRole;
  public applicationRoleId: number;
  public activeRoute: string;

  constructor(
    private creditProposalService: CreditProposalService,
    private creditProposalProcessService: CreditProposalProcessService,
    protected activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    protected messageService: MessageService,
    private positionService: PositionService,
    public accountService: AccountService,
    public applicationRoleService: ApplicationRoleService
  ) {
    this.applicationRole = new ApplicationRole();
    this.creditProposal = this.activatedRoute.snapshot.data['loanAnalys'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    // this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.activeRoute = this.router.url.replace(/\//g, '');
    this.selectedMenu = 'credit-proposal-summary';

    this.subMenu = SUBMENU_LOAN_ANALYS;

    const parentPath = this.router.url.split('/')[1];
    this.url = parentPath;

    if (parentPath === 'cc-distribution' || parentPath === 'cc-checking-review' || parentPath === 'cc-checking-inquiry') {
      if (this.creditProposal.statusId === 'CP_APPROVE_TO_LA') {
        this.subMenu = [
          {
            id: 'credit-proposal-summary',
            text: 'Credit Proposal Summary',
          },
        ];
      } else {
        this.subMenu.splice(1, 1);
      }
    } else {
      if (this.creditProposal.statusId === 'CP_APPROVE_TO_LA') {
        this.subMenu = [
          {
            id: 'credit-proposal-summary',
            text: 'Credit Proposal Summary',
          },
        ];
      }
    }

    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.selectedMenu = subRoute;
      }
    });
  }

  public loadPosition(position): void {
    this.positionService.queryFilterBy({ idPositionType: position, size: 9999, page: 0 }).subscribe(res => {
      this.position = lodash.filter(res.body, function (o) {
        return o.partyId !== null;
      });

      this.applicationRoleService
        .queryFilterBy({ idApplication: this.creditProposal.id, size: 9999, page: 0 })
        .subscribe(resApplicationRole => {
          if (resApplicationRole) {
            this.applicationRoles = resApplicationRole.body;
            for (let i = 0; i < this.applicationRoles.length; i++) {
              if (this.applicationRoles[i].roleId === 'CRO') {
                for (let j = 0; j < this.position.length; j++) {
                  if (this.applicationRoles[i].partyId === this.position[j].partyId) {
                    this.applicationRoleId = this.position[j].id;
                    this.applicationRole = this.applicationRoles[i];
                  }
                }
              }
            }
          }
        });
    });
  }

  ngOnInit() {
    //* if proposal status include at least 1 of the values below, then show complience recommendation menu
    const values = ['CP_CC_DISTRIBUTION', 'CP_CC_ANALYST', 'CP_CC_REVIEW'];
    if (values.includes(this.creditProposal.statusId) === false) {
      this.subMenu.splice(_.findIndex(this.subMenu, { id: 'complience-recommendation' }), 1);
    }

    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });

    this.loadPosition('CRO');
    const passSummary = {
      strength: '',
      opportunities: '',
      weaknesses: '',
      threats: '',
    };
    this.creditProposal.attributes['tabSummary'] = this.creditProposal.attributes.tabSummary
      ? JSON.parse(this.creditProposal.attributes.tabSummary)
      : passSummary;
    this.getTasks();
    this.postalAdresss = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'PRIMARY_LOCATION';
    });
  }

  private getTasks(): void {
    this.creditProposalProcessService.getTasks(this.id).subscribe(res => {
      this.tasks = res.body;
    });
  }

  public processTask(task: IProcessTask): void {
    const dialogRef = this.dialog.open(TaskCommentDialogComponent, {
      width: '80vw',
      data: { processTask: task },
    });
    dialogRef.afterClosed().subscribe(_res => {
      if (_res) {
        this.creditProposalProcessService.processTask(task).subscribe(res => {
          this.router.navigate([this.router.url.split('/')[1]]);
        });
      }
    });
  }

  public previousState(): void {
    window.history.back();
  }

  public goToSubMenu(menu: string): void {
    this.selectedMenu = menu;
  }

  public routeSubMenu(menu: object): void {
    const routeHelper =
      this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2] + '/' + this.router.url.split('/')[3].substr(0, 13);
    this.router.navigate([routeHelper], { queryParams: { subroute: menu['id'] } });
  }

  private addNewNotes(messageVal: any, recomendationVal: string, conditionVal: string, userIdVal: string): INotes {
    let note: INotes = new Notes();

    return (note = {
      message: messageVal,
      userId: userIdVal,
      createDate: new Date(),
      recomendation: recomendationVal,
      condition: conditionVal,
    });
  }

  // get data from child
  public onAssignTo(ev) {
    this.applicationRole = ev;
  }

  private saveApplicationRole(): void {
    if (this.applicationRole.id) {
      this.applicationRoleService.update(this.applicationRole).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
      });
    } else {
      this.applicationRoleService.create(this.applicationRole).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
      });
    }
  }

  private preSave(): ICreditProposal {
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);
    let tempHelper = 0;

    if (lodash.has(copyCreditProposal.attributes, 'tempLoggedInNotes')) {
      if (copyCreditProposal.notes.length > 0) {
        for (let i = 0; i < copyCreditProposal.notes.length; i++) {
          if (copyCreditProposal.notes[i].userId === this.currentAccount.login) {
            copyCreditProposal.notes[i].message = copyCreditProposal.attributes['tempLoggedInNotes'];
            copyCreditProposal.notes[i].recomendation = copyCreditProposal.attributes['tempLoggedInRecomendation'];
            copyCreditProposal.notes[i].condition = copyCreditProposal.attributes['tempLoggedInCondition'];
            tempHelper = tempHelper + 1;
          }
        }

        if (tempHelper === 0) {
          copyCreditProposal.notes.push(
            this.addNewNotes(
              copyCreditProposal.attributes['tempLoggedInNotes'],
              copyCreditProposal.attributes['tempLoggedInRecomendation'],
              copyCreditProposal.attributes['tempLoggedInCondition'],
              this.currentAccount.login
            )
          );
        }
      } else {
        copyCreditProposal.notes.push(
          this.addNewNotes(
            copyCreditProposal.attributes['tempLoggedInNotes'],
            copyCreditProposal.attributes['tempLoggedInRecomendation'],
            copyCreditProposal.attributes['tempLoggedInCondition'],
            this.currentAccount.login
          )
        );
      }
      delete copyCreditProposal.attributes['tempLoggedInNotes'];
      delete copyCreditProposal.attributes['tempLoggedInRecomendation'];
      delete copyCreditProposal.attributes['tempLoggedInCondition'];
    }

    copyCreditProposal.attributes['businessGroup'] = JSON.stringify(copyCreditProposal.attributes['businessGroup']);
    copyCreditProposal.attributes['shareHolder'] = JSON.stringify(copyCreditProposal.attributes['shareHolder']);
    copyCreditProposal.attributes['correspondence'] = JSON.stringify(copyCreditProposal.attributes['correspondence']);
    copyCreditProposal.attributes['basicInformation'] = JSON.stringify(copyCreditProposal.attributes['basicInformation']);
    copyCreditProposal.attributes['guaranturAnalysis'] = JSON.stringify(copyCreditProposal.attributes['guaranturAnalysis']);
    copyCreditProposal.attributes['riksCriteria'] = JSON.stringify(copyCreditProposal.attributes['riksCriteria']);
    copyCreditProposal.attributes['convenant'] = JSON.stringify(copyCreditProposal.attributes['convenant']);
    copyCreditProposal.attributes['businessActivity'] = JSON.stringify(copyCreditProposal.attributes['businessActivity']);
    copyCreditProposal.attributes['analysisOfCalculation'] = JSON.stringify(copyCreditProposal.attributes['analysisOfCalculation']);
    copyCreditProposal.attributes['bankAnalyst'] = JSON.stringify(copyCreditProposal.attributes['bankAnalyst']);
    copyCreditProposal.attributes['proformaLaporanKeuangan'] = JSON.stringify(copyCreditProposal.attributes['proformaLaporanKeuangan']);
    copyCreditProposal.attributes['tabSummary'] = JSON.stringify(copyCreditProposal.attributes['tabSummary']);
    copyCreditProposal.attributes['insurance'] = JSON.stringify(copyCreditProposal.attributes['insurance']);
    copyCreditProposal.attributes['binding'] = JSON.stringify(copyCreditProposal.attributes['binding']);
    copyCreditProposal.debtorData.attributes['prospectPerson'] = JSON.stringify(copyCreditProposal.debtorData.attributes['prospectPerson']);
    copyCreditProposal.attributes['repaymentCapability'] = JSON.stringify(copyCreditProposal.attributes['repaymentCapability']);
    copyCreditProposal.attributes['facilityDetail'] = JSON.stringify(this.creditProposal.attributes['facilityDetail']);
    copyCreditProposal.attributes['tabCustomer'] = JSON.stringify(this.creditProposal.attributes['tabCustomer']);
    copyCreditProposal.attributes['tradeCheckingSupplier'] = JSON.stringify(copyCreditProposal.attributes['tradeCheckingSupplier']);
    copyCreditProposal.attributes['tradeCheckingBuyers'] = JSON.stringify(copyCreditProposal.attributes['tradeCheckingBuyers']);
    copyCreditProposal.attributes['collateralChecklist'] = JSON.stringify(this.creditProposal.attributes['collateralChecklist']);
    copyCreditProposal.attributes['tabSummaryMessage'] = JSON.stringify(this.creditProposal.attributes['tabSummaryMessage']);
    copyCreditProposal.attributes['managementInfo'] = JSON.stringify(this.creditProposal.attributes['managementInfo']);
    copyCreditProposal.attributes['noteMessage'] = JSON.stringify(copyCreditProposal.attributes['noteMessage']);
    copyCreditProposal.attributes['purposePricing'] = JSON.stringify(copyCreditProposal.attributes['purposePricing']);
    copyCreditProposal.attributes['cpRacBelow'] = JSON.stringify(copyCreditProposal.attributes['cpRacBelow']);
    copyCreditProposal.attributes['cpRacBack'] = JSON.stringify(copyCreditProposal.attributes['cpRacBack']);
    copyCreditProposal.attributes['emptyField'] = JSON.stringify(copyCreditProposal.attributes['emptyField']);
    copyCreditProposal.attributes['collateralPrevious'] = JSON.stringify(copyCreditProposal.attributes['collateralPrevious']);
    copyCreditProposal.attributes['facilityTakeOver'] = JSON.stringify(copyCreditProposal.attributes['facilityTakeOver']);
    copyCreditProposal.attributes['facilityTakeOverAfterBank'] = JSON.stringify(copyCreditProposal.attributes['facilityTakeOverAfterBank']);
    copyCreditProposal.attributes['creditProposalParent'] = JSON.stringify(copyCreditProposal.attributes['creditProposalParent']);
    copyCreditProposal.attributes['complienceReccomendation'] = JSON.stringify(copyCreditProposal.attributes['complienceReccomendation']);
    copyCreditProposal.attributes['industryLimit'] = JSON.stringify(copyCreditProposal.attributes['industryLimit']);
    copyCreditProposal.attributes['offeringLetter'] = JSON.stringify(copyCreditProposal.attributes['offeringLetter']);
    copyCreditProposal.attributes['bankAnalystMessage'] = JSON.stringify(copyCreditProposal.attributes['bankAnalystMessage']);
    copyCreditProposal.attributes['previous'] = JSON.stringify(copyCreditProposal.attributes['previous']);
    copyCreditProposal.attributes['offeringLetterPreparation'] = JSON.stringify(copyCreditProposal.attributes['offeringLetterPreparation']);
    copyCreditProposal.attributes['creditProposalCollateralData'] = JSON.stringify(
      copyCreditProposal.attributes['creditProposalCollateralData']
    );
    copyCreditProposal.attributes['retriveData'] = JSON.stringify(copyCreditProposal.attributes['retriveData']);
    copyCreditProposal.attributes['remarksFinancialStatement'] = JSON.stringify(copyCreditProposal.attributes['remarksFinancialStatement']);
    copyCreditProposal.attributes['tradeCheckingRemarks'] = JSON.stringify(copyCreditProposal.attributes['tradeCheckingRemarks']);

    return copyCreditProposal;
  }

  public onSave(): void {
    if (this.creditProposal.id) {
      this.creditProposalService.update(this.preSave()).subscribe(res => {
        this.saveApplicationRole();
      });
    } else {
      this.creditProposalService.create(this.preSave()).subscribe(res => {
        this.saveApplicationRole();
      });
    }
  }
}
