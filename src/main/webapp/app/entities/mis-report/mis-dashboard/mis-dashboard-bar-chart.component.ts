import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, registerables, ChartDataset } from 'chart.js';
import { DashboardData } from './mis-dashboard.model';

Chart.register(...registerables);

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
  @Input() data: DashboardData[] = [];
  @Input() legendPosition: 'top' | 'left' | 'bottom' | 'right' = 'top';
  @Input() date: Date;
  @Input() options?: ChartOptions;
  @Input() title = '';
  @ViewChild('creditChart') creditChart!: ElementRef;

  chartData: { labels: string[]; datasets: ChartDataset<'bar', number[]>[] };
  chart: Chart | undefined;

  private readonly excludedProperties = ['date', 'information', 'showcase'];
  private readonly colorPalette = [
    '#96c6f4',
    '#fba1b7',
    '#fdc390',
    '#fee09e',
    '#a1dad9',
    '#bea2ff',
    '#b2dfdb',
    '#ffcdd2',
    '#c8e6c9',
    '#d1c4e9',
    '#bbdefb',
    '#f8bbd0',
    '#ffe0b2',
  ];

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

  private prepareChartData() {
    if (!this.data || this.data.length === 0) {
      return;
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

    const properties = Object.keys(this.data[0]).filter(key => !this.excludedProperties.includes(key));

    const datasets: ChartDataset<'bar', number[]>[] = properties.map((property, index) => {
      const label = this.formatPropertyName(property);
      return {
        label,
        data: this.data.map(item => item[property as keyof DashboardData] as number),
        backgroundColor: this.colorPalette[index % this.colorPalette.length],
        borderRadius: {
          topLeft: 3,
          topRight: 3,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      };
    });

    this.chartData = { labels, datasets };
  }

  private formatPropertyName(property: string): string {
    const words = property.split(/(?=[A-Z])/);
    const filteredWords = words.filter(word => word !== 'Facility');
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
