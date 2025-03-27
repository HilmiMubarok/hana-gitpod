import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardData, DashboardUserData } from './mis-dashboard.model';

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderRadius: ChartBorderRadius;
  borderSkipped?: boolean;
}

interface ChartBorderRadius {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}

interface ChartOptions {
  title?: string;
  height?: string;
  backgroundColor?: string;
}

@Component({
  selector: 'jhi-mis-dashboard-bar-chart',
  styles: [
    `
      .chart-content {
        padding: 16px;
      }

      .empty-chart-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        background-color: #f9f9f9;
        border-radius: 8px;
      }

      .empty-chart-content {
        text-align: center;
        padding: 2rem;
      }

      .empty-chart-content i {
        font-size: 3rem;
        color: #ccc;
        margin-bottom: 1rem;
      }

      .empty-chart-content h4 {
        margin-bottom: 0.5rem;
        color: #555;
      }

      .empty-chart-content p {
        color: #888;
      }
    `,
  ],
  template: `
    <div class="chart-content" [style.height]="options?.height || '400px'" [hidden]="data.length === 0">
      <canvas #creditChart></canvas>
    </div>

    <div [hidden]="data && data.length > 0">
      <div class="empty-chart-container">
        <div class="empty-chart-content">
          <i class="bi bi-bar-chart"></i>
          <h4>No Data Available</h4>
          <p>There is no chart data to display for the selected period.</p>
        </div>
      </div>
    </div>
  `,
})
export class MisDashboardBarChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.data = changes['data'].currentValue;

      this.prepareChartData();
      this.initializeChart();
    }
  }

  @Input() data: DashboardData[] | DashboardUserData[] = [];
  @Input() legendPosition;
  @Input() type?;
  @Input() date: Date;
  @Input() options?: ChartOptions;
  @Input() title? = '';
  @ViewChild('creditChart') creditChart!: ElementRef;
  chartData: { labels: string[]; datasets: ChartDataset[] };

  chart: Chart | undefined;

  private readonly defaultBorderRadius: ChartBorderRadius = {
    topLeft: 3,
    topRight: 3,
    bottomLeft: 0,
    bottomRight: 0,
  };

  ngOnInit(): void {
    this.prepareChartData();
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private readonly excludedProperties = ['date', 'information', 'showcase'];
  private readonly colorPalette = [
    '#96c6f4', // Light Blue
    '#fba1b7', // Pink
    '#fdc390', // Orange
    '#fee09e', // Yellow
    '#a1dad9', // Teal
    '#bea2ff', // Purple
    '#b2dfdb', // Mint
    '#ffcdd2', // Light Red
    '#c8e6c9', // Light Green
    '#d1c4e9', // Light Purple
    '#bbdefb', // Very Light Blue
    '#f8bbd0', // Light Pink
    '#ffe0b2', // Light Orange
  ];

  private prepareChartData() {
    if (!this.data || this.data.length === 0) {
      this.data = [];
    }

    const labels: string[] = this.data.map(item => {
      // Sort item.showcase ascending by fromDate
      const sortedShowcase = [...item.showcase].sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());

      // Format each date to "Month Year" and return as an array
      return sortedShowcase.map(showcaseItem =>
        new Date(showcaseItem.fromDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      );
    })[0];

    if (this.type === 'user') {
      this._prepareChartUserData(labels);
      return;
    }

    // Get all properties from the first data item except excluded ones
    const properties = this.data.length > 0 ? Object.keys(this.data[0]).filter(key => !this.excludedProperties.includes(key)) : [];

    // Create datasets dynamically
    const datasets = properties.map((property, index) => {
      const label = this.formatPropertyName(property);
      return {
        label,
        data: this.data.map(item => item[property as keyof typeof item] as number),
        backgroundColor: this.colorPalette[index % this.colorPalette.length],
        borderRadius: this.defaultBorderRadius,
        borderSkipped: false,
      };
    });

    // check if all the datasets value is 0
    if (datasets.every(dataset => dataset.data.every(value => value === 0))) {
      this.data = [];
    }

    this.chartData = { labels, datasets };
  }

  _prepareChartUserData(labels) {
    const groupedData = {};

    // Group data by user label
    this.data.forEach((item, index) => {
      if (!groupedData[item.nameUser]) {
        groupedData[item.nameUser] = {
          label: item.nameUser,
          data: [],
          backgroundColor: this.colorPalette[index % this.colorPalette.length],
          borderRadius: this.defaultBorderRadius,
          borderSkipped: false,
        };
      }
      groupedData[item.nameUser].data.push(item.total);
    });

    // Convert grouped data object to an array
    const datasets = Object.values(groupedData) as ChartDataset[];

    this.chartData = { labels, datasets };
  }

  private formatPropertyName(property: string): string {
    // Convert camelCase to Title Case with spaces
    const words = property.split(/(?=[A-Z])/); // Split on capital letters

    // Remove 'Facility' from the array
    const filteredWords = words.filter(word => word !== 'Facility');

    // Capitalize the first letter of each word
    const formattedWords = filteredWords.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    return formattedWords.join(' ');
  }

  private initializeChart() {
    if (!this.creditChart) {
      return;
    }

    const ctx = this.creditChart.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: this.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: this.title,
            font: {
              size: 16,
            },
          },
          legend: {
            position: this.legendPosition,
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 11,
              },
            },
          },
        },
        scales: {
          x: {
            stacked: false,
            ticks: {
              font: {
                size: 11,
              },
            },
          },
          y: {
            stacked: false,
            beginAtZero: true,
            grid: {
              color: '#E0E0E0',
            },
            ticks: {
              precision: 0,
              stepSize: 1,
              font: {
                size: 11,
              },
            },
          },
        },
        datasets: {
          bar: {
            barPercentage: 0.8,
            categoryPercentage: 0.9,
          },
        },
      },
    });
  }
}
