import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'jhi-mis-report-credit-proposal-deviation',
  templateUrl: './mis-report-credit-proposal-deviation.component.html',
  styleUrls: ['./mis-report-credit-proposal-deviation.css'],
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
export class MisReportCreditProposalDeviationComponent {
  public lovStatus = [];
  status: '';
  date1: any;
  date2: any;
  listOfValue = [];
  allSelected = false;

  MisReportCPDeviation: FormGroup;

  changeOption(event) {
    console.log('data', event.value);
  }

  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    this.getStatus();
    this.MisReportCPDeviation;

    this.MisReportCPDeviation = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
    });

    this.MisReportCPDeviation.get('date1')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MisReportCPDeviation.get('date1').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.MisReportCPDeviation.get('date2')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MisReportCPDeviation.get('date2').setValue(formattedDate, { emitEvent: false });
      }
    });
  }

  getStatus() {
    this.misReportService.getStatuses('MIS_CREDIT_PROPOSAL_DEVIATION').subscribe({
      next: res => (this.listOfValue = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.MisReportCPDeviation.get('status')?.setValue([...this.listOfValue.map(status => status.statusId)]);
    } else {
      this.MisReportCPDeviation.get('status')?.setValue('');
    }
  }
  generateMISCreditDeviation() {
    this.misReportService.setLoading(true);
    const params = {
      startDate: this.MisReportCPDeviation.get('date1')?.value,
      endDate: this.MisReportCPDeviation.get('date2')?.value,
      status: this._convertStatusToString(this.MisReportCPDeviation.get('status')?.value),
    };
    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_Credit_Proposal'),
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
    if (!data || data.length === 0) {
      this._applyStyles(worksheet);
      this._downloadFile(workbook, fileName);
      return;
    }
    // Add data to worksheet
    data.forEach((proposal, index, row) => {
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
      { header: 'Booking Branch', key: 'bookingBranch', width: 30 },
      { header: 'Customer Status', key: 'customerStatus', width: 25 },
      { header: 'CIF', key: 'cif', width: 35 },
      { header: 'Debtor Name', key: 'debtorName', width: 40 },
      { header: 'Proposal Type', key: 'proposalType', width: 35 },
      { header: 'Covenant Status', key: 'covenantStatus', width: 20 },
      { header: 'Deviation', key: 'covenantDeviations', width: 50 },
      { header: 'Status', key: 'status', width: 20 },
    ];
  }

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal, index): void {
    // Handle null or undefined proposal.covenant
    if (!proposal.covenant) {
      worksheet.addRow({
        no: index + 1 || '',
        proposalNumber: proposal.proposalNumber || '',
        proposalDate: proposal.proposalDate || '',
        segment: proposal.segment || '',
        bookingBranch: proposal.bookingBranchName || '',
        customerStatus: proposal.customerStatus || '',
        cif: proposal.cif || '',
        debtorName: proposal.debtorName || '',
        proposalType: proposal.proposalType || '',
        covenantStatus: '',
        covenantDeviations: '',
        status: proposal.status || '',
      });
      return;
    }

    // Filter covenant based on proposalType
    let covenantData = [];
    const statusesToFilter = ['Waived', 'To be waived', 'To Be Waived']; // Filtered statuses
    if (proposal.proposalType === 'Total Exposure Back to Back') {
      covenantData = [
        ...(proposal.covenant.deposit.filter(c => statusesToFilter.includes(c.status)) || []),
        ...(proposal.covenant.general.filter(c => statusesToFilter.includes(c.status)) || []),
        ...(proposal.covenant.other.filter(c => statusesToFilter.includes(c.status)) || []),
      ];
    } else if (proposal.proposalType === 'Total Exposure > IDR 15 Bio') {
      covenantData = [
        ...(proposal.covenant.above.filter(c => statusesToFilter.includes(c.status)) || []),
        ...(proposal.covenant.other.filter(c => statusesToFilter.includes(c.status)) || []),
      ];
    } else {
      covenantData = [
        ...(proposal.covenant.below.filter(c => statusesToFilter.includes(c.status)) || []),
        ...(proposal.covenant.other.filter(c => statusesToFilter.includes(c.status)) || []),
      ];
    }
    console.log('covenantData', covenantData); // console bundle covenant to excel
    for (let i = 0; i < covenantData.length; i++) {
      // condition manipulate character
      if (covenantData[i].status === 'To be waived') {
        covenantData[i].status = 'To Be Waived';
      }
    }

    const rowStart = worksheet.lastRow ? worksheet.lastRow.number + 1 : 1; // Track the starting row number for merging

    // Loop through covenant data and create rows
    covenantData.forEach((covenant, i) => {
      worksheet.addRow({
        no: i === 0 ? index + 1 : '',
        proposalNumber: i === 0 ? proposal.proposalNumber || '' : '',
        proposalDate: i === 0 ? proposal.proposalDate || '' : '',
        segment: i === 0 ? proposal.segment || '' : '',
        bookingBranch: i === 0 ? proposal.bookingBranchName || '' : '',
        customerStatus: i === 0 ? proposal.customerStatus || '' : '',
        cif: i === 0 ? proposal.cif || '' : '',
        debtorName: i === 0 ? proposal.debtorName || '' : '',
        proposalType: i === 0 ? proposal.proposalType || '' : '',
        covenantStatus: covenant.status || '',
        covenantDeviations: covenant.deviation || '',
        status: i === 0 ? proposal.status || '' : '',
      });
    });

    const rowEnd = worksheet.lastRow.number;

    // Merge columns for the proposal details (first row only)
    if (rowEnd > rowStart) {
      worksheet.mergeCells(`A${rowStart}:A${rowEnd}`); // Merge 'no'
      worksheet.mergeCells(`B${rowStart}:B${rowEnd}`); // Merge 'proposalNumber'
      worksheet.mergeCells(`C${rowStart}:C${rowEnd}`); // Merge 'proposalDate'
      worksheet.mergeCells(`D${rowStart}:D${rowEnd}`); // Merge 'segment'
      worksheet.mergeCells(`E${rowStart}:E${rowEnd}`); // Merge 'bookingBranch'
      worksheet.mergeCells(`F${rowStart}:F${rowEnd}`); // Merge 'customerStatus'
      worksheet.mergeCells(`G${rowStart}:G${rowEnd}`); // Merge 'cif'
      worksheet.mergeCells(`H${rowStart}:H${rowEnd}`); // Merge 'debtorName'
      worksheet.mergeCells(`I${rowStart}:I${rowEnd}`); // Merge 'proposalType'
      worksheet.mergeCells(`L${rowStart}:L${rowEnd}`); // Merge 'status'
    }

    // Handle the case where there's no covenant data (covenantData is empty)
    if (covenantData.length === 0) {
      worksheet.addRow({
        no: index + 1 || '',
        proposalNumber: proposal.proposalNumber || '',
        proposalDate: proposal.proposalDate || '',
        segment: proposal.segment || '',
        bookingBranch: proposal.bookingBranchName || '',
        customerStatus: proposal.customerStatus || '',
        cif: proposal.cif || '',
        debtorName: proposal.debtorName || '',
        proposalType: proposal.proposalType || '',
        covenantStatus: '',
        covenantDeviations: '',
        status: proposal.status || '',
      });
    }
  }

  private _applyStyles(worksheet: ExcelJS.Worksheet): void {
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber === 1) {
        worksheet.getRow(rowNumber).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ff4285f4' },
        };

        worksheet.getRow(rowNumber).font = { bold: true };
        worksheet.getRow(rowNumber).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getColumn('covenantStatus').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getColumn('covenantDeviations').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
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
    worksheet.getColumn('covenantStatus').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('covenantDeviations').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
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
  private _convertStatusToString(status: Array<string>): string {
    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }
  public previousState(): void {
    window.history.back();
  }
}
