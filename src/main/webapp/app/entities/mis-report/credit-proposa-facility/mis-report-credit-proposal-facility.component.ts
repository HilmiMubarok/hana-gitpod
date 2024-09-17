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
}
