import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { MisReportService } from '../../mis-report.service';
import { MessageService } from 'primeng/api';
import * as ExcelJS from 'exceljs';
import { AbstractExcelMISReport } from '../../abstract-excel-report';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import saveAs from 'file-saver';
import { MenuItemModel } from '@syncfusion/ej2-angular-navigations';

export const YEAR_FORMATS = {
  parse: { dateInput: 'YYYY' },
  display: { dateInput: 'YYYY', monthYearLabel: 'YYYY', dateA11yLabel: 'YYYY', monthYearA11yLabel: 'YYYY' },
};

@Component({
  selector: 'jhi-mis-summary-approval-yearly',
  templateUrl: './mis-summary-approval-yearly.component.html',
  styleUrls: ['./mis-summary-approval-yearly.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: YEAR_FORMATS }],
})
export class MisSummaryApprovalYearlyComponent extends AbstractExcelMISReport implements OnInit {
  public lovBranch = [];

  public menuItems: MenuItemModel[] = [{ text: 'Yearly' }, { text: 'Monthly' }];
  lovProposalType: { code: string; description: string }[] = [];
  misYearlyReport: FormGroup;

  @ViewChild('formContainer', { static: true }) formContainer: ElementRef;

  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    super(misReportService);
    this.misYearlyReport = new FormGroup({
      year: new FormControl(''),
      proposalType: new FormControl(''),
      branchId: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this._getProposalTypes();
    this.getBranch();
  }

  getBranch() {
    this.misReportService.getBranches().subscribe({
      next: res => {
        this.lovBranch = res.filter(branch => branch.internalTypeId === 'BRANCH');
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Branch' });
      },
    });
  }

  generateMISYearlyReport() {
    const yearControl = this.misYearlyReport.get('year')?.value;
    const year = yearControl ? moment(yearControl).year().toString() : null;

    const proposalType = this.misYearlyReport.get('proposalType')?.value;
    const branchId = this.misYearlyReport.get('branchId')?.value;

    const params = {
      year,
      proposalType,
      branchId: branchId ? branchId.join(',') : '',
    };

    this.misReportService.getMisYearlyReport(params).subscribe({
      next: res => this.processGenerate(res.body, 'MIS-CRO-YEARLY-REPORT'),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate MIS Report' });
      },
    });
  }

  protected worksheet: ExcelJS.Worksheet;

  private processGenerate(data, fileName) {
    this.workbook = new ExcelJS.Workbook();
    this.worksheet = this.workbook.addWorksheet('Yearly Summary');

    this.setUpColumns(this.worksheet);
    this.processData(data);

    this.downloadFile(fileName);
  }

  protected setUpColumns(worksheet: ExcelJS.Worksheet) {
    worksheet.columns = [
      { header: 'Branch Name', key: 'branchName', width: 30 },
      { header: 'January', key: 'january', width: 15 },
      { header: 'February', key: 'february', width: 15 },
      { header: 'March', key: 'march', width: 15 },
      { header: 'April', key: 'april', width: 15 },
      { header: 'May', key: 'may', width: 15 },
      { header: 'June', key: 'june', width: 15 },
      { header: 'July', key: 'july', width: 15 },
      { header: 'August', key: 'august', width: 15 },
      { header: 'September', key: 'september', width: 15 },
      { header: 'October', key: 'october', width: 15 },
      { header: 'November', key: 'november', width: 15 },
      { header: 'December', key: 'december', width: 15 },
      { header: 'Total E.O.M', key: 'totalEOM', width: 15 },
    ];
  }

  private transformToWorksheetData(rawData: any[]): { branch: string; months: number[] }[] {
    const result: { branch: string; months: number[] }[] = [];

    rawData.forEach(item => {
      item.branchDTOList?.forEach(branch => {
        const months = Array(12).fill(0);

        branch.summaryDTOList?.forEach(summary => {
          const index = this.getMonthIndex(summary.month);
          if (index >= 0) {
            months[index] = summary.count;
          }
        });

        result.push({
          branch: branch.branchName,
          months,
        });
      });
    });

    return result;
  }

  private getMonthIndex(month: string): number {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months.indexOf(month);
  }

  protected processData(data: any[]): void {
    const transformed = this.transformToWorksheetData(data);
    this.addYearlySummaryData(this.worksheet, transformed);
  }

  private addYearlySummaryData(worksheet: ExcelJS.Worksheet, data: any[]): void {
    const year = this.misYearlyReport.get('year')?.value ? moment(this.misYearlyReport.get('year')?.value).year() : 2025;

    const proposalType = this.misYearlyReport.get('proposalType')?.value;
    console.log('Proposal Type:', proposalType); // Debugging untuk memeriksa nilai

    let proposalTypeText = 'Tidak ada proposal type yang dipilih';
    if (Array.isArray(proposalType) && proposalType.length > 0) {
      proposalTypeText = proposalType.join(', ');
    } else if (typeof proposalType === 'string') {
      proposalTypeText = proposalType;
    }

    worksheet.mergeCells('A1:N1');
    const proposalTypeCell = worksheet.getCell('A1');
    proposalTypeCell.value = `Proposal Type: ${proposalTypeText}`;
    proposalTypeCell.font = { bold: true, size: 12 };
    proposalTypeCell.alignment = { vertical: 'middle', horizontal: 'center' };
    proposalTypeCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF00B0F0' },
    };

    worksheet.mergeCells('A2:N2');
    const titleCell = worksheet.getCell('A2');
    titleCell.value = `YEAR ${year}`;
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF00B0F0' },
    };

    const monthNames = [
      'Branch',
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
      'Total E.O.Y',
    ];
    const headerRow = worksheet.addRow(monthNames);
    headerRow.font = { bold: true };
    headerRow.eachCell(headerCell => {
      headerCell.alignment = { vertical: 'middle', horizontal: 'center' };
      headerCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF00B0F0' },
      };
      headerCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    let rowIndex = 3;
    const totalPerMonth = Array(12).fill(0);
    let totalEOY = 0;

    data.forEach(branchData => {
      const rowValues: (string | number)[] = [branchData.branch];
      let branchTotal = 0;

      for (let i = 0; i < 12; i++) {
        const value = branchData.months?.[i] || 0;
        rowValues.push(value);
        totalPerMonth[i] += value;
        branchTotal += value;
      }

      rowValues.push(branchTotal);
      const dataRow = worksheet.addRow(rowValues);
      dataRow.eachCell(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      totalEOY += branchTotal;
      rowIndex++;
    });

    const totalRowValues: (string | number)[] = ['Total E.O.Y', ...totalPerMonth, totalEOY];
    const totalRow = worksheet.addRow(totalRowValues);
    totalRow.font = { bold: true };
    totalRow.eachCell((cell, colNumber) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'fffefd32' },
      };
    });

    worksheet.columns.forEach(column => {
      column.width = 15;
    });
  }

  private _applyStyles(worksheet: ExcelJS.Worksheet) {
    worksheet.eachRow((row, rowNumber) => {
      row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });
  }
  chosenYearHandler(normalizedYear: moment.Moment, datepicker: any) {
    const ctrlValue = moment();
    ctrlValue.year(normalizedYear.year());
    this.misYearlyReport.get('year')?.setValue(ctrlValue.toDate());
    datepicker.close();
  }

  allSelectedProposalType = false;

  private _getProposalTypes(): void {
    this.misReportService.getProposalTypes().subscribe({
      next: res => {
        this.lovProposalType = res.map(item => ({
          code: item.value,
          description: item.statusDescription,
        }));
        console.log('Proposal Types:', this.lovProposalType);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Proposal Types' });
      },
    });
  }

  public toggleSelectProposalTypeAll(): void {
    this.allSelectedProposalType = !this.allSelectedProposalType;
    if (this.allSelectedProposalType) {
      this.misYearlyReport.get('proposalType')?.setValue(this.lovProposalType.map(item => item.code));
    } else {
      this.misYearlyReport.get('proposalType')?.setValue([]);
    }
  }

  allSelectedBranch = false;

  toggleSelectBranch(): void {
    this.allSelectedBranch = !this.allSelectedBranch;
    if (this.allSelectedBranch) {
      this.misYearlyReport.get('branchId')?.setValue(this.lovBranch.map(branch => branch.id));
    } else {
      this.misYearlyReport.get('branchId')?.setValue([]);
    }
  }
}
