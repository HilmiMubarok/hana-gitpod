import { Component, OnInit } from '@angular/core';
import { WeeklyDataUpdateService } from './weekly-data-update.service';
import { AbstractExcelMISReport } from '../../abstract-excel-report';
import { MisReportService } from '../../mis-report.service';

interface PieWeeklyData {
  review: number;
  legalDocs: number;
  onSchedule: number;
  pending: number;
  done: number;
}

interface weeklyDataUpdateResponse {
  month: string;
  region: string | null;
  summary: PieWeeklyData;
  totalSummary: number;
}

@Component({
  selector: 'jhi-weekly-data-update',
  templateUrl: './weekly-data-update.component.html',
  styleUrls: ['./pie-chart-weekly-data-update.style.css'],
})
export class WeeklyDataUpdateComponent extends AbstractExcelMISReport implements OnInit {
  selectedCredit = 'All';
  selectedWeek: string;
  weeklyData: PieWeeklyData = { review: 0, legalDocs: 0, onSchedule: 0, pending: 0, done: 0 };
  chartData: any;
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 20,
          font: {
            size: 14,
          },
        },
      },
    },
  };

  colorPalette = ['#3b8dbc', '#00a65a', '#f39c12', '#dd4b39', '#605ca8'];
  defaultBorderRadius = 5;

  constructor(public misReportService: MisReportService, private weeklyDataUpdateService: WeeklyDataUpdateService) {
    super(misReportService);

    const now = new Date();
    this.selectedWeek = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  creditOptions = [
    { key: 'All', value: 'Credit Legal Department (HO + OR)' },
    { key: 'R1', value: 'Credit Legal Head Office (HO)' },
    { key: 'R2', value: 'Credit Legal Out Region (OR)' },
  ];

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.weeklyDataUpdateService
      .getWeeklyDataUpdateReport(this.selectedWeek, this.selectedCredit)
      .subscribe((res: weeklyDataUpdateResponse[]) => {
        if (res && res.length > 0 && res[0].summary) {
          this.weeklyData = res[0].summary;
        } else {
          this.weeklyData = {
            review: 10,
            legalDocs: 20,
            onSchedule: 15,
            pending: 5,
            done: 8,
          };
        }
        this.prepareChartData();
      });
  }

  prepareChartData(): void {
    this.chartData = {
      labels: ['Review By Legal', 'Legal Docs Done', 'On Schedule Signing', 'Pending by Branch / Debtor', 'Done DPDL'],
      datasets: [
        {
          data: [
            this.weeklyData.review,
            this.weeklyData.legalDocs,
            this.weeklyData.onSchedule,
            this.weeklyData.pending,
            this.weeklyData.done,
          ],
          backgroundColor: this.colorPalette,
          hoverBackgroundColor: this.colorPalette.map(color => this.darkenHexColor(color, 15)),
          borderRadius: this.defaultBorderRadius,
          borderSkipped: false,
        },
      ],
    };
  }

  darkenHexColor(hex: string, percent: number): string {
    const r = parseInt(hex.substring(1, 3), 16) - percent;
    const g = parseInt(hex.substring(3, 5), 16) - percent;
    const b = parseInt(hex.substring(5, 7), 16) - percent;

    return '#' + this._clampToHex(r) + this._clampToHex(g) + this._clampToHex(b);
  }

  private _clampToHex(value: number): string {
    const v = Math.max(0, Math.min(255, value));
    return v.toString(16).padStart(2, '0');
  }

  onCreditSelected(event: any): void {
    this.selectedCredit = event.value || event;
    this.getData();
  }

  get columns() {
    return [
      { header: 'Kategori', key: 'kategori' },
      { header: 'Jumlah', key: 'jumlah' },
      { header: 'Persentase', key: 'persentase' },
    ];
  }

  generate(): void {
    const data = this._buildReportRows();
    this.processGenerate(data);
  }

  protected processGenerate(data: any[]): void {
    this.setUpColumns(this.columns);

    if (!data || data.length === 0) {
      this.applyStyles();
      this.downloadFile('Weekly_Report_' + this.selectedWeek);
      return;
    }

    this._addReportHeader();

    this.processData(data);

    this._applyStyles();

    this._setAutoWidthForAllColumns();
    this.downloadFile('Weekly_Report_' + this.selectedWeek);
    this._resetData();
  }

  private _applyStyles(): void {
    this.columns.forEach(column => {
      const columnValue = this.worksheet.getColumn(column.key);
      const newValue = columnValue.values.map(value => {
        if (value) {
          return this._clearEmptyEntries(value.toString());
        }
        return value;
      });
      columnValue.values = newValue;
    });

    this.worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 4) {
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
      }
    });
  }

  protected processData(data: any[]): void {
    this.worksheet.getRow(5).values = this.columns.map(col => col.header);

    const headerRow = this.worksheet.getRow(5);
    headerRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    let rowIndex = 6;
    data.forEach(row => {
      const newRow = this.worksheet.addRow(row);
      newRow.eachCell(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
      rowIndex++;
    });

    const totalRow = {
      kategori: 'Total',
      jumlah: this._getTotalJumlah(),
      persentase: this._getTotalPersentase(data),
    };

    const excelTotalRow = this.worksheet.addRow(totalRow);
    excelTotalRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' },
      };
    });
  }

  private _getTotalPersentase(data: any[]): string {
    const totalJumlah = this._getTotalJumlah();

    if (!totalJumlah || isNaN(totalJumlah)) {
      return '0%';
    }

    const totalPersen = data.reduce((sum, item) => {
      const persen = (item.jumlah / totalJumlah) * 100;
      return sum + persen;
    }, 0);

    const formatted = totalPersen.toFixed(1).replace('.', ',');
    return `${formatted}%`;
  }

  private _addReportHeader(): void {
    const selectedCreditLabel = this.creditOptions.find(opt => opt.key === this.selectedCredit)?.value || 'Credit Legal Department';

    this.worksheet.mergeCells('A1:C1');
    this.worksheet.getCell('A1').value = 'WEEKLY DATA UPDATE';
    this.worksheet.getCell('A1').alignment = { horizontal: 'left', vertical: 'middle' };
    this.worksheet.getCell('A1').font = { bold: true };

    this.worksheet.mergeCells('A2:C2');
    this.worksheet.getCell('A2').value = selectedCreditLabel;
    this.worksheet.getCell('A2').alignment = { horizontal: 'left', vertical: 'middle' };
    this.worksheet.getCell('A2').font = { bold: true };

    this.worksheet.mergeCells('A3:C3');
    this.worksheet.getCell('A3').value = `Periode : ${this._formatMonth(this.selectedWeek)}`;
    this.worksheet.getCell('A3').alignment = { horizontal: 'right', vertical: 'middle' };
    this.worksheet.getCell('A3').font = { italic: true };

    this.worksheet.addRow([]);

    this.worksheet.columns = [{ width: 35 }, { width: 12 }, { width: 15 }];
  }

  private _buildReportRows(): any[] {
    const s = this.weeklyData;
    const t = this._getTotalJumlah();

    return [
      { kategori: 'Review by Legal', jumlah: s.review, persentase: this._getPercent(s.review, t) },
      { kategori: 'Legal Docs Done', jumlah: s.legalDocs, persentase: this._getPercent(s.legalDocs, t) },
      { kategori: 'On Schedule Signing', jumlah: s.onSchedule, persentase: this._getPercent(s.onSchedule, t) },
      { kategori: 'Pending by Branch / Debtor', jumlah: s.pending, persentase: this._getPercent(s.pending, t) },
      { kategori: 'Done DPDL', jumlah: s.done, persentase: this._getPercent(s.done, t) },
    ];
  }

  private _getTotalJumlah(): number {
    const s = this.weeklyData;
    return s.review + s.legalDocs + s.onSchedule + s.pending + s.done;
  }

  private _getPercent(count: number, total: number): string {
    if (!total || isNaN(total) || total === 0) {
      return '0%';
    }

    const percent = (count / total) * 100;
    const formatted = percent.toFixed(1).replace('.', ',');
    return `${formatted}%`;
  }

  private _formatMonth(monthStr: string): string {
    const [year, month] = monthStr.split('-');
    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  }
}
