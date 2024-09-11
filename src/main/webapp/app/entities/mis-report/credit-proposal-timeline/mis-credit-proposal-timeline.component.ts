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
  misCpTimeline: FormGroup;
  allSelected = false;
  changeOption(event) {
    console.log('test', event.value);
  }
  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    this.misCpTimeline = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
    });
    this.getStatus();
  }
  public previousState(): void {
    window.history.back();
  }
  getStatus() {
    this.misReportService.getStatusCpMapping().subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }
  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.misCpTimeline.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.misCpTimeline.get('status')?.setValue('');
    }
  }
}
