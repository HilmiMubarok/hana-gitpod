import { forEach } from 'lodash';
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
  changeOption(event) {
    console.log('test');
  }

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

  convertStatusToString(status: Array<string>): string {
    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  generateMISReportCP() {
    const template_report_data = [
      { key: 'No.', valueFrom: '', format: 'string' },
      { key: 'Proposal Number', valueFrom: 'proposalNumber', format: 'string' },
      { key: 'Proposal Date', valueFrom: 'proposalDate', format: 'string' },
      { key: 'Segment', valueFrom: 'segment', format: 'string' },
      { key: 'Customer Status', valueFrom: 'customerStatus', format: 'string' },
      { key: 'Program', valueFrom: 'program', format: 'string' },
      { key: 'UMKM', valueFrom: 'umkm', format: 'string' },
      { key: 'Kategori Usaha Debitur', valueFrom: 'kategoriUsahaDebitur', format: 'string' },
      { key: 'Refferal', valueFrom: 'refferal', format: 'string' },
      { key: 'RM First Name', valueFrom: 'rmFirstName', format: 'string' },
      { key: 'RM Last Name', valueFrom: 'rmLastName', format: 'string' },
      { key: 'BM', valueFrom: 'bm', format: 'string' },
      { key: 'Head Name', valueFrom: 'headName', format: 'string' },
      { key: 'CIF', valueFrom: 'cif', format: 'string' },
      { key: 'Debtor Name', valueFrom: 'debtorName', format: 'string' },
      { key: 'ID Card Number', valueFrom: 'idCardNumber', format: 'string' },
      { key: 'Date of Birth', valueFrom: 'dateOfBirth', format: 'date' },
      { key: 'Deed of RCNT Number', valueFrom: 'deedOfRCNTNumber', format: 'string' },
      { key: 'Deed of RCNT Date', valueFrom: 'deedOfRCNTDate', format: 'date' },
      { key: 'Line of Business', valueFrom: 'lineOfBusiness', format: 'string' },
      { key: 'Total Exposure Group', valueFrom: 'totalExposureGroup', format: 'string' },
      { key: 'Sector Industry', valueFrom: 'sectorIndustry', format: 'string' },
      { key: 'Sales Verified', valueFrom: 'salesVerified', format: 'string' },
      { key: 'Collectability Status', valueFrom: 'collectibilityStatus', format: 'string' },
      { key: 'Deviation', valueFrom: 'deviation', format: 'string' },
      { key: 'Based on FS (in IDR MN)', valueFrom: 'basedOnFS', format: 'moneyIDR' },
      { key: 'Based on Average Balance (in IDR MN)', valueFrom: 'basedOnAvgBalance', format: 'string' },
      { key: 'Based on Credit Mutation (in IDR MN)', valueFrom: 'basedOnCreditMutation', format: 'string' },
      { key: 'Credit Grading', valueFrom: 'creditGrading', format: 'string' },
      { key: 'Modal Usaha', valueFrom: 'modalUsaha', format: 'string' },
      { key: 'STO / Penjualan Tahunan', valueFrom: 'penjualanTahunan', format: 'string' },
      { key: 'Total Changes Eq to IDR', valueFrom: 'totalChangesEqToIDR', format: 'string' },
      { key: 'Total Plafond Debtor Only (IDR)', valueFrom: 'totalPlafondDebtorOnlyIDR', format: 'string' },
      { key: 'Total Plafond Debtor Only (USD)', valueFrom: 'totalPlafondDebtorOnlyUSD', format: 'string' },
      { key: 'Total Plafond Group (IDR)', valueFrom: 'totalPlafondGroupIDR', format: 'string' },
      { key: 'Sub Total Plafon Eq to IDR (Debtor)', valueFrom: 'subTotalPlafondEqToIDR', format: 'string' },
      { key: 'Grand Total Plafon Eq to IDR (Include Group)', valueFrom: 'grandTotalPlafondEqToIDR', format: 'string' },
      { key: 'Total MV Internal', valueFrom: 'totalMVInternal', format: 'string' },
      { key: 'Total LV Internal', valueFrom: 'totalLVInternal', format: 'string' },
      { key: 'Total MV KJPP', valueFrom: 'totalMVKJPP', format: 'string' },
      { key: 'Total LV KJPP', valueFrom: 'totalLVKJPP', format: 'string' },
      { key: 'Collateral Coverage MV Internal (%)', valueFrom: 'colCoverageMVInternal', format: 'string' },
      { key: 'Collateral Coverage MV KJPP (%)', valueFrom: 'colCoverageMVKJPP', format: 'string' },
      { key: 'Collateral Coverage LV Internal (%)', valueFrom: 'colCoverageLVInternal', format: 'string' },
      { key: 'Collateral Coverage LV KJPP (%)', valueFrom: 'colCoverageLVKJPP', format: 'string' },
      { key: 'Status', valueFrom: 'status', format: 'string' },
    ];

    const params = {
      startDate: this.MISReportCP.get('date1')?.value,
      endDate: this.MISReportCP.get('date2')?.value,
      status: this.convertStatusToString(this.MISReportCP.get('status')?.value),
    };
  }
  allSelected = false;

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.MISReportCP.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.MISReportCP.get('status')?.setValue('');
    }
  }

  _convertDate(date: string): string {
    // Convert date to format YYYY-MM-DD HH:mm

    return moment(date).format('YYYY-MM-DD HH:mm');
  }

  private _processNewGenerate(data, fileName) {
    this.misReportService.loadingGenerateDocument.next(true);
    this.misReportService.generateDocumentLabel.next('Generating...');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Set up columns
    worksheet.columns = [
      { header: 'Test', key: 'test', width: 30 },
      { header: 'Proposal Number', key: 'proposalNumber', width: 30 },
      { header: 'Proposal Type', key: 'proposalType', width: 30 },
      { header: 'Proposal Date', key: 'proposalDate', width: 15 },
      { header: 'Product Id', key: 'productId', width: 15 },
      { header: 'Pengajuan', key: 'pengajuan', width: 15 },
      { header: 'Collateral Id', key: 'collateralId', width: 20 },
      { header: 'Collateral Number', key: 'collateralNumber', width: 20 },
      { header: 'Certificates', key: 'certificates', width: 20 },
      { header: 'Timeline', key: 'timeline', width: 45 },
    ];

    // Add data
    data.forEach(proposal => {
      const proposalRowCount = Math.max(
        proposal.product.length,
        proposal.collateral.reduce((sum, col) => sum + (col.certificate ? col.certificate.length : 0), 0),
        proposal.timeline.length
      );

      const startRow = worksheet.rowCount + 1;

      // Add proposal data
      for (let i = 0; i < proposalRowCount; i++) {
        const row = worksheet.addRow({
          test: i === 0 ? proposal.test : '',
          proposalNumber: i === 0 ? proposal.proposalNumber : '',
          proposalType: i === 0 ? proposal.proposalType : '',
          proposalDate: i === 0 ? new Date(proposal.proposalDate) : '',
          productId: proposal.product[i]?.productId || '',
          pengajuan: proposal.product[i]?.pengajuan || '',
        });

        // Format date cell
        if (i === 0) {
          row.getCell('proposalDate').numFmt = 'dd/mm/yyyy';
        }

        row.getCell('test').alignment = { wrapText: true };
      }

      // Add collateral data
      let collateralRowIndex = startRow;
      proposal.collateral.forEach(collateral => {
        collateral.certificate?.forEach((cert, certIndex) => {
          const row = worksheet.getRow(collateralRowIndex);
          row.getCell('collateralId').value = certIndex === 0 ? collateral.id : '';
          row.getCell('collateralNumber').value = certIndex === 0 ? collateral.collateralCode : '';
          row.getCell('certificates').value = cert.buktiKepemilikan;
          collateralRowIndex++;
        });
      });

      // sort timeline asc by id
      proposal.timeline.sort((a, b) => a.id - b.id);

      const timelineRowIndex = startRow;

      const row = worksheet.getRow(timelineRowIndex);
      row.getCell('timeline').value =
        proposal.timeline
          .map(timeline => `${timeline.statusDescription} : ${this._convertDate(timeline.fromDate)} : ${timeline.userName}`)
          .join('\n') || '';

      // Add timeline data
      // let timelineRowIndex = startRow;
      // proposal.timeline.forEach(timeline => {
      //   const row = worksheet.getRow(timelineRowIndex);
      //   row.getCell('timeline').value =
      //     `${timeline.statusDescription} : ${this._convertDate(timeline.fromDate)} : ${timeline.userName}` || '';
      //   timelineRowIndex++;
      // });

      // enable wrap text for timeline cell
      worksheet.getColumn('timeline').alignment = { wrapText: true };

      // set font size to 10px in column timeline
      worksheet.getColumn('timeline').font = { size: 10 };

      // Merge cells for proposal data
      ['test', 'proposalNumber', 'proposalType', 'proposalDate', 'timeline'].forEach(key => {
        const colIndex = worksheet.columns.findIndex(col => col.key === key) + 1;
        return worksheet.mergeCells(startRow, colIndex, startRow + proposalRowCount - 1, colIndex);
      });

      // Merge cells for collateral numbers
      let collateralStartRow = startRow;
      proposal.collateral.forEach(collateral => {
        const certCount = collateral.certificate ? collateral.certificate.length : 0;
        if (certCount > 1) {
          const collateralColumnIndex = worksheet.columns.findIndex(col => col.key === 'collateralId') + 1;
          const collateralNumberIndex = worksheet.columns.findIndex(col => col.key === 'collateralNumber') + 1;
          worksheet.mergeCells(collateralStartRow, collateralColumnIndex, collateralStartRow + certCount - 1, collateralColumnIndex);
          worksheet.mergeCells(collateralStartRow, collateralNumberIndex, collateralStartRow + certCount - 1, collateralNumberIndex);
        }
        collateralStartRow += certCount;
      });
    });

    // Apply styles
    worksheet.getRow(1).font = { bold: true };

    // Add background color to header row
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' },
    };

    worksheet.eachRow({ includeEmpty: true }, row => {
      row.eachCell(cell => {
        cell.border = {};
      });
    });

    // Generate and save file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, fileName);
      this.misReportService.loadingGenerateDocument.next(false);
      this.misReportService.generateDocumentLabel.next('Generate Document');
    });
  }
}
