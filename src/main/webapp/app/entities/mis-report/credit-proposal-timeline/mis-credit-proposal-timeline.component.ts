import { Component } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'jhi-mis-credit-proposal-timeline',
  templateUrl: './mis-credit-proposal-timeline.component.html',
  styleUrls: ['./mis-report-credit-proposal-timeline.css', '../mis-report.css'],
})
export class MisCreditProposalTimelineComponent {
  public lovStatus = [];
  listOfValue = [];
  changeOption(event) {
    console.log('test', event);
  }
  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    this.getStatus();
  }
  public previousState(): void {
    window.history.back();
  }
  getStatus() {
    this.misReportService.getStatuses().subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }
}
