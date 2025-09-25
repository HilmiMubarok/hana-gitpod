import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import * as ExcelJS from 'exceljs';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { InternalService } from 'app/entities/internal/internal.service';

@Component({
  selector: 'jhi-mis-tambah-report',
  templateUrl: './mis-application-tracking-report.component.html',
  styleUrls: ['./mis-application-tracking.css', '../mis-report.css', '../disabled-style.scss'],
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

      .e-breadcrumb .e-breadcrumb-item .e-breadcrumb-text .e-anchor-wrap {
        align-items: inherit;
        display: inherit;
        color: #3c958f;
        font-size: 16px;
      }
    `,
  ],
})
export class MisApplicationTrackingReportComponent extends AbstractExcelMISReport implements OnInit {
  public lovStatus = [];
  public lovRegional = [];
  public date1: any;
  public date2: any;
  public allSelected = false;
  public allSelectedApplicationType = false;
  public allSelectedRegional = false;
  public MISApplicationTracking: FormGroup;
  private debounceTimer: any;

  public lovApplicationType = [
    'New',
    'Additional / Top Up',
    'Renewal',
    'Restructure',
    'Existing',
    'Others',
    'Renewal + Additional',
    'Renewal + Decrease',
  ];

  @ViewChild('formContainer', { static: true }) formContainer: ElementRef;

  constructor(public misReportService: MisReportService, public messageService: MessageService, public internalService: InternalService) {
    super(misReportService);

    this.MISApplicationTracking = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
      applicationType: new FormControl(''),
    });

    this.MISApplicationTracking.get('date1')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISApplicationTracking.get('date1').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.MISApplicationTracking.get('date2')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISApplicationTracking.get('date2').setValue(formattedDate, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.misReportService.getStatuses('MIS_APPLICATION_TRACKING_REPORT').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }

  onDateRangeFocus() {
    this.MISApplicationTracking.get('query')?.disable();
    this.applyDisabledStyle(this.formContainer.nativeElement, true);
  }

  onDateRangeBlur() {
    this.checkFieldStatus(); // This ensures search field behavior is updated accordingly
  }

  dateRangeHasValue(): boolean {
    return this.MISApplicationTracking.get('date1')?.value && this.MISApplicationTracking.get('date2')?.value;
  }

  clearDateRange(): void {
    this.MISApplicationTracking.get('date1')?.reset();
    this.MISApplicationTracking.get('date2')?.reset();
  }

  checkFieldStatus() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      const startDate = this.MISApplicationTracking.get('date1')?.value;
      const endDate = this.MISApplicationTracking.get('date2')?.value;
      const status = this.MISApplicationTracking.get('status')?.value;

      if (startDate || endDate || (status && status.length > 0)) {
        this.applyDisabledStyle(this.formContainer.nativeElement, true);
      } else {
        this.applyDisabledStyle(this.formContainer.nativeElement, false);
      }
    }, 50);
  }

  public toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.MISApplicationTracking.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.MISApplicationTracking.get('status')?.setValue(null);
    }
  }

  public toggleSelectApplicationTypeAll(): void {
    this.allSelectedApplicationType = !this.allSelectedApplicationType;
    if (this.allSelectedApplicationType) {
      this.MISApplicationTracking.get('applicationType')?.setValue([...this.lovApplicationType]);
    } else {
      this.MISApplicationTracking.get('applicationType')?.setValue(null);
    }
  }

  protected setUpColumns(columns): void {
    this.worksheet.columns = columns;
  }

  // private _processGenerate(data, fileName) {
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet('Sheet 1');

  //   this.setUpColumns(this.columns);

  //   // if data is empty, generate an empty file
  //   if (!data || data.length === 0) {
  //     this.applyStyles();
  //     this.downloadFile(fileName);
  //     return;
  //   }

  //   // Add data to worksheet
  //   this.processData(data);

  //   this._applyStyles();
  //   this._setAutoWidthForAllColumns();
  //   this._setAutoHeightForAllRows();
  //   this.downloadFile(fileName);
  // }

  private _processGenerate(data, fileName) {
    this.setUpColumns(this.columns);

    // if data is empty, generate an empty file
    if (!data || data.length === 0) {
      this.applyStyles();
      this.downloadFile(fileName);
      return;
    }

    // Add data to worksheet
    this.processData(data);

    this._applyStyles();
    this._setAutoWidthForAllColumns();
    this.downloadFile(fileName);
    this._resetData();
  }

  generateMISApplicationTracking() {
    let params;

    if (this.MISApplicationTracking.get('query')?.value) {
      params = { query: this.MISApplicationTracking.get('query')?.value };

      this.misReportService.getMisApplicationTracking(params).subscribe({
        next: res => this._processGenerate(res.body, 'MIS_Credit_Proposal_Timeline_Summary'),
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
      return;
    }

    if (!this.MISApplicationTracking.get('date1')?.value || !this.MISApplicationTracking.get('date2')?.value) {
      this.messageService.add({
        severity: 'error',
        summary: 'Warning',
        detail: 'Please, entry Date Range.',
      });
      return;
    }

    params = {
      startDate: this.MISApplicationTracking.get('date1')?.value,
      endDate: this.MISApplicationTracking.get('date2')?.value,
      status: this._convertStatusToString(this.MISApplicationTracking.get('status')?.value),
      applicationType: this._convertStatusToStringApplicationType(this.MISApplicationTracking.get('applicationType')?.value),
    };

    if (params.startDate === params.endDate) {
      params.endDate = `${params.endDate} 23:59:59`;
    }

    this.misReportService.getMisApplicationTracking(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_Credit_Proposal_Timeline_Summary'),
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

  protected processData(data: any[]): void {
    data.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }

  get columns() {
    return [
      { header: 'No.', key: 'no' },
      { header: 'CIF', key: 'cif' },
      { header: 'Debtor Name', key: 'debtorName' },
      { header: 'Application Type', key: 'applicationType' },
      { header: 'RM', key: 'rm' },
      { header: 'Facility Type', key: 'facilityType' },
      { header: 'Maturity Date', key: 'maturityDate' },
      { header: 'Created Date', key: 'createdDate' },
    ];
  }

  private _applyStyles(): void {
    const headerColumns = ['no', 'cif', 'debtorName', 'applicationType', 'rm', 'facilityType', 'maturityDate', 'createdDate'];

    headerColumns.forEach(key => {
      const col = this.worksheet.getColumn(key);

      col.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };

      let maxLength = 10;
      col.eachCell({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length + 2);
      });
      col.width = maxLength;

      col.eachCell((cell, rowNumber) => {
        if (rowNumber === 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '228B22' }, // hijau muda
          };
          cell.font = { bold: true, color: { argb: '000000' } }; // font hitam
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        } else {
          // border untuk seluruh data
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }
      });
    });

    if (this.worksheet.rowCount === 1) {
      // hanya header
      const emptyRow = this.worksheet.addRow(['No Data Available', '', '', '', '', '', '', '']);

      // merge biar tulisan cuma sekali di kolom A sampai H
      this.worksheet.mergeCells(`A2:H2`);

      const mergedCell = this.worksheet.getCell('A2');
      mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
      mergedCell.font = { italic: true, color: { argb: '808080' } }; // abu-abu

      // kasih border untuk seluruh range (A2:H2)
      emptyRow.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }
  }

  // private _applyStyles(): void {
  //   super.applyStyles();
  //   this.columns.forEach(column => {
  //     const col = this.worksheet.getColumn(column.key);
  //     col.alignment = {
  //       vertical: 'middle',
  //       horizontal: 'center',
  //       wrapText: true,
  //     };

  //     const columnValue = this.worksheet.getColumn(column.key);

  //     const newValue = columnValue.values.map(value => {
  //       if (value) {
  //         return this._clearEmptyEntries(value.toString());
  //       }
  //       return value;
  //     });

  //     columnValue.values = newValue;
  //   });
  // }

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal: any, index: number): void {
    const row = {
      no: worksheet.rowCount,
      cif: proposal.cif ?? '',
      debtorName: proposal.debiturName ?? '',
      applicationType: proposal.applicationType ?? '',
      rm: proposal.rmName ?? '',
      facilityType: proposal.facilityType ?? '',
      maturityDate: proposal.maturityDate ? this._formatDate(proposal.maturityDate) : '',
      createdDate: proposal.createDate ? this._formatDate(proposal.createDate) : '',
    };

    worksheet.addRow(row);
  }
}
