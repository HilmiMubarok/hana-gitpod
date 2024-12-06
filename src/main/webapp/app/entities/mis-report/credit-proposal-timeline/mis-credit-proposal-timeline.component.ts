import { Component, OnInit } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import * as ExcelJS from 'exceljs';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractExcelMISReport } from '../abstract-excel-report';

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
export class MisCreditProposalTimelineComponent extends AbstractExcelMISReport implements OnInit {
  public lovStatus = [];
  listOfValue = [];
  misCpTimeline: FormGroup;
  allSelected = false;
  searchFieldDisabled = false;
  dateRangeAndStatusDisabled = false;
  changeOption(event) {
    console.log('test', event.value);
  }
  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    super(misReportService);

    this.misCpTimeline = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
      search: new FormControl(
        '',
        Validators.pattern(/^\d{5}\/\d{2}\/CP\/(Comm|CB|EB|GLO|SME)\/(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\/\d{4}$/)
      ),
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
    this.misCpTimeline.get('date1')?.valueChanges.subscribe(() => this.checkFieldStatus());
    this.misCpTimeline.get('date2')?.valueChanges.subscribe(() => this.checkFieldStatus());
    this.misCpTimeline.get('status')?.valueChanges.subscribe(() => this.checkFieldStatus());
    // this.getStatus();
  }

  ngOnInit(): void {
    this.misReportService.getStatuses('MIS_CREDIT_PROPOSAL_TIMELINE').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }

  checkFieldStatus() {
    const date1 = this.misCpTimeline.get('date1')?.value;
    const date2 = this.misCpTimeline.get('date2')?.value;
    const status = this.misCpTimeline.get('status')?.value;

    // Disable search if date1, date2, or status is filled
    if (date1 || date2 || (status && status.length > 0)) {
      this.misCpTimeline.get('search')?.disable();
    } else {
      this.misCpTimeline.get('search')?.enable();
    }
  }

  onSearchFocus() {
    this.misCpTimeline.get('date1')?.disable();
    this.misCpTimeline.get('date2')?.disable();
    this.misCpTimeline.get('status')?.disable();
  }

  onSearchBlur() {
    const searchValue = this.misCpTimeline.get('search')?.value;
    if (!searchValue) {
      this.misCpTimeline.get('date1')?.enable();
      this.misCpTimeline.get('date2')?.enable();
      this.misCpTimeline.get('status')?.enable();
    }
  }

  onDateRangeFocus() {
    this.misCpTimeline.get('search')?.disable();
  }

  onDateRangeBlur() {
    this.checkFieldStatus(); // This ensures search field behavior is updated accordingly
  }

  onStatusOpenedChange(opened: boolean) {
    if (opened) {
      this.misCpTimeline.get('search')?.disable();
    } else {
      this.checkFieldStatus();
    }
  }

