import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardData } from './mis-dashboard.model';

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
      <canvas
		baseChart
		[data]="chartData"
		[options]="barChartOptions"
		[type]="barChartType"
	  >
	  </canvas>

    </div>
  `,
})
export class MisDashboardBarChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  constructor() {}
  
  @Input() data: DashboardData[] = [];
  @Input() legendPosition;
  @Input() date: Date;
  @Input() options?: ChartOptions;
  @Input() title? = '';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  public chartData: { labels: string[]; datasets: ChartDataset[] };
  
  public barChartOptions: ChartConfiguration['options'];
  public barChartType: ChartType;
  public labelList: string[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.data = changes['data'].currentValue;

	  this.initBarChart();
    }
  }
  
  this.barChartType = 'bar';
  this.barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
    interaction: {
      mode: 'point',
    },
  };
  
  public initBarChart(): void {
    this.barChartType = 'bar';
    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,

      // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {},
        y: {
          min: 0,
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
        },
      },
      interaction: {
        mode: 'point',
      },
    };
	
	this.prepareChartData();
  }

  ngOnInit(): void {
    this.prepareChartData();
  }

  ngAfterViewInit(): void {
    this.prepareChartData();
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

    const labels: string[] = this.data.map(item => {
      // Sort item.showcase ascending by fromDate
      const sortedShowcase = [...item.showcase].sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());

      // Format each date to "Month Year" and return as an array
      return sortedShowcase.map(showcaseItem =>
        new Date(showcaseItem.fromDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      );
    })[0];

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
	  this.chart?.update();
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
}
