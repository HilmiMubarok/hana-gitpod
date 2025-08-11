import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import * as ExcelJS from 'exceljs';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { PositionService } from 'app/entities/position/position.service';
import { POSITION_TYPE } from 'app/shared/constants/base.constants';
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
  public lovBranch = [];
  lovProposalType: { code: string; description: string }[] = [];
  misYearlyReports: FormGroup;
  @ViewChild('formContainer', { static: true }) formContainer: ElementRef;
  lovCustomerStatus = ['New', 'Existing'];
  lovApprovalFasilitas = ['New', 'Restructure', 'Additional', 'Decrease', 'Renewal', 'Other'];
  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    super(misReportService);
    this.misYearlyReports = new FormGroup({
      year: new FormControl(''),
      customerStatus: new FormControl(''),
      approvalFasilitas: new FormControl(''),
    });
  }
  menu = 'yearly';

  onMenuChanged(): void {
    this._resetForms();
  }

  private _resetForms(): void {
    if (this.misYearlyReports) {
      this.misYearlyReports.reset();
      this.allSelectedApprovalFasilitas = false;
    }
  }
  generateMISYearlyReport() {
    const yearControl = this.misYearlyReports.get('year')?.value;
    const year = yearControl ? moment(yearControl).year().toString() : null;
    const approvalFasilitas = this._convertStatusToString(this.misYearlyReports.get('approvalFasilitas')?.value);
    const customerStatus = this.misYearlyReports.get('customerStatus')?.value;

    const params = {
      year,
      customerStatus: customerStatus,
      approvalFasilitas: approvalFasilitas,
    };

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
        // Siapkan array kosong untuk semua bulan × kondisi
        const monthsData: number[] = Array(12 * 3).fill(0);

        reviewer.data?.forEach(conditionBlock => {
          const condition = conditionBlock.condition; // "Approved" | "Reject" | "Cancel"
          const conditionIndex = this.getConditionIndex(condition);

          conditionBlock.summaryMonthly?.forEach(summary => {
            const monthIndex = this.getMonthIndex(summary.month);
            if (monthIndex >= 0 && conditionIndex >= 0) {
              // Posisi kolom = (bulan × 3) + kondisi
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

    // ===== Baris 1: Judul =====
    worksheet.mergeCells(1, 2, 1, 1 + months.length * statuses.length);
    const titleCell = worksheet.getCell('B1');
    titleCell.value = `YEAR ${year}`;
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00B0F0' } };

    // ===== Baris 2: Nama Bulan =====
    worksheet.mergeCells('A1:A3');
    const firstColCell = worksheet.getCell('A2');
    firstColCell.value = 'Reviewer';
    firstColCell.font = { bold: true };
    firstColCell.alignment = { vertical: 'middle', horizontal: 'center' };

    let col = 2;
    months.forEach(month => {
      worksheet.mergeCells(2, col, 2, col + statuses.length - 1);
      const cell = worksheet.getCell(2, col);
      cell.value = month;
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      col += statuses.length;
    });

    // ===== Baris 3: Sub-header status per bulan =====
    col = 2;
    months.forEach(() => {
      statuses.forEach((status, idx) => {
        const cell = worksheet.getCell(3, col + idx);
        cell.value = status;
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
      col += statuses.length;
    });

    // ===== Data Reviewer =====
    // Atur jumlah kolom total (12 bulan × 3 status)
    const totalPerMonthPerStatus = Array(12 * statuses.length).fill(0);

    // Data reviewer
    data.forEach(branchData => {
      const rowValues: (string | number)[] = [branchData.reviewer];

      for (let i = 0; i < 12 * statuses.length; i++) {
        const value = branchData.months?.[i] || 0;
        rowValues.push(value);
        totalPerMonthPerStatus[i] += value;
      }

      worksheet.addRow(rowValues);
    });

    // ===== Baris Total =====
    const totalRowValues: (string | number)[] = ['Total'];
    totalPerMonthPerStatus.forEach(val => totalRowValues.push(val));

    const totalRow = worksheet.addRow(totalRowValues);
    totalRow.font = { bold: true };

    // ===== Styling =====
    // Kolom "Reviewer" lebar + teks rata kiri + wrap
    worksheet.getColumn(1).width = 40;
    worksheet.getColumn(1).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

    // Lebar kolom bulan
    for (let i = 2; i <= worksheet.columnCount; i++) {
      worksheet.getColumn(i).width = 15;
    }

    // Border dan alignment semua sel
    worksheet.eachRow(row => {
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
    });

    // Warna background untuk baris total
    totalRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' }, // Kuning
      };
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
    this.misYearlyReports.get('year')?.setValue(ctrlValue.toDate());
    datepicker.close();
  }

  allSelectedApprovalFasilitas = false;

  toggleSelectApprovalFasilitas(): void {
    this.allSelectedApprovalFasilitas = !this.allSelectedApprovalFasilitas;
    if (this.allSelectedApprovalFasilitas) {
      this.misYearlyReports.get('approvalFasilitas')?.setValue(this.lovApprovalFasilitas.map(item => item));
    } else {
      this.misYearlyReports.get('approvalFasilitas')?.setValue([]);
    }
  }
}
