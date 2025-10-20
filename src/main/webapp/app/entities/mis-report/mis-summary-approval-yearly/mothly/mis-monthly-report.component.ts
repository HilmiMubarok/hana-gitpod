import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment, { Moment } from 'moment';
import { MessageService } from 'primeng/api';
import { MisReportService } from '../../mis-report.service';
import * as ExcelJS from 'exceljs';
import { start } from 'repl';
import { AbstractExcelMISReport } from '../../abstract-excel-report';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MONTH_YEAR_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'jhi-mis-monthly',
  templateUrl: './mis-monthly-report.component.html',
  styleUrls: ['./mis-monthly.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS }],
})
export class MisMonthlySummaryApprovalComponent extends AbstractExcelMISReport implements OnInit {
  public lovBranch = [];
  protected worksheet: ExcelJS.Worksheet;

  misMonthlyReport: FormGroup;

  lovProposalType: { code: string; description: string }[] = [];

  @ViewChild('formContainer', { static: true }) formContainer: ElementRef;

  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    super(misReportService);
    this.misMonthlyReport = new FormGroup({
      startMonth: new FormControl(''),
      endMonth: new FormControl(''),
      proposalType: new FormControl(''),
      branchId: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.getBranch();
    this._getProposalTypes();
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

  generateMISMonthlyReport() {
    const startMonthValue = this.misMonthlyReport.get('startMonth')?.value;
    const endMonthValue = this.misMonthlyReport.get('endMonth')?.value;

    if (!startMonthValue || !endMonthValue) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select Start and End Month',
      });
      return;
    }

    const startMonth = moment(startMonthValue).format('MM-YYYY');
    const endMonth = moment(endMonthValue).format('MM-YYYY');

    const proposalType = this.misMonthlyReport.get('proposalType')?.value;
    const branchId = this.misMonthlyReport.get('branchId')?.value;

    const params = {
      startMonth,
      endMonth,
      proposalType,
      branchId,
    };

