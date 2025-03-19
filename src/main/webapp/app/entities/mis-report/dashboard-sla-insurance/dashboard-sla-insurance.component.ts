import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from 'app/dashboard/dashboard.service';

@Component({
  selector: 'jhi-dashboard-sla-insurance',
  templateUrl: './dashboard-sla-insurance.component.html',
  styleUrls: ['../dashboard-credam/dashboard.style.css'],
})
export class dashboardSlaInsuranceComponent implements OnInit {
  selectedTab: string;
  dppkfinalize = 1;
  dppkreview = 1;
  selectedDate = new Date();

  constructor(public dashboardService: DashboardService) {
    this.selectedTab = 'dashboard';
  }

  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Active', backgroundColor: 'purple' },
      { data: [], label: 'Existing', backgroundColor: 'brown' },
      { data: [], label: 'New', backgroundColor: 'green' },
      { data: [], label: 'To Be Release', backgroundColor: 'orange' },
    ],
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  ngOnInit() {
    this.fetchData();
  }

  setTab(tab: string): void {
    this.selectedTab = tab;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getMonthName(date: Date): string {
    return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this.fetchData();
  }

  fetchData(): void {
    const formattedDate = this.formatDate(this.selectedDate);
    this.dashboardService.getInsurance(formattedDate).subscribe(response => {
      const dataArray = response.body;
      if (!Array.isArray(dataArray)) {
        return;
      }

      let allInformation: any[] = [];
      dataArray.forEach(data => {
        if (Array.isArray(data.showcase)) {
          allInformation = allInformation.concat(
            data.showcase.filter(item => item.fromDate && item.thruDate) // Pastikan ada fromDate & thruDate
          );
        }
      });

      // Kelompokkan data berdasarkan bulan dari `fromDate` & `thruDate`
      const monthlyData = this.groupDataByMonth(allInformation);
      console.log(monthlyData, 'monthlyData');

      // Urutkan data berdasarkan bulan terkecil ke terbesar
      const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(`${a}`).getTime() - new Date(`${b}`).getTime());

      const getArrayData = (key: string) => dataArray.map(item => item[key] || 0);

      // Bangun data untuk chart berdasarkan hasil pengelompokan
      this.chartData = {
        labels: sortedMonths,
        datasets: [
          { data: getArrayData('activeCollateralStatus'), label: 'Active', backgroundColor: 'purple' },
          { data: getArrayData('existingCollateralStatus'), label: 'Existing', backgroundColor: 'brown' },
          { data: getArrayData('newCollateralStatus'), label: 'New', backgroundColor: 'green' },

          {
            data: getArrayData('toBeReleaseCollateralStatus'),
            label: 'To Be Release',
            backgroundColor: 'orange',
          },
        ],
      };
    });
  }
  // Fungsi untuk mengelompokkan data berdasarkan bulan dari fromDate & thruDate
  groupDataByMonth(information: any[]): Record<string, any> {
    const groupedData: Record<string, any> = {};

    information.forEach(item => {
      if (!item.thruDate) {
        return;
      }

      const dueDate = new Date(item.thruDate);
      const dueMonthYear = dueDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });

      if (!groupedData[dueMonthYear]) {
        groupedData[dueMonthYear] = { active: 0, existing: 0, new: 0, toBeRelease: 0 };
      }

      this.incrementCategoryCount(groupedData[dueMonthYear], item);
    });

    return groupedData;
  }

  // Fungsi untuk menambah jumlah kategori berdasarkan description
  incrementCategoryCount(target: any, item: any): void {
    if (item.description === 'Active') {
      target.active++;
    }
    if (item.description === 'Existing') {
      target.existing++;
    }
    if (item.description === 'New') {
      target.new++;
    }
    if (item.description === 'To Be Release') {
      target.toBeRelease++;
    }
  }
}
