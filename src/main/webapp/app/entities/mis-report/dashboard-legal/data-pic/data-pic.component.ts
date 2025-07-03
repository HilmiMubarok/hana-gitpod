import { MisReportService } from './../../mis-report.service';
import { Component, OnInit } from '@angular/core';
import { DataPicService } from './data-pic.service';
import { FormControl } from '@angular/forms';
import moment, { Moment } from 'moment';
import { AbstractExcelMISReport } from '../../abstract-excel-report';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MessageService } from 'primeng/api';
import _ from 'lodash';

interface DataSourcePIC {
  fullName: string;
  januray: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
  totalEOY?: number;
}

export const YEAR_ONLY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'jhi-data-pic',
  templateUrl: './data-pic.component.html',
  styleUrls: ['./data-pic.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_ONLY_FORMATS },
  ],
})
export class DataPicComponent extends AbstractExcelMISReport implements OnInit {

  constructor(private misReportService: MisReportService, private messageService: MessageService, private dataPicService: DataPicService) {
      super(misReportService);
      this.selectedYear = new Date().getFullYear().toString();
    }
  
    selectedCredit = 'R1';
    selectedRegion = 'R1';
    selectedYear;
    dataSource: DataSourcePIC[] = [];
    yearFormControl = new FormControl(moment());
  
    ngOnInit(): void {
      this.loadData();
    }
  
    loadData(): void {
      this.dataPicService.getDataPic(this.selectedYear, this.selectedRegion).subscribe({
        next: res => {
          const legalUser = res[0].legalUser.filter(user => user.username !== 'supercash');
  
          const data: DataSourcePIC[] = [];
  
          legalUser.forEach(user => {
            data.push({
              fullName: user.fullName,
              januray: user.summaryDTOList.find(summary => summary.month === 'January')?.count || 0,
              february: user.summaryDTOList.find(summary => summary.month === 'February')?.count || 0,
              march: user.summaryDTOList.find(summary => summary.month === 'March')?.count || 0,
              april: user.summaryDTOList.find(summary => summary.month === 'April')?.count || 0,
              may: user.summaryDTOList.find(summary => summary.month === 'May')?.count || 0,
              june: user.summaryDTOList.find(summary => summary.month === 'June')?.count || 0,
              july: user.summaryDTOList.find(summary => summary.month === 'July')?.count || 0,
              august: user.summaryDTOList.find(summary => summary.month === 'August')?.count || 0,
              september: user.summaryDTOList.find(summary => summary.month === 'September')?.count || 0,
              october: user.summaryDTOList.find(summary => summary.month === 'October')?.count || 0,
              november: user.summaryDTOList.find(summary => summary.month === 'November')?.count || 0,
              december: user.summaryDTOList.find(summary => summary.month === 'December')?.count || 0,
            });
          });
  
          this.dataSource = data;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Data PIC' });
        },
      });
    }
  
    onYearSelected(normalizedYear: Moment, dp: any) {
      const ctrlValue = this.yearFormControl.value;
      ctrlValue.year(normalizedYear.year());
      this.yearFormControl.setValue(ctrlValue);
      dp.close();
  
      this.selectedYear = this.yearFormControl.value.year().toString();
      this.loadData();
    }
  
    onCreditSelected(event: any): void {
      this.selectedRegion = event.value || undefined;
      this.loadData();
    }
  
    generate(): void {
      this.processGenerate(this.dataSource);
    }
  
    get columns(): any[] {
      return [
        'fullName',
        'januray',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
      ];
    }
  
    protected processData(data: DataSourcePIC[]): void {

      const headerRow = this.worksheet.getRow(4);
      const columns = _.cloneDeep(this.columns);
      columns.push('totalEOY');
      const headerRowValues = columns.map(col => {
        if (col === 'fullName') {
          return 'USERNAME CREDIT LEGAL OFFICER';
        } else if (col === 'januray') {
          return 'JANUARY';
        } else if (col === 'totalEOY') {
          return 'TOTAL E.O.Y'
        } else {
          return col.toUpperCase();
        }
      });
      headerRow.values = headerRowValues;
      headerRow.eachCell(cell => {
        cell.font = { bold: true };
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
          fgColor: { argb: 'FFF4A85F' }, 
        };
      });
  