    this.misReportService.getMisMonthlyReport(params).subscribe({
      next: res => this.processGenerate(res.body, 'MIS-CRO-YEARLY-REPORT'),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to generate MIS Report',
        });
      },
    });
  }

  private processGenerate(data, fileName) {
    this.workbook = new ExcelJS.Workbook();
    this.worksheet = this.workbook.addWorksheet('MIS Monthly');

    const startDate = moment(this.misMonthlyReport.get('startMonth')?.value);
    const endDate = moment(this.misMonthlyReport.get('endMonth')?.value);
    if (!startDate.isValid() || !endDate.isValid()) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select Start and End Month' });
      return;
    }

    this.addMonthlyReportLayout(data, startDate, endDate);
    this.downloadFile(fileName);
  }

  private addMonthlyReportLayout(data: any[], startDate: moment.Moment, endDate: moment.Moment): void {
    const ws = this.worksheet;

    const allMonths = [
      { full: 'January', short: 'Jan' },
      { full: 'February', short: 'Feb' },
      { full: 'March', short: 'Mar' },
      { full: 'April', short: 'Apr' },
      { full: 'May', short: 'May' },
      { full: 'June', short: 'Jun' },
      { full: 'July', short: 'Jul' },
      { full: 'August', short: 'Aug' },
      { full: 'September', short: 'Sep' },
      { full: 'October', short: 'Oct' },
      { full: 'November', short: 'Nov' },
      { full: 'December', short: 'Dec' },
    ];

    const monthRange: { year: number; month: string; short: string }[] = [];
    const current = startDate.clone();
    while (current.isSameOrBefore(endDate, 'month')) {
      const mObj = allMonths[current.month()];
      monthRange.push({ year: current.year(), month: mObj.full, short: mObj.short });
      current.add(1, 'month');
    }

    const years = [...new Set(monthRange.map(m => m.year))];
    const columns = [
      { header: 'Branch', key: 'branch', width: 25 },
      ...monthRange.map(m => ({
        header: `${m.month}-${m.year}`,
        key: `${m.year}_${m.month}`,
        width: 16,
      })),
      { header: 'Total', key: 'total', width: 12 },
    ];
    ws.columns = columns;

    // Header merge baris pertama
    ws.mergeCells(1, 1, 2, 1);
    let col = 2;

    years.forEach(y => {
      const monthsInYear = monthRange.filter(m => m.year === y);
      const startCol = col;
      const endCol = col + monthsInYear.length - 1;

      ws.mergeCells(1, startCol, 1, endCol);
      const cell = ws.getCell(1, startCol);
      cell.value = `YEAR ${y}`;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = { bold: true, color: { argb: '000000' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B0F0' } };
      cell.border = this.fullBorder();

      col += monthsInYear.length;
    });

    // Kolom total
    ws.mergeCells(1, col, 2, col);
    const totalHeader = ws.getCell(1, col);
    totalHeader.value = 'Total';
    totalHeader.alignment = { horizontal: 'center', vertical: 'middle' };
    totalHeader.font = { bold: true };
    totalHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B0F0' } };
    totalHeader.border = this.fullBorder();

    // Baris 2 header bulan
    ws.getCell(2, 1).value = 'Branch';
    ws.getCell(2, 1).alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getCell(2, 1).font = { bold: true };
    ws.getCell(2, 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } };
    ws.getCell(2, 1).border = this.fullBorder();

    let colIndex = 2;
    monthRange.forEach(m => {
      const cell = ws.getCell(2, colIndex++);
      cell.value = m.month;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } };
      cell.border = this.fullBorder();
    });

    const totalLabelCell = ws.getCell(2, col);
    totalLabelCell.value = 'Total';
    totalLabelCell.alignment = { horizontal: 'center', vertical: 'middle' };
    totalLabelCell.font = { bold: true };
    totalLabelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B0F0' } };
    totalLabelCell.border = this.fullBorder();

    // Mulai isi data
    let currentRow = 3;
    const branchMap: Record<string, Record<string, number>> = {};

    const normalizeMonth = (name: string): string => {
      const lower = (name || '').toLowerCase();
      if (lower.startsWith('jan')) {
        return 'January';
      }
      if (lower.startsWith('feb')) {
        return 'February';
      }
      if (lower.startsWith('mar')) {
        return 'March';
      }
      if (lower.startsWith('apr')) {
        return 'April';
      }
      if (lower.startsWith('may')) {
        return 'May';
      }
      if (lower.startsWith('jun')) {
        return 'June';
      }
      if (lower.startsWith('jul')) {
        return 'July';
      }
      if (lower.startsWith('aug')) {
        return 'August';
      }
      if (lower.startsWith('sep')) {
        return 'September';
      }
      if (lower.startsWith('oct')) {
        return 'October';
      }
      if (lower.startsWith('nov')) {
        return 'November';
      }
      if (lower.startsWith('dec')) {
        return 'December';
      }
      return name;
    };

    data.forEach(main => {
      (main.data || []).forEach(yearData => {
        (yearData.branch || []).forEach(branch => {
          const branchName = branch.branchName || 'Unknown';
          branchMap[branchName] = branchMap[branchName] || {};
          (branch.summaryMonth || []).forEach((s: any) => {
            const keyMonth = normalizeMonth(s.month || '');
            const keyYear = s.year || yearData.year;
            const monthObj = monthRange.find(m => m.month === keyMonth && m.year === keyYear);
            if (monthObj) {
              const key = `${monthObj.year}_${monthObj.month}`;
              branchMap[branchName][key] = (branchMap[branchName][key] || 0) + (s.count || 0);
            }
          });
        });
      });
    });

    // Isi nilai ke baris Excel
    Object.entries(branchMap).forEach(([branchName, monthData]) => {
      const row = ws.getRow(currentRow);
      row.getCell(1).value = branchName;
      row.getCell(1).alignment = { horizontal: 'left' };
      row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } };

      let totalCount = 0;
      let colOffset = 2;

      monthRange.forEach(m => {
        const key = `${m.year}_${m.month}`;
        const val = monthData[key] || 0;
        const cell = row.getCell(colOffset++);
        cell.value = val;
        cell.alignment = { horizontal: 'center' };
        cell.border = this.fullBorder();
        totalCount += val;
      });

      const totalCell = row.getCell(colOffset);
      totalCell.value = totalCount;
      totalCell.alignment = { horizontal: 'center' };
      totalCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B0F0' } };
      totalCell.border = this.fullBorder();

      currentRow++;
    });

    // Baris total EOM
    const totalRow = ws.getRow(currentRow);
    totalRow.getCell(1).value = 'Total E.O.M';
    totalRow.getCell(1).font = { bold: true };
    totalRow.getCell(1).alignment = { horizontal: 'center' };
    totalRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
    totalRow.getCell(1).border = this.fullBorder();

    monthRange.forEach((_, i) => {
      const colLetter = ws.getColumn(2 + i).letter;
      const startRow = 3;
      const endRow = currentRow - 1;
      totalRow.getCell(2 + i).value = endRow >= startRow ? { formula: `SUM(${colLetter}${startRow}:${colLetter}${endRow})` } : 0;
      totalRow.getCell(2 + i).alignment = { horizontal: 'center' };
      totalRow.getCell(2 + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
      totalRow.getCell(2 + i).border = this.fullBorder();
    });

    const totalLetter = ws.getColumn(2 + monthRange.length).letter;
    const startRow = 3;
    const endRow = currentRow - 1;
    totalRow.getCell(2 + monthRange.length).value =
      endRow >= startRow ? { formula: `SUM(${totalLetter}${startRow}:${totalLetter}${endRow})` } : 0;
    totalRow.getCell(2 + monthRange.length).alignment = { horizontal: 'center' };
    totalRow.getCell(2 + monthRange.length).font = { color: { argb: '000000' }, bold: true };
    totalRow.getCell(2 + monthRange.length).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B0F0' } };
    totalRow.getCell(2 + monthRange.length).border = this.fullBorder();
  }

  // private addMonthlyReportLayout(data: any[], startDate: moment.Moment, endDate: moment.Moment): void {
  //   const ws = this.worksheet;

  //   const allMonths = [
  //     { full: 'January', short: 'Jan' },
  //     { full: 'February', short: 'Feb' },
  //     { full: 'March', short: 'Mar' },
  //     { full: 'April', short: 'Apr' },
  //     { full: 'May', short: 'May' },
  //     { full: 'June', short: 'Jun' },
  //     { full: 'July', short: 'Jul' },
  //     { full: 'August', short: 'Aug' },
  //     { full: 'September', short: 'Sep' },
  //     { full: 'October', short: 'Oct' },
  //     { full: 'November', short: 'Nov' },
  //     { full: 'December', short: 'Dec' },
  //   ];

  //   const monthRange: { year: number; month: string; short: string }[] = [];
  //   const current = startDate.clone();
  //   while (current.isSameOrBefore(endDate, 'month')) {
  //     const mObj = allMonths[current.month()];
  //     monthRange.push({ year: current.year(), month: mObj.full, short: mObj.short });
  //     current.add(1, 'month');
  //   }

  //   const years = [...new Set(monthRange.map(m => m.year))];
  //   const columns = [
  //     { header: 'Branch', key: 'branch', width: 25 },
  //     ...monthRange.map(m => ({
  //       header: `${m.short}-${m.year}`,
  //       key: `${m.year}_${m.short}`,
  //       width: 12,
  //     })),
  //     { header: 'Total', key: 'total', width: 12 },
  //   ];
  //   ws.columns = columns;

  //   ws.mergeCells(1, 1, 2, 1);
  //   let col = 2;

  //   years.forEach(y => {
  //     const monthsInYear = monthRange.filter(m => m.year === y);
  //     const startCol = col;
  //     const endCol = col + monthsInYear.length - 1;

  //     ws.mergeCells(1, startCol, 1, endCol);
  //     const cell = ws.getCell(1, startCol);
  //     cell.value = `YEAR ${y}`;
  //     cell.alignment = { horizontal: 'center', vertical: 'middle' };
  //     cell.font = { bold: true, color: { argb: '000000' } };
  //     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B0F0' } }; // 💠 Biru
  //     cell.border = this.fullBorder();

  //     col += monthsInYear.length;
  //   });

  //   ws.mergeCells(1, col, 2, col);
  //   const totalHeader = ws.getCell(1, col);
  //   totalHeader.value = 'Total';
  //   totalHeader.alignment = { horizontal: 'center', vertical: 'middle' };
  //   totalHeader.font = { bold: true };
  //   totalHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B0F0' } }; // 💠 Biru juga
  //   totalHeader.border = this.fullBorder();

  //   ws.getCell(2, 1).value = 'Branch';
  //   ws.getCell(2, 1).alignment = { horizontal: 'center', vertical: 'middle' };
  //   ws.getCell(2, 1).font = { bold: true };
  //   ws.getCell(2, 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } }; // 🌫 Abu-abu
  //   ws.getCell(2, 1).border = this.fullBorder();

  //   let colIndex = 2;
  //   monthRange.forEach(m => {
  //     const cell = ws.getCell(2, colIndex++);
  //     cell.value = m.short;
  //     cell.alignment = { horizontal: 'center', vertical: 'middle' };
  //     cell.font = { bold: true };
  //     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } }; // 🌫 Abu-abu
  //     cell.border = this.fullBorder();
  //   });

  //   const totalLabelCell = ws.getCell(2, col);
  //   totalLabelCell.value = 'Total';
  //   totalLabelCell.alignment = { horizontal: 'center', vertical: 'middle' };
  //   totalLabelCell.font = { bold: true };
  //   totalLabelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B0F0' } }; // 💠 Biru
  //   totalLabelCell.border = this.fullBorder();

  //   let currentRow = 3;
  //   const branchMap: Record<string, Record<string, number>> = {};

  //   data.forEach(main => {
  //     (main.data || []).forEach(yearData => {
  //       (yearData.branch || []).forEach(branch => {
  //         const branchName = branch.branchName || 'Unknown';
  //         branchMap[branchName] = branchMap[branchName] || {};
  //         (branch.summaryMonth || []).forEach((s: any) => {
  //           const keyMonth = s.month?.toLowerCase();
  //           const keyYear = s.year || yearData.year;
  //           const monthObj = monthRange.find(
  //             m => (m.month.toLowerCase() === keyMonth || m.short.toLowerCase() === keyMonth) && m.year === keyYear
  //           );
  //           if (monthObj) {
  //             const key = `${monthObj.year}_${monthObj.short}`;
  //             branchMap[branchName][key] = (branchMap[branchName][key] || 0) + (s.count || 0);
  //           }
  //         });
  //       });
  //     });
  //   });

  //   Object.entries(branchMap).forEach(([branchName, monthData]) => {
  //     const row = ws.getRow(currentRow);
  //     row.getCell(1).value = branchName;
  //     row.getCell(1).alignment = { horizontal: 'left' };
  //     row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } }; // 🌫 Kolom Branch abu

  //     let totalCount = 0;
  //     let colOffset = 2;

  //     monthRange.forEach(m => {
  //       const key = `${m.year}_${m.short}`;
  //       const val = monthData[key] || 0;
  //       const cell = row.getCell(colOffset++);
  //       cell.value = val;
  //       cell.alignment = { horizontal: 'center' };
  //       cell.border = this.fullBorder();
  //       totalCount += val;
  //     });

  //     const totalCell = row.getCell(colOffset);
  //     totalCell.value = totalCount;
  //     totalCell.alignment = { horizontal: 'center' };
  //     totalCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B0F0' } }; // 💠 Biru Total
  //     totalCell.border = this.fullBorder();

  //     currentRow++;
  //   });

  //   const totalRow = ws.getRow(currentRow);
  //   totalRow.getCell(1).value = 'Total E.O.M';
  //   totalRow.getCell(1).font = { bold: true };
  //   totalRow.getCell(1).alignment = { horizontal: 'center' };
  //   totalRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } }; // 💛 Kuning
  //   totalRow.getCell(1).border = this.fullBorder();

  //   monthRange.forEach((_, i) => {
  //     const colLetter = ws.getColumn(2 + i).letter;
  //     const startRow = 3;
  //     const endRow = currentRow - 1;
  //     totalRow.getCell(2 + i).value = endRow >= startRow ? { formula: `SUM(${colLetter}${startRow}:${colLetter}${endRow})` } : 0;
  //     totalRow.getCell(2 + i).alignment = { horizontal: 'center' };
  //     totalRow.getCell(2 + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } }; // 💛 Kuning
  //     totalRow.getCell(2 + i).border = this.fullBorder();
  //   });

  //   const totalLetter = ws.getColumn(2 + monthRange.length).letter;
  //   const startRow = 3;
  //   const endRow = currentRow - 1;
  //   totalRow.getCell(2 + monthRange.length).value =
  //     endRow >= startRow ? { formula: `SUM(${totalLetter}${startRow}:${totalLetter}${endRow})` } : 0;
  //   totalRow.getCell(2 + monthRange.length).alignment = { horizontal: 'center' };
  //   totalRow.getCell(2 + monthRange.length).font = { color: { argb: '000000' }, bold: true };
  //   totalRow.getCell(2 + monthRange.length).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B0F0' } }; // 💠 Biru total EOM
  //   totalRow.getCell(2 + monthRange.length).border = this.fullBorder();
  // }

  // atas fix

  // private addMonthlyReportLayout(data: any[], startDate: moment.Moment, endDate: moment.Moment): void {
  //   const ws = this.worksheet;

  //   const allMonths = [
  //     { full: 'January', short: 'Jan' },
  //     { full: 'February', short: 'Feb' },
  //     { full: 'March', short: 'Mar' },
  //     { full: 'April', short: 'Apr' },
  //     { full: 'May', short: 'May' },
  //     { full: 'June', short: 'Jun' },
  //     { full: 'July', short: 'Jul' },
  //     { full: 'August', short: 'Aug' },
  //     { full: 'September', short: 'Sep' },
  //     { full: 'October', short: 'Oct' },
  //     { full: 'November', short: 'Nov' },
  //     { full: 'December', short: 'Dec' },
  //   ];

  //   // === generate range bulan ===
  //   const monthRange: { year: number; month: string; short: string }[] = [];
  //   const current = startDate.clone();
  //   while (current.isSameOrBefore(endDate, 'month')) {
  //     const mObj = allMonths[current.month()];
  //     monthRange.push({ year: current.year(), month: mObj.full, short: mObj.short });
  //     current.add(1, 'month');
  //   }

  //   const years = [...new Set(monthRange.map(m => m.year))];
  //   console.log('[Month Range]', monthRange);
  //   console.log('[Years]', years);

  //   // === definisi kolom ===
  //   const columns = [
  //     { header: 'Branch', key: 'branch', width: 25 },
  //     ...monthRange.map(m => ({
  //       header: `${m.short}-${m.year}`,
  //       key: `${m.year}_${m.short}`,
  //       width: 12,
  //     })),
  //     { header: 'Total', key: 'total', width: 12 },
  //   ];
  //   ws.columns = columns;

  //   // === HEADER MERGE ===
  //   ws.mergeCells(1, 1, 2, 1);
  //   let col = 2;
  //   years.forEach(y => {
  //     const monthsInYear = monthRange.filter(m => m.year === y);
  //     const startCol = col;
  //     const endCol = col + monthsInYear.length - 1;

  //     ws.mergeCells(1, startCol, 1, endCol);
  //     const cell = ws.getCell(1, startCol);
  //     cell.value = `YEAR ${y}`;
  //     cell.alignment = { horizontal: 'center', vertical: 'middle' };
  //     cell.font = { bold: true };
  //     this.setHeaderStyle(ws, 1, startCol, endCol);

  //     col += monthsInYear.length;
  //   });

  //   ws.mergeCells(1, col, 2, col);
  //   const totalHeader = ws.getCell(1, col);
  //   totalHeader.value = 'Total';
  //   totalHeader.alignment = { horizontal: 'center', vertical: 'middle' };
  //   totalHeader.font = { bold: true };
  //   totalHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00FF00' } };
  //   totalHeader.border = this.fullBorder();

  //   // === HEADER BARIS 2 ===
  //   ws.getCell(2, 1).value = 'Branch';
  //   ws.getCell(2, 1).alignment = { horizontal: 'center', vertical: 'middle' };
  //   ws.getCell(2, 1).font = { bold: true };
  //   ws.getCell(2, 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '92D050' } };
  //   ws.getCell(2, 1).border = this.fullBorder();

  //   let colIndex = 2;
  //   monthRange.forEach(m => {
  //     const cell = ws.getCell(2, colIndex++);
  //     cell.value = m.short;
  //     cell.alignment = { horizontal: 'center', vertical: 'middle' };
  //     cell.font = { bold: true };
  //     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '92D050' } };
  //     cell.border = this.fullBorder();
  //   });

  //   const totalLabelCell = ws.getCell(2, col);
  //   totalLabelCell.value = 'Total';
  //   totalLabelCell.alignment = { horizontal: 'center', vertical: 'middle' };
  //   totalLabelCell.font = { bold: true };
  //   totalLabelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00FF00' } };
  //   totalLabelCell.border = this.fullBorder();

  //   // === ISI DATA ===
  //   let currentRow = 3;

  //   console.log('[ALL MAIN DATA]', data);

  //   data.forEach(main => {
  //     console.log('[MAIN DATA]', main);

  //     const yearList = main?.data || [];
  //     console.log(
  //       '[ALL YEARS IN MAIN]',
  //       yearList.map(y => y.year)
  //     );

  //     yearList.forEach(yearData => {
  //       console.log('[YEAR DATA]', yearData.year, yearData);

  //       const branches = yearData?.branch || [];
  //       console.log(`[BRANCHES YEAR ${yearData.year}] Jumlah:`, branches.length);

  //       if (!branches.length) {
  //         console.warn(`[SKIP] Year ${yearData.year} tidak punya branch`);
  //         return;
  //       }

  //       branches.forEach(branch => {
  //         console.log('  [BRANCH]', branch.branchName, 'summaryMonth:', branch.summaryMonth);

  //         const row = ws.getRow(currentRow);
  //         row.getCell(1).value = branch.branchName || '';
  //         row.getCell(1).alignment = { horizontal: 'left' };

  //         let totalCount = 0;
  //         let colOffset = 2;

  //         monthRange.forEach(m => {
  //           let val = 0;

  //           // ambil data berdasarkan bulan & tahun, tidak hanya year match
  //           const found = (branch.summaryMonth || []).find(
  //             (s: any) =>
  //               (s.month?.toLowerCase() === m.short.toLowerCase() || s.month?.toLowerCase() === m.month.toLowerCase()) &&
  //               (s.year === m.year || !s.year) // toleransi jika summaryMonth tidak punya field year
  //           );

  //           console.log(
  //             `    [CHECK] ${branch.branchName} - ${m.short}-${m.year} →`,
  //             found ? found.count : 0,
  //             found ? '(found)' : '(not found)'
  //           );

  //           val = found && typeof found.count === 'number' ? found.count : 0;

  //           const cell = row.getCell(colOffset++);
  //           cell.value = val;
  //           cell.alignment = { horizontal: 'center' };
  //           cell.border = this.fullBorder();
  //           totalCount += val;
  //         });

  //         const totalCell = row.getCell(colOffset);
  //         totalCell.value = totalCount;
  //         totalCell.alignment = { horizontal: 'center' };
  //         totalCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00FF00' } };
  //         totalCell.border = this.fullBorder();

  //         console.log(`  [TOTAL] ${branch.branchName} (${yearData.year}): ${totalCount}`);
  //         currentRow++;
  //       });

  //       // tambahkan spasi antar tahun
  //       currentRow++;
  //     });
  //   });

  //   // === TOTAL AKHIR ===
  //   const totalRow = ws.getRow(currentRow);
  //   totalRow.getCell(1).value = 'Total E.O.M';
  //   totalRow.getCell(1).font = { bold: true };
  //   totalRow.getCell(1).alignment = { horizontal: 'center' };
  //   totalRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
  //   totalRow.getCell(1).border = this.fullBorder();

  //   monthRange.forEach((_, i) => {
  //     const colLetter = ws.getColumn(2 + i).letter;
  //     const startRow = 3;
  //     const endRow = currentRow - 1;
  //     totalRow.getCell(2 + i).value = endRow >= startRow ? { formula: `SUM(${colLetter}${startRow}:${colLetter}${endRow})` } : 0;
  //     totalRow.getCell(2 + i).alignment = { horizontal: 'center' };
  //     totalRow.getCell(2 + i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
  //     totalRow.getCell(2 + i).border = this.fullBorder();
  //   });

  //   const totalLetter = ws.getColumn(2 + monthRange.length).letter;
  //   const startRow = 3;
  //   const endRow = currentRow - 1;
  //   totalRow.getCell(2 + monthRange.length).value =
  //     endRow >= startRow ? { formula: `SUM(${totalLetter}${startRow}:${totalLetter}${endRow})` } : 0;
  //   totalRow.getCell(2 + monthRange.length).alignment = { horizontal: 'center' };
  //   totalRow.getCell(2 + monthRange.length).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00FF00' } };
  //   totalRow.getCell(2 + monthRange.length).border = this.fullBorder();
  // }

  private setHeaderStyle(ws: ExcelJS.Worksheet, row: number, startCol: number, endCol: number) {
    for (let i = startCol; i <= endCol; i++) {
      const cell = ws.getCell(row, i);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B0F0' } }; // biru muda
      cell.border = this.fullBorder();
      cell.font = { bold: true };
    }
  }

  private fullBorder(): Partial<ExcelJS.Borders> {
    const thin = 'thin' as ExcelJS.BorderStyle;
    return {
      top: { style: thin },
      left: { style: thin },
      bottom: { style: thin },
      right: { style: thin },
    };
  }

  protected processData(data: any[]): void {
    const transformed = this.transformToWorksheetData(data);
    this.addYearlySummaryData(this.worksheet, transformed);
  }

  protected addYearlySummaryData(worksheet: ExcelJS.Worksheet, data: any[]): void {
    let rowIndex = 3;

    data.forEach(item => {
      const row = worksheet.getRow(rowIndex++);
      row.getCell(1).value = item.branch;

      item.months.forEach((val: number, idx: number) => {
        row.getCell(2 + idx).value = val;
        row.getCell(2 + idx).alignment = { horizontal: 'center' };
        row.getCell(2 + idx).border = this.fullBorder();
      });

      const total = item.months.reduce((a, b) => a + b, 0);
      const totalCell = row.getCell(14);
      totalCell.value = total;
      totalCell.font = { bold: true };
      totalCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00FF00' } };
      totalCell.border = this.fullBorder();
    });
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

  private getMonthIndex(monthName: string): number {
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
    return months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
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

  chosenStartYearHandler(normalizedYear: moment.Moment): void {
    const ctrlValue = this.misMonthlyReport.get('startMonth')?.value ? moment(this.misMonthlyReport.get('startMonth')?.value) : moment();
    ctrlValue.year(normalizedYear.year());
    this.misMonthlyReport.get('startMonth')?.setValue(ctrlValue.toDate());
  }

  chosenStartMonthHandler(normalizedMonth: moment.Moment, datepicker: any): void {
    const ctrlValue = this.misMonthlyReport.get('startMonth')?.value ? moment(this.misMonthlyReport.get('startMonth')?.value) : moment();
    ctrlValue.month(normalizedMonth.month());
    this.misMonthlyReport.get('startMonth')?.setValue(ctrlValue.toDate());
    datepicker.close();
  }

  chosenEndMonthHandler(normalizedMonth: moment.Moment, datepicker: any): void {
    const ctrlValue = this.misMonthlyReport.get('endMonth')?.value ? moment(this.misMonthlyReport.get('endMonth')?.value) : moment();
    ctrlValue.month(normalizedMonth.month());
    this.misMonthlyReport.get('endMonth')?.setValue(ctrlValue.toDate());
    datepicker.close();

    this.validateMonthRange();
  }

  private validateMonthRange(): void {
    const startValue = this.misMonthlyReport.get('startMonth')?.value;
    const endValue = this.misMonthlyReport.get('endMonth')?.value;

    if (startValue && endValue && moment(endValue).isBefore(moment(startValue), 'month')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'End Month cannot be earlier than Start Month.',
      });
      this.misMonthlyReport.get('endMonth')?.setValue('');
    }
  }

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

  allSelectedBranch = false;

  toggleSelectBranch(): void {
    this.allSelectedBranch = !this.allSelectedBranch;
    if (this.allSelectedBranch) {
      this.misMonthlyReport.get('branchId')?.setValue(this.lovBranch.map(branch => branch.id));
    } else {
      this.misMonthlyReport.get('branchId')?.setValue([]);
    }
  }
}
