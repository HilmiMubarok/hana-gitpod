import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { firstValueFrom } from 'rxjs';

@Component({ selector: 'jhi-for-developer-show-diagram-state-dialog', templateUrl: './diagram-state-dialog.component.html' })
export class DeveloperShowDiagramStateDialogComponent implements OnInit {
  private id: number;
  public diagram: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: object,
    private creditProposalService: CreditProposalService,
    private sanitizer: DomSanitizer
  ) {
    this.id = data['id'];
  }
  ngOnInit(): void {
    this.loadDiagram();
  }

  private async loadDiagram() {
    const result: Blob = (await firstValueFrom(this.creditProposalService.getTaskDiagram(this.id))).body;
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.diagram = this.sanitizer.bypassSecurityTrustUrl(reader.result.toString());
      },
      false
    );
    reader.readAsDataURL(result);
  }
}