      let rowIndex = 5;
      const totalsByMonth = Array(12).fill(0); 
  
      data.forEach(item => {
        const row = this.worksheet.getRow(rowIndex);
  
        row.getCell(1).value = item.fullName;
        row.getCell(2).value = item.januray;
        row.getCell(3).value = item.february;
        row.getCell(4).value = item.march;
        row.getCell(5).value = item.april;
        row.getCell(6).value = item.may;
        row.getCell(7).value = item.june;
        row.getCell(8).value = item.july;
        row.getCell(9).value = item.august;
        row.getCell(10).value = item.september;
        row.getCell(11).value = item.october;
        row.getCell(12).value = item.november;
        row.getCell(13).value = item.december;
  
        const rowTotal = [
          item.januray,
          item.february,
          item.march,
          item.april,
          item.may,
          item.june,
          item.july,
          item.august,
          item.september,
          item.october,
          item.november,
          item.december,
        ].reduce((sum, val) => sum + val, 0);
        
        item.totalEOY = rowTotal;
        row.getCell(14).value = rowTotal;
        row.getCell(14).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF4A85F' } };
  
        totalsByMonth[0] += item.januray;
        totalsByMonth[1] += item.february;
        totalsByMonth[2] += item.march;
        totalsByMonth[3] += item.april;
        totalsByMonth[4] += item.may;
        totalsByMonth[5] += item.june;
        totalsByMonth[6] += item.july;
        totalsByMonth[7] += item.august;
        totalsByMonth[8] += item.september;
        totalsByMonth[9] += item.october;
        totalsByMonth[10] += item.november;
        totalsByMonth[11] += item.december;
  
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
  
        row.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
  
        rowIndex++;
      });
  
      const totalRow = this.worksheet.getRow(rowIndex);
      totalRow.getCell(1).value = 'TOTAL E.O.M';
      totalRow.getCell(1).font = { bold: true };
  
      for (let i = 0; i < 12; i++) {
        totalRow.getCell(i + 2).value = totalsByMonth[i];
        totalRow.getCell(i + 2).font = { bold: true };
        totalRow.getCell(i + 2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF4A85F' } };
      }
  

      const grandTotal = totalsByMonth.reduce((sum, val) => sum + val, 0);
      totalRow.getCell(14).value = grandTotal;
      totalRow.getCell(14).font = { bold: true };
      totalRow.getCell(14).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF4A85F' } };
  
      totalRow.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF4A85F' },
        };
      });
  
      totalRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    }
  
    protected processGenerate(data: DataSourcePIC[]): void {
      this.setUpColumns(this.columns);
  
      if (!data || data.length === 0) {
        this.applyStyles();
        const date = moment(new Date()).format('YYYY-MM-DD');
        this.downloadFile('PIC_Data_Report_' + date);
        return;
      }
  
      this.addReportHeader();
  
      this.processData(data);
  
      this._setAutoWidthForAllColumns();
  
      this.downloadFile('PIC_Data_Report_' + moment(new Date()).format('YYYY-MM-DD'));
  
      this._resetData();
    }
  
    private addReportHeader(): void {
      let credit;
      if (this.selectedCredit === 'R1') {
        credit = 'Credit Legal Head Office (HO)';
      } else {
        credit = 'Credit Legal Out Region (OR)';
      }
  
      for (let i = 0; i < this.columns.length; i++) {
        this.worksheet.getCell(`${String.fromCharCode(65 + i)}1`).value = '';
      }
  
      this.worksheet.getCell('A2').value = credit;
      this.worksheet.getCell('A2').font = { bold: true };
      this.worksheet.getCell('A2').alignment = { horizontal: 'left' };
  
      const totalEOYColumn = String.fromCharCode(65 + this.columns.length);
      this.worksheet.getCell(`${totalEOYColumn}2`).value = this.selectedYear;
      this.worksheet.getCell(`${totalEOYColumn}2`).font = { bold: true };
      this.worksheet.getCell(`${totalEOYColumn}2`).alignment = { horizontal: 'right' };
    }
}
