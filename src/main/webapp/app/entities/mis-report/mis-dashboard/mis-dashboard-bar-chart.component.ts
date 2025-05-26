import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartDataset, registerables } from 'chart.js';
import { DashboardData, DashboardUserData } from './mis-dashboard.model';

Chart.register(...registerables);

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
    <div class="chart-content" [style.height]="options?.height || '400px'">
      <canvas #creditChart></canvas>
    </div>
  `,
})
export class MisDashboardBarChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() data: DashboardData[] | DashboardUserData[] = [];
  @Input() legendPosition: 'top' | 'left' | 'bottom' | 'right' = 'top';
  @Input() type?;
  @Input() date: Date;
  @Input() options?: ChartOptions;
  @Input() title = '';
  @ViewChild('creditChart') creditChart!: ElementRef;

  chartData: { labels: string[]; datasets: ChartDataset[] };
  chart: Chart | undefined;

  private readonly excludedProperties = ['date', 'information', 'showcase'];
  private readonly colorPalette = [
    '#96c6f4',
    '#fba1b7',
    '#fdc390',
    '#c1fe9e',
    '#a1dad9',
    '#bea2ff',
    '#c3dfb2',
    '#ffcdf9',
    '#c8e5e6',
    '#dbc4e9',
    '#bbf9fb',
    '#f8ecbb',
  ];
  private readonly defaultBorderRadius: ChartBorderRadius = {
    topLeft: 3,
    topRight: 3,
    bottomLeft: 0,
    bottomRight: 0,
  };

  ngOnInit(): void {
    this.prepareChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.data = changes['data'].currentValue;
      this.prepareChartData();
      this.initializeChart();
    }
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private darkenHexColor(hex: string, percent = 15): string {
    const amt = Math.round(2.55 * percent);
    return '#' + hex.replace(/^#/, '').replace(/../g, color => ('0' + Math.max(0, parseInt(color, 16) - amt).toString(16)).slice(-2));
  }

  private prepareChartData() {
    if (!this.data || this.data.length === 0) {
      this.data = [];
    }
    const labels: string[] = this.data.map(item => {
      const sortedShowcase = [...item.showcase].sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());
      return sortedShowcase.map(showcaseItem =>
        new Date(showcaseItem.fromDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        })
      );
    })[0];

    if (this.type === 'user') {
      this._prepareChartUserData(labels);
      return;
    }

    // Get all properties from the first data item except excluded ones
    const properties = this.data.length > 0 ? Object.keys(this.data[0]).filter(key => !this.excludedProperties.includes(key)) : [];

    const datasets: ChartDataset[] = properties.map((property, index) => {
      const label = this.formatPropertyName(property);
      const bg = this.colorPalette[index % this.colorPalette.length];
      return {
        label,
        data: this.data.map(item => item[property as keyof DashboardData] as number),
        backgroundColor: bg,
        hoverBackgroundColor: this.darkenHexColor(bg, 15),
        borderRadius: {
          topLeft: 3,
          topRight: 3,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      };
    });

    // check if all the datasets value is 0
    if (datasets.every(dataset => dataset.data.every(value => value === 0))) {
      this.data = [];
    }

    this.chartData = { labels, datasets };
  }

  _handleNullName(name: string): string {
    return name.replace('null', '');
  }

  _prepareChartUserData(labels) {
    const groupedData = {};

    // Group data by user label
    this.data.forEach((item, index) => {
      if (!groupedData[item.nameUser]) {
        const bg = this.colorPalette[index % this.colorPalette.length];
        groupedData[item.nameUser] = {
          label: this._handleNullName(item.nameUser),
          data: [],
          backgroundColor: bg,
          hoverBackgroundColor: this.darkenHexColor(bg, 15),
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
    const words = property.split(/(?=[A-Z])/);
    const filteredWords = words.filter(word => word !== 'Facility' && word !== 'Collateral' && word !== 'Status');
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
            display: !!this.title,
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
            beginAtZero: true,
            stacked: false,
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
      },
    });
  }
}
