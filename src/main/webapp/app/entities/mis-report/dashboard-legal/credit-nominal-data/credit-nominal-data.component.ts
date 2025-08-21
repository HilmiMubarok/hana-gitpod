import { Component, OnInit } from "@angular/core";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material/core";
import { AbstractExcelMISReport } from "../../abstract-excel-report";
import { MisReportService } from "../../mis-report.service";
import { MessageService } from "primeng/api";
import { FormControl } from "@angular/forms";
import moment, { Moment } from "moment";
import { CreditNominalService } from "./credit-nominal.service";
import _ from "lodash";

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

interface PlafondCurrency {
  applicationId: string;
  productId: string;
  currency: string;
  plafond: number;
}

interface MonthPlafond {
  month: string;
  countTotalIDRPerMonth: number;
  countTotalUSDPerMonth: number;
  plafondCurrency: PlafondCurrency[];
}

interface RegionData {
  year: string;
  region: string;
  monthPlafond: MonthPlafond[];
  totalIDR: number;
  totalUSD: number;
}

type PlafondData = RegionData[];

@Component({
  selector: 'jhi-credit-nominal-data',
  templateUrl: './credit-nominal-data.component.html',
  styleUrls: ['./credit-nominal-data.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_ONLY_FORMATS },
  ],
})
export class CreditNominalDataComponent extends AbstractExcelMISReport implements OnInit {
  selectedCredit = 'All';
  selectedYear;
  dataSource = [];
  yearFormControl = new FormControl(moment());

  constructor(
    public misReportService: MisReportService,
    public messageService: MessageService,
    public creditNominalService: CreditNominalService
  ) {
    super(misReportService);
    this.selectedYear = new Date().getFullYear().toString();
  }

  onCreditSelected(event: any): void {
    this.selectedCredit = event.value || undefined;
    this.loadData();
  }

  onYearSelected(normalizedYear: Moment, dp: any) {
    const ctrlValue = this.yearFormControl.value;
    ctrlValue.year(normalizedYear.year());
    this.yearFormControl.setValue(ctrlValue);
    dp.close();

    this.selectedYear = this.yearFormControl.value.year().toString();
    this.loadData();
  }

  get columns(): string[] {
    return ['month', 'totalIDR', 'totalUSD'];
  }

  loadData(): void {
    this.creditNominalService.getCreditNominalData(this.selectedYear, this.selectedCredit).subscribe({
      next: res => (this.dataSource = res[0].monthPlafond),
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Credit Nominal Data' }),
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  generate(): void {
    this.processGenerate(this.dataSource);
  }

  processGenerate(data: PlafondData): void {
    this.setUpColumns(this.columns);

    if (!data || data.length === 0) {
      this.applyStyles();
      this.downloadFile('Credit_Nominal_Data_Report');
      return;
    }

    this.addReportHeader();

    this.processData(data);

    this._setAutoWidthForAllColumns();

    this.downloadFile('Credit_Nominal_Data_Report');

    this._resetData();
  }

  addReportHeader(): void {
    let credit;
    if (this.selectedCredit === 'All') {
      credit = 'Credit Legal Head Office (HO + OR)';
    } else if (this.selectedCredit === 'R1') {
      credit = 'Credit Legal Head Office (HO)';
    } else {
      credit = 'Credit Legal Out Region (OR)';
    }

    for (let i = 0; i < this.columns.length; i++) {
      this.worksheet.getCell(`${String.fromCharCode(65 + i)}1`).value = '';
    }

    this.worksheet.getCell('A1').value = 'CREDIT NOMINAL DATA';
    this.worksheet.getCell('A1').font = { bold: true };
    this.worksheet.getCell('A1').alignment = { horizontal: 'left' };

    this.worksheet.getCell('A2').value = credit;
    this.worksheet.getCell('A2').font = { bold: true };
    this.worksheet.getCell('A2').alignment = { horizontal: 'left' };

    const totalEOYColumn = String.fromCharCode(65 + (this.columns.length - 1));
    this.worksheet.getCell(`${totalEOYColumn}2`).value = this.selectedYear;
    this.worksheet.getCell(`${totalEOYColumn}2`).font = { bold: true };
    this.worksheet.getCell(`${totalEOYColumn}2`).alignment = { horizontal: 'right' };
  }

  processData(data): void {
    
    const headerRow = this.worksheet.getRow(4);
    const columns = _.cloneDeep(this.columns);

    const headerRowValues = columns.map(col => {
      if (col === 'month') {
        return 'MONTH';
      } else if (col === 'totalIDR') {
        return 'IDR';
      } else {
        return 'USD';
      }
    })

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
      };
    });

    let rowIndex = 5;
    data.forEach(item => {
      const row = this.worksheet.getRow(rowIndex);
      row.getCell(1).value = item.month;
      row.getCell(2).value = item.formattedIDR;
      row.getCell(3).value = item.formattedUSD;
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'right' };

        if(row.getCell(1).value === 'Total E.O.Y') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFF4D2' },
          };
        }
      });

      row.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
      
      rowIndex++;
    });
  }
}