  public previousState(): void {
    window.history.back();
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.misCpTimeline.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.misCpTimeline.get('status')?.setValue('');
    }
  }

  clearSearch(): void {
    this.misCpTimeline.get('search')?.reset();
    // reset the searchResult
    this.searchResult = null;
  }

  skeletonData = [
    {
      proposalNumber: '',
      cif: '',
      debtorName: '',
      customerType: '',
      proposalDate: '',
    },
  ];

  loadingSearch: Boolean = false;

  private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }

  public searchResult = null;
  displayedColumns: string[] = ['proposalNumber', 'cif', 'debtorName', 'customerType', 'proposalDate'];

  public doSearch(): void {
    this.loadingSearch = true;

    // if search not valid, show error message
    if (this.misCpTimeline.get('search')?.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Proposal Number Format' });
      return;
    }

    const predicate: object = {
      page: 0,
      query: this.misCpTimeline.get('search')?.value,
      size: 10,
      idPosition: this.getLocStor('POS'),
    };

    predicate['target'] = 'credit_proposal_status'; // Belum dibuat di BE

    this.misReportService.searchCP(predicate).subscribe({
      next: res => {
        this.searchResult = res.body;
        this.loadingSearch = false;
      },
      error: (res: HttpErrorResponse) => console.error(res.message),
    });
  }

  convertStatusToString(status: Array<string>): string {
    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  dateRangeHasValue(): boolean {
    return this.misCpTimeline.get('date1')?.value && this.misCpTimeline.get('date2')?.value;
  }

  clearDateRange(): void {
    this.misCpTimeline.get('date1')?.reset();
    this.misCpTimeline.get('date2')?.reset();
  }

  generateMISCPTimeline() {
    // Check if search field is valid
    if (this.misCpTimeline.get('search')?.value && this.misCpTimeline.get('search')?.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Proposal Number Format' });
      return;
    }

    let params;
    // if search has value, create params only search
    if (this.misCpTimeline.get('search')?.value) {
      params = {
        proposalNumber: this.misCpTimeline.get('search')?.value,
      };
    } else {
      params = {
        startDate: this.misCpTimeline.get('date1')?.value,
        endDate: this.misCpTimeline.get('date2')?.value,
        status: this.convertStatusToString(this.misCpTimeline.get('status')?.value),
      };
    }

    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_Credit_Proposal_Timeline'),
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

    this.setUpColumns(this.columns);

    // if data is empty, generate an empty file
    if (!data || data.length === 0) {
      this.applyStyles('ffffe49c');
      this.downloadFile(fileName);
      return;
    }

    // Add data to worksheet
    this.processData(data);

    this._applyStyles();
    this.downloadFile(fileName);
  }

  protected processData(data: any[]): void {
    data.forEach((timeLineCreditProposal, index) => {
      this._addTimelineData(this.worksheet, timeLineCreditProposal, index);
    });
  }

  get columns(): any[] {
    return [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Proposal Number', key: 'proposalNumber', width: 30 },
      { header: 'Proposal Date', key: 'proposalDate', width: 15 },
      { header: 'Segment', key: 'segment', width: 10 },
      { header: 'Branchs', key: 'branchs', width: 30 },
      { header: 'Customer Status', key: 'customerStatus', width: 15 },
      { header: 'RM', key: 'rm', width: 40 },
      { header: 'BM', key: 'bm', width: 25 },
      { header: 'SME Head Name', key: 'headName', width: 15 },
      { header: 'CIF', key: 'cif', width: 15 },
      { header: 'Debtor Name', key: 'debtorName', width: 30 },
      { header: 'Loan Comm Approval', key: 'loanCommApproval', width: 19 },
      { header: 'Proposal Type', key: 'proposalType', width: 30 },
      { header: ' Previous Status', key: 'previousStatus', width: 20 },
      { header: 'Next Status', key: 'nextStatus', width: 20 },
      { header: 'Previous Date', key: 'previousDate', width: 20 },
      { header: 'Next Date', key: 'nextDate', width: 20 },
      { header: 'PIC', key: 'pic', width: 30 },
      { header: 'NOTE', key: 'note', width: 25 },
      { header: 'Status', key: 'status', width: 25 },
      { header: 'TAT', key: 'tat', width: 25 },
    ];
  }

  private _convertDate(date: string): string {
    if (!date) {
      return '';
    }
    return moment(date).format('YYYY-MM-DD');
  }

  private _addTimelineData(worksheet: ExcelJS.Worksheet, timeLineCreditProposal, index): void {
    const startRow = worksheet.lastRow ? worksheet.lastRow.number + 1 : 1;
    const reversedTimeline = [...timeLineCreditProposal.timeLineCreditProposal].reverse();

    function calculateWorkDays(startDate: Date, endDate: Date): number {
      let workDays = 0;
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + 1);

      while (currentDate <= endDate) {
        const day = currentDate.getDay();
        if (day !== 0 && day !== 6) {
          workDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return workDays;
    }

    reversedTimeline.forEach((timeline, timelineIndex) => {
      const previousDate = timeline.fromDate ? new Date(timeline.fromDate) : null;
      const adjustedNextDate = timeline.thruDate ? (timeline.thruDate === '9999-12-31' ? new Date() : new Date(timeline.thruDate)) : null;

      const tat = previousDate && adjustedNextDate ? calculateWorkDays(previousDate, adjustedNextDate) : null;

      worksheet.addRow({
        no: timelineIndex === 0 ? index + 1 : '',
        proposalNumber: timelineIndex === 0 ? timeLineCreditProposal.proposalNumber || '' : '',
        proposalDate:
          timelineIndex === 0
            ? timeLineCreditProposal.proposalDate
              ? `${String(new Date(timeLineCreditProposal.proposalDate).getDate()).padStart(2, '0')}-${String(
                  new Date(timeLineCreditProposal.proposalDate).getMonth() + 1
                ).padStart(2, '0')}-${new Date(timeLineCreditProposal.proposalDate).getFullYear()}`
              : ''
            : '',
        segment: timelineIndex === 0 ? timeLineCreditProposal.segment || '' : '',
        branchs: timelineIndex === 0 ? timeLineCreditProposal.bookingBranchName || '' : '',
        customerStatus: timelineIndex === 0 ? timeLineCreditProposal.customerStatus || '' : '',
        rm: timelineIndex === 0 ? `${timeLineCreditProposal.rmFirstName || ''} ${timeLineCreditProposal.rmLastName || ''}`.trim() : '',
        bm: timelineIndex === 0 ? timeLineCreditProposal.bm || '' : '',
        headName: timelineIndex === 0 ? timeLineCreditProposal.headName || '' : '',
        cif: timelineIndex === 0 ? timeLineCreditProposal.cif || '' : '',
        debtorName: timelineIndex === 0 ? timeLineCreditProposal.debtorName || '' : '',
        loanCommApproval: timelineIndex === 0 ? timeLineCreditProposal.approvalLc?.split(' ')[0] || '' : '',
        proposalType: timelineIndex === 0 ? timeLineCreditProposal.proposalType || '' : '',
        previousStatus: timeline.fromStatusDescription || '',
        nextStatus: timeline.statusDescription || '',
        previousDate: timeline.fromDate
          ? `${String(new Date(timeline.fromDate).getDate()).padStart(2, '0')}-${String(
              new Date(timeline.fromDate).getMonth() + 1
            ).padStart(2, '0')}-${new Date(timeline.fromDate).getFullYear()}`
          : '',
        nextDate:
          timeline.thruDate === '9999-12-31'
            ? ''
            : timeline.thruDate
            ? `${String(new Date(timeline.thruDate).getDate()).padStart(2, '0')}-${String(
                new Date(timeline.thruDate).getMonth() + 1
              ).padStart(2, '0')}-${new Date(timeline.thruDate).getFullYear()}`
            : '',
        pic: timeline.personName || '',
        note: timeline.note || '',
        status: timelineIndex === 0 ? timeLineCreditProposal.status || '' : '',
        tat,
      });
    });

    if (timeLineCreditProposal.timeLineCreditProposal.length > 0) {
      const endRow = startRow + timeLineCreditProposal.timeLineCreditProposal.length - 1;

      worksheet.mergeCells(`A${startRow}:A${endRow}`);
      worksheet.mergeCells(`B${startRow}:B${endRow}`);
      worksheet.mergeCells(`C${startRow}:C${endRow}`);
      worksheet.mergeCells(`D${startRow}:D${endRow}`);
      worksheet.mergeCells(`E${startRow}:E${endRow}`);
      worksheet.mergeCells(`F${startRow}:F${endRow}`);
      worksheet.mergeCells(`G${startRow}:G${endRow}`);
      worksheet.mergeCells(`H${startRow}:H${endRow}`);
      worksheet.mergeCells(`I${startRow}:I${endRow}`);
      worksheet.mergeCells(`J${startRow}:J${endRow}`);
      worksheet.mergeCells(`K${startRow}:K${endRow}`);
      worksheet.mergeCells(`L${startRow}:L${endRow}`);
      worksheet.mergeCells(`M${startRow}:M${endRow}`);
      worksheet.mergeCells(`R${startRow}:R${endRow}`);
    }
  }

  private _applyStyles(): void {
    super.applyStyles('FFFFA500');
    const columnsToBeWraped = ['previousStatus', 'nextStatus', 'previousDate', 'nextDate'];
    const topAlignedColumns = [
      'no',
      'proposalNumber',
      'proposalDate',
      'segment',
      'branchs',
      'customerStatus',
      'rm',
      'bm',
      'headName',
      'cif',
      'debtorName',
      'loanCommApproval',
      'proposalType',
    ];
    columnsToBeWraped.forEach(column => {
      this.worksheet.getColumn(column).alignment = {
        vertical: 'top',
        horizontal: 'center',
        wrapText: true,
      };
    });

    topAlignedColumns.forEach(column => {
      this.worksheet.getColumn(column).alignment = {
        vertical: 'top',
        horizontal: 'center',
        wrapText: true,
      };
    });
  }
}
