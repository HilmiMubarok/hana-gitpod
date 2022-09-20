import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ICreditProposal, CreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { IProcessTask } from 'app/shared/model/process-task.model';
import { CreditProposalProcessService } from '../credit-proposal/credit-proposal-process.service';
import { AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { MessageService } from 'primeng/api';
import lodash from 'lodash';

@Component({
  selector: 'jhi-loan-analys-main',
  templateUrl: './loan-analys-main.component.html',
  styleUrls: ['./loan-analys-main.css']
})
export class LoanAnalysMainComponent implements OnInit {
  private id: number;
  public tasks: IProcessTask[] = new Array<IProcessTask>();

  public selectedMenu: string;

  public creditProposal: ICreditProposal;

  constructor(
    private creditProposalService: CreditProposalService,
    private creditProposalProcessService: CreditProposalProcessService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    protected messageService: MessageService
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
	this.selectedMenu = 'credit-proposal-summary';
  }

  ngOnInit() {
	this.getTasks();
  }
  /* test */

  private getTasks(): void {
    this.creditProposalProcessService.getTasks(this.id).subscribe(res => {
      this.tasks = res.body;
    });
  }

  public processTask(task: IProcessTask): void {
    this.creditProposalProcessService.processTask(task).subscribe(res => {
      this.router.navigate(['./loan-analys']);
    });
  }

  public previousState(): void {
    window.history.back();
  }

  public onSave(): void {
	
  }
}