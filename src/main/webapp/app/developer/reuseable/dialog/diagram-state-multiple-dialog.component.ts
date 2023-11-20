import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { CashSurveyAppraisalsService } from 'app/entities/survey-appraisals/cash-survey-appraisal.service';
import { firstValueFrom } from 'rxjs';

@Component({ selector: 'jhi-developer-area-show-diagram-state-dialog', templateUrl: './diagram-state-multiple-dialog.component.html' })
export class DeveloperShowDiagramStateMultipleDialogComponent implements OnInit {
  public loading = true;
  private id: number;
  private type: string;
  public diagram: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: object,
    private creditProposalService: CreditProposalService,
    private cashSurveyAppraisalsService: CashSurveyAppraisalsService,
    private sanitizer: DomSanitizer
  ) {
    this.id = data['id'];
    this.type = data['type'];
  }
  ngOnInit(): void {
    this.loadDiagram();
  }

  private async loadDiagram() {
    const result: Blob =
      this.type === 'cp'
        ? (await firstValueFrom(this.creditProposalService.getTaskDiagram(this.id))).body
        : (await firstValueFrom(this.cashSurveyAppraisalsService.getTaskDiagram(this.id))).body;
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.diagram = this.sanitizer.bypassSecurityTrustUrl(reader.result.toString());
      },
      false
    );
    reader.readAsDataURL(result);
    this.loading = false;
  }
}
