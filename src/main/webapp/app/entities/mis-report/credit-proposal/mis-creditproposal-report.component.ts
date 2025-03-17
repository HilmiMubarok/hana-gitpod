import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import * as ExcelJS from 'exceljs';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { InternalService } from 'app/entities/internal/internal.service';
import { APPLICATION_TYPE } from 'app/shared/constants/base.constants';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'jhi-mis-creditproposal-report',
  templateUrl: './mis-creditproposal-report.component.html',
  styleUrls: ['./mis-report-credit-proposal.css', '../mis-report.css', '../disabled-style.scss'],
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

      .skeleton-loading {
        display: flex;
        align-items: center;
        justify-content: start;
        background-color: #fff;
        border-radius: 4px;
        padding: 16px;
        width: 90%;
        height: 100%;
        animation: skeleton-loading 1.5s ease-in-out infinite;
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
export class MisCreditProposalReportComponent extends AbstractExcelMISReport implements OnInit {
  public lovStatus = [];
  public lovRegional = [];
  public lovCustomerType = ['NEW', 'EXISTING'];
  public date1: any;
  public date2: any;
  public allSelected = false;
  public allSelectedRegional = false;
  public MISReportCP: FormGroup;
  private readonly parentIds = ['9901', '9902', '9903', '9904', '9905'];
  displayedColumns: string[] = ['proposalNumber', 'cif', 'debtorName', 'customerType', 'proposalDate', 'status'];
  @ViewChild('formContainer', { static: true }) formContainer: ElementRef;

  constructor(public misReportService: MisReportService, public messageService: MessageService, public internalService: InternalService) {
    super(misReportService);
    this.MISReportCP = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
      regional: new FormControl(null),
      customerType: new FormControl(null),
      query: new FormControl(''),
    });

    this.MISReportCP.get('date1')?.valueChanges.subscribe(date => {
      this.checkFieldStatus();
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportCP.get('date1')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.MISReportCP.get('date2')?.valueChanges.subscribe(date => {
      this.checkFieldStatus();
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportCP.get('date2')?.setValue(formattedDate, { emitEvent: false });
      }
    });
    this.MISReportCP.get('regional')?.valueChanges.subscribe(() => {
      this.checkFieldStatus();
      // if type is array and length 0, change to null
      if (Array.isArray(this.MISReportCP.get('regional')?.value) && this.MISReportCP.get('regional')?.value.length === 0) {
        this.MISReportCP.get('regional')?.setValue(null);
      }
    });

    this.MISReportCP.get('status')?.valueChanges.subscribe(() => this.checkFieldStatus());
    this.MISReportCP.get('customerType')?.valueChanges.subscribe(() => this.checkFieldStatus());
  }

  onDateRangeFocus() {
    this.MISReportCP.get('query')?.disable();
    this.applyDisabledStyle(this.formContainer.nativeElement, true);
  }

  onDateRangeBlur() {
    this.checkFieldStatus(); // This ensures search field behavior is updated accordingly
  }

  dateRangeHasValue(): boolean {
    return this.MISReportCP.get('date1')?.value && this.MISReportCP.get('date2')?.value;
  }

  checkFieldStatus() {
    const date1 = this.MISReportCP.get('date1')?.value;
    const date2 = this.MISReportCP.get('date2')?.value;
    const status = this.MISReportCP.get('status')?.value;
    const regional = this.MISReportCP.get('regional')?.value;
    const customerType = this.MISReportCP.get('customerType')?.value;

    if (date1 || date2 || (status && status.length > 0) || (regional && regional.length > 0) || (customerType && customerType.length > 0)) {
      this.MISReportCP.get('query')?.disable();
      this.applyDisabledStyle(this.formContainer.nativeElement, true);
    } else {
      this.MISReportCP.get('query')?.enable();
      this.applyDisabledStyle(this.formContainer.nativeElement, false);
    }
  }
  get columns() {
    return [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Proposal Number', key: 'proposalNumber', width: 30 },
      { header: 'Proposal Date', key: 'proposalDate', width: 15 },
      { header: 'Segment', key: 'segment', width: 10 },
      { header: 'Proposal Type', key: 'proposalType', width: 30 },
      { header: 'Branchs', key: 'branchs', width: 30 },
      { header: 'Customer Status', key: 'customerStatus', width: 15 },
      { header: 'Program', key: 'program', width: 25 },
      { header: 'Klasifikasi UMKM', key: 'umkm', width: 20 },
      { header: 'Modal Usaha (IDR)', key: 'modalUsaha', width: 20 },
      { header: 'STO/Penjualan Tahunan', key: 'stoPenjualanTahunan', width: 21 },
      { header: 'Refferal', key: 'refferal', width: 20 },
      { header: 'RM', key: 'rm', width: 20 },
      { header: 'BM', key: 'bm', width: 30 },
      { header: 'SME Head', key: 'smeHead', width: 30 },
      { header: 'Regional', key: 'regional', width: 30 },
      { header: 'CIF', key: 'cif', width: 15 },
      { header: 'Debtor Name', key: 'debtorName', width: 30 },
      { header: 'Line of Business', key: 'lineOfBusiness', width: 45 },
      { header: 'Total Exposure Group', key: 'totalExposureGroup', width: 20 },
      { header: 'Deviation', key: 'deviation', width: 10 },
      { header: 'Credit Grading', key: 'creditGrading', width: 13 },
      { header: 'Loan Comm Approval', key: 'loanCommApproval', width: 19 },
      { header: 'Pengajuan', key: 'pengajuan', width: 20 },
      { header: 'Facility', key: 'facility', width: 20 },
      { header: 'Maturity Date', key: 'maturityDate', width: 20 },
      { header: 'Interest Rate (%)', key: 'interestRate', width: 20 },
      { header: 'Provision (%pa)', key: 'provisionPa', width: 20 },
      { header: 'Provision (IDR)', key: 'provisionIDR', width: 20 },
      { header: 'Provision (USD)', key: 'provisionUSD', width: 20 },
      { header: 'Total Admin Fee (%pa)', key: 'totalAdminFeePa', width: 20 },
      { header: 'Total Admin Fee (IDR)', key: 'totalAdminFeeIDR', width: 20 },
      { header: 'Total Admin Fee (USD)', key: 'totalAdminFeeUSD', width: 20 },
      { header: 'Initial Limit (IDR)', key: 'initialLimitIDR', width: 20 },
      { header: 'Initial Limit (USD)', key: 'initialLimitUSD', width: 20 },
      { header: 'Total Initial Limit (IDR)', key: 'totalInitialLimitIDR', width: 20 },
      { header: 'Total Initial Limit (USD)', key: 'totalInitialLimitUSD', width: 20 },
      { header: 'Facility (Proposed)', key: 'facilityProposed', width: 15 },
      { header: 'Facility (DAR Final)', key: 'facilityDARFinal', width: 15 },
      { header: 'Total Plafond Per Facility Proposed', key: 'totalPlafondPerFacilityProposed', width: 15 },
      { header: 'Total Plafond Proposed (IDR)', key: 'totalPlafondProposedIDR', width: 15 },
      { header: 'Total Plafond Proposed (USD)', key: 'totalPlafondProposedUSD', width: 15 },
      { header: 'Total Plafond Per Facility DAR Final', key: 'totalPlafondPerFacilityDARFinal', width: 15 },
      { header: 'Total Plafond DAR Final (IDR)', key: 'totalPlafondDARFinalIDR', width: 15 },
      { header: 'Total Plafond DAR Final (USD)', key: 'totalPlafondDARFinalUSD', width: 15 },
      { header: 'Plafond OD/DL IDR', key: 'plafondODDLIDR', width: 15 },
      { header: 'Plafond Installment IDR', key: 'plafondInstallmentIDR', width: 15 },
      { header: 'Plafond OD/DL USD', key: 'plafondODDLUSD', width: 15 },
      { header: 'Plafond Installment USD', key: 'plafondInstallmentUSD', width: 15 },
      { header: 'Rate Proposed', key: 'rateProposed', width: 15 },
      { header: 'Rate DAR Final', key: 'rateDARFinal', width: 15 },
      { header: 'Total Changes Eq To IDR', key: 'totalChangesEqToIDR', width: 22 },
      { header: 'Total Plafond Debtor only (IDR)', key: 'totalPlafondDebtorIDR', width: 20 },
      { header: 'Total Plafond Debtor only (USD)', key: 'totalPlafondDebtorUSD', width: 20 },
      { header: 'Sub Total Plafond Eq to IDR (Debtor)', key: 'subTotalPlafondEqToIDRDebtor', width: 20 },
      { header: 'Grand Total Plafond Eq to IDR (Include Group)', key: 'grandTotalPlafondEqToIDR', width: 20 },
      { header: 'ID', key: 'id', width: 20 },
      { header: 'Collateral (INCLUDE CROS COLL OTHER CIF)', key: 'collateralIncCrosOtherCIF', width: 20 },
      { header: 'Kabupaten / Kota', key: 'city', width: 20 },
      { header: 'Total MV Internal', key: 'totalMVInternal', width: 20 },
      { header: 'Total LV Internal', key: 'totalLVInternal', width: 20 },
      { header: 'Total MV KJPP', key: 'totalMVKJPP', width: 20 },
      { header: 'Total LV KJPP', key: 'totalLVKJPP', width: 20 },
      { header: 'Collateral Coverage MV', key: 'collateralCoverageMVInternal', width: 20 },
      { header: 'Collateral Coverage LV', key: 'collateralCoverageLVInternal', width: 20 },
      { header: 'Collateral Coverage MV KJPP (%)', key: 'collateralCoverageMVKJPP', width: 20 },
      { header: 'Collateral Coverage LV KJPP (%)', key: 'collateralCoverageLVKJPP', width: 20 },
      { header: 'Group Name', key: 'groupName', width: 20 },
      { header: 'DebiturGroup', key: 'debiturGroup', width: 20 },
      { header: 'Draft', key: 'draft', width: 20 },
      { header: 'Appraisal Date / Draft', key: 'appraisalDateDraft', width: 20 },
      { header: 'Approval Team Leader', key: 'approvalTeamLeader', width: 20 },
      { header: 'Approval BM', key: 'approvalBM', width: 20 },
      { header: 'Approval Ho', key: 'approvalHo', width: 20 },
      { header: 'Approval Div Head', key: 'approvalDivHead', width: 20 },
      { header: 'Approval to Analyst', key: 'approvalToAnalyst', width: 20 },
      { header: 'Assignment', key: 'assignment', width: 20 },
      { header: 'Checker', key: 'checker', width: 20 },
      { header: 'Loan Komite/Approval', key: 'loanKomiteApproval', width: 20 },
      { header: 'DAR Checker', key: 'darChecker', width: 20 },
      { header: 'DAR Rev Checker', key: 'darRevChecker', width: 20 },
      { header: 'Reviewer Name', key: 'reviewerName', width: 20 },
      { header: 'Status', key: 'status', width: 25 },
      { header: 'Summary of Reviewer/Recommendation', key: 'summaryOfReviewerRecommendation', width: 20 },
    ];
  }

  ngOnInit(): void {
    this._getStatusLOV();
    this._getRegionalLOV();
  }

  public onSearchFocus() {
    this.MISReportCP.get('date1')?.disable();
    this.MISReportCP.get('date2')?.disable();
    this.MISReportCP.get('status')?.disable();
    this.MISReportCP.get('regional')?.disable();
    this.MISReportCP.get('customerType')?.disable();
    this.applyDisabledStyle(this.formContainer.nativeElement, true);
  }

  public onSearchBlur() {
    const searchValue = this.MISReportCP.get('query')?.value;
    if (!searchValue) {
      this.MISReportCP.get('date1')?.enable();
      this.MISReportCP.get('date2')?.enable();
      this.MISReportCP.get('status')?.enable();
      this.MISReportCP.get('regional')?.enable();
      this.MISReportCP.get('customerType')?.enable();
      this.applyDisabledStyle(this.formContainer.nativeElement, false);
    }
  }

  public searchResult = null;

  public clearSearch(): void {
    this.MISReportCP.get('query')?.reset();
    // reset the searchResult
    this.searchResult = null;
  }

  public pageSize = 10;
  public currentPage = 0;
  public totalItems = 0;
  public pageSizeOptions: number[] = [5, 10, 25, 50];

  skeletonData = [
    {
      proposalNumber: '',
      cif: '',
      debtorName: '',
      customerType: '',
      proposalDate: '',
      status: '',
    },
  ];
  public loadingSearch = false;
  public doSearch(pageEvent?: PageEvent): void {
    this.loadingSearch = true;

    if (pageEvent) {
      this.currentPage = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    }

    const predicate: object = {
      page: this.currentPage,
      query: this.MISReportCP.get('query')?.value,
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

  clearDateRange(): void {
    this.MISReportCP.get('date1')?.reset();
    this.MISReportCP.get('date2')?.reset();
  }

  public generateMISReportCP() {
    this.misReportService.setLoading(true);

    let params;
    if (this.MISReportCP.get('query')?.value) {
      params = {
        query: this.MISReportCP.get('query')?.value,
      };
    } else {
      params = {
        startDate: this.MISReportCP.get('date1')?.value,
        endDate: this.MISReportCP.get('date2')?.value,
        status: this._convertStatusToString(this.MISReportCP.get('status')?.value),
        regionalRM: this._convertStatusToString(this.MISReportCP.get('regional')?.value),
        customerStatus: this._convertStatusToString(this.MISReportCP.get('customerType')?.value),
      };
    }

    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_Credit_Proposal'),
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

  public toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.MISReportCP.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.MISReportCP.get('status')?.setValue('');
    }
  }

  public toggleSelectRegionalAll(): void {
    this.allSelectedRegional = !this.allSelectedRegional;
    if (this.allSelectedRegional) {
      this.MISReportCP.get('regional')?.setValue([...this.lovRegional.map(internal => internal.id)]);
    } else {
      this.MISReportCP.get('regional')?.setValue(null);
    }
  }

  allSelectedCustomerType = false;
  public toggleSelectCustomerTypeAll(): void {
    this.allSelectedCustomerType = !this.allSelectedCustomerType;
    if (this.allSelectedCustomerType) {
      this.MISReportCP.get('customerType')?.setValue([...this.lovCustomerType]);
    } else {
      this.MISReportCP.get('customerType')?.setValue(null);
    }
  }

  private _getStatusLOV() {
    this.misReportService.getStatuses('MIS_CREDIT_PROPOSALBSU').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
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
    this.setUpColumns(this.columns);

    // if data is empty, generate an empty file
    if (!data || data.length === 0) {
      this.applyStyles();
      this.downloadFile(fileName);
      return;
    }

    // Add data to worksheet
    this.processData(data);

    this._applyStyles();
    this.downloadFile(fileName);
    this._resetData();
  }

  protected processData(data: any[]): void {
    data.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal, index): void {
    worksheet.addRow({
      no: index + 1 || '',
      proposalNumber: proposal.proposalNumber || '',
      proposalDate: this._formatDate(proposal.proposalDate) || '',
      segment: proposal.segment || '',
      proposalType: proposal.proposalType || '',
      branchs: proposal.bookingBranchName || '',
      customerStatus: proposal.customerStatus || '',
      program: proposal.program || '',
      umkm: proposal.umkm || '',
      modalUsaha: proposal.modalUsaha || '',
      stoPenjualanTahunan: proposal.penjualanTahunan || '',
      refferal: proposal.refferal || '',
      rm: (proposal.rmFirstName || '') + ' ' + (proposal.rmLastName || '') || '',
      bm: proposal.bm || '',
      smeHead: proposal.headName || '',
      regional: proposal.regionalParentRM || '',
      cif: proposal.cif || '',
      debtorName: proposal.debtorName || '',
      lineOfBusiness: proposal.lineOfBusiness || '',
      totalExposureGroup: proposal.totalExposureGroup || '',
      deviation: this._getDeviation(proposal),
      creditGrading: proposal.creditGrading || '',
      loanCommApproval: proposal.approvalLc ? proposal.approvalLc.split(' ')[0] || '' : '',
      pengajuan: proposal.product.map(product => product.pengajuan).join(',\n') || '',
      facility: proposal.product.map(product => product.facility).join(',\n') || '',
      maturityDate: proposal.product.map(product => this._formatDate(product.maturityDate)).join(',\n') || '',
      interestRate: proposal.product.map(product => product.currentRate).join(',\n') || '',
      provisionPa: proposal.product.map(product => (product.provisionFeeType === '%p.a' ? product.provisionFee : '')).join(',\n') || '',
      provisionIDR: proposal.product.map(product => (product.provisionFeeType === 'IDR' ? product.provisionFee : '')).join(',\n') || '',
      provisionUSD: proposal.product.map(product => (product.provisionFeeType === 'USD' ? product.provisionFee : '')).join(',\n') || '',
      totalAdminFeePa: proposal.product.map(product => (product.adminFeeType === '%p.a' ? product.adminFee : '')).join(',\n') || '',
      totalAdminFeeIDR: proposal.product.map(product => (product.adminFeeType === 'IDR' ? product.adminFee : '')).join(',\n') || '',
      totalAdminFeeUSD: proposal.product.map(product => (product.adminFeeType === 'USD' ? product.adminFee : '')).join(',\n') || '',
      initialLimitIDR: proposal.product.map(product => (product.currency === 'IDR' ? product.initialLimit : '')).join(',\n') || '',
      initialLimitUSD: proposal.product.map(product => (product.currency === 'USD' ? product.initialLimit : '')).join(',\n') || '',
      totalInitialLimitIDR: '',
      totalInitialLimitUSD: '',
      facilityProposed: this._getFacilityProposedDataSource(proposal),
      facilityDARFinal: proposal.product.map(product => product.facility).join(',\n') || '',
      totalPlafondPerFacilityProposed: this._getTotalPlafondPerFacility(proposal, 'History') || '',
      totalPlafondProposedIDR: this._gettotalPlafondProposed(proposal, 'IDR'),
      totalPlafondProposedUSD: this._gettotalPlafondProposed(proposal, 'USD'),
      totalPlafondPerFacilityDARFinal: this._getTotalPlafondPerFacility(proposal, 'Current') || '',
      totalPlafondDARFinalIDR: proposal.totalPlafondDebtorOnlyIDR || '',
      totalPlafondDARFinalUSD: proposal.totalPlafondDebtorOnlyUSD || '',
      plafondODDLIDR: this._getTotalPlafond(proposal, 'IDR', 'Cash'),
      plafondInstallmentIDR: this._getTotalPlafond(proposal, 'IDR', 'Installment'),
      plafondODDLUSD: this._getTotalPlafond(proposal, 'USD', 'Cash'),
      plafondInstallmentUSD: this._getTotalPlafond(proposal, 'USD', 'Installment'),
      rateProposed: this._getRate(proposal, 'Proposed'),
      rateDARFinal: this._getRate(proposal, 'DAR Final'),
      totalChangesEqToIDR: proposal.totalChangesEqToIDR || '',
      totalPlafondDebtorIDR: proposal.totalPlafondDebtorOnlyIDR || '',
      totalPlafondDebtorUSD: proposal.totalPlafondDebtorOnlyUSD || '',
      subTotalPlafondEqToIDRDebtor: proposal.subTotalPlafondEqToIDR || '',
      grandTotalPlafondEqToIDR: proposal.grandTotalPlafondEqToIDR || '',
      id: this._getCollateralIdAndCode(proposal).id,
      collateralIncCrosOtherCIF: this._getCollateralIdAndCode(proposal).collateralCode,
      city: this._getCity(proposal),
      totalMVInternal: proposal.totalMVInternal || '',
      totalLVInternal: proposal.totalLVInternal || '',
      totalMVKJPP: proposal.totalMVKJPP || '',
      totalLVKJPP: proposal.totalLVKJPP || '',
      collateralCoverageMVInternal: proposal.colCoverageMVInternal || '',
      collateralCoverageLVInternal: proposal.colCoverageLVInternal || '',
      collateralCoverageMVKJPP: proposal.colCoverageMVKJPP || '',
      collateralCoverageLVKJPP: proposal.colCoverageLVKJPP || '',
      groupName: proposal.businessGroup ? proposal.businessGroup.groupCompanyName || '' : '',
      debiturGroup: this._getDebiturGroup(proposal),
      draft: this._getStatus(proposal, 'statusDescription', 'first', ['Draft']),
      appraisalDateDraft: '',
      approvalTeamLeader: '',
      approvalBM: this._getStatus(proposal, 'statusDescription', 'first', ['Approval BM']),
      approvalHo: this._getStatus(proposal, 'statusDescription', 'first', ['Approval SME Head']),
      approvalDivHead: this._getStatus(proposal, 'statusDescription', 'first', ['Approval Div Head']),
      approvalToAnalyst: this._getStatus(proposal, 'statusDescription', 'first', ['Approve To Loan Analysis']),
      assignment: this._getStatus(proposal, 'statusDescription', 'first', ['Assignment']),
      checker: this._getStatus(proposal, 'statusDescription', 'first', ['Checker']),
      loanKomiteApproval: this._getStatus(proposal, 'statusDescription', 'last', ['DAR Notif', 'DAR Checker']),
      darChecker: this._getStatus(proposal, 'fromStatusDescription', 'last', ['DAR Checker', 'DAR Notif']),
      darRevChecker: this._getStatus(proposal, 'fromStatusDescription', 'last', ['DAR Rev Checker']),
      reviewerName: proposal.dataAssignToCROName || '',
      status: proposal.status || '',
      summaryOfReviewerRecommendation: proposal.approvalStatus || '',
    });
  }

  private _applyStyles(): void {
    super.applyStyles();

    const columnsToBeWraped = [
      'pengajuan',
      'lineOfBusiness',
      'totalPlafondDebtorIDR',
      'totalPlafondDebtorUSD',
      'subTotalPlafondEqToIDRDebtor',
      'grandTotalPlafondEqToIDR',
      'collateralCoverageMVInternal',
      'collateralCoverageLVInternal',
      'collateralCoverageMVKJPP',
      'collateralCoverageLVKJPP',
      'facility',
      'maturityDate',
      'interestRate',
      'provisionPa',
      'provisionIDR',
      'provisionUSD',
      'totalAdminFeePa',
      'totalAdminFeeIDR',
      'totalAdminFeeUSD',
      'initialLimitIDR',
      'initialLimitUSD',
      'facilityProposed',
      'facilityDARFinal',
      'totalPlafondPerFacilityProposed',
      'totalPlafondPerFacilityDARFinal',
      'id',
      'totalPlafondProposedIDR',
      'rateProposed',
      'rateDARFinal',
      'debiturGroup',
      'collateralIncCrosOtherCIF',
      'city',
    ];

    columnsToBeWraped.forEach(column => {
      this.worksheet.getColumn(column).alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };

      const columnValue = this.worksheet.getColumn(column);

      const newValue = columnValue.values.map(value => {
        if (value) {
          return this._clearEmptyEntries(value.toString());
        }
        return value;
      });

      columnValue.values = newValue;
    });
  }
}
