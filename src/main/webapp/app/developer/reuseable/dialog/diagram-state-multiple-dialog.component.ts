import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { ReviewInsuranceService } from 'app/entities/review-insurance/review-insurance.service';
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
    private reviewInsuranceService: ReviewInsuranceService,
    private sanitizer: DomSanitizer
  ) {
    this.id = data['id'];
    this.type = data['type'];
  }
  ngOnInit(): void {
    this.loadDiagram();
  }

  private async loadDiagram() {
    let result: Blob;
    switch (this.type) {
      case 'insurance':
        result = (await firstValueFrom(this.reviewInsuranceService.getTaskDiagram(this.id))).body;
        break;
      case 'appraisal':
        result = (await firstValueFrom(this.cashSurveyAppraisalsService.getTaskDiagram(this.id))).body;
        break;

      default:
        result = (await firstValueFrom(this.creditProposalService.getTaskDiagram(this.id))).body;
        break;
    }

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
