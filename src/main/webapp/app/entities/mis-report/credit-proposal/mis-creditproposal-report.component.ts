import { Component } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'jhi-mis-creditproposal-report',
  templateUrl: './mis-creditproposal-report.component.html',
  styleUrls: ['./mis-report-credit-proposal.css', '../mis-report.css'],
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
export class MisCreditProposalReportComponent {
  public lovStatus = [];
  data = '';
  date1: any;
  date2: any;
  listOfValue = [];
  allSelected = false;
  MISReportCP: FormGroup;

  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    this.MISReportCP = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
    });
    // Listen to changes on the date fields
    this.MISReportCP.get('date1')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportCP.get('date1')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.MISReportCP.get('date2')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportCP.get('date2')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.getStatus();
  }

  getStatus() {
    this.misReportService.getStatuses('MIS_CREDIT_PROPOSAL').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }

  generateMISReportCP() {
    this.misReportService.setLoading(true);

    const params = {
      startDate: this.MISReportCP.get('date1')?.value,
      endDate: this.MISReportCP.get('date2')?.value,
      status: this._convertStatusToString(this.MISReportCP.get('status')?.value),
    };

    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_Credit_Proposal'),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate MIS Report' });
        this.misReportService.setLoading(false);
      },
    });
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.MISReportCP.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.MISReportCP.get('status')?.setValue('');
    }
  }

  private _convertDate(date: string): string {
    if (!date) {
      return '';
    }
    return moment(date).format('YYYY-MM-DD');
  }

  private _convertStatusToString(status: Array<string>): string {
    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  private _processGenerate(data, fileName) {
    console.log('Data: ', data);

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
      { header: 'Proposal Number', key: 'proposalNumber', width: 30 },
      { header: 'Proposal Date', key: 'proposalDate', width: 15 },
      { header: 'Segment', key: 'segment', width: 10 },
      { header: 'Proposal Type', key: 'proposalType', width: 30 },
      { header: 'Customer Status', key: 'customerStatus', width: 15 },
      { header: 'Program', key: 'program', width: 25 },
      { header: 'UMKM', key: 'umkm', width: 20 },
      { header: 'Kategori Usaha Debitur', key: 'kategoriUsahaDebitur', width: 15 },
      { header: 'Refferal', key: 'refferal', width: 20 },
      { header: 'RM First Name', key: 'rmFirstName', width: 20 },
      { header: 'RM Last Name', key: 'rmLastName', width: 20 },
      { header: 'BM', key: 'bm', width: 30 },
      { header: 'Head Name', key: 'headName', width: 30 },
      { header: 'CIF', key: 'cif', width: 15 },
      { header: 'Debtor Name', key: 'debtorName', width: 30 },
      { header: 'ID Card Number', key: 'idCardNumber', width: 20 },
      { header: 'Date Of Birth', key: 'dateOfBirth', width: 12 },
      { header: 'Deed Of RCNT Number', key: 'deedOfRCNTNumber', width: 20 },
      { header: 'Deed of RCNT Date', key: 'deedOfRCNTDate', width: 17 },
      { header: 'Line of Business', key: 'lineOfBusiness', width: 45 },
      { header: 'Total Exposure Group', key: 'totalExposureGroup', width: 20 },
      { header: 'Sector Industry', key: 'sectorIndustry', width: 20 },
      { header: 'Sales Verified', key: 'salesVerified', width: 20 },
      { header: 'Collectability Status', key: 'collectabilityStatus', width: 17 },
      { header: 'Deviation', key: 'deviation', width: 10 },
      { header: 'Based on FS (in IDR MN)', key: 'basedOnFS', width: 22 },
      { header: 'Based on Average Balance (in IDR Mn)', key: 'basedOnAverageBalance', width: 20 },
      { header: 'Based on Credit Mutation (in IDR Mn)', key: 'basedOnCreditMutation', width: 20 },
      { header: 'Credit Grading', key: 'creditGrading', width: 13 },
      { header: 'Modal Usaha', key: 'modalUsaha', width: 20 },
      { header: 'STO/Penjualan Tahunan', key: 'stoPenjualanTahunan', width: 21 },
      { header: 'Loan Comm Approval', key: 'loanCommApproval', width: 19 },
      { header: 'Pengajuan', key: 'pengajuan', width: 20 },
      { header: 'Total Changes Eq To IDR', key: 'totalChangesEqToIDR', width: 22 },
      { header: 'Total Plafond Debtor only (IDR)', key: 'totalPlafondDebtorIDR', width: 20 },
      { header: 'Total Plafond Debtor only (USD)', key: 'totalPlafondDebtorUSD', width: 20 },
      { header: 'Total Plafond Group (IDR)', key: 'totalPlafondGroupIDR', width: 22 },
      { header: 'Sub Total Plafond Eq to IDR (Debtor)', key: 'subTotalPlafondEqToIDRDebtor', width: 20 },
      { header: 'Grand Total Plafond Eq to IDR (Include Group)', key: 'grandTotalPlafondEqToIDR', width: 20 },
      { header: 'Collateral Type', key: 'collateralType', width: 30 },
      { header: 'Total MV Internal', key: 'totalMVInternal', width: 20 },
      { header: 'Total LV Internal', key: 'totalLVInternal', width: 20 },
      { header: 'Total MV KJPP', key: 'totalMVKJPP', width: 20 },
      { header: 'Total LV KJPP', key: 'totalLVKJPP', width: 20 },
      { header: 'Collateral Coverage MV Internal (%)', key: 'collateralCoverageMVInternal', width: 20 },
      { header: 'Collateral Coverage LV Internal (%)', key: 'collateralCoverageLVInternal', width: 20 },
      { header: 'Collateral Coverage MV KJPP (%)', key: 'collateralCoverageMVKJPP', width: 20 },
      { header: 'Collateral Coverage LV KJPP (%)', key: 'collateralCoverageLVKJPP', width: 20 },
      { header: 'Status', key: 'status', width: 25 },
    ];
  }

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal, index): void {
    worksheet.addRow({
      no: index + 1 || '',
      proposalNumber: proposal.proposalNumber || '',
      proposalDate: proposal.proposalDate || '',
      segment: proposal.segment || '',
      proposalType: proposal.proposalType || '',
      customerStatus: proposal.customerStatus || '',
      program: proposal.program || '',
      umkm: proposal.umkm || '',
      kategoriUsahaDebitur: proposal.kategoriUsahaDebitur || '',
      refferal: proposal.refferal || '',
      rmFirstName: proposal.rmFirstName || '',
      rmLastName: proposal.rmLastName || '',
      bm: proposal.bm || '',
      headName: proposal.headName || '',
      cif: proposal.cif || '',
      debtorName: proposal.debtorName || '',
      idCardNumber: proposal.idCardNumber || '',
      dateOfBirth: this._convertDate(proposal.dateOfBirth) || '',
      deedOfRCNTNumber: proposal.deedOfRCNTNumber || '',
      deedOfRCNTDate: this._convertDate(proposal.deedOfRCNTDate) || '',
      lineOfBusiness: proposal.lineOfBusiness || '',
      totalExposureGroup: proposal.totalExposureGroup || '',
      sectorIndustry: proposal.sectorIndustry || '',
      salesVerified: proposal.salesVerified || '',
      collectabilityStatus: proposal.collectibilityStatus || '',
      deviation: proposal.deviation || '',
      basedOnFS: proposal.basedOnFS || '',
      basedOnAverageBalance: proposal.basedOnAvgBalance || '',
      basedOnCreditMutation: proposal.basedOnCreditMutation || '',
      creditGrading: proposal.creditGrading || '',
      modalUsaha: proposal.modalUsaha || '',
      stoPenjualanTahunan: proposal.penjualanTahunan || '',
      loanCommApproval: proposal.approvalLc || '',
      pengajuan: proposal.product.map(product => product.pengajuan).join(',\n') || '',
      totalChangesEqToIDR: proposal.totalChangesEqToIDR || '',
      totalPlafondDebtorIDR: proposal.totalPlafondDebtorOnlyIDR || '',
      totalPlafondDebtorUSD: proposal.totalPlafondDebtorOnlyUSD || '',
      totalPlafondGroupIDR: proposal.totalPlafondGroupIDR || '',
      subTotalPlafondEqToIDRDebtor: proposal.subTotalPlafondEqToIDR || '',
      grandTotalPlafondEqToIDR: proposal.grandTotalPlafondEqToIDR || '',
      collateralType: proposal.collateral.map(col => col.collateralType).join(',\n') || '',
      totalMVInternal: proposal.totalMVInternal || '',
      totalLVInternal: proposal.totalLVInternal || '',
      totalMVKJPP: proposal.totalMVKJPP || '',
      totalLVKJPP: proposal.totalLVKJPP || '',
      collateralCoverageMVInternal: proposal.collateralCoverageMVInternal || '',
      collateralCoverageLVInternal: proposal.collateralCoverageLVInternal || '',
      collateralCoverageMVKJPP: proposal.collateralCoverageMVKJPP || '',
      collateralCoverageLVKJPP: proposal.collateralCoverageLVKJPP || '',
      status: proposal.status || '',
    });
  }

  private _applyStyles(worksheet: ExcelJS.Worksheet): void {
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber === 1) {
        worksheet.getRow(rowNumber).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'fffefd32' },
        };

        worksheet.getRow(rowNumber).font = { bold: true };
        worksheet.getRow(rowNumber).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getColumn('collateralType').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      }

      row.eachCell({ includeEmpty: true }, cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    worksheet.getColumn('pengajuan').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('kategoriUsahaDebitur').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('basedOnAverageBalance').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('basedOnCreditMutation').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('collateralType').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('lineOfBusiness').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('totalPlafondDebtorIDR').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('totalPlafondDebtorUSD').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('subTotalPlafondEqToIDRDebtor').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('grandTotalPlafondEqToIDR').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('collateralCoverageMVInternal').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('collateralCoverageLVInternal').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('collateralCoverageMVKJPP').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('collateralCoverageLVKJPP').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
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
