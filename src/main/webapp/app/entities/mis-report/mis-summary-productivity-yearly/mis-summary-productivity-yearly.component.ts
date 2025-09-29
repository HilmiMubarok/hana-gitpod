import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import * as ExcelJS from 'exceljs';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker/datepicker';
export const YEAR_FORMATS = {
  parse: { dateInput: 'YYYY' },
  display: { dateInput: 'YYYY', monthYearLabel: 'YYYY', dateA11yLabel: 'YYYY', monthYearA11yLabel: 'YYYY' },
};

@Component({
  selector: 'jhi-mis-summary-productivity-yearly',
  templateUrl: './mis-summary-productivity-yearly.component.html',
  styleUrls: ['./mis-summary-productivity-yearly.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: YEAR_FORMATS }],
})
export class MisSummaryProductivityYearlyComponent extends AbstractExcelMISReport {
  misYearlyReports: FormGroup;
  @ViewChild('formContainer', { static: true }) formContainer: ElementRef;
  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    super(misReportService);
    this.misYearlyReports = new FormGroup({
      year: new FormControl(''),
      customerStatus: new FormControl(''),
      approvalFasilitas: new FormControl(''),
      monthYearStart: new FormControl(),
      monthYearEnd: new FormControl(),
    });
  }
  menu = 'yearly';
  onMenuChanged(): void {
    this._resetForms();
  }

  private _resetForms(): void {
    if (this.misYearlyReports) {
      this.misYearlyReports.reset();
    }
  }
  formatMonthYear(date: Date | null): string {
    if (!date) {
      return '';
    }
    const d = date instanceof Date ? date : new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${month}-${year}`;
  }
  generateMISYearlyReport() {
    let params;
    const yearControl = this.misYearlyReports.get('year')?.value;
    const year = yearControl ? moment(yearControl).year().toString() : null;
    const startMonthYearly = this.misYearlyReports.get('monthYearStart')?.value;
    const endMonthYearly = this.misYearlyReports.get('monthYearEnd')?.value;
    const approvalFasilitass = this._convertStatusToString(this.misYearlyReports.get('approvalFasilitas')?.value);
    const customerStatuss = this._convertStatusToString(this.misYearlyReports.get('customerStatus')?.value);
    if (this.menu === 'monthly') {
      if (!this.misYearlyReports.get('monthYearStart')?.value || !this.misYearlyReports.get('monthYearEnd')?.value) {
        this.messageService.add({
          severity: 'error',
          summary: 'Warning',
          detail: 'Please, Select Date Range.',
        });
        return;
      }
    } else {
      if (!year) {
        this.messageService.add({
          severity: 'error',
          summary: 'Warning',
          detail: 'Please, Select Date Range.',
        });
        return;
      }
    }
    if (this.menu === 'yearly') {
      params = {
        year,
        customerStatus: customerStatuss,
        rank: approvalFasilitass,
      };
    } else {
      params = {
        startMonth: this.formatMonthYear(startMonthYearly),
        endMonth: this.formatMonthYear(endMonthYearly),
        rank: approvalFasilitass,
        customerStatus: customerStatuss,
      };
    }
    if (this.menu === 'monthly') {
      this.misReportService.getMisSummaryProductivityMonthly(params).subscribe({
        next: res => this.processGenerates(res.body, 'MIS-CRO-SUMMARY-REPORT'),
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
    } else {
      this.misReportService.getMisSummaryProductivityYearly(params).subscribe({
        next: res => this.processGenerate(res.body, 'MIS-CRO-SUMMARY-REPORT'),
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
  }

  protected worksheet: ExcelJS.Worksheet;

  private processGenerate(data, fileName) {
    this.workbook = new ExcelJS.Workbook();
    this.worksheet = this.workbook.addWorksheet('Yearly Summary');
    this.processData(data);
    this.downloadFile(fileName);
  }

  private transformToWorksheetData(rawData: any[]) {
    const result: any[] = [];

    rawData.forEach(item => {
      item.reviewers?.forEach(reviewer => {
        const monthsData: number[] = Array(12 * 3).fill(0);
        reviewer.data?.forEach(conditionBlock => {
          const condition = conditionBlock.condition;
          const conditionIndex = this.getConditionIndex(condition);
          conditionBlock.summaryMonthly?.forEach(summary => {
            const monthIndex = this.getMonthIndex(summary.month);
            if (monthIndex >= 0 && conditionIndex >= 0) {
              monthsData[monthIndex * 3 + conditionIndex] = summary.count;
            }
          });
        });

        result.push({
          reviewer: reviewer.fullName,
          months: monthsData,
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
    return months.findIndex(m => m.toLowerCase() === month.toLowerCase());
  }

  private getConditionIndex(condition: string): number {
    const conditions = ['Approved', 'Reject', 'Cancel'];
    return conditions.findIndex(c => c.toLowerCase() === condition.toLowerCase());
  }

  protected processData(data: any[]): void {
    const transformed = this.transformToWorksheetData(data);
    this.addYearlySummaryData(this.worksheet, transformed);
  }

  private addYearlySummaryData(worksheet: ExcelJS.Worksheet, data: any[]): void {
    const year = this.misYearlyReports.get('year')?.value ? moment(this.misYearlyReports.get('year')?.value).year() : 2025;
    const approvalFasilitass = this._convertStatusToString(this.misYearlyReports.get('approvalFasilitas')?.value);
    const customerStatuss = this._convertStatusToString(this.misYearlyReports.get('customerStatus')?.value);

    // Add labels at the top left before creating columns
    const yearRow = worksheet.getRow(1);
    yearRow.getCell('A').value = 'YEAR';
    yearRow.getCell('B').value = year;

    const customerStatusRow = worksheet.getRow(2);
    customerStatusRow.getCell('A').value = 'Customer Status';
    customerStatusRow.getCell('B').value = customerStatuss;

    const approvalFasilitasRow = worksheet.getRow(3);
    approvalFasilitasRow.getCell('A').value = 'Approval Fasilitas';
    approvalFasilitasRow.getCell('B').value = approvalFasilitass;

    // Start creating the main table from row 5 (leaving a gap)
    const startRow = 5;

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
    const statuses = ['Approved', 'Reject', 'Cancel'];

    // Title row for the year (now at row 5)
    worksheet.mergeCells(startRow, 2, startRow, 1 + months.length * statuses.length);
    const titleCell = worksheet.getCell(startRow, 2);
    titleCell.value = `YEAR ${year}`;
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00B0F0' } };

    // Reviewer column header
    worksheet.mergeCells(startRow, 1, startRow + 2, 1);
    const firstColCell = worksheet.getCell(startRow + 1, 1);
    firstColCell.value = 'Reviewer';
    firstColCell.font = { bold: true };
    firstColCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Month headers (row 6)
    let col = 2;
    months.forEach(month => {
      worksheet.mergeCells(startRow + 1, col, startRow + 1, col + statuses.length - 1);
      const cell = worksheet.getCell(startRow + 1, col);
      cell.value = month;
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      col += statuses.length;
    });

    // Status headers (row 7)
    col = 2;
    months.forEach(() => {
      statuses.forEach((status, idx) => {
        const cell = worksheet.getCell(startRow + 2, col + idx);
        cell.value = status;
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
      col += statuses.length;
    });

    const totalPerMonthPerStatus = Array(12 * statuses.length).fill(0);

    // Data rows (starting from row 8)
    let currentRow = startRow + 3;
    data.forEach(branchData => {
      const rowValues: (string | number)[] = [branchData.reviewer];

      for (let i = 0; i < 12 * statuses.length; i++) {
        const value = branchData.months?.[i] || 0;
        rowValues.push(value);
        totalPerMonthPerStatus[i] += value;
      }

      const dataRow = worksheet.getRow(currentRow);
      rowValues.forEach((value, index) => {
        dataRow.getCell(index + 1).value = value;
      });
      currentRow++;
    });

    // Total row
    const totalRowValues: (string | number)[] = ['Total'];
    totalPerMonthPerStatus.forEach(val => totalRowValues.push(val));

    const totalRow = worksheet.getRow(currentRow);
    totalRowValues.forEach((value, index) => {
      totalRow.getCell(index + 1).value = value;
    });
    totalRow.font = { bold: true };

    // Column widths
    worksheet.getColumn(1).width = 40;
    worksheet.getColumn(1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

    // Width for month columns
    for (let i = 2; i <= worksheet.columnCount; i++) {
      worksheet.getColumn(i).width = 15;
    }

    // Border and alignment for all cells (starting from the main table)
    for (let rowIndex = startRow; rowIndex <= currentRow; rowIndex++) {
      const row = worksheet.getRow(rowIndex);
      row.height = 20;
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    }

    // Background color for total row
    totalRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
      };
    });
  }
  // monthly
  private processGenerates(data, fileName) {
    this.workbook = new ExcelJS.Workbook();
    this.worksheet = this.workbook.addWorksheet('Monthly Summary');
    this.processDataMonthly(data);
    this.downloadFile(fileName);
  }

  private transformToWorksheetDataMonthly(rawData: any[]): any[] {
    const result: any[] = [];
    rawData.forEach(item => {
      item.reviewers?.forEach(cat => {
        result.push({
          reviewer: cat.fullName,
          dataMonthly: cat,
        });
      });
    });

    return result;
  }
  protected processDataMonthly(data: any[]): void {
    const transformed = this.transformToWorksheetDataMonthly(data);
    this.addMonthlySummaryData(this.worksheet, transformed);
  }

  private addMonthlySummaryData(worksheet: ExcelJS.Worksheet, data: any[]): void {
    const statuses = ['Approved', 'Reject', 'Cancel'];

    const startMonthYearly = this.misYearlyReports.get('monthYearStart')?.value;
    const endMonthYearly = this.misYearlyReports.get('monthYearEnd')?.value;

    const startFormatted = startMonthYearly ? moment(startMonthYearly).format('MMM YYYY') : '';
    const endFormatted = endMonthYearly ? moment(endMonthYearly).format('MMM YYYY') : '';
    const approvalFasilitass = this._convertStatusToString(this.misYearlyReports.get('approvalFasilitas')?.value);
    const customerStatuss = this._convertStatusToString(this.misYearlyReports.get('customerStatus')?.value);

    const periodTitle =
      startFormatted && endFormatted ? `Periode: ${startFormatted} - ${endFormatted}` : startFormatted || endFormatted || 'Periode';

    const periodeRow = worksheet.getRow(1);
    periodeRow.getCell('A').value = 'Periode';
    periodeRow.getCell('B').value = startFormatted;
    periodeRow.getCell('C').value = endFormatted;

    const customerStatusRow = worksheet.getRow(2);
    customerStatusRow.getCell('A').value = 'Customer Status';
    customerStatusRow.getCell('B').value = customerStatuss;

    const approvalFasilitasRow = worksheet.getRow(3);
    approvalFasilitasRow.getCell('A').value = 'Approval Fasilitas';
    approvalFasilitasRow.getCell('B').value = approvalFasilitass;

    const allCategories: string[] = [];
    data.forEach(r => {
      r.dataMonthly?.category?.forEach((cat: any) => {
        if (!allCategories.includes(cat.categoryName)) {
          allCategories.push(cat.categoryName);
        }
      });
    });

    const totalCols = allCategories.length * statuses.length * 2 + 1;

    // // === Judul Periode sekarang di baris 4 ===
    // worksheet.mergeCells(4, 1, 4, totalCols);
    // const periodCell = worksheet.getCell(4, 1);
    // periodCell.value = periodTitle;
    // periodCell.font = { bold: true, size: 16 };
    // periodCell.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A5:A7');
    worksheet.getCell('A5').value = 'Reviewer';
    worksheet.getCell('A5').font = { bold: true };
    worksheet.getCell('A5').alignment = { vertical: 'middle', horizontal: 'center' };

    allCategories.forEach((cat, cIdx) => {
      const offset = cIdx * statuses.length * 2;

      worksheet.mergeCells(5, 2 + offset, 5, 1 + statuses.length * 2 + offset);
      worksheet.getCell(5, 2 + offset).value = cat;
      worksheet.getCell(5, 2 + offset).font = { bold: true, size: 14, color: { argb: 'FF0000' } };
      worksheet.getCell(5, 2 + offset).alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.mergeCells(6, 2 + offset, 6, 1 + statuses.length + offset);
      worksheet.getCell(6, 2 + offset).value = 'Total';
      worksheet.getCell(6, 2 + offset).font = { bold: true };
      worksheet.getCell(6, 2 + offset).alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.mergeCells(6, 2 + statuses.length + offset, 6, 1 + statuses.length * 2 + offset);
      worksheet.getCell(6, 2 + statuses.length + offset).value = 'Avg';
      worksheet.getCell(6, 2 + statuses.length + offset).font = { bold: true };
      worksheet.getCell(6, 2 + statuses.length + offset).alignment = { vertical: 'middle', horizontal: 'center' };

      statuses.forEach((s, idx) => {
        worksheet.getCell(7, 2 + offset + idx).value = s;
        worksheet.getCell(7, 2 + offset + idx).font = { bold: true };
        worksheet.getCell(7, 2 + offset + idx).alignment = { vertical: 'middle', horizontal: 'center' };
      });

      statuses.forEach((s, idx) => {
        worksheet.getCell(7, 2 + statuses.length + offset + idx).value = s;
        worksheet.getCell(7, 2 + statuses.length + offset + idx).font = { bold: true };
        worksheet.getCell(7, 2 + statuses.length + offset + idx).alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    const startRow = 8;
    data.forEach(r => {
      const rowValues: (string | number)[] = [r.reviewer];
      allCategories.forEach(catName => {
        const cat = r.dataMonthly.category?.find((c: any) => c.categoryName === catName);
        if (cat) {
          rowValues.push(cat.totalApproved || 0);
          rowValues.push(cat.totalReject || 0);
          rowValues.push(cat.totalCancel || 0);

          rowValues.push(cat.averageApproved || 0);
          rowValues.push(cat.averageReject || 0);
          rowValues.push(cat.averageCancel || 0);
        } else {
          rowValues.push(0, 0, 0, 0, 0, 0);
        }
      });
      worksheet.addRow(rowValues);
    });

    const lastRow = worksheet.lastRow!.number;
    const totalRow = worksheet.addRow([]);

    totalRow.getCell(1).value = 'TOTAL';
    totalRow.getCell(1).font = { bold: true };

    for (let col = 2; col <= totalCols; col++) {
      const colLetter = worksheet.getColumn(col).letter;
      totalRow.getCell(col).value = { formula: `SUM(${colLetter}${startRow}:${colLetter}${lastRow})` };
      totalRow.getCell(col).font = { bold: true };
    }

    worksheet.getColumn(1).width = 50;
    worksheet.getColumn(1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

    worksheet.eachRow((row, rowNumber) => {
      row.height = 20;
      if (rowNumber >= 5) {
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
      }
    });
  }
}
