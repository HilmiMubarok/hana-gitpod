import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'jhi-mis-credit-proposal',
  templateUrl: './mis-cp.component.html',
  styleUrls: ['./mis-cp.css', '../mis-report.css'],
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

      .skeleton {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
      }

      .mat-spinner {
        margin: auto;
      }

      .mat-cell div {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        height: 16px;
        width: 80%;
        animation: pulse 1.5s infinite;
      }

      @keyframes pulse {
        0% {
          background-color: rgba(0, 0, 0, 0.1);
        }
        50% {
          background-color: rgba(0, 0, 0, 0.2);
        }
        100% {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
    `,
  ],
})
export class MisCPComponent {
  public lovStatus = [];
  listOfValue = [];
  misCp: FormGroup;
  allSelected = false;

  changeOption(event) {
    console.log('test', event.value);
  }
  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    this.misCp = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
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
    this.getStatus();
  }

  public previousState(): void {
    window.history.back();
  }
  getStatus() {
    this.misReportService.getStatuses('MIS_CREDIT_PROPOSAL').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }
  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.misCp.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.misCp.get('status')?.setValue('');
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

  private _convertLov(lov: Array<string> | null | string): string {
    if (lov === null) {
      return null;
    }

    if (typeof lov === 'string') {
      return '';
    }

    if (lov.length === 0) {
      return '';
    }
    return lov.join(',');
  }

  private _convertStatusToString(status: Array<string>): string {
    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  generateMISCP() {
    this.misReportService.setLoading(true);
    const params = {
      startDate: this.misCp.get('date1')?.value,
      endDate: this.misCp.get('date2')?.value,
      status: this._convertStatusToString(this.misCp.get('status')?.value),
      type: null,
    };

    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_CREDIT_PROPOSAL'),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate MIS Report' });
        this.misReportService.setLoading(false);
      },
    });
  }

  private _processGenerate(data, fileName) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    this._setUpColumns(worksheet);

    // if data is empty, generate an empty file
    if (!data || data.length === 0) {
      this._applyStyles(worksheet);
      this._downloadFile(workbook, fileName);
      return;
    }
    // Add data to worksheet
    data.forEach((proposal, index) => {
      this._addProposalData(worksheet, proposal, index);
    });

    this._applyStyles(worksheet);
    this._downloadFile(workbook, fileName);
  }

  private _setUpColumns(worksheet: ExcelJS.Worksheet): void {
    worksheet.columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Segment', key: 'segment', width: 10 },
      { header: 'Proposal Type', key: 'proposalType', width: 30 },
      { header: 'Proposal Date', key: 'proposalDate', width: 15 },
      { header: 'Proposal Number', key: 'proposalNumber', width: 30 },
      { header: 'Program', key: 'program', width: 15 },
      { header: 'Branchs', key: 'branchs', width: 30 },
      { header: 'Regional', key: 'regional', width: 15 },
      { header: 'SME Head Name', key: 'headName', width: 15 },
      { header: 'BM', key: 'bm', width: 25 },
      { header: 'RM', key: 'rm', width: 40 },
      { header: 'Debtor Name', key: 'debtorName', width: 30 },
      { header: 'Loan Comm Approval', key: 'loanCommApproval', width: 19 },
      { header: 'Line Of Business', key: 'lineOfBusiness', width: 30 },
      { header: 'Proposed', key: 'proposed', width: 30 },
      { header: 'Facility', key: 'facility', width: 15 },
      { header: 'Facility Tenor', key: 'facilityTenor', width: 15 },
      { header: 'Period Type', key: 'periodType', width: 15 },
      { header: 'Maturity Date', key: 'maturityDate', width: 15 },
      { header: 'Currency', key: 'currency', width: 15 },
      { header: 'Initial Limit', key: 'initialLimit', width: 15 },
      { header: 'Total Changes Eq To IDR', key: 'totalChangesEqToIDR', width: 30 },
      { header: 'Grand Total Plafond DEBTOR ONLY (IDR)', key: 'grandTotalPlafondDebtorIDR', width: 30 },
      { header: 'Grand Total Plafond TOTAL EXPOSURE (IDR)', key: 'grandTotalPlafondExposureIDR', width: 30 },
      { header: 'Interest Rate (%)', key: 'interestRate', width: 15 },
      { header: 'Provision Fee', key: 'provisionFee', width: 15 },
      { header: 'Provision Type', key: 'provisionType', width: 15 },
      { header: 'Admin Fee', key: 'adminFee', width: 15 },
      { header: 'Admin Type', key: 'adminType', width: 15 },
      { header: 'Collateral (INCLUDE CROS COLL OTHER CIF)', key: 'collateral', width: 35 },
      { header: 'MV (internal) (In Currency)', key: 'mv', width: 25 },
      { header: 'MV (internal) (Equivalen to IDR)', key: 'mvIDR', width: 30 },
      { header: 'LV Internal', key: 'lvInternal', width: 15 },
      { header: 'Group Name', key: 'groupName', width: 15 },
      { header: 'DEBITUR GROUP', key: 'debiturGroup', width: 15 },
      { header: 'Reviewer', key: 'reviewer', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Date of Status', key: 'dateOfStatus', width: 30 },
      { header: 'Memo', key: 'memo', width: 30 },
    ];
  }

  _getDebiturGroup(proposal: any): string {
    const debiturNames = proposal.businessGroup?.customersGrup?.map((customer: any) => customer.customerName).join(', ') || '';
    return debiturNames;
  }

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal, index): void {
    const productCount = proposal.product?.length || 1;
    const collateralCount = proposal.collateral?.length || 1;
    const rowCount = Math.max(productCount, collateralCount);
    const baseRowIndex = worksheet.lastRow ? worksheet.lastRow.number + 1 : 1;

    const collateralCodes = proposal.collateral?.map(col => col.collateralCode).join(',\n') || '';

    for (let i = 0; i < rowCount; i++) {
      const product = proposal.product[i] || {};

      const row = worksheet.addRow({
        no: i === 0 ? index + 1 : '',
        segment: proposal.segment || '',
        proposalType: proposal.proposalType || '',
        proposalDate: proposal.proposalDate || '',
        proposalNumber: proposal.proposalNumber || '',
        program: proposal.program || '',
        branchs: proposal.bookingBranchName || '',
        regional: proposal.regionalParentRM || '',
        headName: proposal.headName || '',
        bm: proposal.bm || '',
        rm: `${proposal.rmFirstName || ''} ${proposal.rmLastName || ''}`.trim(),
        debtorName: proposal.debtorName || '',
        loanCommApproval: proposal.approvalLc ? proposal.approvalLc.split(' ')[0] || '' : '',
        lineOfBusiness: proposal.lineOfBusiness || '',
        proposed: product.pengajuan || '',
        facility: product.facility || '',
        facilityTenor: product.tenorFasilitas || '',
        periodType: product.periodType || '',
        maturityDate: product.maturityDate || '',
        currency: product.currency || '',
        initialLimit: product.initialLimit || '',
        totalChangesEqToIDR: i === 0 ? proposal.totalChangesEqToIDR || '' : '',
        grandTotalPlafondDebtorIDR: i === 0 ? proposal.totalPlafondDebtorOnlyIDR || '' : '',
        grandTotalPlafondExposureIDR: i === 0 ? proposal.grandTotalPlafondEqToIDR || '' : '',
        interestRate: product.currentRate || '',
        provisionFee: product.provisionFee || '',
        provisionType: product.provisionFeeType || '',
        adminFee: product.adminFee || '',
        adminType: product.adminFeeType || '',
        collateral: collateralCodes,
        mv: i === 0 ? proposal.totalMVInternal || '' : '',
        mvIDR: i === 0 ? proposal.totalMVInternalEqToIDR || '' : '',
        lvInternal: i === 0 ? proposal.totalLVInternal || '' : '',
        groupName: proposal.businessGroup?.groupCompanyName || '',
        debiturGroup: this._getDebiturGroup(proposal),
        reviewer: proposal.dataAssignToCROName || '',
        status: proposal.status || '',
        dateOfStatus: proposal.statusDate || '',
        memo: proposal.approvalStatus || '',
      });

      row.getCell('collateral').alignment = { wrapText: true };
    }

    if (rowCount > 1) {
      this._mergeCells(worksheet, baseRowIndex, rowCount, [
        'no',
        'totalChangesEqToIDR',
        'grandTotalPlafondDebtorIDR',
        'grandTotalPlafondExposureIDR',
        'collateral',
        'mv',
        'mvIDR',
        'lvInternal',
        'groupName',
        'debiturGroup',
        'reviewer',
        'status',
        'dateOfStatus',
        'memo',
      ]);
    }
  }

  private _mergeCells(worksheet: ExcelJS.Worksheet, startRow: number, rowCount: number, columns: string[]): void {
    columns.forEach(column => {
      worksheet.mergeCells(startRow, worksheet.getColumnKey(column).number, startRow + rowCount - 1, worksheet.getColumnKey(column).number);
    });
  }

  private _applyStyles(worksheet: ExcelJS.Worksheet): void {
    worksheet.columns.forEach((column, index) => {
      worksheet.getCell(1, index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFA500' },
      };
    });

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber === 1) {
        worksheet.getRow(rowNumber).font = { bold: true };
        worksheet.getRow(rowNumber).alignment = { vertical: 'middle', horizontal: 'center' };
      }

      row.eachCell({ includeEmpty: true }, cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'top', horizontal: 'center' };
      });
    });
    worksheet.getColumn('collateral').alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('mv').alignment = { wrapText: true, vertical: 'middle', horizontal: 'right' };
    worksheet.getColumn('mvIDR').alignment = { wrapText: true, vertical: 'middle', horizontal: 'right' };
    worksheet.getColumn('lvInternal').alignment = { wrapText: true, vertical: 'middle', horizontal: 'right' };
    worksheet.getColumn('groupName').alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
    worksheet.getColumn('debiturGroup').alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
    worksheet.getColumn('reviewer').alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
    worksheet.getColumn('status').alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
    worksheet.getColumn('dateOfStatus').alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
    worksheet.getColumn('memo').alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
  }

  private _downloadFile(workbook: ExcelJS.Workbook, fileName: string): void {
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const date = new Date();
      const outputName = `${fileName}_${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`;

      saveAs(blob, outputName);
      this.misReportService.setLoading(false);
    });
  }
}
