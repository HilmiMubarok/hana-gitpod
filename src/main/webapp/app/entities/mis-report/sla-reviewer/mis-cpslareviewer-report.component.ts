import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import * as ExcelJS from 'exceljs';
import { GetSlaLengthService } from './services/get-sla-length.service';
import { SLAReviewerService } from './services/sla-reviewer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import { handleBlur, handleFocus, setupQueryControlBehavior } from './services/utils';

@Component({
  selector: 'jhi-mis-cpslareviewer-report',
  templateUrl: './mis-cpslareviewer-report.component.html',
  styleUrls: ['../credit-proposal/mis-report-credit-proposal.css', '../mis-report.css', '../disabled-style.scss'],
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

      .department-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        border-radius: 12px;
        height: 74px;
        margin-bottom: 24px;
      }

      .department-name {
        font-weight: bold;
        margin-top: 10px;
        color: #5bafaa;
      }

      :host ::ng-deep .ng-invalid:not(form) {
        border: none !important;
      }

      .skeleton-loading {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        background-color: #fff;
        border-radius: 4px;
        padding: 16px;
        width: 90%;
        height: 100%;
        animation: skeleton-loading 1.5s ease-in-out infinite;
      }

      .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
      .mat-button-toggle-group-appearance-standard {
        border: none !important;
      }

      .mat-button-toggle {
        margin: 0 3px;
        border-radius: 5px !important;
        font-weight: 400;
      }

      .mat-button-toggle-appearance-standard {
        background: #e5e5e5;
      }

      .mat-button-toggle-group-appearance-standard .mat-button-toggle + .mat-button-toggle {
        border: none;
      }

      .mat-button-toggle-checked {
        color: rgb(255 255 255 / 87%);
        background: #48a5a0;
      }

      @keyframes skeleton-loading {
        0% {
          background-color: #e2e2e2;
        }
        50% {
          background-color: #f2f2f2;
        }
        100% {
          background-color: #e2e2e2;
        }
      }
    `,
  ],
})
export class MisCpslaReviewerReportComponent extends AbstractExcelMISReport implements OnInit {
  public lovStatus = [];
  public lovReviewerName = [];
  public lovApprovalLC = [];
  public allSelectedReviewerName = false;
  public allSelectedApprovalLC = false;
  public startDate: any;
  public endDate: any;
  public allSelected = false;
  public MISReportSLA: FormGroup;
  public selection = new SelectionModel<any>(true, []);
  public loadingSearch = false;
  public searchResult;
  private debounceTimer: any;
  public displayedColumns: string[] = ['proposalNumber', 'cif', 'debtorName', 'customerType', 'proposalDate', 'status', 'action'];
  public skeletonData = [
    {
      proposalNumber: '',
      cif: '',
      debtorName: '',
      customerType: '',
      proposalDate: '',
      status: '',
      action: '',
    },
  ];
  @ViewChild('formContainer', { static: true }) formContainer: ElementRef;

  constructor(
    public misReportService: MisReportService,
    public messageService: MessageService,
    public slaLengthService: GetSlaLengthService,
    public slaReviewerService: SLAReviewerService
  ) {
    super(misReportService);
    this._initializeForm();
    this._handleFormChanges();
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.searchResult.forEach(row => this.selection.select(row));
  }

  selectAll() {
    if (this.selection.selected.length > 0) {
      this.selection.clear();
    } else {
      this.selection.select(...this.searchResult);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.searchResult.length;
    return numSelected === numRows;
  }

  processSelectedItems() {
    const selectedData = this.selection.selected;
    if (!selectedData || selectedData.length === 0) {
      return [];
    }
    const selectedIds = selectedData.map((item: any) => item.id);
    return selectedIds;
  }

  _initializeForm() {
    this.MISReportSLA = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      reviewerName: new FormControl(''),
      status: new FormControl(''),
      approvalLC: new FormControl(''),
      query: new FormControl(''),
    });
  }

  onFocus() {
    this.MISReportSLA.get('query')?.disable();
    this.applyDisabledStyle(this.formContainer.nativeElement, true);
  }

  onBlur() {
    this.checkFieldStatus();
  }

  onControlFocus(controlName: string) {
    handleFocus(this.MISReportSLA, controlName);
  }

  onControlBlur() {
    handleBlur(this.MISReportSLA);
  }

  checkFieldStatus() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      const startDate = this.MISReportSLA.get('startDate')?.value;
      const endDate = this.MISReportSLA.get('endDate')?.value;
      const status = this.MISReportSLA.get('status')?.value;
      const reviewerName = this.MISReportSLA.get('reviewerName')?.value;
      const approvalLC = this.MISReportSLA.get('approvalLC')?.value;
      const query = this.MISReportSLA.get('query')?.value;

      if (
        startDate ||
        endDate ||
        (status && status.length > 0) ||
        (reviewerName && reviewerName.length > 0) ||
        (approvalLC && approvalLC.length > 0) ||
        (query && query.length > 0)
      ) {
        this.MISReportSLA.get('query')?.disable();
        this.applyDisabledStyle(this.formContainer.nativeElement, true);
      } else {
        this.MISReportSLA.get('query')?.enable();
        this.applyDisabledStyle(this.formContainer.nativeElement, false);
      }
    }, 50);
  }

  _handleFormChanges() {
    this.MISReportSLA.get('startDate')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportSLA.get('startDate')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.MISReportSLA.get('endDate')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportSLA.get('endDate')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.MISReportSLA.get('query')?.valueChanges.subscribe(query => {
      if (query === '') {
        this.clearSearch();
      }
    });

    this.MISReportSLA.valueChanges.subscribe(changes => {
      if (Array.isArray(changes.status)) {
        if (changes.status.length === 0) {
          this._updateFormControl('status', '');
          this.allSelected = false;
        } else if (changes.status.length === this.lovStatus.length) {
          this.allSelected = true;
        }
      }

      if (Array.isArray(changes.reviewerName)) {
        if (changes.reviewerName.length === 0) {
          this._updateFormControl('reviewerName', '');
          this.allSelectedReviewerName = false;
        } else if (changes.reviewerName.length === this.lovReviewerName.length) {
          this.allSelectedReviewerName = true;
        }
      }

      if (Array.isArray(changes.approvalLC)) {
        if (changes.approvalLC.length === 0) {
          this._updateFormControl('approvalLC', '');
          this.allSelectedApprovalLC = false;
        } else if (changes.approvalLC.length === this.lovApprovalLC.length) {
          this.allSelectedApprovalLC = true;
        }
      }
    });
  }

  private _updateFormControl(field: string, value: any): void {
    this.MISReportSLA.get(field)?.setValue(value, { emitEvent: false });
  }

  clearDateRange() {
    this.MISReportSLA.get('startDate')?.reset();
    this.MISReportSLA.get('endDate')?.reset();
  }

  setAllSelectedSearch() {
    this.selection.select(...this.searchResult);
  }

  dateRangeHasValue() {
    return this.MISReportSLA.get('startDate')?.value && this.MISReportSLA.get('endDate')?.value;
  }

  get columns(): any[] {
    return [
      { header: 'No.', key: 'no' },
      { header: 'Approve to LA', key: 'approveToLA' },
      { header: 'Date of Assignment', key: 'dateOfAssignmentSingle' },
      { header: 'Segment', key: 'segment' },
      { header: 'Proposal Type', key: 'proposalType' },
      { header: 'Proposal Date', key: 'proposalDate' },
      { header: 'Proposal Number', key: 'proposalNumber' },
      { header: 'Program', key: 'program' },
      { header: 'Branch', key: 'branchs' },
      { header: 'Regional', key: 'regional' },
      { header: 'SME Head Name', key: 'headName' },
      { header: 'BM', key: 'bm' },
      { header: 'RM', key: 'rm' },
      { header: 'Debtor Name', key: 'debtorName' },
      { header: 'Loan Comm Approval', key: 'loanCommApproval' },
      { header: 'Line of Business', key: 'lineOfBusiness' },
      { header: 'SME Scorecard', key: 'gradingSME' },
      { header: 'Credit Rating', key: 'rating' },
      { header: 'Application Type', key: 'statusOfFacility' },
      { header: 'Take Over (Y/N)', key: 'takeOverYN' },
      { header: 'Previous Bank', key: 'previousBank' },
      { header: 'Facility', key: 'facility' },
      { header: 'Facility Tenor', key: 'facilityTenor' },
      { header: 'Period Type', key: 'periodType' },
      { header: 'Maturity Date', key: 'maturityDate' },
      { header: 'Currency', key: 'currency' },
      { header: 'Initial Limit', key: 'initialLimit' },
      { header: 'Total Changes Eq To IDR', key: 'totalChangesEqToIDR' },
      { header: 'Grand Total Plafond DEBTOR ONLY (IDR)', key: 'grandTotalPlafondDebtorOnlyIDR' },
      { header: 'Grand Total Plafond TOTAL EXPOSURE (IDR)', key: 'grandTotalPlafondTotalExposureIDR' },
      { header: 'Exchange Rate', key: 'exchangeRate' },
      { header: 'Interest Rate (%)', key: 'interestRate' },
      { header: 'Provision Fee', key: 'provisionFee' },
      { header: 'Provision Fee Type', key: 'provisionFeeType' },
      { header: 'Admin Fee', key: 'adminFee' },
      { header: 'Admin Fee Type', key: 'adminFeeType' },
      { header: 'Collateral (INCLUDE CROS COLL OTHER CIF)', key: 'collateralIncCrosCollOtherCif' },
      { header: 'MV Internal  (In Currency)', key: 'mvInternalInCurrency' },
      { header: 'MV Internal (Eq to IDR)', key: 'mvInternalEqToIDR' },
      { header: 'Total MV Internal (Eq to IDR)', key: 'totalMVInternalEqToIDR' },
      { header: 'LV Internal  (In Currency)', key: 'lvInternalInCurrency' },
      { header: 'LV Internal (Eq to IDR)', key: 'lvInternalEqToIDR' },
      { header: 'Total LV Internal (Eq to IDR)', key: 'totalLVInternalEqToIDR' },
      { header: 'Group Name', key: 'groupName' },
      { header: `Debtor's Group`, key: 'debtorGroup' },
      { header: 'Reviewer', key: 'reviewer' },
      { header: 'Status', key: 'status' },
      { header: 'Date of Status', key: 'dateOfStatus' },
      { header: 'Memo (Y/N)', key: 'memoYN' },
      { header: 'Recommendation Reviewer', key: 'recommendationReviewer' },
      { header: 'Loan Comm Approval (Summary)', key: 'loanCommApprovalSummary' },
      { header: 'Days to Maturity Date', key: 'daysToMaturityDate' },
      { header: 'Date of Approve to LA', key: 'dateOfApproveToLA' },
      { header: 'Date of Assignment', key: 'dateOfAssignmentAll' },
      { header: 'Date Return to Branch', key: 'dateReturnToBranch' },
      { header: 'Proposal back to CRO', key: 'proposalBackToCRO' },
      { header: 'Proposal check by Checker', key: 'proposalCheckByChecker' },
      { header: 'Date Return to Reviewer', key: 'dateReturnToReviewer' },
      { header: 'Loan Approval/Loan Comm Date', key: 'loanApprovalLoanCommDate' },
      { header: 'Generate DAR', key: 'generateDAR' },
      { header: 'Finalized DAR', key: 'finalizedDAR' },
      { header: 'SLA Length', key: 'slaLength' },
    ];
  }

  ngOnInit(): void {
    this.getStatusLOV('MIS_SLA_REVIEWER').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });

    this.slaReviewerService.getReviewerName().subscribe({
      next: res => {
        this.lovReviewerName = res
          .sort((a: any, b: any) => a.employeeFirstName?.localeCompare(b.employeeFirstName))
          .filter((item: any) => item.employeeEmail !== 'supercash@localhost');
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Reviewer Name' });
      },
    });

    this.slaReviewerService.getApprovalLc().subscribe({
      next: res => {
        this.lovApprovalLC = res;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Approval LC' });
      },
    });

    setupQueryControlBehavior(this.MISReportSLA);
  }

  public toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.MISReportSLA.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.MISReportSLA.get('status')?.setValue('');
    }
  }

  public toggleSelectAllReviewerName(): void {
    this.allSelectedReviewerName = !this.allSelectedReviewerName;
    if (this.allSelectedReviewerName) {
      this.MISReportSLA.get('reviewerName')?.setValue([...this.lovReviewerName.map(reviewer => reviewer.partyId)]);
    } else {
      this.MISReportSLA.get('reviewerName')?.setValue('');
    }
  }

  public toggleSelectAllApprovalLC(): void {
    this.allSelectedApprovalLC = !this.allSelectedApprovalLC;
    if (this.allSelectedApprovalLC) {
      this.MISReportSLA.get('approvalLC')?.setValue([...this.lovApprovalLC.map(approval => approval.id)]);
    } else {
      this.MISReportSLA.get('approvalLC')?.setValue('');
    }
  }

  public onSearchFocus() {
    this.MISReportSLA.get('startDate')?.disable();
    this.MISReportSLA.get('endDate')?.disable();
    this.MISReportSLA.get('status')?.disable();
    this.MISReportSLA.get('reviewerName')?.disable();
    this.MISReportSLA.get('approvalLC')?.disable();

    this.applyDisabledStyle(this.formContainer.nativeElement, true);
  }

  public onSearchBlur() {
    const searchValue = this.MISReportSLA.get('query')?.value;
    if (!searchValue) {
      this.MISReportSLA.get('startDate')?.enable();
      this.MISReportSLA.get('endDate')?.enable();
      this.MISReportSLA.get('status')?.enable();
      this.MISReportSLA.get('reviewerName')?.enable();
      this.MISReportSLA.get('approvalLC')?.enable();

      this.applyDisabledStyle(this.formContainer.nativeElement, false);
    }
  }

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

  doSearch() {
    this.selection.clear();
    this.loadingSearch = true;
    const queryValue = this.MISReportSLA.get('query')?.value;

    const predicate: object = {
      page: 0,
      query: queryValue,
      size: 9999,
      sort: ['id,desc'],
      idPosition: this.getLocStor('POS'),
    };

    predicate['target'] = 'mis-cp-report';

    this.misReportService.searchCP(predicate).subscribe({
      next: res => {
        this.searchResult = res.body || [];
        this.setAllSelectedSearch();
        this.loadingSearch = false;

        if (queryValue !== null && queryValue !== undefined) {
          this.MISReportSLA.get('query')?.setValue(queryValue, { emitEvent: false });
        }
      },
      error: (res: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
        this.loadingSearch = false;

        if (queryValue !== null && queryValue !== undefined) {
          this.MISReportSLA.get('query')?.setValue(queryValue, { emitEvent: false });
        }
      },
    });
  }

  public clearSearch(): void {
    this.MISReportSLA.get('query')?.reset();
    this.searchResult = null;
    this.selection.clear();
  }

  public generateMISReportSLA() {
    this.misReportService.setLoading(true);

    let params;
    if (this.MISReportSLA.get('query')?.value) {
      params = {
        query: this.MISReportSLA.get('query')?.value,
      };
    } else {
      params = {
        startDate: this.MISReportSLA.get('startDate')?.value,
        endDate: this.MISReportSLA.get('endDate')?.value,
        status: this._convertStatusToString(this.MISReportSLA.get('status')?.value),
        type: 'STATELOG',
      };
    }

    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_SLA_Credit_Review'),
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
    this._setAutoWidthForAllColumns();
    this.downloadFile(fileName);
    this._resetData();
  }

  private filterData(data) {
    const reviewerNames = this._convertStatusToString(this.MISReportSLA.get('reviewerName')?.value).split(',');
    const approvalLC = this._convertStatusToString(this.MISReportSLA.get('approvalLC')?.value)
      .split(',')
      .map(approval => approval.replace(/_/g, ' '));
    const selectedIds = this.processSelectedItems();

    if (selectedIds.length > 0) {
      return data.filter(proposal => selectedIds.includes(proposal.id));
    } else {
      if (reviewerNames.length === 1 && reviewerNames[0] === '' && approvalLC.length === 1 && approvalLC[0] === '') {
        return data;
      } else {
        return data.filter(proposal => approvalLC.includes(proposal.approvalLc) && reviewerNames.includes(proposal.dataAssignToCROId));
      }
    }
  }

  protected processData(data: any[]): void {
    const filteredData = this.filterData(data);
    filteredData.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal, index): void {
    this.slaLengthService.setDatesSlaLength({
      dateOfAssignment: [this.getDateOfAssignment(proposal, false)],
      dateReturnToBranch: this.getFromDateBasedOnField(
        proposal,
        'statusDescription',
        ['Return to Credit Proposal (CR)'],
        'Default',
        false
      ).split(',\n'),
      proposalBackToCRO: this.getFromDateBasedOnField(
        proposal,
        'fromStatusDescription',
        ['Return to Credit Proposal (CR)'],
        'Default',
        false
      ).split(',\n'),
      proposalCheckByChecker: this.getFromDateBasedOnField(proposal, 'statusDescription', ['Checker'], 'Default', false).split(',\n'),
      loanCommDate: this.getFromDateBasedOnField(
        proposal,
        'statusDescription',
        ['Loan Committee Approval', 'Loan Approval'],
        'Default',
        false
      ).split(',\n'),
      dateReturnToReviewer: this.getFromDateBasedOnField(proposal, 'fromStatusDescription', ['Checker', 'Assignment']).split(',\n'),
      generateDAR: [this.getGenerateDAR(proposal, false)],
      finalizedDAR: this.getFromDateBasedOnField(proposal, 'statusDescription', ['DAR Notif', 'DAR Checker'], 'Default', false).split(
        ',\n'
      ),
    });

    const repeatCount = proposal.product?.length || 1;
    const baseRowIndex = worksheet.lastRow ? worksheet.lastRow.number + 1 : 1;

    for (let i = 0; i < repeatCount; i++) {
      const product = proposal.product?.[i] || {};
      worksheet.addRow({
        no: i === 0 ? index + 1 : '',
        approveToLA: this.getApproveToLA(proposal) || '',
        dateOfAssignmentSingle: this.getDateOfAssignment(proposal),
        segment: proposal.segmentParentRM || '',
        proposalType: proposal.proposalType || '',
        proposalDate: '', // TBC
        proposalNumber: '', // TBC
        program: proposal.program || '',
        branchs: proposal.bookingBranchName || '',
        regional: this.getRegionalParentRM(proposal.regionalParentRM),
        headName: proposal.headName || '',
        bm: proposal.bm || '',
        rm: proposal.rmFirstName || proposal.rmLastName ? (proposal.rmFirstName ? proposal.rmFirstName : '') + ' ' + (proposal.rmLastName ? proposal.rmLastName : '') : '',
        debtorName: proposal.debtorName || '',
        loanCommApproval: proposal.approvalLc || '',
        lineOfBusiness: proposal.lineOfBusiness || '',
        gradingSME: this.getGrading(proposal) === 'Grading' ? proposal.creditGrading : '',
        rating: this.getGrading(proposal) === 'Rating' ? proposal.creditGrading : '',
        statusOfFacility: product.pengajuan || '',
        takeOverYN: proposal.previousBank === null || proposal.previousBank === 'null' ? 'N' : 'Y',
        previousBank: proposal.previousBank || '',
        facility: product.facility || '',
        facilityTenor: product.tenorFasilitas || '',
        periodType: product.periodType || '',
        maturityDate: this.getMaturityDate(product),
        currency: product.currency || '',
        initialLimit: product.initialLimit || '',
        totalChangesEqToIDR: proposal.totalChangesEqToIDR || '',
        grandTotalPlafondDebtorOnlyIDR: proposal.totalPlafondDebtorOnlyIDR || '',
        grandTotalPlafondTotalExposureIDR: proposal.grandTotalPlafondEqToIDR || '',
        exchangeRate: this.getExchangeRate(proposal) || '',
        interestRate: product.currentRate || '',
        provisionFee: this.formatProvisionFee(product.provisionFee, product.provisionFeeType) || '',
        provisionFeeType: product.provisionFeeType || '',
        adminFee: this.formatAdminFee(product.adminFee) || '',
        adminFeeType: product.adminFeeType || '',
        collateralIncCrosCollOtherCif: this.getCollateralIncCrosCollOtherCif(proposal),
        mvInternalInCurrency: this.getMV(proposal).original,
        mvInternalEqToIDR: this.getMV(proposal).internal,
        totalMVInternalEqToIDR: proposal.totalMVInternal || '',
        lvInternalInCurrency: '', // TBC
        lvInternalEqToIDR: this.getLV(proposal).internal,
        totalLVInternalEqToIDR: proposal.totalLVInternal || '',
        groupName: proposal.businessGroup?.groupCompanyName || '',
        debtorGroup: this.getDebturGroup(proposal),
        reviewer: this.formatReviewer(proposal.dataAssignToCROName),
        status: proposal.status || '',
        dateOfStatus: this.formatDate(proposal.lastModifiedDate) || '',
        memoYN: this.getMemo(proposal),
        recommendationReviewer: '', // TBC
        loanCommApprovalSummary: proposal.approvalStatus || '',
        daysToMaturityDate: this._getDaysToMaturityDate(proposal) || '',
        dateOfApproveToLA: this.getFromDateBasedOnField(proposal, 'statusDescription', ['Approve To Loan Analysis']) || '',
        dateOfAssignmentAll: this.getDateOfAssignment(proposal),
        dateReturnToBranch: this.getFromDateBasedOnField(proposal, 'statusDescription', ['Return to Credit Proposal (CR)']) || '',
        proposalBackToCRO: this.getFromDateBasedOnField(proposal, 'fromStatusDescription', ['Return to Credit Proposal (CR)']) || '',
        proposalCheckByChecker: this.getFromDateBasedOnField(proposal, 'statusDescription', ['Checker']) || '',
        dateReturnToReviewer: this.getFromDateBasedOnField(proposal, 'fromStatusDescription', ['Checker', 'Assignment']) || '',
        loanApprovalLoanCommDate:
          this.getFromDateBasedOnField(proposal, 'statusDescription', ['Loan Committee Approval', 'Loan Approval']) || '',
        generateDAR: this.getGenerateDAR(proposal),
        finalizedDAR: this.getFromDateBasedOnField(proposal, 'statusDescription', ['DAR Notif', 'DAR Checker']) || '',
        slaLength: this.slaLengthService.getSLALength(),
      });
    }

    if (repeatCount > 1) {
      this.mergeCells(worksheet, baseRowIndex, repeatCount, [
        'no',
        'approveToLA',
        'dateOfAssignmentSingle',
        'segment',
        'proposalType',
        'proposalDate',
        'proposalNumber',
        'program',
        'branchs',
        'regional',
        'headName',
        'bm',
        'rm',
        'debtorName',
        'loanCommApproval',
        'lineOfBusiness',
        'gradingSME',
        'rating',
        'takeOverYN',
        'previousBank',
        'totalChangesEqToIDR',
        'grandTotalPlafondDebtorOnlyIDR',
        'grandTotalPlafondTotalExposureIDR',
        'exchangeRate',
        'collateralIncCrosCollOtherCif',
        'mvInternalInCurrency',
        'mvInternalEqToIDR',
        'totalMVInternalEqToIDR',
        'lvInternalInCurrency',
        'lvInternalEqToIDR',
        'totalLVInternalEqToIDR',
        'groupName',
        'debtorGroup',
        'reviewer',
        'status',
        'dateOfStatus',
        'memoYN',
        'recommendationReviewer',
        'loanCommApprovalSummary',
        'daysToMaturityDate',
        'dateOfApproveToLA',
        'dateOfAssignmentAll',
        'dateReturnToBranch',
        'proposalBackToCRO',
        'dateReturnToReviewer',
        'proposalCheckByChecker',
        'loanApprovalLoanCommDate',
        'generateDAR',
        'finalizedDAR',
        'slaLength',
      ]);
    }
  }

  private _applyStyles(): void {
    super.applyStyles();
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

  private mergeCells(worksheet: ExcelJS.Worksheet, startRow: number, rowCount: number, columns: string[]): void {
    columns.forEach(column => {
      worksheet.mergeCells(startRow, worksheet.getColumnKey(column).number, startRow + rowCount - 1, worksheet.getColumnKey(column).number);
    });
  }

  private getApproveToLA(proposal: any): string {
    const { timeLineCreditProposal: timelines } = proposal;

    // Return '' if there is no timeline data
    if (!timelines) {
      return '';
    }

    return timelines
      .filter(t => t.statusDescription === 'Approve To Loan Analysis')
      .map(t => this.formatDate(t.createdDate))
      .join(',\n');
  }

  private getCollateralIncCrosCollOtherCif(proposal: any) {
    const { collateral } = proposal;

    // Return '' if there is no collateral data
    if (!collateral) {
      return '';
    }

    return collateral.map(c => c.collateralCode).join(',\n');
  }

  private getMV(proposal: any) {
    const { collateral } = proposal;

    if (!collateral) {
      return {
        original: '',
        internal: '',
      };
    }

    return {
      original: collateral.map(c => (c.collateralProperty ? c.collateralProperty.marketValueOriginal : '')).join(',\n'),
      internal: collateral.map(c => (c.collateralProperty ? c.collateralProperty.marketValueInternal : '')).join(',\n'),
    };
  }

  private getLV(proposal: any) {
    const { collateral } = proposal;

    if (!collateral) {
      return {
        original: '',
        internal: '',
      };
    }

    return {
      original: '',
      internal: collateral.map(c => (c.collateralProperty ? c.collateralProperty.liquidationValueInternal : '')).join(',\n'),
    };
  }

  private getDebturGroup(proposal: any) {
    // return from proposal.businessGroup.customersGroup[x].customerName
    if (!proposal.businessGroup) {
      return '';
    }

    if (!proposal.businessGroup.customersGroup) {
      return '';
    }

    return proposal.businessGroup.customersGroup.map(cg => cg.customerName).join(',\n');
  }

  private getMemo(proposal: any) {
    const { darAppealSeqNo, appealMemoDocNo } = proposal;

    if (Number(darAppealSeqNo) === 0 && !appealMemoDocNo) {
      return 'N';
    }

    return 'Y';
  }

  private getGrading(proposal: any) {
    const grading = proposal.creditGrading ? proposal.creditGrading.charAt(0) : '';

    if (grading === grading.toUpperCase()) {
      return 'Rating';
    }

    return 'Grading';
  }

  private formatReviewer(reviewerName: string): string {
    try {
      if (!reviewerName) {
        return '';
      }

      if (reviewerName.includes('null')) {
        reviewerName = reviewerName.replace('null', '');
      }

      const words = reviewerName.split(' ');

      const formattedWords = words.map(word => {
        if (word === word.toUpperCase()) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      });

      return formattedWords.join(' ');
    } catch (error) {
      console.log('Error formatting reviewer name:', error);
      return '';
    }
  }

  private formatProvisionFee(provisionFee: string, type: string): string {
    if (!provisionFee) {
      return '';
    }

    let formattedProvisionFee = provisionFee;

    if (type === 'IDR' || type === 'USD') {
      formattedProvisionFee = provisionFee.replace(/,/g, '');
    } else {
      const data = provisionFee.split('.')[0];
      if (Number(data) === 0) {
        return '0';
      }
      formattedProvisionFee = Number(data).toFixed(2).replace(/\B(?=(\d{3})+(?!\.))/g, ',');
    }

    return formattedProvisionFee;
  }

  private getDateOfAssignment(proposal: any, isDateFormated = true): string {
    const { timeLineCreditProposal: timelines } = proposal;

    // Return '' if there is no timeline data
    if (!timelines) {
      return '';
    }

    const assignment = timelines.find(t => t.statusDescription === 'Assignment');
    if (!isDateFormated) {
      return assignment.fromDate || undefined;
    }
    return this.formatDate(assignment?.fromDate) || '';
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) {
      return '';
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  private formatAdminFee(adminFee: string): string {
    if (!adminFee) {
      return '';
    }

    return adminFee.split('.')[0];
  }

  private getFromDateBasedOnField(
    proposal: any,
    field: 'statusDescription' | 'fromStatusDescription',
    status: string[],
    outputType: 'Default' | 'Count' = 'Default',
    isFormatted = true
  ): string {
    const timelines = proposal.timeLineCreditProposal;

    // Return '' if there is no timeline data
    if (!timelines || !Array.isArray(timelines)) {
      return '';
    }

    // Sort timelines asc by id
    timelines.sort((a, b) => a.id - b.id);

    // Filter timelines based on the specified field and statuses in the array
    const filteredTimelines = timelines.filter(t => status.includes(t[field]));

    if (outputType === 'Default') {
      // Map the filtered timelines to their fromDate and join them with a newline separator
      if (isFormatted) {
        return filteredTimelines.map(t => this.formatDate(t.fromDate)).join(',\n');
      }

      return filteredTimelines.map(t => t.fromDate).join(',\n');
    }

    // Return the count of the filtered timelines' fromDate
    return filteredTimelines.length.toString();
  }

  protected getGenerateDAR(proposal: any, isDateFormated = true): string {
    const documentGenerate = proposal.documentGenerate;

    if (!documentGenerate) {
      return '';
    }

    if (!isDateFormated) {
      return documentGenerate.generateDate || '';
    }

    return this.formatDate(documentGenerate.generateDate);
  }

  private getMaturityDate(product) {
    if (!product) {
      return '';
    }

    if (!product.maturityDate || product.maturityDate === 'null') {
      return '';
    }

    if (product.pengajuan === 'Renewal') {
      const tenor = product.tenorFasilitas;
      const period = product.periodType;
      product.maturityDate = this._getAdjustedMaturityDate(product.maturityDate, tenor, period);
    }

    return this.formatDate(product.maturityDate) || '';
  }

  private getExchangeRate(proposal) {
    const { collateral } = proposal;

    if (!collateral) {
      return '';
    }

    // find if any collateral[x].collateralProperty.marketValueOriginal === 'USD'
    // or if any product[x].currency === 'USD'
    const isUSD =
      collateral.some(c => c.collateralProperty.marketValueOriginalCcy === 'USD') || proposal.product.some(p => p.currency === 'USD');

    if (!isUSD) {
      return '';
    }

    return proposal.exchangeRateUsdIdr;
  }

  private getRegionalParentRM(regionalParentRM) {
    if (!regionalParentRM) {
      return '';
    }

    if (regionalParentRM.startsWith('SME ')) {
      return regionalParentRM.substring(4);
    }

    if (regionalParentRM === 'Corporate Banking') {
      return 'CP';
    }

    if (regionalParentRM === 'Industry Coverage') {
      return 'IC';
    }

    if (regionalParentRM === 'Commercial Banking') {
      return 'CM';
    }

    if (regionalParentRM === 'SME Plus') {
      return 'SM';
    }

    if (regionalParentRM.startsWith('Global Marketing ')) {
      return regionalParentRM.substring(17);
    }

    if (regionalParentRM === 'Enterprise Banking') {
      return 'EB';
    }

    if (regionalParentRM === 'Mortgage/KPR') {
      return 'M';
    }
  }
}
