import { Component } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-mis-creditproposal-report',
  templateUrl: './mis-creditproposal-report.component.html',
  styleUrls: ['./mis-report-credit-proposal.css', '../mis-report.css'],
})
export class MisCreditProposalReportComponent {
  data = '';
  date1: any;
  date2: any;
  listOfValue = [];
  changeOption(event) {
    console.log('test');
  }

  constructor(public misReportService: MisReportService, public messageService: MessageService) {}

  generateMISReportCP() {
    const template_report_data = [
      { key: 'No.', valueFrom: '', format: 'string' },
      { key: 'Proposal Number', valueFrom: 'applicationNumber', format: 'string' },
      { key: 'Debtors Name', valueFrom: 'debtorName', format: 'string' },
      { key: 'Branch', valueFrom: 'branch', format: 'string' },
      { key: 'RM', valueFrom: 'rm', format: 'string' },
      { key: 'PIC', valueFrom: 'pic', format: 'string' },
      { key: 'Document Name', valueFrom: 'name', format: 'string' },
      { key: 'Current Document Status', valueFrom: 'initialStatusId', format: 'string' },
      { key: 'Current Document Date', valueFrom: 'date', format: 'date' },
      { key: 'Proposed Document Status', valueFrom: 'statusAppDocId', format: 'string' },
      { key: 'Proposed Document Date', valueFrom: 'dueDate', format: 'date' },
      { key: 'Monitoring Checking Date', valueFrom: 'checkingDate', format: 'date' },
      { key: 'Monitoring Review Date', valueFrom: 'reviewDate', format: 'date' },
      { key: 'Monitoring Approval Date', valueFrom: 'approvalDate', format: 'date' },
      { key: 'Remark', valueFrom: 'notes', format: 'string' },
      { key: 'Status Last Meeting', valueFrom: '', format: 'string' },
    ];

    this.misReportService
      .generateMisReport(template_report_data, this.misReportService.getMisReportCP(), 'MIS_Report_Credit_Proposal')
      .subscribe({
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate document' });
        },
      });
  }
}
