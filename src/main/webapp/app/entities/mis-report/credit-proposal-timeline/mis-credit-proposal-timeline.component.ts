import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import * as ExcelJS from 'exceljs';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { InternalService } from 'app/entities/internal/internal.service';
import { APPLICATION_TYPE } from 'app/shared/constants/base.constants';
import { PageEvent } from '@angular/material/paginator';
import { map } from 'rxjs';

@Component({
  selector: 'jhi-mis-credit-proposal-timeline',
  templateUrl: './mis-credit-proposal-timeline.component.html',
  styleUrls: ['./mis-report-credit-proposal-timeline.css', '../mis-report.css', '../disabled-style.scss'],
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
      .mat-card-actions,
      .mat-card-subtitle,
      .mat-card-content {
        display: block;
        margin-bottom: 0px;
      }

      .nav-button {
        min-width: 250px;
        min-height: 40px;
        border-radius: 10px;
        font-weight: bold;
        color: #9dcac7;
      }

      .nav-buttons {
        display: flex;
        gap: 12px;
      }

      .nav-button.active {
        background-color: #5bafaa;
        color: white;
      }

      .department-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        border-radius: 12px;
        height: 74px;
        margin-bottom: 3px;
        margin-top: 25px;
      }

      .department-name {
        font-weight: bold;
        margin-top: 10px;
        color: #5bafaa;
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

  public lovCustomerType = ['New', 'Existing'];
  public allSelectedRegional = false;
  public lovRegional = [];
  private readonly parentIds = ['9901', '9902', '9903', '9904', '9905'];
  @ViewChild('formContainer', { static: true }) formContainer: ElementRef;
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
      this.searchResult = null;

      if (type === 'Date From Status') {
        this.showDateRange = true;
        this.showStatusAndRegional = false;

        this.misCpTimeline.get('date1')?.enable();
        this.misCpTimeline.get('date2')?.enable();
        this.misCpTimeline.get('status')?.enable();
      } else if (type === 'Proposal Date') {
        this.showDateRange = true;
        this.showStatusAndRegional = true;

        this.misCpTimeline.get('date1')?.enable();
        this.misCpTimeline.get('date2')?.enable();
        this.misCpTimeline.get('status')?.enable();
        this.misCpTimeline.get('regional')?.enable();
        this.misCpTimeline.get('customerType')?.enable();
      } else {
        this.showDateRange = false;
        this.showStatusAndRegional = false;

        this.misCpTimeline.get('date1')?.disable();
        this.misCpTimeline.get('date2')?.disable();
        this.misCpTimeline.get('status')?.disable();
      }

      this.misCpTimeline.get('status')?.reset();
      this.misCpTimeline.get('date1')?.reset();
      this.misCpTimeline.get('date2')?.reset();
      this.misCpTimeline.get('query')?.reset();
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

    this.misCpTimeline.get('query')?.valueChanges.subscribe(value => {
      if (value === '') {
        this.clearSearch();
      }
    });
    this.misCpTimeline.get('type')?.setValue('Proposal Date');
  }

  checkFieldStatus() {
    const date1 = this.misCpTimeline.get('date1')?.value;
    const date2 = this.misCpTimeline.get('date2')?.value;
    const status = this.misCpTimeline.get('status')?.value;
    const regional = this.misCpTimeline.get('regional')?.value;
    const customerType = this.misCpTimeline.get('customerType')?.value;

    if (date1 || date2 || (status && status.length > 0) || (regional && regional.length > 0) || (customerType && customerType.length > 0)) {
      this.misCpTimeline.get('query')?.disable();
      this.applyDisabledStyle(this.formContainer.nativeElement, true);
    } else {
      this.misCpTimeline.get('query')?.enable();
      this.applyDisabledStyle(this.formContainer.nativeElement, false);
    }
  }

  onSearchFocus() {
    this.misCpTimeline.get('date1')?.disable();
    this.misCpTimeline.get('date2')?.disable();
    this.misCpTimeline.get('status')?.disable();
    this.misCpTimeline.get('regional')?.disable();
    this.misCpTimeline.get('customerType')?.disable();
    this.applyDisabledStyle(this.formContainer.nativeElement, true);
  }

  onSearchBlur() {
    const searchValue = this.misCpTimeline.get('query')?.value;
    if (!searchValue) {
      this.misCpTimeline.get('date1')?.enable();
      this.misCpTimeline.get('date2')?.enable();
      this.misCpTimeline.get('status')?.enable();
      this.misCpTimeline.get('regional')?.enable();
      this.misCpTimeline.get('customerType')?.enable();
      this.applyDisabledStyle(this.formContainer.nativeElement, false);
    }
  }

  onDateRangeFocus() {
    this.misCpTimeline.get('query')?.disable();
    this.applyDisabledStyle(this.formContainer.nativeElement, true);
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

  public clearSearch(): void {
    this.misCpTimeline.get('query')?.setValue('', { emitEvent: false }); // Ganti reset()
    this.searchResult = null;
  }

  skeletonData = [
    {
      proposalNumber: '',
      cif: '',
      debtorName: '',
      customerType: '',
      proposalDate: '',
      statusDescription: '',
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
  displayedColumns: string[] = ['proposalNumber', 'cif', 'debtorName', 'customerType', 'proposalDate', 'statusDescription'];

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

    const queryValue = this.misCpTimeline.get('query')?.value;

    const predicate: object = {
      page: this.currentPage,
      query: queryValue,
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

        if (queryValue !== null && queryValue !== undefined) {
          this.misCpTimeline.get('query')?.setValue(queryValue, { emitEvent: false });
        }
      },
      error: (res: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
        this.loadingSearch = false;

        if (queryValue !== null && queryValue !== undefined) {
          this.misCpTimeline.get('query')?.setValue(queryValue, { emitEvent: false });
        }
      },
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
    const selectedDateType = this.misCpTimeline.get('type')?.value;
    let dateTypeValue = null;

    if (this.misCpTimeline.get('query')?.value) {
      params = { query: this.misCpTimeline.get('query')?.value };

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
      return;
    }

    if (
      (!this.misCpTimeline.get('date1')?.value || !this.misCpTimeline.get('date2')?.value) &&
      (!this.misCpTimeline.get('status')?.value || this.misCpTimeline.get('status')?.value.length === 0)
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Warning',
        detail: 'Please, Select Parameter.',
      });
      return;
    }

    if (!this.misCpTimeline.get('date1')?.value || !this.misCpTimeline.get('date2')?.value) {
      this.messageService.add({
        severity: 'error',
        summary: 'Warning',
        detail: 'Please, entry Date Range.',
      });
      return;
    }

    if (!this.misCpTimeline.get('status')?.value || this.misCpTimeline.get('status')?.value.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Warning',
        detail: 'Please, entry Status.',
      });
      return;
    }

    if (selectedDateType === 'Date From Status') {
      dateTypeValue = 'STATELOG';
    } else if (selectedDateType === 'Proposal Date') {
      dateTypeValue = null;
    }

    params = {
      startDate: this.misCpTimeline.get('date1')?.value,
      endDate: this.misCpTimeline.get('date2')?.value,
      status: this._convertStatusToString(this.misCpTimeline.get('status')?.value),
      regionalRM: this._convertStatusToString(this.misCpTimeline.get('regional')?.value),
      customerType: this._convertStatusToString(this.misCpTimeline.get('customerType')?.value),
      dateType: dateTypeValue, // Tambahkan dateType di parameter
    };

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
    data.sort((a, b) => {
      const dateA = new Date(a.proposalDate);
      const dateB = new Date(b.proposalDate);

      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        return 0;
      }

      return dateA.getTime() - dateB.getTime();
    });

    let proposalIndex = 1;
    for (const proposal of data) {
      this._addTimelineData(this.worksheet, proposal, proposalIndex++);
    }
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
      { header: 'TAT Pipeline Process', key: 'tatPipelineProcess', width: 25 },
      { header: 'TAT Review Process', key: 'tatReviewProcess', width: 25 },
      { header: 'TAT Pending Acceptance', key: 'tatPendingAcceptance', width: 25 },
      { header: 'TAT Appeal Pipeline Process', key: 'tatAppealPipelineProcess', width: 25 },
      { header: 'TAT Appeal Review Process', key: 'tatAppealReviewProcess', width: 25 },
      { header: 'TAT Appeal Pending Acceptance', key: 'tatAppealPendingAcceptance', width: 25 },
      { header: 'TAT Signed', key: 'tatSigned', width: 25 },
      { header: 'TAT', key: 'tat', width: 25 },
    ];
  }

  private _tatPipelineProcess(timeline) {
    if (!Array.isArray(timeline)) {
      return 0;
    }

    const draft = this._getDate(timeline, 'Draft', 'createdDate');
    const darAppeal = this._getDate(timeline, 'DAR Appeal', 'createdDate');

    const assignments = timeline.filter(
      item => item.statusDescription === 'Assignment' && (!darAppeal || new Date(item.createdDate) < new Date(darAppeal))
    );

    const latestAssignment = assignments.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);

    return latestAssignment && latestAssignment.createdDate ? this.countWeekdays(draft, latestAssignment.createdDate) : 0;
  }

  private _tatReviewProcess(timeline) {
    if (!Array.isArray(timeline)) {
      return 0;
    }

    const darAppeals = timeline.filter(item => item.statusDescription === 'DAR Appeal');
    const earliestDarAppeal = darAppeals.reduce((a, b) => (!a || new Date(b.createdDate) < new Date(a.createdDate) ? b : a), null);

    const darAppealDate = earliestDarAppeal ? new Date(earliestDarAppeal.createdDate) : null;

    const assignments = timeline.filter(
      item => item.statusDescription === 'Assignment' && (!darAppealDate || new Date(item.createdDate) < darAppealDate)
    );

    const latestAssignment = assignments.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);

    const loanApprovals = timeline.filter(
      item => item.statusDescription === 'Loan Committee Approval' && (!darAppealDate || new Date(item.createdDate) < darAppealDate)
    );

    let latestApproval = loanApprovals.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);

    if (!latestApproval) {
      const darFinals = timeline.filter(
        item => item.statusDescription === 'DAR Final' && (!darAppealDate || new Date(item.createdDate) < darAppealDate)
      );

      latestApproval = darFinals.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);
    }

    return latestAssignment && latestAssignment.createdDate && latestApproval && latestApproval.createdDate
      ? this.countWeekdays(latestAssignment.createdDate, latestApproval.createdDate)
      : 0;
  }

  private _tatAppealPipelineProcess(timeline) {
    if (!Array.isArray(timeline)) {
      return 0;
    }

    const darAppeals = timeline.filter(item => item.statusDescription === 'DAR Appeal');

    const earliestDarAppeal = darAppeals.reduce((a, b) => (!a || new Date(b.createdDate) < new Date(a.createdDate) ? b : a), null);

    if (!earliestDarAppeal || !earliestDarAppeal.createdDate) {
      return 0;
    }

    const assignments = timeline.filter(
      item => item.statusDescription === 'Assignment' && new Date(item.createdDate) > new Date(earliestDarAppeal.createdDate)
    );

    const latestAssignment = assignments.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);

    return latestAssignment && latestAssignment.createdDate
      ? this.countWeekdays(earliestDarAppeal.createdDate, latestAssignment.createdDate)
      : 0;
  }

  private _tatAppealReviewProcess(timeline) {
    if (!Array.isArray(timeline)) {
      return 0;
    }

    const darAppeals = timeline.filter(item => item.statusDescription === 'DAR Appeal');
    const earliestDarAppeal = darAppeals.reduce((a, b) => (!a || new Date(b.createdDate) < new Date(a.createdDate) ? b : a), null);

    if (!earliestDarAppeal || !earliestDarAppeal.createdDate) {
      return 0;
    }

    const darAppealDate = new Date(earliestDarAppeal.createdDate);

    const assignments = timeline.filter(item => item.statusDescription === 'Assignment' && new Date(item.createdDate) > darAppealDate);

    const latestAssignment = assignments.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);

    const approvals = timeline.filter(
      item => item.statusDescription === 'Loan Committee Approval' && new Date(item.createdDate) > darAppealDate
    );

    let latestApproval = approvals.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);

    if (!latestApproval) {
      const darFinals = timeline.filter(item => item.statusDescription === 'DAR Final' && new Date(item.createdDate) > darAppealDate);

      latestApproval = darFinals.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);
    }

    return latestAssignment && latestAssignment.createdDate && latestApproval && latestApproval.createdDate
      ? this.countWeekdays(latestAssignment.createdDate, latestApproval.createdDate)
      : 0;
  }

  private _getDate(objOrArray: any, status: string, date: string, isLast = false): string | null {
    const arr = Array.isArray(objOrArray) ? objOrArray : objOrArray?.timeLineCreditProposal;
    const data = arr?.filter(t => t.statusDescription === status).map(t => t[date]);

    if (!data || data.length === 0) {
      return null;
    }

    return isLast ? data[data.length - 1] : data[0];
  }

  private _tatPendingAcceptance(timeline) {
    if (!Array.isArray(timeline)) {
      return 0;
    }

    const darAppeals = timeline.filter(item => item.statusDescription === 'DAR Appeal');
    const earliestDarAppeal = darAppeals.reduce((a, b) => (!a || new Date(b.createdDate) < new Date(a.createdDate) ? b : a), null);

    const darAppealDate = earliestDarAppeal ? new Date(earliestDarAppeal.createdDate) : null;

    const loanApprovals = timeline.filter(
      item => item.statusDescription === 'Loan Committee Approval' && (!darAppealDate || new Date(item.createdDate) < darAppealDate)
    );

    let latestApproval = loanApprovals.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);

    if (!latestApproval) {
      const darFinals = timeline.filter(
        item => item.statusDescription === 'DAR Final' && (!darAppealDate || new Date(item.createdDate) < darAppealDate)
      );

      latestApproval = darFinals.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);
    }

    const confirmations = timeline.filter(
      item => item.statusDescription === 'Confirmation' && (!darAppealDate || new Date(item.createdDate) < darAppealDate)
    );

    const latestConfirmation = confirmations.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);

    return latestApproval && latestApproval.createdDate && latestConfirmation && latestConfirmation.createdDate
      ? this.countWeekdays(latestApproval.createdDate, latestConfirmation.createdDate)
      : 0;
  }

  private _tatAppealPendingAcceptance(timeline) {
    if (!Array.isArray(timeline)) {
      return 0;
    }

    const darAppeals = timeline.filter(item => item.statusDescription === 'DAR Appeal');
    const earliestDarAppeal = darAppeals.reduce((a, b) => (!a || new Date(b.createdDate) < new Date(a.createdDate) ? b : a), null);

    const darAppealDate = earliestDarAppeal ? new Date(earliestDarAppeal.createdDate) : null;

    const loanApprovals = timeline.filter(
      item => item.statusDescription === 'Loan Committee Approval' && (!darAppealDate || new Date(item.createdDate) > darAppealDate)
    );

    let latestApproval = loanApprovals.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);

    if (!latestApproval) {
      const darFinals = timeline.filter(
        item => item.statusDescription === 'DAR Final' && (!darAppealDate || new Date(item.createdDate) > darAppealDate)
      );

      latestApproval = darFinals.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);
    }

    if (!darAppealDate) {
      return 0;
    }

    const confirmations = timeline.filter(item => item.statusDescription === 'Confirmation' && new Date(item.createdDate) > darAppealDate);

    const latestConfirmation = confirmations.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);

    return latestApproval && latestApproval.createdDate && latestConfirmation && latestConfirmation.createdDate
      ? this.countWeekdays(latestApproval.createdDate, latestConfirmation.createdDate)
      : 0;
  }

  private _tatSigned(timeline) {
    if (!Array.isArray(timeline)) {
      return 0;
    }

    const confirmations = timeline.filter(item => item.statusDescription === 'Confirmation');
    const latestConfirmation = confirmations.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);

    const completes = timeline.filter(item => item.statusDescription === 'Complete');
    const latestComplete = completes.reduce((a, b) => (!a || new Date(b.createdDate) > new Date(a.createdDate) ? b : a), null);

    return latestConfirmation && latestConfirmation.createdDate && latestComplete && latestComplete.createdDate
      ? this.countWeekdays(latestConfirmation.createdDate, latestComplete.createdDate)
      : 0;
  }

  private noCounter = 1;

  private tatTotal(timeline: any[]): number {
    const tatPipeline = this._tatPipelineProcess(timeline);
    const tatReview = this._tatReviewProcess(timeline);
    const tatPending = this._tatPendingAcceptance(timeline);
    const tatAppealPipeline = this._tatAppealPipelineProcess(timeline);
    const tatAppealReview = this._tatAppealReviewProcess(timeline);
    const tatAppealPending = this._tatAppealPendingAcceptance(timeline);
    const tatSigned = this._tatSigned(timeline);

    return tatPipeline + tatReview + tatPending + tatAppealPipeline + tatAppealReview + tatAppealPending + tatSigned;
  }

  private _addTimelineData(worksheet: ExcelJS.Worksheet, timeLineCreditProposal: any, index: number): void {
    const startRow = worksheet.lastRow ? worksheet.lastRow.number + 1 : 1;

    const customerType = this.misCpTimeline.get('customerType')?.value;
    const search = this.misCpTimeline.get('query')?.value;

    let filteredTimeline;
    if (!customerType || customerType.length === 0 || (search && search !== '')) {
      filteredTimeline = [...timeLineCreditProposal.timeLineCreditProposal];
    } else {
      const customerStatus = timeLineCreditProposal.customerStatus || '';
      if (customerType.includes(customerStatus)) {
        filteredTimeline = [...timeLineCreditProposal.timeLineCreditProposal];
      } else {
        filteredTimeline = [];
      }
    }

    const reversedTimeline = [...filteredTimeline].reverse();

    const timelineData = filteredTimeline;
    const tatPipeline = this._tatPipelineProcess(timelineData);
    const tatReview = this._tatReviewProcess(timelineData);
    const tatPending = this._tatPendingAcceptance(timelineData);
    const tatAppealPipeline = this._tatAppealPipelineProcess(timelineData);
    const tatAppealReview = this._tatAppealReviewProcess(timelineData);
    const tatAppealPending = this._tatAppealPendingAcceptance(timelineData);
    const tatSigned = this._tatSigned(timelineData);
    const totalTat = this.tatTotal(timelineData);

    let manualNo = 1;
    const columnNo = worksheet.getColumn(1).values;
    for (let i = columnNo.length - 1; i >= 1; i--) {
      if (typeof columnNo[i] === 'number') {
        manualNo = (columnNo[i] as number) + 1;
        break;
      }
    }

    reversedTimeline.forEach((timeline, timelineIndex) => {
      worksheet.addRow({
        no: timelineIndex === 0 ? manualNo : '',
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
        tatPipelineProcess: timelineIndex === 0 ? tatPipeline : '',
        tatReviewProcess: timelineIndex === 0 ? tatReview : '',
        tatPendingAcceptance: timelineIndex === 0 ? tatPending : '',
        tatAppealPipelineProcess: timelineIndex === 0 ? tatAppealPipeline : '',
        tatAppealReviewProcess: timelineIndex === 0 ? tatAppealReview : '',
        tatAppealPendingAcceptance: timelineIndex === 0 ? tatAppealPending : '',
        tatSigned: timelineIndex === 0 ? tatSigned : '',
        tat: timelineIndex === 0 ? totalTat : '',
      });
    });

    if (filteredTimeline.length > 0) {
      const endRow = startRow + filteredTimeline.length - 1;
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
      worksheet.mergeCells(`U${startRow}:U${endRow}`);
      worksheet.mergeCells(`V${startRow}:V${endRow}`);
      worksheet.mergeCells(`W${startRow}:W${endRow}`);
      worksheet.mergeCells(`X${startRow}:X${endRow}`);
      worksheet.mergeCells(`Y${startRow}:Y${endRow}`);
      worksheet.mergeCells(`Z${startRow}:Z${endRow}`);
      worksheet.mergeCells(`AA${startRow}:AA${endRow}`);
      worksheet.mergeCells(`AB${startRow}:AB${endRow}`);
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
      'tatPipelineProcess',
      'tatReviewProcess',
      'tatPendingAcceptance',
      'tatAppealPipelineProcess',
      'tatAppealReviewProcess',
      'tatAppealPendingAcceptance',
      'tatSigned',
      'tat',
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
