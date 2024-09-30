import { Component } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'jhi-mis-credit-proposal-timeline',
  templateUrl: './mis-credit-proposal-timeline.component.html',
  styleUrls: ['./mis-report-credit-proposal-timeline.css', '../mis-report.css'],
  styles: [
    `
      .select-all {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        line-height: 48px;
        height: 48px;
        padding: 0 16px;
        text-align: left;
        text-decoration: none;
        max-width: 100%;
        position: relative;
        liststyletype: none;
        outline: none;
        display: flex;
        flex-direction: row;
        max-width: 100%;
        box-sizing: border-box;
        align-items: center;
        -webkit-tap-highlight-color: transparent;
      }

      .select-all:hover {
        background-color: #f5f5f5;
        cursor: pointer;
      }
    `,
  ],
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
    this.misCpTimeline.get('date1')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.misCpTimeline.get('date1').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.misCpTimeline.get('date2')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.misCpTimeline.get('date2').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.getStatus();
  }
  public previousState(): void {
    window.history.back();
  }
  getStatus() {
    this.misReportService.getStatuses('MIS_CREDIT_PROPOSAL_TIMELINE').subscribe({
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

  convertStatusToString(status: Array<string>): string {
    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  generateMISCPTimeline() {
    const template_report_data_cp_timeline = [
      { key: 'No.', valueFrom: '', format: 'string' },
      { key: 'Proposal Number', valueFrom: 'proposalNumber', format: 'string' },
      { key: 'Proposal Date', valueFrom: 'proposalDate', format: 'string' },
      { key: 'Segment', valueFrom: 'segment', format: 'string' },
      { key: 'Customer Status', valueFrom: 'customerStatus', format: 'string' },
      { key: 'CIF', valueFrom: 'cif', format: 'string' },
      { key: 'Debtor Name', valueFrom: 'debtorName', format: 'string' },
      { key: 'Credit Proposal Submit', valueFrom: 'creditProposalSubmit', format: 'string' },
      { key: 'Name', valueFrom: 'name1', format: 'string' },
      { key: 'Notes', valueFrom: 'notes1', format: 'string' },
      { key: 'BM APPROVED', valueFrom: 'bmApproved', format: 'string' },
      { key: 'Name', valueFrom: 'name2', format: 'string' },
      { key: 'Notes', valueFrom: 'notes2', format: 'string' },
      { key: 'SME HEAD', valueFrom: 'smeHead', format: 'string' },
      { key: 'Name', valueFrom: 'name3', format: 'string' },
      { key: 'Notes', valueFrom: 'notes3', format: 'string' },
      { key: 'Dept Head', valueFrom: 'deptHead', format: 'string' },
      { key: 'Name', valueFrom: 'name4', format: 'string' },
      { key: 'Notes', valueFrom: 'notes4', format: 'string' },
      { key: 'Div Head', valueFrom: 'divHead', format: 'string' },
      { key: 'Name', valueFrom: 'name5', format: 'string' },
      { key: 'Notes', valueFrom: 'notes5', format: 'string' },
      { key: 'Credit Review In', valueFrom: 'creditReviewIn', format: 'string' },
      { key: 'Name', valueFrom: 'name6', format: 'string' },
      { key: 'Notes', valueFrom: 'notes6', format: 'string' },
      { key: 'Loan Com 1', valueFrom: 'loanCom1', format: 'string' },
      { key: 'Name', valueFrom: 'name7', format: 'string' },
      { key: 'Notes', valueFrom: 'notes7', format: 'string' },
      { key: 'Loan Com 2', valueFrom: 'loanCom2', format: 'string' },
      { key: 'Name', valueFrom: 'name8', format: 'string' },
      { key: 'Notes', valueFrom: 'notes8', format: 'string' },
      { key: 'Loan Com 3', valueFrom: 'loanCom3', format: 'string' },
      { key: 'Name', valueFrom: 'name9', format: 'string' },
      { key: 'Notes', valueFrom: 'notes9', format: 'string' },
      { key: 'Loan Com 4', valueFrom: 'loanCom4', format: 'string' },
      { key: 'Name', valueFrom: 'name10', format: 'string' },
      { key: 'Notes', valueFrom: 'notes10', format: 'string' },
      { key: 'Approved', valueFrom: 'approved', format: 'string' },
      { key: 'Name', valueFrom: 'name11', format: 'string' },
      { key: 'Notes', valueFrom: 'notes11', format: 'string' },
      { key: 'Cancel', valueFrom: 'cancel', format: 'string' },
      { key: 'Name', valueFrom: 'name12', format: 'string' },
      { key: 'Notes', valueFrom: 'notes12', format: 'string' },
      { key: 'Reject', valueFrom: 'reject', format: 'string' },
      { key: 'Name', valueFrom: 'name13', format: 'string' },
      { key: 'Notes', valueFrom: 'notes13', format: 'string' },
      { key: 'TAT', valueFrom: 'tat', format: 'string' },
    ];

    const params = {
      startDate: this.misCpTimeline.get('date1')?.value,
      endDate: this.misCpTimeline.get('date2')?.value,
      status: this.convertStatusToString(this.misCpTimeline.get('status')?.value),
    };
  }
}
