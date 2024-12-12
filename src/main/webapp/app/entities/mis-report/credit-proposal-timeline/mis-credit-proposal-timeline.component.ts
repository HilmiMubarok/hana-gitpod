import { Component, OnInit } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import * as ExcelJS from 'exceljs';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { map } from 'rxjs';
import { InternalService } from 'app/entities/internal/internal.service';
import { APPLICATION_TYPE } from 'app/shared/constants/base.constants';
import { PageEvent } from '@angular/material/paginator';

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
  showDateRange = false;
  showStatusAndRegional = false;
  dateTypes: string[] = ['Proposal Date', 'Date From Status'];

  public lovCustomerType = ['NEW', 'EXISTING'];
  public allSelectedRegional = false;
  public lovRegional = [];
  private readonly parentIds = ['9901', '9902', '9903', '9904', '9905'];
  changeOption(event) {
    console.log('test', event.value);
  }
  constructor(public misReportService: MisReportService, public messageService: MessageService, public internalService: InternalService) {
    super(misReportService);

    this.misCpTimeline = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
      type: new FormControl(''),
      search: new FormControl(
        '',
        Validators.pattern(/^\d{5}\/\d{2}\/CP\/(Comm|CB|EB|GLO|SME)\/(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\/\d{4}$/)
      ),
      regional: new FormControl(null),
      customerType: new FormControl(null),
      query: new FormControl(''),
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
    this.misCpTimeline.get('regional')?.valueChanges.subscribe(() => {
      this.checkFieldStatus();
      // if type is array and length 0, change to null
      if (Array.isArray(this.misCpTimeline.get('regional')?.value) && this.misCpTimeline.get('regional')?.value.length === 0) {
        this.misCpTimeline.get('regional')?.setValue(null);
      }
    });

    this.misCpTimeline.get('customerType')?.valueChanges.subscribe(() => this.checkFieldStatus());
    // this.getStatus();
    this.misCpTimeline.get('type')?.valueChanges.subscribe(type => {
      if (type === 'Date From Status') {
        this.showDateRange = true;
        this.showStatusAndRegional = false;
      } else if (type === 'Proposal Date') {
        this.showDateRange = true;
        this.showStatusAndRegional = true;
      } else {
        this.showDateRange = false;
        this.showStatusAndRegional = false;
      }
    });
  }

  ngOnInit(): void {
    this.misReportService.getStatuses('MIS_CREDIT_PROPOSAL_TIMELINE').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
    this._getRegionalLOV();
  }

  checkFieldStatus() {
    const date1 = this.misCpTimeline.get('date1')?.value;
    const date2 = this.misCpTimeline.get('date2')?.value;
    const status = this.misCpTimeline.get('status')?.value;
    const regional = this.misCpTimeline.get('regional')?.value;
    const customerType = this.misCpTimeline.get('customerType')?.value;

    if (date1 || date2 || (status && status.length > 0) || (regional && regional.length > 0) || (customerType && customerType.length > 0)) {
      this.misCpTimeline.get('query')?.disable();
    } else {
      this.misCpTimeline.get('query')?.enable();
    }
  }

  onSearchFocus() {
    this.misCpTimeline.get('date1')?.disable();
    this.misCpTimeline.get('date2')?.disable();
    this.misCpTimeline.get('status')?.disable();
  }

  onSearchBlur() {
    const searchValue = this.misCpTimeline.get('query')?.value;
    if (!searchValue) {
      this.misCpTimeline.get('date1')?.enable();
      this.misCpTimeline.get('date2')?.enable();
      this.misCpTimeline.get('status')?.enable();
      this.misCpTimeline.get('regional')?.enable();
      this.misCpTimeline.get('customerType')?.enable();
    }
  }

  onDateRangeFocus() {
    this.misCpTimeline.get('query')?.disable();
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
    this.misCpTimeline.get('query')?.reset();
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

  public loadingSearch = false;

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

  public pageSize = 10;
  public currentPage = 0;
  public totalItems = 0;
  public pageSizeOptions: number[] = [5, 10, 25, 50];

  public doSearch(pageEvent?: PageEvent): void {
    this.loadingSearch = true;

    if (pageEvent) {
      this.currentPage = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    }

    const predicate: object = {
      page: this.currentPage,
      query: this.misCpTimeline.get('query')?.value,
      size: this.pageSize,
      sort: ['id,desc'],
      idPosition: this.getLocStor('POS'),
    };

    predicate['target'] = 'credit_proposal_status';

    this.misReportService.searchCP(predicate).subscribe({
      next: res => {
        this.searchResult = res.body || [];
        const totalCount = res.headers.get('X-Total-Count');
        this.totalItems = totalCount ? parseInt(totalCount, 10) : 0;
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
    let params;
    const selectedDateType = this.misCpTimeline.get('type')?.value; // Ambil nilai dateType yang dipilih
    let dateTypeValue = null;

    if (selectedDateType === 'Date From Status') {
      dateTypeValue = 'STATELOG';
    } else if (selectedDateType === 'Proposal Date') {
      dateTypeValue = null;
    }

    // if search has value, create params only search
    if (this.misCpTimeline.get('query')?.value) {
      params = {
        query: this.misCpTimeline.get('query')?.value,
      };
    } else {
      params = {
        startDate: this.misCpTimeline.get('date1')?.value,
        endDate: this.misCpTimeline.get('date2')?.value,
        status: this._convertStatusToString(this.misCpTimeline.get('status')?.value),
        regional: this._convertStatusToString(this.misCpTimeline.get('regional')?.value),
        customerType: this._convertStatusToString(this.misCpTimeline.get('customerType')?.value),
        dateType: dateTypeValue, // Tambahkan dateType di parameter
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

  allSelectedCustomerType = false;
  public toggleSelectCustomerTypeAll(): void {
    this.allSelectedCustomerType = !this.allSelectedCustomerType;
    if (this.allSelectedCustomerType) {
      this.misCpTimeline.get('customerType')?.setValue([...this.lovCustomerType]);
    } else {
      this.misCpTimeline.get('customerType')?.setValue(null);
    }
  }

  public toggleSelectRegionalAll(): void {
    this.allSelectedRegional = !this.allSelectedRegional;
    if (this.allSelectedRegional) {
      this.misCpTimeline.get('regional')?.setValue([...this.lovRegional.map(internal => internal.id)]);
    } else {
      this.misCpTimeline.get('regional')?.setValue(null);
    }
  }

  private _getRegionalLOV(): void {
    this.internalService
      .queryFilterBy({
        idInternalType: APPLICATION_TYPE.BUSINESS_UNIT,
        size: 9999,
        page: 0,
      })
      .pipe(
        map(response => response.body),
        map(internals =>
          internals
            .filter(internal => this.parentIds.includes(String(internal.parentId)))
            .map(internal => ({ id: internal.id, name: internal.facilityName }))
        )
      )
      .subscribe({
        next: internals => (this.lovRegional = internals),
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Regional Data' }),
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
      worksheet.mergeCells(`T${startRow}:T${endRow}`);
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
      'status',
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
