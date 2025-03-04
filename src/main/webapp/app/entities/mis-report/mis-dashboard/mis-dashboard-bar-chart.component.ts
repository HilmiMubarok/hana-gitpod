import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardData } from './dummy-data';

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
    `,
  ],
  template: `
    <div class="chart-content" [style.height]="options?.height || '400px'">
      <canvas #creditChart></canvas>
    </div>
  `,
})
export class MisDashboardBarChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  ngOnChanges(changes: SimpleChanges): void {
    console.log({ changes });
  }

  @Input() data: DashboardData[] = [];
  @Input() date: Date;
  @Input() options?: ChartOptions;
  @Input() title? = '';
  @ViewChild('creditChart') creditChart!: ElementRef;

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
      return;
    }

    const labels = this.data.map((item, index) => `${new Date(item.showcase[index].fromDate).toLocaleDateString()} - ${new Date(item.showcase[index].thruDate).toLocaleDateString()}`);

    // Get all properties from the first data item except excluded ones
    const properties = Object.keys(this.data[0]).filter(key => !this.excludedProperties.includes(key));

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

    this.chartData = { labels, datasets };
  }

  private formatPropertyName(property: string): string {
    // Convert camelCase to Title Case with spaces
    const words = property.split(/(?=[A-Z])/); // Split on capital letters
    const formattedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return formattedWords.join(' ');
  }

  private initializeChart() {
    const ctx = this.creditChart.nativeElement.getContext('2d');

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
            position: 'bottom',
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
            grid: {
              display: false,
            },
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

  chartData: { labels: string[]; datasets: ChartDataset[] } = {
    labels: [],
    datasets: [
      {
        label: 'New',
        data: [20, 35, 35],
        backgroundColor: '#96c6f4',
        borderRadius: {
          topLeft: 9,
          topRight: 9,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
      {
        label: 'Restructure',
        data: [55, 55, 55],
        backgroundColor: '#fba1b7',
        borderRadius: {
          topLeft: 9,
          topRight: 9,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
      {
        label: 'Additional',
        data: [35, 35, 35],
        backgroundColor: '#fdc390',
        borderRadius: {
          topLeft: 9,
          topRight: 9,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
      {
        label: 'Other',
        data: [80, 65, 55],
        backgroundColor: '#fee09e',
        borderRadius: {
          topLeft: 9,
          topRight: 9,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
      {
        label: 'Renewal',
        data: [35, 35, 35],
        backgroundColor: '#a1dad9',
        borderRadius: {
          topLeft: 9,
          topRight: 9,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
      {
        label: 'Decrease',
        data: [70, 80, 70],
        backgroundColor: '#bea2ff',
        borderRadius: {
          topLeft: 9,
          topRight: 9,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
    ],
  };
}
