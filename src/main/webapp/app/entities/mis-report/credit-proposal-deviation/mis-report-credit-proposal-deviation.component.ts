import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { InternalService } from 'app/entities/internal/internal.service';
import { APPLICATION_TYPE } from 'app/shared/constants/base.constants';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { style } from '@angular/animations';
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
export class MisReportCreditProposalDeviationComponent extends AbstractExcelMISReport implements OnInit {
  public lovStatus = [];
  public status: '';
  public date1: any;
  public date2: any;
  public listOfValue = [];
  public allSelected = false;
  public allSelectedRegion = false;
  public allSelectedCustomerType = false;
  public lovRegional = [];
  public lovCustomerType = ['NEW', 'EXISTING'];
  private parentIds = ['9901', '9902', '9903', '9904', '9905'];
  public displayedColumns: string[] = ['proposalNumber', 'cif', 'debtorName', 'customerType', 'proposalDate', 'status'];
  isDisabled = false;
  MisReportCPDeviation: FormGroup;
  searchResultPagination: any;
  queryDisabled = false;
  constructor(public misReportService: MisReportService, public messageService: MessageService, public internalService: InternalService) {
    super(misReportService);

    this.MisReportCPDeviation;

    this.MisReportCPDeviation = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
      regional: new FormControl(null),
      customerType: new FormControl(null),
      query: new FormControl(''),
    });

    this.MisReportCPDeviation.get('date1')?.valueChanges.subscribe(date => {
      this.checkField();
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MisReportCPDeviation.get('date1').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.MisReportCPDeviation.get('date2')?.valueChanges.subscribe(date => {
      this.checkField();
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MisReportCPDeviation.get('date2').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.MisReportCPDeviation.get('regional')?.valueChanges.subscribe(() => {
      this.checkField();
      if (
        Array.isArray(this.MisReportCPDeviation.get('regional')?.value) &&
        this.MisReportCPDeviation.get('regional')?.value.length === 0
      ) {
        this.MisReportCPDeviation.get('regional')?.setValue(null);
      }
    });
    this.MisReportCPDeviation.get('customerType')?.valueChanges.subscribe(() => this.checkField());
    this.MisReportCPDeviation.get('status')?.valueChanges.subscribe(() => this.checkField());
  }
  public checkField() {
    const date1 = this.MisReportCPDeviation.get('date1')?.value;
    const date2 = this.MisReportCPDeviation.get('date2')?.value;
    const status = this.MisReportCPDeviation.get('status')?.value;
    const regional = this.MisReportCPDeviation.get('regional')?.value;
    const customerType = this.MisReportCPDeviation.get('customerType')?.value;

    if (date1 || date2 || (status && status.length > 0) || (regional && regional.length > 0) || (customerType && customerType.length > 0)) {
      this.MisReportCPDeviation.get('query')?.disable();
      this.queryDisabled = true;
    } else {
      this.MisReportCPDeviation.get('query')?.enable();
      this.queryDisabled = false;
    }
  }
  public onSearchFocus() {
    this.isDisabled = true;
    this.MisReportCPDeviation.get('date1')?.disable();
    this.MisReportCPDeviation.get('date2')?.disable();
    this.MisReportCPDeviation.get('status')?.disable();
    this.MisReportCPDeviation.get('regional')?.disable();
    this.MisReportCPDeviation.get('customerType')?.disable();
  }

  public onSearchBlur() {
    const searchValue = this.MisReportCPDeviation.get('query')?.value;
    if (!searchValue) {
      this.isDisabled = false;
      this.MisReportCPDeviation.get('date1')?.enable();
      this.MisReportCPDeviation.get('date2')?.enable();
      this.MisReportCPDeviation.get('status')?.enable();
      this.MisReportCPDeviation.get('regional')?.enable();
      this.MisReportCPDeviation.get('customerType')?.enable();
    }
  }

  public searchResult = null;

  public clearSearch(): void {
    this.MisReportCPDeviation.get('query')?.reset();
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
  public loadingSearch = false;
  public doSearch(): void {
    this.loadingSearch = true;

    const predicate: object = {
      page: 0,
      query: this.MisReportCPDeviation.get('query')?.value,
      size: 10,
      idPosition: this.getLocStor('POS'),
    };

    predicate['target'] = 'credit_proposal_status';

    this.misReportService.searchCP(predicate).subscribe({
      next: res => {
        this.searchResult = res.body;
        const searchResultSort = this.searchResult.sort((a, b) => a.proposalDate - b.proposalDate);
        this.searchResultPagination = new MatTableDataSource(searchResultSort);
        this.searchResultPagination.paginator = this.paginator;
        this.loadingSearch = false;
      },
      error: (res: HttpErrorResponse) => console.error(res.message),
    });
  }
  @ViewChild('paginator') paginator: MatPaginator;
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
  ngOnInit(): void {
    this.getStatus();
    this._getRegionalLOV();
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
  public toggleSelectAllRegion(): void {
    this.allSelectedRegion = !this.allSelectedRegion;
    if (this.allSelectedRegion) {
      this.MisReportCPDeviation.get('regional')?.setValue([...this.lovRegional.map(internal => internal.id)]);
    } else {
      this.MisReportCPDeviation.get('regional')?.setValue(null);
    }
  }
  public toggleSelectAllCustomerType(): void {
    this.allSelectedCustomerType = !this.allSelectedCustomerType;
    if (this.allSelectedCustomerType) {
      this.MisReportCPDeviation.get('customerType')?.setValue([...this.lovCustomerType]);
    } else {
      this.MisReportCPDeviation.get('customerType')?.setValue(null);
    }
  }
  private _getRegionalLOV(): void {
    this.internalService
      .queryFilterBy({
        idInternalType: APPLICATION_TYPE.BUSINESS_UNIT,
        size: 9999,
        page: 0,
      })
      .pipe(
        map(response => response.body),
        map(internals =>
          internals
            .filter(internal => this.parentIds.includes(String(internal.parentId)))
            .map(internal => ({ id: internal.id, name: internal.facilityName }))
        )
      )
      .subscribe({
        next: internals => (this.lovRegional = internals),
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Regional Data' }),
      });
  }
  generateMISCreditDeviation() {
    this.misReportService.setLoading(true);

    let params;
    if (this.MisReportCPDeviation.get('query')?.value) {
      params = {
        query: this.MisReportCPDeviation.get('query')?.value,
      };
    } else {
      const startDate1 = this.MisReportCPDeviation.get('date1')?.value;
      const endDate2 = this.MisReportCPDeviation.get('date2')?.value;
      const statuss = this._convertStatusToString(this.MisReportCPDeviation.get('status')?.value);
      // Validasi untuk startDate, endDate, dan status
      if (!startDate1) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please, entry Start Date.' });
        return;
      } else if (!endDate2) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please, entry End Date.' });
        return;
      } else if (!statuss) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please, entry Status.' });
        return;
      }
      params = {
        startDate: startDate1,
        endDate: endDate2,
        status: statuss,
        regional: this._convertStatusToString(this.MisReportCPDeviation.get('regional')?.value),
        customerType: this._convertStatusToString(this.MisReportCPDeviation.get('customerType')?.value),
      };
    }
    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_Credit_Proposal_Deviation'),
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
    this.setUpColumns(this.columns);
    if (!data || data.length === 0) {
      this.applyStyles('ff4285f4');
      this.downloadFile(fileName);
      return;
    }
    // Add data to worksheet
    this.processData(data);
    this._applyStyles();
    this.downloadFile(fileName);
    this._resetData();
  }
  protected processData(data: any[]): void {
    data.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }
  get columns(): any[] {
    return [
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

    const rowEnd = rowStart + covenantData.length - 1;

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
  private _applyStyles(): void {
    super.applyStyles('ff4285f4');
    const columnsToBeWraped = ['covenantStatus', 'covenantDeviations'];
    columnsToBeWraped.forEach(column => {
      this.worksheet.getColumn(column).alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    });
  }
  public _convertStatusToString(status: Array<string>): string {
    if (status === null) {
      return null;
    }
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
