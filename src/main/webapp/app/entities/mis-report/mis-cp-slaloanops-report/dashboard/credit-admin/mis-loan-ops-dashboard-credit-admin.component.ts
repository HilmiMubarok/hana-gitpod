import { animate, state, style, transition, trigger } from "@angular/animations";
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Chart } from 'chart.js';

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
@Component({
    selector: 'jhi-mis-loan-ops-dashboard-credit-admin',
    styles: [
        `
            .chart-container {
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }

            .chart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: #b2dfdb;
                border-radius: 8px 8px 0 0;
            }

            .title {
                font-size: 16px;
                font-weight: 500;
                color: white;
                text-transform: uppercase;
            }

            .form-controls {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                margin-bottom: 16px;
            }

            :host ::ng-deep .mat-mdc-form-field {
                width: 140px;
                margin-bottom: -1.25em;
            }

            :host ::ng-deep .mat-mdc-form-field-wrapper {
                padding-bottom: 0;
            }

            :host ::ng-deep .mat-mdc-text-field-wrapper {
                background-color: white !important;
                border-radius: 4px;
            }

            :host ::ng-deep .mdc-text-field--outlined {
                --mdc-outlined-text-field-container-height: 36px;
            }

            :host ::ng-deep .mat-mdc-form-field-subscript-wrapper {
                display: none;
            }

            .expand-button {
                color: white;
                line-height: 36px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .collapsible-content {
                overflow: hidden;
                padding: 20px;
            }

            .chart-content {
                height: 400px;
                margin: 20px 0;
            }

            .date-range {
                text-align: center;
                margin: 20px 0;
                color: #666;
            }

            .legend {
                display: flex;
                justify-content: center;
                gap: 24px;
                margin-top: 20px;
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .legend-color {
                width: 12px;
                height: 12px;
            }
        `
    ],
    template: `
    <div class="chart-container">
        <div class="chart-header">
            <div class="title">BY TRANSACTION</div>
            <button mat-icon-button class="expand-button" (click)="toggleExpand()">
                <mat-icon [@rotateIcon]="isExpanded ? 'expanded' : 'collapsed'">
                    expand_less
                </mat-icon>
            </button>
        </div>

        <div [@expandCollapse]="isExpanded ? 'expanded' : 'collapsed'" class="collapsible-content">
            <div class="form-controls">
                <mat-form-field [formGroup]="dateForm" appearance="outline">
                    <mat-label>Select Month</mat-label>
                    <input matInput formControlName="date" [matDatepicker]="picker">
                    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker startView="year" (monthSelected)="picker.close()"></mat-datepicker>
                </mat-form-field>
            </div>

            <div class="chart-content">
                <canvas #creditChart></canvas>
            </div>

            <div class="legend">
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #96c6f4"></span>
                    <span>New</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #fba1b7"></span>
                    <span>Restructure</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #fdc390"></span>
                    <span>Additional</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #fee09e"></span>
                    <span>Other</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #a1dad9"></span>
                    <span>Renewal</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #bea2ff"></span>
                    <span>Decrease</span>
                </div>
            </div>
        </div>
    </div>
    `,
    animations: [
        trigger('expandCollapse', [
            state('expanded', style({
                height: '*',
                opacity: 1,
                willChange: 'height, opacity'
            })),
            state('collapsed', style({ height: '0', opacity: 0 })),
            transition('expanded <=> collapsed', [animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')]),
        ]),
        trigger('rotateIcon', [
            state('expanded', style({ transform: 'rotate(0deg)' })),
            state('collapsed', style({ transform: 'rotate(180deg)' })),
            transition('expanded <=> collapsed', [animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')]),
        ]),
    ],
})
export class MisLoanOpsDashboardCreditAdminComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('creditChart') creditChart!: ElementRef;

    isExpanded = true;
    dateForm: FormGroup;
    chart: any;

    chartData: { labels: string[]; datasets: ChartDataset[] } = {
        labels: ['Januari', 'Februari', 'Maret'],
        datasets: [
            {
                label: 'New',
                data: [20, 35, 35],
                backgroundColor: '#96c6f4',
                borderRadius: {
                    topLeft: 9,
                    topRight: 9,
                    bottomLeft: 0,
                    bottomRight: 0
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
                    bottomRight: 0
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
                    bottomRight: 0
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
                    bottomRight: 0
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
                    bottomRight: 0
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
                    bottomRight: 0
                },
                borderSkipped: false,
            },
            {
                label: 'New',
                data: [20, 35, 35],
                backgroundColor: '#96c6f4',
                borderRadius: {
                    topLeft: 9,
                    topRight: 9,
                    bottomLeft: 0,
                    bottomRight: 0
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
                    bottomRight: 0
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
                    bottomRight: 0
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
                    bottomRight: 0
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
                    bottomRight: 0
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
                    bottomRight: 0
                },
                borderSkipped: false,
            },
        ],
    };

    ngOnInit(): void {
        this.initializeForm();
        this.dateForm.get('date')?.valueChanges.subscribe(date => {
            this.updateChartData(date);
        });

        console.log("ngOnInit: Dashboard Credit Admin");
    }

    ngAfterViewInit(): void {
        this.initChart();
        console.log("ngAfterViewInit: Dashboard Credit Admin");
    }

    ngOnDestroy(): void {
        this.chart?.destroy();
        this.chart = null;
        console.log("ngOnDestroy: Dashboard Credit Admin");
    }

    private initChart(): void {
        const ctx = this.creditChart.nativeElement.getContext('2d');

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: this.chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: false,
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        stacked: false,
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                elements: {
                    bar: {
                        borderWidth: 0,
                        borderRadius: {
                            topLeft: 9,
                            topRight: 9,
                            bottomLeft: 0,
                            bottomRight: 0
                        },
                        borderSkipped: false,
                    },
                },
            },
        });
    }

    private updateChartData(date: Date): void {
        if (!date) {
            return;
        }

        const months = this.getThreeMonths(date);
        this.chartData.labels = months;

        if (this.chart) {
            this.chart.update();
        }
    }

    private getThreeMonths(date: Date): string[] {
        const months = [
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
        const selectedMonth = date.getMonth();

        const result = [];
        for (let i = 0; i < 3; i++) {
            const monthIndex = (selectedMonth + i) % 12;
            result.push(months[monthIndex]);
        }

        return result;
    }

    private initializeForm() {
        this.dateForm = new FormGroup({
            date: new FormControl(null)
        });
    }

    toggleExpand(): void {
        this.isExpanded = !this.isExpanded;
    }
}