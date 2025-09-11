import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { AbstractExcelMISReport } from '../abstract-excel-report';

@Component({
  selector: 'jhi-mis-credit-proposal',
  templateUrl: './mis-cp.component.html',
  styleUrls: ['../disabled-style.scss'],
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
export class MisCPComponent extends AbstractExcelMISReport implements OnInit {
  public lovStatus = [];
  public lovApprovalLc = [];
  public lovDebtorStatus = [];
  public lovstatusMemo = ['Yes', 'No'];
  public lovProposalType;
  public menu = 'dateFromStatus';
  public form: FormGroup;
  showDateRange = false;
  listOfValue = [];
  misCp: FormGroup;
  allSelected = false;
  allSelectedApprovalLc = false;
  allSelectedProposalType = false;
  allSelectedDebtorStatus = false;
  dateTypes: string[] = ['Proposal Date', 'Date From Status'];

  @ViewChild('formContainer', { static: true }) formContainer: ElementRef;

  changeOption(event) {
    console.log('test', event.value);
  }
  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    super(misReportService);

    this._initializeForm();

    this.misCp = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
      approvalLC: new FormControl(''),
      proposalType: new FormControl(''),
      debtorStatus: new FormControl(''),
      statusMemo: new FormControl(''),
    });
    this.misCp.get('date1')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.misCp.get('date1').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.misCp.get('date2')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.misCp.get('date2').setValue(formattedDate, { emitEvent: false });
      }
    });
  }

  toggleSelectAllApprovalLc(): void {
    this.allSelectedApprovalLc = !this.allSelectedApprovalLc;
    if (this.allSelectedApprovalLc) {
      this.misCp.get('approvalLC')?.setValue([...this.lovApprovalLc.map(status => status.statusId)]);
    } else {
      this.misCp.get('approvalLC')?.setValue('');
    }
  }

  toggleSelectAllProposalType(): void {
    this.allSelectedProposalType = !this.allSelectedProposalType;
    if (this.allSelectedProposalType) {
      this.misCp.get('proposalType')?.setValue([...this.lovApprovalLc.map(status => status.statusId)]);
    } else {
      this.misCp.get('proposalType')?.setValue('');
    }
  }

  toggleSelectAllDebtorStatus(): void {
    this.allSelectedDebtorStatus = !this.allSelectedDebtorStatus;
    if (this.allSelectedDebtorStatus) {
      this.misCp.get('debtorStatus')?.setValue([...this.lovApprovalLc.map(status => status.statusId)]);
    } else {
      this.misCp.get('debtorStatus')?.setValue('');
    }
  }

  public previousState(): void {
    window.history.back();
  }

  onMenuChanged(): void {
    this._resetForms();
  }

  private _resetForms(): void {
    if (this.form) {
      this.form.reset();
      this.allSelected = false;
      this.allSelectedProposalType = false;
      this.allSelectedApprovalLc = false;
      this.allSelectedDebtorStatus = false;
      this.allSelectedProposalType = false;
    }
  }

  ngOnInit(): void {
    this.getStatusLOV('MIS_CREDIT_PROPOSAL').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });

    this.misReportService.getApprovalLc('LOS_REL').subscribe({
      next: res => {
        this.lovApprovalLc = res;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get Approval Lc',
        });
      },
    });

    this._getProposalTypes();
    this.misCp.get('type')?.setValue('Proposal Date');
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.misCp.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.misCp.get('status')?.setValue('');
    }
  }

  private _getProposalTypes(): void {
    this.misReportService.getProposalTypes().subscribe({
      next: res => {
        this.lovProposalType = res.map(item => ({
          code: item.value,
          description: item.statusDescription,
        }));
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Proposal Types' });
      },
    });
  }

  allSelectedStatusMemo = false;
  public toggleSelectStatusMemo(): void {
    this.allSelectedStatusMemo = !this.allSelectedStatusMemo;
    if (this.allSelectedStatusMemo) {
      this.misCp.get('statusMemo')?.setValue([...this.lovstatusMemo]);
    } else {
      this.misCp.get('statusMemo')?.setValue(null);
    }
  }

  public searchResult = null;
  displayedColumns: string[] = ['proposalNumber', 'cif', 'debtorName', 'customerType', 'proposalDate'];

  convertStatusToString(status: Array<string>): string {
    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  dateRangeHasValue(): boolean {
    return this.misCp.get('date1')?.value && this.misCp.get('date2')?.value;
  }

  clearDateRange(): void {
    this.misCp.get('date1')?.reset();
    this.misCp.get('date2')?.reset();
  }

  private _initializeForm() {
    this.form = new FormGroup({
      date1: new FormControl(null),
      date2: new FormControl(null),
      status: new FormControl(null),
      approvalLC: new FormControl(null),
      debtorStatus: new FormControl(null),
      statusMemo: new FormControl(null),
      proposalType: new FormControl(null),
    });
  }

  public generateMISCP(): void {
    this.rowCounter = 0;
    if (this.menu === 'dateFromStatus') {
      if ((!this.misCp.get('date1')?.value || !this.misCp.get('date2')?.value) && !this.misCp.get('status')?.value) {
        this.messageService.add({
          severity: 'error',
          summary: 'Warning',
          detail: 'Please, Select Parameter.',
        });
        return;
      }

      if (!this.misCp.get('date1')?.value || !this.misCp.get('date2')?.value) {
        this.messageService.add({
          severity: 'error',
          summary: 'Warning',
          detail: 'Please, Select Date Range.',
        });
        return;
      }

      if (!this.misCp.get('status')?.value) {
        this.messageService.add({
          severity: 'error',
          summary: 'Warning',
          detail: 'Please, Select Status.',
        });
        return;
      }
    } else if (this.menu === 'proposalDate') {
      if (!this.misCp.get('status')?.value) {
        this.messageService.add({
          severity: 'error',
          summary: 'Warning',
          detail: 'Please, Select Status.',
        });
        return;
      }
    }

    this.misReportService.setLoading(true);

    let params;

    if (this.menu === 'dateFromStatus') {
      params = {
        startDate: this.misCp.get('date1')?.value,
        endDate: this.misCp.get('date2')?.value,
        status: this._convertStatusToString(this.misCp.get('status')?.value),
        type: 'STATELOG',
      };
    } else {
      params = {
        startDate: null,
        endDate: null,
        status: this._convertStatusToString(this.misCp.get('status')?.value),
        type: null,
      };
    }

    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_CREDIT_PROPOSAL'),
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
      this.applyStyles('ffffe49c');
      this.downloadFile(fileName);
      return;
    }

    // Add data to worksheet
    this.processData(data);

    this._applyStyles(worksheet);
    this._setAutoWidthForAllColumns();
    this._setAutoHeightForAllRows();
    this.downloadFile(fileName);
    this._resetData();
  }

  get columns(): any[] {
    return [
      { header: 'No.', key: 'no' },
      { header: 'Date of Approval to LA', key: 'dateOfApprovalToLA' },
      { header: 'Date of Assignment', key: 'dateOfAssignment' },
      { header: 'Segment', key: 'segment' },
      { header: 'Proposal Type', key: 'proposalType' },
      { header: 'Proposal Date', key: 'proposalDate' },
      { header: 'Proposal Number', key: 'proposalNumber' },
      { header: 'DAR Date of Proposal', key: 'darDateOfProposal' },
      { header: 'DAR Number of Proposal', key: 'darNumberOfProposal' },
      { header: 'Appeal Date', key: 'appealDate' },
      { header: 'Appeal Number', key: 'appealNumber' },
      { header: 'DAR Date of Appeal', key: 'darDateOfAppeal' },
      { header: 'DAR Number of Appeal', key: 'darNumberOfAppeal' },
      { header: 'Program', key: 'program' },
      { header: 'Branchs', key: 'branchs' },
      { header: 'Regional', key: 'regional' },
      { header: 'SME Head', key: 'headName' },
      { header: 'BM', key: 'bm' },
      { header: 'Dep Head', key: 'depHead' },
      { header: 'Div Head', key: 'divHead' },
      { header: 'RM', key: 'rm' },
      { header: 'Debtor Name', key: 'debtorName' },
      { header: 'Loan Comm Approval', key: 'loanCommApproval' },
      { header: 'Line Of Business', key: 'lineOfBusiness' },
      { header: 'Scorecard', key: 'scorecard' },
      { header: 'Credit Rating', key: 'creditRating' },
      { header: 'Application Type', key: 'applicationType' },
      { header: 'Take Over (Y/N)', key: 'takeOverYN' },
      { header: 'Previous Bank', key: 'previousBank' },
      { header: 'Facility Type', key: 'facilityType' },
      { header: 'Facility Tenor', key: 'facilityTenor' },
      { header: 'Period Type', key: 'periodType' },
      { header: 'Maturity Date', key: 'maturityDate' },
      { header: 'Currency', key: 'currency' },
      { header: 'Initial Limit', key: 'initialLimit' },
      { header: 'Total Changes Eq To IDR', key: 'totalChangesEqToIDR' },
      { header: 'Grand Total Plafond DEBTOR ONLY (IDR)', key: 'grandTotalPlafondDebtorIDR' },
      { header: 'Grand Total Plafond TOTAL EXPOSURE (IDR)', key: 'grandTotalPlafondExposureIDR' },
      { header: 'Interest Rate (%)', key: 'interestRate' },
      { header: 'Provision Fee', key: 'provisionFee' },
      { header: 'Provision Type', key: 'provisionType' },
      { header: 'Admin Fee', key: 'adminFee' },
      { header: 'Admin Type', key: 'adminType' },
      { header: 'Collateral (INCLUDE CROS COLL OTHER CIF)', key: 'collateral' },
      { header: 'Cross Collateral (Other CIF)', key: 'crossCollateral' },
      { header: `Debtor's Name of Cross Collateral`, key: 'debtorNameCrossCollateral' },
      { header: 'Appraisal No', key: 'appraisalNo' },
      { header: 'Appraisal Date', key: 'appraisalDate' },
      { header: 'MV (internal) (In Currency)', key: 'mv' },
      { header: 'MV (internal) (Equivalen to IDR)', key: 'mvIDR' },
      { header: 'Total MV Internal (Eq to IDR)', key: 'totalMVInternalEqToIDR' },
      { header: 'LV Internal (In Currency)', key: 'lvInternalInCurrency' },
      { header: 'LV Internal (Eq to IDR)', key: 'lvInternalEqToIDR' },
      { header: 'Total LV Internal (Eq to IDR)', key: 'totalLVInternalEqToIDR' },
      { header: 'Group Name', key: 'groupName' },
      { header: 'DEBITUR GROUP', key: 'debiturGroup' },
      { header: 'Reviewer', key: 'reviewer' },
      { header: 'Proposal Status', key: 'proposalStatus' },
      { header: 'Date of Status', key: 'dateOfStatus' },
      { header: 'Memo', key: 'memo' },
    ];
  }

  protected processData(data: any[]): void {
    data.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }

  private getDebtorNameCrossCollateral(proposal: any): string {
    if (!proposal?.collateral || !Array.isArray(proposal.collateral)) {
      return '';
    }

    const debtorNames: string[] = [];

    proposal.collateral.forEach(col => {
      if (col.crossCollaterals && Array.isArray(col.crossCollaterals)) {
        col.crossCollaterals.forEach((cc: any) => {
          if (cc.debtorName && !debtorNames.includes(cc.debtorName)) {
            debtorNames.push(cc.debtorName);
          }
        });
      }
    });

    return debtorNames.join(',\n');
  }

  private getAppraisalNumbers(proposal: any): string {
    if (!proposal?.collateral || !Array.isArray(proposal.collateral)) {
      return '';
    }

    const appraisalNumbers: string[] = [];

    for (const col of proposal.collateral) {
      if (!col.appraisal || !Array.isArray(col.appraisal)) {
        continue;
      }

      for (const appraisal of col.appraisal) {
        if (appraisal.appraisalType === 'Internal' && appraisal.appraisalNumber) {
          appraisalNumbers.push(appraisal.appraisalNumber);
        }
      }
    }

    return appraisalNumbers.join(',\n');
  }

  private getAppraisalDates(proposal: any): string {
    if (!proposal?.collateral || !Array.isArray(proposal.collateral)) {
      return '';
    }

    const dates: string[] = [];

    for (const col of proposal.collateral) {
      if (!col.appraisal || !Array.isArray(col.appraisal)) {
        continue;
      }

      for (const appraisal of col.appraisal) {
        if (appraisal.appraisalType !== 'Internal') {
          continue;
        }

        if (!appraisal.timeLine || !Array.isArray(appraisal.timeLine)) {
          continue;
        }

        for (const timeline of appraisal.timeLine) {
          if (timeline.statusDescription === 'Visited' && timeline.createdDate) {
            dates.push(timeline.createdDate);
          }
        }
      }
    }

    return dates.join(',\n');
  }

  private _formatTwoDecimals(value: any): string {
    const num = parseFloat(value);
    if (isNaN(num)) {
      return '';
    }
    return num.toFixed(2);
  }

  private rowCounter = 0;

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal, index): void {
    const repeatCount = proposal.product?.length || 1;
    const baseRowIndex = worksheet.lastRow ? worksheet.lastRow.number + 1 : 1;

    // 🔹 Tambahin logic filter Approval LC
    const selectedApprovalLc = this.misCp.get('approvalLC')?.value;
    const approvalLcValue = proposal.approvalLc || '';

    if (selectedApprovalLc && selectedApprovalLc.length > 0) {
      const normalizedSelected = selectedApprovalLc.map((val: string) => val.replace(/_/g, ' ').toUpperCase());
      const approvalLcUpper = (approvalLcValue || '').toUpperCase();
      if (!normalizedSelected.includes(approvalLcUpper)) {
        return;
      }
    }

    const selectedProposalType = this.misCp.get('proposalType')?.value;
    const proposalTypeValue = proposal.proposalType || '';

    if (selectedProposalType && selectedProposalType.length > 0) {
      const normalizedSelected = selectedProposalType.map((val: string) => val.toUpperCase());
      const proposalTypeUpper = (proposalTypeValue || '').toUpperCase();
      if (!normalizedSelected.includes(proposalTypeUpper)) {
        return;
      }
    }

    // 🔹 Filter Status Memo
    const selectedStatusMemo = this.misCp.get('statusMemo')?.value;
    const memoValue = (this.getMemo(proposal) || '').toString();

    if (selectedStatusMemo && selectedStatusMemo.length > 0) {
      const normalizedSelected = selectedStatusMemo.map((val: string) => val.toUpperCase());
      const memoUpper = memoValue.toUpperCase();
      if (!normalizedSelected.includes(memoUpper)) {
        return;
      }
    }

    for (let i = 0; i < repeatCount; i++) {
      const product = proposal.product?.[i] || {};

      const row = worksheet.addRow({
        no: i === 0 ? ++this.rowCounter : '',
        dateOfApprovalToLA: this.getDateOfApprovalToLA(proposal),
        dateOfAssignment: this.getDateOfAssignment(proposal),
        segment: proposal.segmentParentRM || '',
        proposalType: proposal.proposalType || '',
        proposalDate: this.formatDateMISCP(proposal.proposalDate) || '',
        proposalNumber: proposal.proposalNumber || '',
        darDateOfProposal: this.getDarDateOfProposal(proposal) || '',
        darNumberOfProposal: proposal.darDocNo || '',
        appealDate: this.getAppealDate(proposal),
        appealNumber: this.getAppealNumber(proposal),
        darDateOfAppeal: this.getDarDateOfAppeal(proposal),
        darNumberOfAppeal: this.getDarNumberOfAppeal(proposal),
        program: proposal.program || '',
        branchs: proposal.bookingBranchName || '',
        regional: proposal.regionalParentRM || '',
        headName: proposal.headName || '',
        bm: proposal.bm || '',
        depHead: proposal.deptHeadName || '',
        divHead: proposal.dhName || '',
        rm: `${proposal.rmFirstName || ''} ${proposal.rmLastName || ''}`.trim(),
        debtorName: proposal.debtorName || '',
        loanCommApproval: approvalLcValue || '',
        lineOfBusiness: proposal.lineOfBusiness || '',
        scorecard: this.getScoreCardAndCreditRating(proposal, 'scorecard'),
        creditRating: this.getScoreCardAndCreditRating(proposal, 'creditRating'),
        applicationType: product.pengajuan || '',
        takeOverYN: this.getTakeOverYN(proposal),
        previousBank: this.getPreviousBank(proposal),
        facilityType: product.facilityType || '',
        facilityTenor: product.tenorFasilitas || '',
        periodType: product.periodType || '',
        maturityDate: product.maturityDate === 'null' ? '' : product.maturityDate || '',
        currency: product.currency || '',
        initialLimit: product.initialLimit || '',
        totalChangesEqToIDR: i === 0 ? proposal.totalChangesEqToIDR || '' : '',
        grandTotalPlafondDebtorIDR: i === 0 ? proposal.totalPlafondDebtorOnlyIDR || '' : '',
        grandTotalPlafondExposureIDR: i === 0 ? proposal.grandTotalPlafondEqToIDR || '' : '',
        interestRate: this._formatTwoDecimals(product.currentRate),
        provisionFee: this._formatTwoDecimals(product.provisionFee),
        provisionType: product.provisionFeeType || '',
        adminFee: product.adminFee || '',
        adminType: product.adminFeeType || '',
        collateral: proposal.collateral?.map(col => col.collateralCode).join(',\n') || '',
        crossCollateral: proposal.collateral?.map(col => col.paripasuStatus).join(',\n') || '',
        debtorNameCrossCollateral: this.getDebtorNameCrossCollateral(proposal),
        appraisalNo: this.getAppraisalNumbers(proposal),
        appraisalDate: this.getAppraisalDates(proposal),
        mv: proposal.collateral?.map(col => col.collateralProperty?.marketValueOriginal || '').join(',\n') || '',
        mvIDR: proposal.collateral?.map(col => col.collateralProperty?.marketValueInternal || '').join(',\n') || '',
        totalMVInternalEqToIDR: proposal.totalMVInternal || '',
        lvInternalInCurrency: '',
        lvInternalEqToIDR: proposal.collateral?.map(col => col.collateralProperty?.liquidationValueInternal || '').join(',\n') || '',
        totalLVInternalEqToIDR: proposal.totalLVInternal || '',
        groupName: proposal.businessGroup?.groupCompanyName || '',
        debiturGroup: proposal.businessGroup?.customersGrup?.map((customer: any) => customer.customerName).join(',\n') || '',
        reviewer: proposal.dataAssignToCROName || '',
        status: proposal.status || '',
        dateOfStatus: this.formatDateMISCP(proposal.lastModifiedDate) || '',
        memo: this.getMemo(proposal),
      });

      const maxContentLength = Math.max(
        row.getCell('collateral').value?.toString().split('\n').length || 1,
        row.getCell('mv').value?.toString().split('\n').length || 1,
        row.getCell('mvIDR').value?.toString().split('\n').length || 1,
        row.getCell('lvInternalInCurrency').value?.toString().split('\n').length || 1,
        row.getCell('debiturGroup').value?.toString().split('\n').length || 1
      );
      row.height = maxContentLength * 15;
    }

    if (repeatCount > 1) {
      this._mergeCells(worksheet, baseRowIndex, repeatCount, [
        'no',
        'totalChangesEqToIDR',
        'grandTotalPlafondDebtorIDR',
        'grandTotalPlafondExposureIDR',
        'collateral',
        'mv',
        'mvIDR',
        'lvInternalInCurrency',
        'groupName',
        'debiturGroup',
        'reviewer',
        'proposalStatus',
        'dateOfStatus',
        'memo',
        'scorecard',
        'creditRating',
        'depHead',
        'darDateOfAppeal',
        'divHead',
        'appealDate',
        'dateOfApprovalToLA',
        'dateOfAssignment',
        'segment',
        'program',
        'proposalType',
        'proposalDate',
        'proposalNumber',
        'darDateOfProposal',
        'darNumberOfProposal',
        'branchs',
        'regional',
        'headName',
        'bm',
        'rm',
        'debtorName',
        'appealNumber',
        'darNumberOfAppeal',
        'loanCommApproval',
        'lineOfBusiness',
        'takeOverYN',
        'previousBank',
        'crossCollateral',
        'debtorNameCrossCollateral',
        'appraisalNo',
        'appraisalDate',
        'totalMVInternalEqToIDR',
        'totalLVInternalEqToIDR',
      ]);
    }
  }

  private _mergeCells(worksheet: ExcelJS.Worksheet, startRow: number, rowCount: number, columns: string[]): void {
    columns.forEach(column => {
      worksheet.mergeCells(startRow, worksheet.getColumnKey(column).number, startRow + rowCount - 1, worksheet.getColumnKey(column).number);
    });
  }

  private _applyStyles(worksheet: ExcelJS.Worksheet): void {
    super.applyStyles('FFD3D3D3');
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

  private formatDateMISCP(dateStr: string): string {
    if (!dateStr || dateStr === 'null' || dateStr === '') {
      return '';
    }
    return (
      this.formatDateID(dateStr).getDay() +
      '-' +
      this.formatDateID(dateStr).getMonth().substring(0, 3) +
      '-' +
      this.formatDateID(dateStr).getYear()
    );
  }

  private getDateOfApprovalToLA(proposal: any): string {
    const timeline = proposal.timeLineCreditProposal;
    if (!timeline) {
      return '';
    }
    const approvalToLA = timeline
      .filter((item: any) => item.statusDescription === 'Approve To Loan Analysis')
      .map((item: any) => this.formatDateMISCP(item.createdDate))
      .join(',\n');
    return approvalToLA || '';
  }

  private getDateOfAssignment(proposal: any): string {
    const timeline = proposal.timeLineCreditProposal.sort((a: any, b: any) => b.id - a.id);
    if (!timeline) {
      return '';
    }
    const assignment = timeline.find((item: any) => item.statusDescription === 'Assignment');
    if (!assignment) {
      return '';
    }
    return this.formatDateMISCP(assignment.createdDate);
  }

  private getDarDateOfProposal(proposal: any): string {
    const timeline = proposal.timeLineCreditProposal.sort((a: any, b: any) => b.id - a.id);
    if (!timeline) {
      return '';
    }

    const darDateOfProposal = timeline.find(
      (item: any) => item.statusDescription === 'DAR Checker' || item.statusDescription === 'DAR Notif'
    );
    if (!darDateOfProposal) {
      return '';
    }
    return this.formatDateMISCP(darDateOfProposal.createdDate);
  }

  private getAppealDate(proposal: any): string {
    const timeline = proposal.timeLineCreditProposal;
    if (!timeline || !Array.isArray(timeline)) {
      return '';
    }

    const reversedTimeline = [...timeline].reverse();
    const darAppealIndex = reversedTimeline.findIndex((item: any) => item.statusDescription === 'DAR Appeal');

    if (darAppealIndex === -1) {
      return '';
    }

    const afterDarAppeal = reversedTimeline.slice(darAppealIndex + 1);

    const approveToLAList = afterDarAppeal
      .filter((item: any) => item.statusDescription === 'Approve To Loan Analysis')
      .map((item: any) => this.formatDateMISCP(item.createdDate));

    if (approveToLAList.length === 0) {
      return '';
    }

    return approveToLAList.join(',\n');
  }

  private getAppealNumber(proposal: any): string {
    const timeline = proposal.timeLineCreditProposal;
    if (!timeline || !Array.isArray(timeline)) {
      return '';
    }

    const hasDarAppeal = timeline.some((item: any) => item.statusDescription === 'DAR Appeal');
    const hasApproveToLA = timeline.some((item: any) => item.statusDescription === 'Approve To Loan Analysis');

    if (hasDarAppeal && hasApproveToLA) {
      return proposal.appealMemoDocNo || '';
    }

    return '';
  }

  private getDarDateOfAppeal(proposal: any): string {
    const timeline = proposal.timeLineCreditProposal.sort((a: any, b: any) => b.id - a.id);
    if (!timeline) {
      return '';
    }

    // if not Dar Appeal, return empty string
    const darAppeal = timeline.find((item: any) => item.statusDescription === 'DAR Appeal');
    if (!darAppeal) {
      return '';
    }

    const darDateOfProposal = timeline.find(
      (item: any) => item.statusDescription === 'DAR Checker' || item.statusDescription === 'DAR Notif'
    );
    if (!darDateOfProposal) {
      return '';
    }
    return this.formatDateMISCP(darDateOfProposal.createdDate);
  }

  private getDarNumberOfAppeal(proposal: any): string {
    if (proposal.appealMemoDocNo) {
      return proposal.darDocNo;
    }
    return '';
  }

  private getScoreCardAndCreditRating(proposal, type): string {
    const c = proposal.creditGrading || '';

    if (type === 'scorecard') {
      if (c.charAt(0) !== c.charAt(0).toUpperCase()) {
        return c;
      } else {
        return '';
      }
    } else {
      if (c.charAt(0) === c.charAt(0).toUpperCase()) {
        return c;
      } else {
        return '';
      }
    }
  }

  private getTakeOverYN(proposal): string {
    const previousBank = proposal.previousBank;

    if (previousBank || previousBank !== '' || previousBank !== null || previousBank !== 'null') {
      return 'N';
    }
    return 'Y';
  }

  private getPreviousBank(proposal): string {
    const previousBank = proposal.previousBank;
    if (previousBank || previousBank !== '' || previousBank !== null || previousBank !== 'null') {
      return previousBank;
    }
    return '';
  }

  private getMemo(proposal): string {
    const darAppealSequence = proposal.darAppealSeqNo;
    const appealMemoDocNo = proposal.appealMemoDocNo;

    if (
      !darAppealSequence ||
      darAppealSequence === 0 ||
      darAppealSequence === '0' ||
      !appealMemoDocNo ||
      appealMemoDocNo === '' ||
      appealMemoDocNo === 'null'
    ) {
      return 'No';
    }
    return 'Yes';
  }
}
