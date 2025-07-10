import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractExcelMISReport } from '../../abstract-excel-report';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MisReportService } from '../../mis-report.service';
import { MessageService } from 'primeng/api';
import moment from 'moment';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'jhi-mis-loan-ops-report',
  template: `
    <form [formGroup]="misLoanOpsForm" (ngSubmit)="generateMISLoanOps()">
      <mat-card style="border-radius: 12px">
        <mat-card-content>
          <div class="row my-3">
            <div class="col">
              <mat-form-field class="w-100" appearance="outline" [hideRequiredMarker]="true">
                <mat-label>Enter a date range</mat-label>
                <mat-date-range-input [rangePicker]="picker">
                  <input matStartDate formControlName="startDate" placeholder="Start date" (focus)="picker.open()" readonly />
                  <input matEndDate formControlName="endDate" placeholder="End date" (focus)="picker.open()" readonly />
                </mat-date-range-input>
                <mat-hint>MM/DD/YYYY – MM/DD/YYYY</mat-hint>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-date-range-picker #picker></mat-date-range-picker>
              </mat-form-field>
            </div>

            <div class="col">
              <mat-form-field class="w-100" appearance="outline" [hideRequiredMarker]="true">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status" multiple>
                  <li class="select-all" (click)="toggleSelectAll()">
                    {{ allSelected ? 'Deselect All' : 'Select All' }}
                  </li>
                  <mat-option *ngFor="let item of lovStatus" [value]="item.statusId">{{ item.statusDescription }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
          <div class="row my-3">
            <div class="col-6">
              <mat-form-field class="w-100" appearance="outline">
                <mat-label>Username</mat-label>
                <mat-select formControlName="username">
                  <mat-option [value]="null">--Select Username--</mat-option>
                  <mat-option *ngFor="let item of lovUsername" [value]="item.partyId">
                    {{
                      (item.employeeFirstName ? item.employeeFirstName : '') + ' ' + (item.employeeLastName ? item.employeeLastName : '')
                    }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="mt-3 text-center">
        <button
          mat-raised-button
          id="generate-btn"
          class="confirm-button-no"
          type="submit"
          [disabled]="misReportService.loadingGenerateDocument$ | async"
          [class.loading]="misReportService.loadingGenerateDocument$ | async"
        >
          {{ misReportService.generateDocumentLabel$ | async }}
        </button>
      </div>
    </form>
  `,
  styleUrls: ['../../mis-sla-credit-insurance/mis-sla-credit-insurance.css', '../../mis-report.css'],
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

      :host ::ng-deep .ng-invalid:not(form) {
        border: none !important;
      }
    `,
  ],
})
export class MisLoanOpsReportComponent extends AbstractExcelMISReport implements OnInit, OnDestroy {
  public lovStatus = [];
  public lovUsername = [];
  listOfValue = [];
  misLoanOpsForm: FormGroup;
  allSelected = false;

  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    super(misReportService);

    this.misLoanOpsForm = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      username: new FormControl(null),
    });

    this.misLoanOpsForm.get('startDate')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.misLoanOpsForm.get('startDate').setValue(formattedDate, { emitEvent: false });
      }
    });

    this.misLoanOpsForm.get('endDate')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.misLoanOpsForm.get('endDate').setValue(formattedDate, { emitEvent: false });
      }
    });
  }

  public previousState(): void {
    window.history.back();
  }

  private getFormValidationMessage(): string | null {
    const startDate = this.misLoanOpsForm.get('startDate');
    const endDate = this.misLoanOpsForm.get('endDate');
    const status = this.misLoanOpsForm.get('status');

    const isDateRangeInvalid = startDate?.invalid || endDate?.invalid;
    const isStatusInvalid = status?.invalid;

    if (isDateRangeInvalid && !isStatusInvalid) {
      return 'Please Select Date Range';
    }

    if (isStatusInvalid && !isDateRangeInvalid) {
      return 'Please Select Status';
    }

    if (isDateRangeInvalid && isStatusInvalid) {
      return 'Please Select Parameters';
    }

    return null;
  }

  ngOnInit(): void {
    this.getStatusLOV('MIS_SLA_LOANOPS').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
    this.misReportService.getLovUsernameLoanOps().subscribe({
      next: res => (this.lovUsername = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get List Username' });
      },
    });
  }

  ngOnDestroy(): void {
    this.misLoanOpsForm.reset();
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.misLoanOpsForm.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.misLoanOpsForm.get('status')?.setValue('');
    }
  }

  convertStatusToString(status: Array<string>): string {
    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  dateRangeHasValue(): boolean {
    return this.misLoanOpsForm.get('startDate')?.value && this.misLoanOpsForm.get('endDate')?.value;
  }

  clearDateRange(): void {
    this.misLoanOpsForm.get('startDate')?.reset();
    this.misLoanOpsForm.get('endDate')?.reset();
  }

  generateMISLoanOps() {
    if (this.misLoanOpsForm.invalid) {
      const errorMessage = this.getFormValidationMessage();
      if (errorMessage) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        return;
      }
    }

    this.misReportService.setLoading(true);
    const params = {
      startDate: this.misLoanOpsForm.get('startDate')?.value,
      endDate: this.misLoanOpsForm.get('endDate')?.value,
      status: this._convertStatusToString(this.misLoanOpsForm.get('status')?.value),
      type: 'STATELOG',
      businessKey: 'CREDITPROPOSAL',
      userName: this.misLoanOpsForm.get('username')?.value,
      assignTo: this.misLoanOpsForm.get('username')?.value ? 'dataAssignToLoanOpsOfficer' : null,
    };

    this.misReportService.getMISReportCPCredam(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_SLA_LOANOPS'),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate MIS Report' });
        this._resetData();
        this.misReportService.setLoading(false);
      },
      complete: () => {
        this._resetData();
        this.misReportService.setLoading(false);
      },
    });
  }

  private _processGenerate(data, fileName) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // this._setUpColumns(worksheet);
    this.setUpColumns(this.columns);

    // if data is empty, generate an empty file
    if (!data || data.length === 0) {
      this.applyStyles('ff2c9a48');
      this.downloadFile(fileName);
      return;
    }

    // Add data to worksheet
    this.processData(data);

    this._applyStyles();
    this._setAutoWidthForAllColumns();
    this._setAutoHeightForAllRows();
    this.downloadFile(fileName);
    this._resetData();
  }

  get columns(): any[] {
    return [
      { header: 'No', key: 'no' },
      { header: 'Proposal Number', key: 'proposalNumber' },
      { header: 'DPPK Number', key: 'dpkNumber' },
      { header: 'PIC Loan Ops Admin', key: 'picLoanOps' },
      { header: 'Debtor', key: 'debtor' },
      { header: 'Loan Ops Distribution in Date', key: 'loanOpsDistributionInDate' },
      { header: 'Loan Ops Distribution in Time', key: 'loanOpsDistributionInTime' },
      { header: 'Checker Out Name', key: 'loanOpsOfficerOutName' },
      { header: 'Checker Out Date', key: 'loanOpsOfficerOutDate' },
      { header: 'Checker out Time', key: 'loanOpsOfficerOutTime' },
      { header: 'Loan Ops Review', key: 'getLoanOpsOfficerSpvOutName' },
      { header: 'Review out Date', key: 'loanOpsOfficerSpvOutDate' },
      { header: 'Review out Time', key: 'loanOpsOfficerSpvOutTime' },
      { header: 'Completed Date', key: 'completedDate' },
      { header: 'Completed Time', key: 'completedTime' },
      { header: 'TAT Date', key: 'tatDate' },
      { header: 'TAT Time', key: 'tatTime' },
      { header: 'Status', key: 'status' },
      { header: 'Transaksi', key: 'transaksi' },
      { header: 'Fasilitas', key: 'fasilitas' },
      { header: 'CCY', key: 'ccy' },
      { header: 'Nominal', key: 'nominal' },
      { header: 'Tgl Efektif Fasilitas', key: 'tglEfektifFasilitas' },
      { header: 'Jenis Jaminan', key: 'jenisJaminan' },
      { header: 'Segmentasi', key: 'segmentasi' },
      { header: 'Branch', key: 'branch' },
      { header: 'RM', key: 'rm' },
      { header: 'Keterangan', key: 'keterangan' },
      { header: 'Deviasi', key: 'deviasi' },
      { header: 'TBO', key: 'tbo' },
    ];
  }

  protected processData(data: any[]): void {
    const statuses = ['Loan Ops Distribution', 'Loan Ops Checking', 'Loan Ops Review', 'Complete'];
    const sortedCreditProposals = this.sortCreditProposalByEarliestDate(data, statuses);

    sortedCreditProposals.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }

  private _addProposalData(ws: ExcelJS.Worksheet, prop: any, idx: number): void {
    prop.product
      ?.filter(prod => prod.pengajuan !== 'Existing')
      .forEach((prod: any, index: number) => {
        const dataRow = {
          no: ws.rowCount,
          proposalNumber: prop.proposalNumber || '',
          dpkNumber: prop.dppkNumber || '',
          picLoanOps: this.getPICLoanOps(prop),
          debtor: prop.debtorName || '',
          loanOpsDistributionInDate: this.getLoanOpsDistributionInDate(prop),
          loanOpsDistributionInTime: this.getLoanOpsDistributionInTime(prop),
          loanOpsOfficerOutName: prop.dataAssignToLoanOpsOfficerName || '',
          loanOpsOfficerOutDate: this.getLoanOpsOfficerOutDate(prop),
          loanOpsOfficerOutTime: this.getLoanOpsOfficerOutTime(prop),
          getLoanOpsOfficerSpvOutName: this.getLoanOpsOfficerSpvOutName(prop),
          loanOpsOfficerSpvOutDate: this._formatDateSLA(this.getLoanOpsOfficerSpvOutDate(prop)),
          loanOpsOfficerSpvOutTime: this.getLoanOpsOfficerSpvOutTime(prop),
          completedDate: this.getCompletedDate(prop),
          completedTime: this.getCompletedTime(prop),
          tatDate: this.getTatDate(prop),
          tatTime: this.getTatTime(prop),
          status: prop.status || '',
          transaksi: prod.pengajuan || '',
          fasilitas: prod.facility || '',
          ccy: prod.currency || '',
          nominal: prod.totalPlafond || '',
          tglEfektifFasilitas: this.getTanggalEfektifFasilitas(prod, prop),
          jenisJaminan: prop.collateral.map(coll => coll.collateralCode).join(',\n'),
          segmentasi: prop.regionalParentRM || '',
          branch: prop.bookingBranchName || '',
          rm: prop.rmFirstName + ' ' + prop.rmLastName || '',
          keterangan: '',
          deviasi: this._getDeviation(prop),
          tbo: prop.statusDocumentTbo || '',
        };

        ws.addRow(dataRow);
      });
  }

  private _applyStyles(): void {
    super.applyStyles('ff2c9a48');
    this.columns.forEach(column => {
      const col = this.worksheet.getColumn(column.key);
      col.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };

      const columnValue = this.worksheet.getColumn(column.key);

      const newValue = columnValue.values.map(value => {
        if (value) {
          return this._clearEmptyEntries(value.toString());
        }
        return value;
      });

      columnValue.values = newValue;
    });
  }

  private getLoanOpsDistributionInDate(proposal: any): string {
    return proposal.timeLineCreditProposal
      .filter((t: any) => t.statusDescription === 'Loan Ops Distribution')
      .map((timeline: any) => this._formatDateSLA(timeline.createdDate))
      .join(',\n');
  }

  private getLastLoanOpsDistributionInDate(product: any): string {
    const timelines = product.timeLineCreditProposal
      .sort((a: any, b: any) => a.id - b.id)
      .filter((t: any) => t.statusDescription === 'Loan Ops Distribution');
    return timelines.length > 0 ? timelines[0].fromDate : '';
  }

  private getLoanOpsDistributionInTime(proposal: any): string {
    return proposal.timeLineCreditProposal
      .filter((t: any) => t.statusDescription === 'Loan Ops Distribution')
      .map((timeline: any) => timeline.fromTime.split(':').slice(0, 2).join(':'))
      .join(',\n');
  }

  private getFirstLoanOpsDistributionInTime(proposal: any): string {
    const timelines = proposal.timeLineCreditProposal
      .sort((a: any, b: any) => a.id - b.id)
      .filter((t: any) => t.statusDescription === 'Loan Ops Distribution');

    return timelines[0].fromTime;
  }

  private getLoanOpsOfficerOutDate(proposal: any): string {
    return proposal.timeLineCreditProposal
      .filter((t: any) => t.statusDescription === 'Loan Ops Checking')
      .map((timeline: any) => this._formatDateSLA(timeline.fromDate))
      .join(',\n');
  }

  private getLoanOpsOfficerOutTime(proposal: any): string {
    return proposal.timeLineCreditProposal
      .filter((t: any) => t.statusDescription === 'Loan Ops Checking')
      .map((timeline: any) => timeline.fromTime.split(':').slice(0, 2).join(':'))
      .join(',\n');
  }

  private getLoanOpsOfficerSpvOutDate(proposal: any): string {
    return proposal.timeLineCreditProposal
      .filter((t: any) => t.statusDescription === 'Loan Ops Review')
      .map((timeline: any) => timeline.fromDate)
      .join(',\n');
  }

  private getLoanOpsOfficerSpvOutTime(proposal: any): string {
    return proposal.timeLineCreditProposal
      .filter((t: any) => t.statusDescription === 'Loan Ops Review')
      .map((timeline: any) => timeline.fromTime.split(':').slice(0, 2).join(':'))
      .join(',\n');
  }

  private getCompletedName(proposal: any): string {
    return proposal.timeLineCreditProposal
      .filter((t: any) => t.statusDescription === 'Complete')
      .map((timeline: any) => timeline.personName)
      .join(',\n');
  }

  private getCompletedDate(proposal: any): string {
    return proposal.timeLineCreditProposal
      .sort((a: any, b: any) => a.id - b.id)
      .filter((t: any) => t.statusDescription === 'Complete')
      .map((timeline: any) => this._formatDateSLA(timeline.fromDate))
      .join(',\n');
  }

  // getLastCompletedDate
  private getLastCompletedDate(proposal: any): string {
    const timelines = (proposal.timeLineCreditProposal || [])
      .filter((t: any) => t.statusDescription === 'Complete')
      .sort((a: any, b: any) => a.id - b.id);

    const lastCompleted = timelines[timelines.length - 1];

    return lastCompleted ? lastCompleted.fromDate : '-';
  }

  private getCompletedTime(proposal: any): string {
    return proposal.timeLineCreditProposal
      .sort((a: any, b: any) => a.id - b.id)
      .filter((t: any) => t.statusDescription === 'Complete')
      .map((timeline: any) => timeline.fromTime.split(':').slice(0, 2).join(':'))
      .join(',\n');
  }

  // getLastCompletedTime
  private getLastCompletedTime(proposal: any): string {
    const timelines = (proposal.timeLineCreditProposal || [])
      .filter((t: any) => t.statusDescription === 'Complete')
      .sort((a: any, b: any) => a.id - b.id);

    const lastCompleted = timelines[timelines.length - 1];

    return lastCompleted ? lastCompleted.fromTime : '-';
  }

  private getTatDate(prop): string {
    const completedDate = new Date(this.getLastCompletedDate(prop));
    const loanOpsDistributionInDate = new Date(this.getLastLoanOpsDistributionInDate(prop));

    if (!completedDate || !loanOpsDistributionInDate || isNaN(completedDate.getTime()) || isNaN(loanOpsDistributionInDate.getTime())) {
      return '';
    }

    const diffDays = Math.abs(completedDate.getTime() - loanOpsDistributionInDate.getTime()) / (1000 * 60 * 60 * 24);
    return isNaN(diffDays) ? '' : diffDays.toString();
  }

  private getTatTime(prop): string {
    const tatDate = Number(this.getTatDate(prop));
    const completedTime = this.getLastCompletedTime(prop);
    const loanOpsDistributionInTime = this.getFirstLoanOpsDistributionInTime(prop);

    if (!completedTime || !loanOpsDistributionInTime) {
      return '';
    }

    const date = new Date().toLocaleDateString('en-US'); // Use a standard date format
    const dateCompletedTime = new Date(`${date} ${completedTime} UTC`);
    const dateLoanOpsDistributionInTime = new Date(`${date} ${loanOpsDistributionInTime} UTC`);
    const eightHours = new Date(`${date} 08:00:00 UTC`);

    if (isNaN(dateCompletedTime.getTime()) || isNaN(dateLoanOpsDistributionInTime.getTime()) || isNaN(eightHours.getTime())) {
      return '';
    }

    let diffInMinutes;

    if (tatDate === 0) {
      diffInMinutes = (dateCompletedTime.getTime() - dateLoanOpsDistributionInTime.getTime()) / (1000 * 60);
    } else {
      diffInMinutes = (dateCompletedTime.getTime() - eightHours.getTime()) / (1000 * 60);
    }

    if (isNaN(diffInMinutes)) {
      return '';
    }

    const totalMinutes = Math.abs(diffInMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
  }

  private _getEarliestDate(dateStr: string): string {
    const dates = dateStr.split(/,\s*|\n/).map(date => date.trim());

    const earliestDate = dates.reduce((earliest, current) => {
      const [day1, month1, year1] = earliest.split('-').map(Number);
      const [day2, month2, year2] = current.split('-').map(Number);

      const date1 = new Date(year1, month1 - 1, day1);
      const date2 = new Date(year2, month2 - 1, day2);

      return date2 < date1 ? current : earliest;
    });
    return earliestDate;
  }

  private getTanggalEfektifFasilitas(prod: any, proposal = null): string {
    const pengajuan = (prod.pengajuan || '').trim().toLowerCase();

    switch (pengajuan) {
      case 'new': {
        return this._getEarliestDate(this.getLoanOpsDistributionInDate(proposal));
      }

      case 'renewal':
      case 'renewal + additional':
      case 'renewal + decrease': {
        const main = Array.isArray(prod.mainProduct) ? prod.mainProduct[0] : prod.mainProduct;
        if (!main || !main.maturityDate) {
          return '';
        }
        return this._formatDateSLA(main.maturityDate) || '';
      }

      case 'existing': {
        return this._formatDateSLA(prod.firstDisbursementDate) || '';
      }

      case 'additional / top up': {
        return this._getEarliestDate(this.getLoanOpsDistributionInDate(proposal));
      }

      default: {
        const main = Array.isArray(prod.mainProduct) ? prod.mainProduct[0] : prod.mainProduct;
        if (!main) {
          return '';
        }
        return main.endPeriodRemark || '';
      }
    }
  }

  private getPICLoanOps(proposal: any): string {
    const timeLine = proposal.timeLineCreditProposal.filter(t => t.statusDescription === 'Loan Ops Checking');
    timeLine.sort((a, b) => b.id - a.id);

    if (timeLine.length > 0) {
      return timeLine[0].personName;
    }
    return '';
  }

  private getLoanOpsOfficerSpvOutName(proposal: any): string {
    return proposal.timeLineCreditProposal
      .filter((t: any) => t.fromStatusDescription === 'Loan Ops Review')
      .map((timeline: any) => timeline.personName)
      .join(',\n');
  }
}
