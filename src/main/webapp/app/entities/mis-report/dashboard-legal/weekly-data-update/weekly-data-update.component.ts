import { Component, OnInit } from '@angular/core';
import { WeeklyDataUpdateService } from './weekly-data-update.service';

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
export class WeeklyDataUpdateComponent implements OnInit {
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

  constructor(private weeklyDataUpdateService: WeeklyDataUpdateService) {
    const now = new Date();
    this.selectedWeek = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  creditOptions = [
    { key: 'All', value: 'Credit Legal Department (HO + OR)' },
    { key: 'R1', value: 'Credit Legal Head Office (HO)' },
    { key: 'R2', value: 'Credit Legal Out Region (OR)' },
    // { key: 'Dummy', value: 'Dummy Data (Testing)' },
  ];

  ngOnInit(): void {
    this.getData();
  }

  // generate(): void {
  //   this.getData();
  // }

  getData(): void {
    // if (this.selectedCredit === 'Dummy') {
    //   this.weeklyData = {
    //     review: 10,
    //     legalDocs: 20,
    //     onSchedule: 15,
    //     pending: 5,
    //     done: 8,
    //   };
    //   this.prepareChartData();
    //   return;
    // }

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
}
