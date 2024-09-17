import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-mis-report-credit-proposal-collateral',
  templateUrl: './mis-report-credit-proposal-collateral.component.html',
  styleUrls: ['./mis-report-credit-proposal-collateral.css'],
})
export class MisReportCreditProposalCollateralComponent {
  public lovStatus = [];
  status: '';
  date1: any;
  date2: any;
  listOfValue = [];
  allSelected = false;

  MisReportCPCollateral: FormGroup;

  changeOption(event) {
    console.log('data', event.value);
  }

  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    this.getStatus();
    this.MisReportCPCollateral;

    this.MisReportCPCollateral = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
    });

    this.MisReportCPCollateral.get('date1')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MisReportCPCollateral.get('date1').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.MisReportCPCollateral.get('date2')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MisReportCPCollateral.get('date2').setValue(formattedDate, { emitEvent: false });
      }
    });
  }

  getStatus() {
    this.misReportService.getStatuses('MIS_CREDIT_PROPOSAL_COLLATERAL').subscribe({
      next: res => (this.listOfValue = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.MisReportCPCollateral.get('status')?.setValue([...this.listOfValue.map(status => status.statusId)]);
    } else {
      this.MisReportCPCollateral.get('status')?.setValue('');
    }
  }

  public previousState(): void {
    window.history.back();
  }
}
