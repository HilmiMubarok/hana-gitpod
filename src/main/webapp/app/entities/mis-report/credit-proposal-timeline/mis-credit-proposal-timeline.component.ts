import { Component } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-mis-credit-proposal-timeline',
  templateUrl: './mis-credit-proposal-timeline.component.html',
  styleUrls: ['./mis-report-credit-proposal-timeline.css', '../mis-report.css'],
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
export class MisCreditProposalTimelineComponent {
  public lovStatus = [];
  listOfValue = [];
  misCpTimeline: FormGroup;
  allSelected = false;
  searchFieldDisabled = false;
  dateRangeAndStatusDisabled = false;
  changeOption(event) {
    console.log('test', event.value);
  }
  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    this.misCpTimeline = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
      search: new FormControl(
        '',
        Validators.pattern(/^\d{5}\/\d{2}\/CP\/(Comm|CB|EB|GLO|SME)\/(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\/\d{4}$/)
      ),
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
    this.getStatus();
  }

  checkFieldStatus() {
    const date1 = this.misCpTimeline.get('date1')?.value;
    const date2 = this.misCpTimeline.get('date2')?.value;
    const status = this.misCpTimeline.get('status')?.value;

    // Disable search if date1, date2, or status is filled
    if (date1 || date2 || (status && status.length > 0)) {
      this.misCpTimeline.get('search')?.disable();
    } else {
      this.misCpTimeline.get('search')?.enable();
    }
  }

  onSearchFocus() {
    this.misCpTimeline.get('date1')?.disable();
    this.misCpTimeline.get('date2')?.disable();
    this.misCpTimeline.get('status')?.disable();
  }

  onSearchBlur() {
    const searchValue = this.misCpTimeline.get('search')?.value;
    if (!searchValue) {
      this.misCpTimeline.get('date1')?.enable();
      this.misCpTimeline.get('date2')?.enable();
      this.misCpTimeline.get('status')?.enable();
    }
  }

  onDateRangeFocus() {
    this.misCpTimeline.get('search')?.disable();
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
  getStatus() {
    this.misReportService.getStatuses('MIS_CREDIT_PROPOSAL_TIMELINE').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }
  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.misCpTimeline.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.misCpTimeline.get('status')?.setValue('');
    }
  }

  clearSearch(): void {
    this.misCpTimeline.get('search')?.reset();
    // reset the searchResult
    this.searchResult = null;
  }

  skeletonData = [
    {
      proposalNumber: '',
      cif: '',
      debtorName: '',
      customerType: '',
      proposalDate: '',
    },
  ];

  loadingSearch: Boolean = false;

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
  displayedColumns: string[] = ['proposalNumber', 'cif', 'debtorName', 'customerType', 'proposalDate'];

  public doSearch(): void {
    this.loadingSearch = true;

    // if search not valid, show error message
    if (this.misCpTimeline.get('search')?.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Proposal Number Format' });
      return;
    }

    const predicate: object = {
      page: 0,
      query: this.misCpTimeline.get('search')?.value,
      size: 10,
      idPosition: this.getLocStor('POS'),
    };

    predicate['target'] = 'credit_proposal_status'; // Belum dibuat di BE

    this.misReportService.searchCP(predicate).subscribe({
      next: res => {
        this.searchResult = res.body;
        this.loadingSearch = false;
      },
      error: (res: HttpErrorResponse) => console.error(res.message),
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
    // Check if search field is valid
    if (this.misCpTimeline.get('search')?.value && this.misCpTimeline.get('search')?.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Proposal Number Format' });
      return;
    }

    let params;
    // if search has value, create params only search
    if (this.misCpTimeline.get('search')?.value) {
      params = {
        proposalNumber: this.misCpTimeline.get('search')?.value,
      };
    } else {
      params = {
        startDate: this.misCpTimeline.get('date1')?.value,
        endDate: this.misCpTimeline.get('date2')?.value,
        status: this.convertStatusToString(this.misCpTimeline.get('status')?.value),
      };
    }

    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_Credit_Proposal_Timeline'),
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
      this._addTimelineData(worksheet, proposal, index);
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

  private _convertDate(date: string): string {
    if (!date) {
      return '';
    }
    return moment(date).format('YYYY-MM-DD');
  }

  private _addTimelineData(worksheet: ExcelJS.Worksheet, proposal, index): void {
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
    worksheet.columns.forEach((column, index) => {
      worksheet.getCell(1, index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'fffefd32' },
      };
    });

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber === 1) {
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
