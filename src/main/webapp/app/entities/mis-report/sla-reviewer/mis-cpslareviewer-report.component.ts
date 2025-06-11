import { Component, OnInit } from '@angular/core';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'jhi-mis-cpslareviewer-report',
  templateUrl: './mis-cpslareviewer-report.component.html',
  styleUrls: ['../credit-proposal/mis-report-credit-proposal.css', '../mis-report.css'],
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
export class MisCpslaReviewerReportComponent extends AbstractExcelMISReport implements OnInit {
  public lovStatus = [];
  public startDate: any;
  public endDate: any;
  public allSelected = false;
  public MISReportSLA: FormGroup;

  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    super(misReportService);

    this.MISReportSLA = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      status: new FormControl(''),
    });

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
      { header: 'Branchs', key: 'branchs' },
      { header: 'Regional', key: 'regional' },
      { header: 'SME Head Name', key: 'headName' },
      { header: 'BM', key: 'bm' },
      { header: 'RM', key: 'rm' },
      { header: 'Debtor Name', key: 'debtorName' },
      { header: 'Loan Comm Approval', key: 'loanCommApproval' },
      { header: 'Line of Business', key: 'lineOfBusiness' },
      { header: 'Grading / SME Scorecard', key: 'gradingSME' },
      { header: 'Rating', key: 'rating' },
      { header: 'Status of Facility', key: 'statusOfFacility' },
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
      { header: 'Date Return to Reviewer', key: 'dateReturnToReviewer' },
      { header: 'Proposal check by Checker', key: 'proposalCheckByChecker' },
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
  }

  public toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.MISReportSLA.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.MISReportSLA.get('status')?.setValue('');
    }
  }

  public generateMISReportSLA() {
    this.misReportService.setLoading(true);

    const params = {
      startDate: this.MISReportSLA.get('startDate')?.value,
      endDate: this.MISReportSLA.get('endDate')?.value,
      status: this._convertStatusToString(this.MISReportSLA.get('status')?.value),
      type: 'STATELOG',
    };

    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_SLA_Reviewer'),
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
    // this._setAutoHeightForAllRows();
    this.downloadFile(fileName);
    this._resetData();
  }

  protected processData(data: any[]): void {
    data.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal, index): void {
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
        regional: proposal.regionalParentRM || '',
        headName: proposal.headName || '',
        bm: proposal.bm || '',
        rm: proposal.rmFirstName && proposal.rmLastName ? proposal.rmFirstName + ' ' + proposal.rmLastName : '',
        debtorName: proposal.debtorName || '',
        loanCommApproval: proposal.approvalLc || '',
        lineOfBusiness: proposal.lineOfBusiness || '',
        gradingSME: this.getGrading(proposal) === 'Grading' ? proposal.creditGrading : '',
        rating: this.getGrading(proposal) === 'Rating' ? proposal.creditGrading : '',
        statusOfFacility: product.pengajuan || '',
        takeOverYN: proposal.previousBank ? 'Y' : 'N',
        previousBank: proposal.previousBank || '',
        facility: product.facility || '',
        facilityTenor: product.tenorFasilitas || '',
        periodType: product.periodType || '',
        maturityDate: this.formatDate(product.maturityDate) || '',
        currency: product.currency || '',
        initialLimit: product.initialLimit || '',
        totalChangesEqToIDR: proposal.totalChangesEqToIDR || '',
        grandTotalPlafondDebtorOnlyIDR: proposal.totalPlafondDebtorOnlyIDR || '',
        grandTotalPlafondTotalExposureIDR: proposal.grandTotalPlafondEqToIDR || '',
        interestRate: product.currentRate || '',
        provisionFee: this.formatProvisionFee(product.provisionFee) || '',
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
        dateOfAssignmentAll: this.getFromDateBasedOnField(proposal, 'statusDescription', ['Assignment']) || '',
        dateReturnToBranch: this.getFromDateBasedOnField(proposal, 'statusDescription', ['Return to Credit Proposal (CR)'], 'Count') || '',
        proposalBackToCRO:
          this.getFromDateBasedOnField(proposal, 'fromStatusDescription', ['Return to Credit Proposal (CR)'], 'Count') || '',
        dateReturnToReviewer: '', // TBC
        proposalCheckByChecker: this.getFromDateBasedOnField(proposal, 'statusDescription', ['Checker']) || '',
        loanApprovalLoanCommDate:
          this.getFromDateBasedOnField(proposal, 'statusDescription', ['Loan Committee Approval', 'Loan Approval']) || '',
        generateDAR: this.getGenerateDAR(proposal),
        finalizedDAR: this.getFromDateBasedOnField(proposal, 'statusDescription', ['DAR Notif', 'DAR Checker']) || '',
        slaLength: this._getSlaLength(proposal),
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
      .map(t => this.formatDate(t.fromDate))
      .join(',\n');
  }

  private getFacility(proposal: any) {
    const { product } = proposal;

    // Return '' if there is no product data
    if (!product) {
      return '';
    }

    return product.map(p => p.facility).join(',\n');
  }

  private getTenorFacility(proposal: any) {
    const { product } = proposal;

    // Return '' if there is no product data
    if (!product) {
      return '';
    }

    return product.map(p => p.tenorFasilitas).join(',\n');
  }

  private getPeriodType(proposal: any) {
    const { product } = proposal;

    // Return '' if there is no product data
    if (!product) {
      return '';
    }

    return product.map(p => p.periodType).join(',\n');
  }

  private getCurrency(proposal: any) {
    const { product } = proposal;

    // Return '' if there is no product data
    if (!product) {
      return '';
    }

    return product.map(p => p.currency).join(',\n');
  }

  private getInitialLimit(proposal: any) {
    const { product } = proposal;

    // Return '' if there is no product data
    if (!product) {
      return '';
    }

    return product.map(p => p.initialLimit).join(',\n');
  }

  private getProduct(proposal: any) {
    const { product } = proposal;

    if (!product) {
      return {
        facility: '',
        tenorFacility: '',
        periodType: '',
        currency: '',
        initialLimit: '',
        currentRate: '',
        provisionFee: '',
        provisionFeeType: '',
        adminFee: '',
        adminFeeType: '',
      };
    }

    return {
      facility: product.map(p => p.facility).join(',\n'),
      tenorFacility: product.map(p => p.tenorFasilitas).join(',\n'),
      periodType: product.map(p => p.periodType).join(',\n'),
      currency: product.map(p => p.currency).join(',\n'),
      initialLimit: product.map(p => p.initialLimit).join(',\n'),
      currentRate: product.map(p => p.currentRate).join(',\n'),
      provisionFee: product.map(p => Number(p.provisionFee).toFixed(2)).join(',\n'),
      provisionFeeType: product.map(p => p.provisionFeeType).join(',\n'),
      adminFee: product.map(p => p.adminFee).join(',\n'),
      adminFeeType: product.map(p => p.adminFeeType).join(',\n'),
    };
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
      return 'NO';
    }

    return 'YES';
  }

  private getGrading(proposal: any) {
    const grading = proposal.creditGrading ? proposal.creditGrading.charAt(0) : '';

    if (grading === grading.toUpperCase()) {
      return 'Rating';
    }

    return 'Grading';
  }

  private formatReviewer(reviewerName: string): string {
    if (!reviewerName) {
      return '';
    }

    return reviewerName.replace(/ null/g, '');
  }

  private formatProvisionFee(provisionFee: string): string {
    if (!provisionFee) {
      return '';
    }

    const data = provisionFee.split('.')[0];

    return Number(data).toFixed(2);
  }

  private getDateOfAssignment(proposal: any): string {
    const { timeLineCreditProposal: timelines } = proposal;

    // Return '' if there is no timeline data
    if (!timelines) {
      return '';
    }

    const assignment = timelines.find(t => t.statusDescription === 'Assignment');
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

      return filteredTimelines.map(t => this.formatDate(t.fromDate)).join(',\n');
    }

    // Return the count of the filtered timelines' fromDate
    return filteredTimelines.length.toString();
  }

  protected getGenerateDAR(proposal: any): string {
    const documentGenerate = proposal.documentGenerate;

    if (!documentGenerate) {
      return '';
    }

    return this.formatDate(documentGenerate.generateDate);
  }
}
