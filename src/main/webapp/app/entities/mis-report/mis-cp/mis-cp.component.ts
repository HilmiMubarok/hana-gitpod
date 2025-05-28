import { Component, OnInit } from '@angular/core';
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
    `,
  ],
})
export class MisCPComponent extends AbstractExcelMISReport implements OnInit {
  public lovStatus = [];
  listOfValue = [];
  misCp: FormGroup;
  allSelected = false;

  changeOption(event) {
    console.log('test', event.value);
  }
  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    super(misReportService);

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
  }

  public previousState(): void {
    window.history.back();
  }

  ngOnInit(): void {
    this.getStatusLOV('MIS_CREDIT_PROPOSAL').subscribe({
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
      { header: 'Program', key: 'program' },
      { header: 'Branchs', key: 'branchs' },
      { header: 'Regional', key: 'regional' },
      { header: 'SME Head Name', key: 'headName' },
      { header: 'BM', key: 'bm' },
      { header: 'RM', key: 'rm' },
      { header: 'Debtor Name', key: 'debtorName' },
      { header: 'Loan Comm Approval', key: 'loanCommApproval' },
      { header: 'Line Of Business', key: 'lineOfBusiness' },
      { header: 'Proposed', key: 'proposed' },
      { header: 'Facility', key: 'facility' },
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
      { header: 'MV (internal) (In Currency)', key: 'mv' },
      { header: 'MV (internal) (Equivalen to IDR)', key: 'mvIDR' },
      { header: 'LV Internal', key: 'lvInternal' },
      { header: 'Group Name', key: 'groupName' },
      { header: 'DEBITUR GROUP', key: 'debiturGroup' },
      { header: 'Reviewer', key: 'reviewer' },
      { header: 'Status', key: 'status' },
      { header: 'Date of Status', key: 'dateOfStatus' },
      { header: 'Memo', key: 'memo' },
    ];
  }

  protected processData(data: any[]): void {
    data.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }

  // ini bergantung dari jumlah si facilitynya

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal, index): void {
    const repeatCount = proposal.product?.length || 1;
    const baseRowIndex = worksheet.lastRow ? worksheet.lastRow.number + 1 : 1;

    for (let i = 0; i < repeatCount; i++) {
      const product = proposal.product?.[i] || {};

      const row = worksheet.addRow({
        no: i === 0 ? index + 1 : '',
        dateOfApprovalToLA: this.getDateOfApprovalToLA(proposal),
        dateOfAssignment: this.getDateOfAssignment(proposal),
        segment: proposal.segmentParentRM || '',
        proposalType: proposal.proposalType || '',
        proposalDate: this.formatDateMISCP(proposal.proposalDate) || '',
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
        maturityDate: product.maturityDate === 'null' ? '' : product.maturityDate || '',
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
        collateral: proposal.collateral?.map(col => col.collateralCode).join(',\n') || '',
        mv: proposal.collateral?.map(col => col.collateralProperty?.marketValueOriginal || '').join(',\n') || '',
        mvIDR: proposal.collateral?.map(col => col.collateralProperty?.marketValueInternal || '').join(',\n') || '',
        lvInternal: proposal.collateral?.map(col => col.collateralProperty?.liquidationValueInternal || '').join(',\n') || '',
        groupName: proposal.businessGroup?.groupCompanyName || '',
        debiturGroup: proposal.businessGroup?.customersGrup?.map((customer: any) => customer.customerName).join(',\n') || '',
        reviewer: proposal.dataAssignToCROName || '',
        status: proposal.status || '',
        dateOfStatus: proposal.statusDate || '',
        memo: proposal.approvalStatus || '',
      });

      const maxContentLength = Math.max(
        row.getCell('collateral').value?.toString().split('\n').length || 1,
        row.getCell('mv').value?.toString().split('\n').length || 1,
        row.getCell('mvIDR').value?.toString().split('\n').length || 1,
        row.getCell('lvInternal').value?.toString().split('\n').length || 1,
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
    return this.formatDateID(dateStr).getDay() + '-' + this.formatDateID(dateStr).getMonth().substring(0, 3) + '-' + this.formatDateID(dateStr).getYear();
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
}
