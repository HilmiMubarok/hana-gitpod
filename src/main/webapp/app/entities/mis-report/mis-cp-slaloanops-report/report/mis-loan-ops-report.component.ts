import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractExcelMISReport } from '../../abstract-excel-report';
import { FormControl, FormGroup } from '@angular/forms';
import { MisReportService } from '../../mis-report.service';
import { MessageService } from 'primeng/api';
import moment from 'moment';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'jhi-mis-loan-ops-report',
  template: `
    <form [formGroup]="misLoanOpsForm" (ngSubmit)="generateMISLoanOps()">
      <div class="e-card-header-caption">
        <ejs-breadcrumb cssClass="margin: 1rem;">
          <e-breadcrumb-items>
            <e-breadcrumb-item iconCss="e-icons e-home" url="/"></e-breadcrumb-item>
            <e-breadcrumb-item text="SLA Loan Operations" url=""> </e-breadcrumb-item>
          </e-breadcrumb-items>
        </ejs-breadcrumb>
      </div>
      <mat-card style="border-radius: 12px">
        <mat-card-content>
          <div class="row my-3">
            <div class="col">
              <mat-form-field class="w-100" appearance="outline">
                <mat-label>Enter a date range</mat-label>
                <mat-date-range-input [rangePicker]="picker">
                  <input matStartDate formControlName="startDate" placeholder="Start date" />
                  <input matEndDate formControlName="endDate" placeholder="End date" />
                </mat-date-range-input>
                <mat-hint>MM/DD/YYYY – MM/DD/YYYY</mat-hint>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-date-range-picker #picker></mat-date-range-picker>
              </mat-form-field>
            </div>

            <div class="col">
              <mat-form-field class="w-100" appearance="outline">
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
                  <mat-option *ngFor="let item of lovUsername" [value]="item.partyId"
                    >{{ item.employeeFirstName + ' ' + item.employeeLastName }}
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
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      status: new FormControl(''),
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
    // Clear form data
    this.misLoanOpsForm.reset();
    console.log('ngOnDestroy: ', this.misLoanOpsForm);
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
    this.misReportService.setLoading(true);
    const params = {
      startDate: this.misLoanOpsForm.get('startDate')?.value,
      endDate: this.misLoanOpsForm.get('endDate')?.value,
      status: this._convertStatusToString(this.misLoanOpsForm.get('status')?.value),
      type: 'STATELOG',
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
      { header: 'DPK Number', key: 'dpkNumber' },
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
    const statuses = ['Loan Ops Ditribution', 'Loan Ops Checking', 'Loan Ops Review', 'Complete'];
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
      .filter((t: any) => t.statusDescription === 'Loan Ops Ditribution')
      .map((timeline: any) => this._formatDateSLA(timeline.fromDate))
      .join(',\n');
  }

  private getLastLoanOpsDistributionInDate(product: any): string {
    const timelines = product.timeLineCreditProposal
      .sort((a: any, b: any) => a.id - b.id)
      .filter((t: any) => t.statusDescription === 'Loan Ops Ditribution');
    return timelines.length > 0 ? timelines[0].fromDate : '';
  }

  private getLoanOpsDistributionInTime(proposal: any): string {
    return proposal.timeLineCreditProposal
      .filter((t: any) => t.statusDescription === 'Loan Ops Ditribution')
      .map((timeline: any) => timeline.fromTime.split(':').slice(0, 2).join(':'))
      .join(',\n');
  }

  private getFirstLoanOpsDistributionInTime(proposal: any): string {
    const timelines = proposal.timeLineCreditProposal
      .sort((a: any, b: any) => a.id - b.id)
      .filter((t: any) => t.statusDescription === 'Loan Ops Ditribution');

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
    // this.getCompletedDate(prop)[this.getCompletedDate(prop).length - 1]
    const loanOpsDistributionInDate = new Date(this.getLastLoanOpsDistributionInDate(prop));
    // this.getLoanOpsDistributionInDate(prop)[this.getLoanOpsDistributionInDate(prop).length - 1]
    const diffDays = Math.abs(completedDate.getTime() - loanOpsDistributionInDate.getTime()) / (1000 * 60 * 60 * 24);

    if (!completedDate || !loanOpsDistributionInDate) {
      return '';
    }
    return diffDays.toString();
  }

  private getTatTime(prop): string {
    const tatDate = Number(this.getTatDate(prop));
    const completedTime = this.getLastCompletedTime(prop);
    const loanOpsDistributionInTime = this.getFirstLoanOpsDistributionInTime(prop);

    const date = new Date().toLocaleDateString('en-US'); // Use a standard date format
    const dateCompletedTime = new Date(`${date} ${completedTime} UTC`);
    const dateLoanOpsDistributionInTime = new Date(`${date} ${loanOpsDistributionInTime} UTC`);
    const eightHours = new Date(`${date} 08:00:00 UTC`);

    let diffInMinutes;

    if (tatDate === 0) {
      diffInMinutes = (dateCompletedTime.getTime() - dateLoanOpsDistributionInTime.getTime()) / (1000 * 60);
    } else {
      diffInMinutes = (dateCompletedTime.getTime() - eightHours.getTime()) / (1000 * 60);
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

  private getTanggalEfektifFasilitas(prod: any, proposal = null) {
    switch (prod.pengajuan) {
      case 'New':
        return this._getEarliestDate(this.getLoanOpsDistributionInDate(proposal));
      case 'Renewal':
        return (
          `${this._formatDateSLA(prod.mainProduct.maturityDate)} s/d ${this._formatDateSLA(prod.mainProduct.proposeMaturityDate)}` || ''
        );
      case 'Renewal + Additional':
        return this._formatDateSLA(prod.mainProduct.mainProduct[0].startPeriodDate) || '';
      case 'Renewal + Decrease':
        return this._formatDateSLA(prod.mainProduct.mainProduct[0].startPeriodDate) || '';
      case 'Existing':
        return this._formatDateSLA(prod.firstDisbursementDate) || '';
      case 'Additional / Top Up':
        return this._getEarliestDate(this.getLoanOpsDistributionInDate(proposal));
      default:
        return prod.mainProduct.endPeriodRemark || '';
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
