import { Component } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'jhi-mis-creditproposal-report-compare',
  templateUrl: './mis-creditproposal-report-compare.component.html',
  styleUrls: ['./mis-report-credit-proposal-compare.css', '../mis-report.css'],
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
export class MisCreditProposalReportCompareComponent {
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
    this.misReportService.getStatuses('MIS_CREDIT_PROPOSAL_COMPARE').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }

  generateMISReportCompare() {
    this.misReportService.setLoading(true);

    const params = {
      startDate: this.MISReportCP.get('date1')?.value,
      endDate: this.MISReportCP.get('date2')?.value,
      status: this._convertStatusToString(this.MISReportCP.get('status')?.value),
    };

    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_Credit_Proposal_Compare'),
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
      { header: 'Segment', key: 'segment', width: 15 },
      { header: 'Branch', key: 'branch', width: 21 },
      { header: 'BM', key: 'bm', width: 30 },
      { header: 'RM', key: 'rm', width: 30 },
      { header: 'Debtor Name', key: 'debtorName', width: 40 },
      { header: 'Loan Comm Approval', key: 'loanCommApproval', width: 25 },
      { header: 'Line Of Business', key: 'lineOfBusiness', width: 100 },
      { header: 'Pengajuan', key: 'pengajuan', width: 15 },
      { header: 'Facility', key: 'facility', width: 20 },
      { header: 'Changes', key: 'changes', width: 20 },
      { header: 'Total Changes Eq To IDR', key: 'totalChanges', width: 20 },
      { header: 'Grand Total Plafond DEBTOR ONLY (IDR)', key: 'grandTotalDebtorIDR', width: 30 },
      { header: 'Grand Total Plafond TOTAL EXPOSURE (IDR)', key: 'grandTotalExposureIDR', width: 30 },
      { header: 'Tenor fasilitas', key: 'tenorFasilitas', width: 15 },
      { header: 'Period Type', key: 'periodType', width: 30 },
      { header: 'Interest Rate (%)', key: 'intRate', width: 20 },
      { header: 'Provision Fee', key: 'provFee', width: 12 },
      { header: 'Provision Type', key: 'provType', width: 20 },
      { header: 'Admin Fee', key: 'adminFee', width: 17 },
      { header: 'Admin Type', key: 'adminType', width: 45 },
      { header: 'Pengajuan Approve', key: 'pengajuanApp', width: 20 },
      { header: 'Facility Approve', key: 'facilityApp', width: 20 },
      { header: 'Changes Approve', key: 'changesApp', width: 20 },
      { header: 'Total Changes Eq To IDR Approve', key: 'totalChangesApp', width: 17 },
      { header: 'Grand Total Plafond DEBTOR ONLY (IDR) Approve', key: 'grandTotalDebtorIDRApp', width: 10 },
      { header: 'Grand Total Plafond TOTAL EXPOSURE (IDR) Approve', key: 'grandTotalExposureIDRApp', width: 22 },
      { header: 'Tenor fasilitas Approve', key: 'tenorFasilitasApp', width: 20 },
      { header: 'Period Type', key: 'periodTypes', width: 20 },
      { header: 'Interest Rate (%) Approve', key: 'intRateApp', width: 13 },
      { header: 'Provision Fee Approve', key: 'provFeeApp', width: 20 },
      { header: 'Provision Type', key: 'provTypeApp', width: 21 },
      { header: 'Admin Fee Approve', key: 'adminFeeApp', width: 19 },
      { header: 'Admin Type', key: 'admintypeApp', width: 20 },
      { header: '%Collateral Coverage MV', key: 'collateralCoverageMV', width: 22 },
    ];
  }

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal, index): void {
    // Initialize the dataCompare with previousHistory or an empty array if undefined
    const dataCompare = [...(proposal.previousHistory || [])];

    // Sort dataCompare[0].product by productId in ascending order if it exists
    if (dataCompare[0]?.product) {
      dataCompare[0].product = dataCompare[0].product.sort((a, b) => a.productId - b.productId);
    }

    // Sort products by productId in ascending order
    const products = [...(proposal.product || [])].sort((a, b) => a.productId - b.productId);

    // Start index for merging rows related to the current proposal
    const startRow = worksheet.rowCount + 1;
    // Calculate the maximum length of both arrays to loop through
    const maxLength = Math.max(dataCompare.length, products.length);

    // Loop through the maximum length
    for (let idx = 0; idx < maxLength; idx++) {
      // Get the sorted previousHistory entry if it exists
      const dataCompareFacility = dataCompare[0]?.product[idx] || {}; // Default to empty object
      const dataCompared = dataCompare[idx] || {};
      // Get the sorted product entry
      const currentProduct = products[idx] || {}; // Default to empty object

      // Add a new row to the worksheet combining data from both
      worksheet.addRow({
        no: index + 1 || '',
        segment: proposal.segment || '',
        branch: proposal.bookingBranchName || '',
        bm: proposal.bm || '',
        rm: proposal.rmFirstName + ' ' + proposal.rmLastName || '',
        debtorName: proposal.debtorName || '',
        loanCommApproval: proposal.approvalLc ? proposal.approvalLc.split(' ')[0] || '' : '',
        lineOfBusiness: proposal.lineOfBusiness || '',
        // PreviousHistory data
        pengajuan: dataCompareFacility.pengajuan || '',
        facility: dataCompareFacility.facility || '',
        changes: dataCompareFacility.changes || '',
        totalChanges: dataCompared?.facility?.totalChangesEqToIDR || '',
        grandTotalDebtorIDR: '',
        grandTotalExposureIDR: '',
        tenorFasilitas: dataCompareFacility.tenorFasilitas || '',
        periodType: dataCompareFacility.periodType || '',
        intRate: dataCompareFacility.currentRate || '',
        provFee: dataCompareFacility.provisionFee || '',
        provType: dataCompareFacility.provisionFeeType || '',
        adminFee: dataCompareFacility.adminFee || '',
        adminType: dataCompareFacility.adminFeeType || '',
        // Sorted Product data
        pengajuanApp: currentProduct.pengajuan || '',
        facilityApp: currentProduct.facility || '',
        changesApp: currentProduct.changes || '',
        totalChangesApp: currentProduct.totalChangesEqToIDR || '',
        grandTotalDebtorIDRApp: currentProduct.totalPlafondDebitorIDR || '',
        grandTotalExposureIDRApp: currentProduct.grandTotalPlafondEqToIDR || '',
        tenorFasilitasApp: currentProduct.tenorFasilitas || '',
        periodTypes: currentProduct.periodType || '',
        intRateApp: currentProduct.currentRate || '',
        provFeeApp: currentProduct.provisionFee || '',
        provTypeApp: currentProduct.provisionFeeType || '',
        adminFeeApp: currentProduct.adminFee || '',
        admintypeApp: currentProduct.adminFeeType || '',
        collateralCoverageMV: proposal.colCoverageMVInternal || '',
      });
    }

    // End index for merging rows related to the current proposal
    const endRow = worksheet.rowCount;

    // Merge the specified cells only if there are multiple rows
    if (endRow > startRow) {
      worksheet.mergeCells(`A${startRow}:A${endRow}`); // 'No'
      worksheet.mergeCells(`L${startRow}:L${endRow}`); // 'Total Changes Eq To IDR'
      worksheet.mergeCells(`M${startRow}:M${endRow}`); // 'Grand Total Plafond DEBTOR ONLY (IDR)'
      worksheet.mergeCells(`N${startRow}:N${endRow}`); // 'Grand Total Plafond TOTAL EXPOSURE (IDR)'
      worksheet.mergeCells(`Y${startRow}:Y${endRow}`); // 'Total Changes Eq To IDR Approve'
      worksheet.mergeCells(`Z${startRow}:Z${endRow}`); // 'Grand Total Plafond DEBTOR ONLY (IDR) Approve'
      worksheet.mergeCells(`AA${startRow}:AA${endRow}`); // 'Grand Total Plafond TOTAL EXPOSURE (IDR) Approve'
      worksheet.mergeCells(`AI${startRow}:AI${endRow}`); // '%Collateral Coverage MV'
    }
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
        // worksheet.getColumn('collateralType').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
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

    // worksheet.getColumn('pengajuan').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getColumn('kategoriUsahaDebitur').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getColumn('basedOnAverageBalance').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getColumn('basedOnCreditMutation').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getColumn('collateralType').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getColumn('lineOfBusiness').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getColumn('totalPlafondDebtorIDR').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getColumn('totalPlafondDebtorUSD').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getColumn('subTotalPlafondEqToIDRDebtor').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getColumn('grandTotalPlafondEqToIDR').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getColumn('collateralCoverageMVInternal').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getColumn('collateralCoverageLVInternal').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getColumn('collateralCoverageMVKJPP').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    // worksheet.getColumn('collateralCoverageLVKJPP').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
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
