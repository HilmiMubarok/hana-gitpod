import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from 'app/dashboard/dashboard.service';

@Component({
  selector: 'jhi-dashboard-credam',
  templateUrl: './dashboard-credam.component.html',
  styleUrls: ['./dashboard.style.css'],
})
export class DashboardCredamComponent implements OnInit {
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
      { data: [], label: 'New', backgroundColor: 'green' },
      { data: [], label: 'Restructure', backgroundColor: 'brown' },
      { data: [], label: 'Additional', backgroundColor: 'orange' },
      { data: [], label: 'Other', backgroundColor: 'purple' },
      { data: [], label: 'Renewal', backgroundColor: 'blue' },
      { data: [], label: 'Decrease', backgroundColor: 'red' },
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
    this.dashboardService.getCpCredam(formattedDate).subscribe(response => {
      const dataArray = response.body;
      if (!Array.isArray(dataArray)) {
        return;
      }
      let allInformation: any[] = [];
      dataArray.forEach(data => {
        if (Array.isArray(data.information)) {
          allInformation = allInformation.concat(
            data.information.filter(item => item.fromDate && item.thruDate) // Pastikan ada fromDate & thruDate
          );
        }
      });

      // Kelompokkan data berdasarkan bulan (dengan filter `description`)
      const monthlyData = this.groupDataByMonth(allInformation);
      console.log(monthlyData, 'monthlyData');
      this.chartData = {
        labels: Object.keys(monthlyData), // Label bulan
        datasets: [
          { data: Object.values(monthlyData).map(item => item.new || 0), label: 'New', backgroundColor: 'green' },
          { data: Object.values(monthlyData).map(item => item.restructure || 0), label: 'Restructure', backgroundColor: 'brown' },
          { data: Object.values(monthlyData).map(item => item.additional || 0), label: 'Additional', backgroundColor: 'orange' },
          { data: Object.values(monthlyData).map(item => item.other || 0), label: 'Other', backgroundColor: 'purple' },
          { data: Object.values(monthlyData).map(item => item.renewal || 0), label: 'Renewal', backgroundColor: 'blue' },
          { data: Object.values(monthlyData).map(item => item.decrease || 0), label: 'Decrease', backgroundColor: 'red' },
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
        groupedData[dueMonthYear] = { new: 0, restructure: 0, additional: 0, other: 0, renewal: 0, decrease: 0 };
      }

      this.incrementCategoryCount(groupedData[dueMonthYear], item);
    });

    return groupedData;
  }

  // Fungsi untuk menambah jumlah kategori berdasarkan description
  incrementCategoryCount(target: any, item: any): void {
    if (item.description === 'New') {
      target.new++;
    }
    if (item.description === 'Restructure') {
      target.restructure++;
    }
    if (item.description === 'Additional') {
      target.additional++;
    }
    if (item.description === 'Other') {
      target.other++;
    }
    if (item.description === 'Renewal') {
      target.renewal++;
    }
    if (item.description === 'Decrease') {
      target.decrease++;
    }
  }
}
