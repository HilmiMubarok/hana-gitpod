import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import moment from 'moment';
import { error } from 'console';

@Component({
  selector: 'jhi-mis-report-credit-proposal-facility',
  templateUrl: './mis-report-credit-proposal-facility.component.html',
  styleUrls: ['./mis-report.style.css'],
})
export class MisReportCreditProposalFacilityComponent {
  status: '';
  date1: any;
  date2: any;
  public listOfValue = [];
  allSelected = false;

  MisReportCPFacility: FormGroup;

  changeOption(event) {
    console.log('data', event.value);
  }

  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    console.log('test22', this.MisReportCPFacility);

    this.MisReportCPFacility = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
    });

    this.MisReportCPFacility.get('date1')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MisReportCPFacility.get('date1').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.MisReportCPFacility.get('date2')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MisReportCPFacility.get('date2').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.getSatus();
  }

  getSatus() {
    this.misReportService.getStatuses('MIS_CREDIT_PROPOSAL_FACILITY').subscribe({
      next: res => (this.listOfValue = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.MisReportCPFacility.get('status')?.setValue([...this.listOfValue.map(status => status.statusId)]);
    } else {
      this.MisReportCPFacility.get('status')?.setValue('');
    }
  }
  public previousState(): void {
    window.history.back();
  }

  convertStatusToString(status: Array<string>): string {
    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  generateMISReportCP() {
    const template_report_data = [
      { key: 'No.', valueFrom: '', format: 'string' },
      { key: 'Proposal Number', valueFrom: 'proposalNumber', format: 'string' },
      { key: 'Proposal Date', valueFrom: 'proposalDate', format: 'date' },
      { key: 'Segment', valueFrom: 'segment', format: 'string' },
      { key: 'Customer Status', valueFrom: 'customerStatus', format: 'string' },
      { key: 'CIF', valueFrom: 'cif', format: 'string' },
      { key: 'Debtor Name', valueFrom: 'debtorName', format: 'string' },
      { key: 'Proposal Type', valueFrom: 'proposalType', format: 'string' },
      { key: 'Product ID', valueFrom: 'productId', format: 'string' },
      { key: 'Pengajuan', valueFrom: 'pengajuan', format: 'string' },
      { key: 'Facility', valueFrom: 'facility', format: 'string' },
      { key: 'Tenor Fasilitas', valueFrom: 'tenorFasilitas', format: 'string' },
      { key: 'Current Rate (%)', valueFrom: 'currentRate', format: 'string' },
      { key: 'Rate Proposed', valueFrom: 'rateProposed', format: 'string' },
      { key: 'Provision Fee', valueFrom: 'provisionFee', format: 'string' },
      { key: 'Admin Fee', valueFrom: 'adminFee', format: 'string' },
      { key: 'Currency', valueFrom: 'currency', format: 'string' },
      { key: 'Initial Limit', valueFrom: 'initialLimit', format: 'string' },
      { key: 'Outstanding', valueFrom: 'outstanding', format: 'string' },
      { key: 'Changes', valueFrom: 'changes', format: 'string' },
      { key: 'Total Plafond', valueFrom: 'totalPlafond', format: 'string' },
    ];

    const params = {
      startDate: this.MisReportCPFacility.get('date1')?.value,
      endDate: this.MisReportCPFacility.get('date2')?.value,
      status: this.convertStatusToString(this.MisReportCPFacility.get('status')?.value),
    };
  }
}
