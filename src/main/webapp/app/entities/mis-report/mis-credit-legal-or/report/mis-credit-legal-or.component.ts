import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { MisReportService } from '../../mis-report.service';
import { MessageService } from 'primeng/api';
import * as ExcelJS from 'exceljs';
import { AbstractExcelMISReport } from '../../abstract-excel-report';
import { PageEvent } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { start } from 'repl';

@Component({
  selector: 'jhi-mis-credit-legal-or',
  templateUrl: './mis-credit-legal-or.component.html',
  styleUrls: ['../../mis-sla-credit-insurance/mis-sla-credit-insurance.css', '../../mis-report.css'],
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
export class MisCreditLegalOrComponent extends AbstractExcelMISReport implements OnInit {
  public lovStatus = [];
  listOfValue = [];
  misCreditLegalOr: FormGroup;
  allSelected = false;
  public form: FormGroup;

  changeOption(event) {
    console.log('test', event.value);
  }
  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    super(misReportService);

    this.misCreditLegalOr = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      status: new FormControl(''),
      type: new FormControl(''),
      search: new FormControl(
        '',
        Validators.pattern(/^\d{5}\/\d{2}\/CP\/(Comm|CB|EB|GLO|SME)\/(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\/\d{4}$/)
      ),
      regional: new FormControl(null),
      customerType: new FormControl(null),
      query: new FormControl(''),
    });
    this.misCreditLegalOr.get('startDate')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.misCreditLegalOr.get('startDate').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.misCreditLegalOr.get('endDate')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.misCreditLegalOr.get('endDate').setValue(formattedDate, { emitEvent: false });
      }
    });
  }

  public previousState(): void {
    window.history.back();
  }

  ngOnInit(): void {
    this.getStatusLOV('MIS_LEGAL_CL_OR').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }

  skeletonData = [
    {
      proposalNumber: '',
      cif: '',
      debtorName: '',
      customerType: '',
      proposalDate: '',
      statusDescription: '',
    },
  ];

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.misCreditLegalOr.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.misCreditLegalOr.get('status')?.setValue('');
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
    return this.misCreditLegalOr.get('date1')?.value && this.misCreditLegalOr.get('date2')?.value;
  }

  public loadingSearch = false;
  public pageSize = 10;
  public currentPage = 0;
  public totalItems = 0;
  public pageSizeOptions: number[] = [5, 10, 25, 50];

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

  public doSearch(pageEvent?: PageEvent): void {
    this.loadingSearch = true;

    if (pageEvent) {
      this.currentPage = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    }

    const predicate: object = {
      page: this.currentPage,
      query: this.misCreditLegalOr.get('query')?.value,
      size: this.pageSize,
      sort: ['id,desc'],
      idPosition: this.getLocStor('POS'),
    };

    predicate['target'] = 'MIS_LEGAL_CL_OR';

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

  clearSearch(): void {
    this.misCreditLegalOr.get('query')?.reset();
    // reset the searchResult
    this.searchResult = null;
  }

  clearDateRange(): void {
    this.misCreditLegalOr.get('date1')?.reset();
    this.misCreditLegalOr.get('date2')?.reset();
  }

  public generateMISCreditLegalOr(): void {
    this.misReportService.setLoading(true);

    const params = {
      startDate: this.misCreditLegalOr.get('startDate')?.value,
      endDate: this.misCreditLegalOr.get('endDate')?.value,
      // status: this._convertStatusToString(this.misCreditLegalOr.get('status')?.value),
      status: 'CP_COMPLETE',
      type: 'STATELOG',
    };

    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_LEGAL_CL_OR'),
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
    this._setAutoWidthForAllColumns();
    this._setAutoHeightForAllRows();
    this._applyStyles(worksheet);
    this.downloadFile(fileName);
  }

  get columns(): any[] {
    return [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Debtor Name', key: 'debtorName' },
      { header: 'Requested By (Branch)', key: 'branch' },
      { header: 'Requested By (RM)', key: 'rm' },
      { header: 'PIC', key: 'pic' },
      { header: 'PIC Timeline', key: 'picTimeline' },
      { header: 'Summary', key: 'summary' },
      { header: 'Tanggal Jatuh Tempo', key: 'tanggalJatuhTempo' },
      { header: 'Segmentation', key: 'segmentation' },
      { header: 'Started (date)', key: 'started' },
      { header: 'Started (Month)', key: 'startedMonth' },
      { header: 'Year', key: 'year' },
      { header: 'DPDL (date)', key: 'dpdl' },
      { header: 'DPDL (Month)', key: 'dpdlMonth' },
      { header: 'DPDL (year)', key: 'dpdlYear' },
      { header: 'Fasilitas Kredit', key: 'fasilitasKredit' },
      { header: 'Currency', key: 'currency' },
      { header: 'Nominal', key: 'nominal' },
      { header: 'Status', key: 'status' },
      { header: 'Information', key: 'information' },
      { header: 'Weekly Process Update', key: 'weeklyProcessUpdate' },
      { header: 'Reason', key: 'reason' },
      { header: 'Compliance Review >25M', key: 'complianceReview' },
      { header: 'Tanggal Compliance Review', key: 'tanggalCompliance' },
    ];
  }

  private _getPicTimeLine(timeLineCreditProposal: any): string {
    if (!Array.isArray(timeLineCreditProposal)) {
      return '';
    }

    return timeLineCreditProposal
      .filter(item => item.fromStatusDescription === 'DPPK Finalize' && item.personName)
      .sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime())
      .map(item => item.personName)
      .join(',\n');
  }

  // private _getPicTimeLine(timeLineCreditProposal: any): string {
  //   if (!Array.isArray(timeLineCreditProposal)) {
  //     return '';
  //   }

  //   return timeLineCreditProposal
  //     .filter(item => item.fromStatusDescription === 'DPPK Finalize' && item.personName)
  //     .sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime())
  //     .map(item => item.personName)
  //     .join('\n');
  // }

  private _getStartedAndDpdl(timeLine: any, status: string, param: 'Date' | 'Month' | 'Year') {
    const data = timeLine.filter(timeline => timeline.statusDescription === status);
    data.sort((a, b) => b.id - a.id);
    const date = data[0].fromDate;

    if (param === 'Date') {
      return this.formatDateID(date).getDay();
    } else if (param === 'Month') {
      return this.formatDateID(date).getMonth();
    } else if (param === 'Year') {
      return this.formatDateID(date).getYear();
    } else {
      return '';
    }
  }

  private _getTanggalComplianceReview(proposal) {
    if (proposal.isCompliance === 'Yes') {
      const date = proposal.timeLineCreditProposal
        .filter(timeline => timeline.fromStatusDescription === 'Compliance Director')
        .map(timeline => timeline.fromDate);
      return this.formatDateID(date).getFullDate();
    } else {
      return '';
    }
  }

  private _getStatusData(proposal: any): string {
    const statusMap = {
      done: ['DPPK Finalize', 'DPPK Review', 'Loan Ops Ditribution', 'Loan Ops Checking', 'Loan Ops Review', 'Complete'],
      pending: [
        'OL Distribution',
        'OL Finalize',
        'OL Assigned',
        'Legal Head Review',
        'Legal Lead Review',
        'Legal Team Lead Review',
        'PK Finalize',
        'PK Generated',
        'Return To OL',
        'PK Legal Lead Review',
        'PK Team Lead Review',
        'DPDL Finalize',
        'DPDL Legal Head Review',
        'DPDL Legal Lead Review',
        'DPDL Team Lead Review',
      ],
      cancel: ['Cancel'],
    };

    const status = proposal.status;

    if (statusMap.done.includes(status)) {
      return 'DONE';
    }

    if (statusMap.pending.includes(status)) {
      return 'PENDING';
    }

    if (statusMap.cancel.includes(status)) {
      return 'CANCEL';
    }

    return '';
  }

  private _getTanggalJatuhTempo(product) {
    const allowedTypes = ['Renewal + Others', 'Renewal + Decrease', 'Renewal + Additional Renewal'];

    if (allowedTypes.includes(product.pengajuan)) {
      return this.formatDateID(product.mainProduct[0].maturityDate).getFullDate();
    } else {
      return '';
    }
  }

  protected processData(data: any[]): void {
    data.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal: any, index: number) {
    const filteredProduct = proposal.product.filter(prod => prod.pengajuan !== 'Existing');

    filteredProduct.forEach(product => {
      const row = {
        no: worksheet.rowCount,
        debtorName: proposal.debtorName,
        branch: proposal.branchNameRM,
        rm: proposal.rmFirstName + ' ' + proposal.rmLastName,
        pic: proposal.dataAssignToLegalOfficerName,
        picTimeline: this._getPicTimeLine(proposal.timeLineCreditProposal),
        summary: product.pengajuan,
        tanggalJatuhTempo: this._getTanggalJatuhTempo(product),
        segmentation: proposal.regionalName,
        started: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'OL Assigned', 'Date'),
        startedMonth: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'OL Assigned', 'Month'),
        year: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'OL Assigned', 'Year'),
        dpdl: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'DPDL Finalize', 'Date'),
        dpdlMonth: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'DPDL Finalize', 'Month'),
        dpdlYear: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'DPDL Finalize', 'Year'),
        fasilitasKredit: product.facility,
        currency: product.currency,
        nominal: product.totalPlafond,
        status: this._getStatusData(proposal),
        information: '',
        weeklyProcessUpdate: proposal.status,
        reason: '',
        complianceReview: proposal.isCompliance,
        tanggalCompliance: this._getTanggalComplianceReview(proposal),
      };

      worksheet.addRow(row);
    });
  }

  private _applyStyles(worksheet: ExcelJS.Worksheet): void {
    super.applyStyles('D3E9FF');

    this.worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
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
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      });
    });
  }
}
