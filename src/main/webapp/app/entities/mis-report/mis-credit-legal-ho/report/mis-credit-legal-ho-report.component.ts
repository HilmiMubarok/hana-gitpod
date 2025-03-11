import { Component, OnInit } from "@angular/core";
import { AbstractExcelMISReport } from "../../abstract-excel-report";
import { MisReportService } from "../../mis-report.service";
import { MessageService } from "primeng/api";
import { FormControl, FormGroup } from "@angular/forms";
import moment from "moment";
import * as ExcelJS from 'exceljs';

@Component({
    selector: "jhi-mis-credit-legal-ho-report",
    templateUrl: "./mis-credit-legal-ho-report.component.html",
    styles: [
        `
      .select-all {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        line-height: 48px;
        height: 48px;
        padding: 0 16px;
        text-align: left;
        text-decoration: none;
        max-width: 100%;
        position: relative;
        liststyletype: none;
        outline: none;
        display: flex;
        flex-direction: row;
        max-width: 100%;
        box-sizing: border-box;
        align-items: center;
        -webkit-tap-highlight-color: transparent;
      }

      .select-all:hover {
        background-color: #f5f5f5;
        cursor: pointer;
      }

      :host ::ng-deep .ng-invalid:not(form) {
        border: none !important;
      }
    `,
    ],
})
export class MisCreditLegalHoReportComponent extends AbstractExcelMISReport implements OnInit {

    public lovStatus = [];
    public form: FormGroup;
    public allSelected = false;

    constructor(public misReportService: MisReportService, public messageService: MessageService) {
        super(misReportService);
        this._initializeForm();
    }

    ngOnInit(): void {
        this.getStatusLOV('MIS_LEGAL_CL_HO').subscribe({
            next: res => (this.lovStatus = res),
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
            },
        })
    }

    public toggleSelectAll(): void {
        this.allSelected = !this.allSelected;
        if (this.allSelected) {
            this.form.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
        } else {
            this.form.get('status')?.setValue('');
        }
    }

    public clearDateRange(): void {
        this.form.get('startDate')?.reset();
        this.form.get('endDate')?.reset();
    }

    public dateRangeHasValue(): boolean {
        return this.form.get('startDate')?.value && this.form.get('endDate')?.value;
    }

    private _initializeForm() {
        this.form = new FormGroup({
            startDate: new FormControl(''),
            endDate: new FormControl(''),
            status: new FormControl(''),
        });

        this.form.get('startDate')?.valueChanges.subscribe(date => {
            if (moment.isMoment(date)) {
                const formattedDate = date.format('YYYY-MM-DD');
                this.form.get('startDate')?.setValue(formattedDate, { emitEvent: false });
            }
        });

        this.form.get('endDate')?.valueChanges.subscribe(date => {
            if (moment.isMoment(date)) {
                const formattedDate = date.format('YYYY-MM-DD');
                this.form.get('endDate')?.setValue(formattedDate, { emitEvent: false });
            }
        });

        this.form.get('status')?.valueChanges.subscribe(status => {
            if (typeof status === 'object' && status.length === 0) {
                this.form.get('status')?.setValue(null);
                this.allSelected = false;
            }

            if (status && status.length === this.lovStatus.length) {
                this.allSelected = true;
            }
        });
    }

    public generateMISLegalReport(): void {
        this.misReportService.setLoading(true);

        const params = {
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            status: this._convertStatusToString(this.form.get('status')?.value),
            type: 'STATELOG',
        };

        this.misReportService.getMisReportCP(params).subscribe({
            next: res => this._processGenerate(res.body, 'MIS_CL_Task_HO'),
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate MIS Report' });
                this._resetData();
                this.misReportService.setLoading(false);
            },
            complete: () => {
                this._resetData();
                this.misReportService.setLoading(false);
            },
        });
    }


    private _processGenerate(data, fileName) {
        this.setUpColumns(this.columns)

        // if data is empty, generate an empty file
        if (!data || data.length === 0) {
            this.applyStyles();
            this.downloadFile(fileName);
            return;
        }

        // Add data to worksheet
        this.processData(data);

        this._applyStyles();
        this._setAutoWidthForAllColumns();
        this._setAutoHeightForAllRows();
        this.downloadFile(fileName);
        this._resetData();
    }

    private _applyStyles(): void {
        super.applyStyles();
        this.columns.forEach(column => {
            const col = this.worksheet.getColumn(column.key);
            col.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true,
            };

            const columnValue = this.worksheet.getColumn(column.key);

            const newValue = columnValue.values.map(value => {
                if (value) {
                    return this._clearEmptyEntries(value.toString());
                }
                return value;
            });

            columnValue.values = newValue;
        });
    }

    protected processData(data: any[]): void {
        data.forEach((proposal, index) => {
            this._addProposalData(this.worksheet, proposal, index);
        });
    }

    get columns() {
        return [
            { header: 'No.', key: 'no' },
            { header: 'Debtors Name', key: 'debtorsName' },
            { header: 'Requested By (Branch)', key: 'requestedByBranch' },
            { header: 'Requested By (RM)', key: 'requestedByRm' },
            { header: 'PIC', key: 'pic' },
            { header: 'PIC Timeline', key: 'picTimeline' },
            { header: 'Summary', key: 'summary' },
            { header: 'Tanggal Jatuh Tempo', key: 'tanggalJatuhTempo' },
            { header: 'Segmentation', key: 'segmentation' },
            { header: 'Started (Date)', key: 'startedDate' },
            { header: 'Started (Month)', key: 'startedMonth' },
            { header: 'Started (Year)', key: 'startedYear' },
            { header: 'DPDL (Date)', key: 'dpdlDate' },
            { header: 'DPDL (Month)', key: 'dpdlMonth' },
            { header: 'DPDL (Year)', key: 'dpdlYear' },
            { header: 'Fasilitas Kredit', key: 'fasilitasKredit' },
            { header: 'Currency', key: 'currency' },
            { header: 'Nominal', key: 'nominal' },
            { header: 'Status', key: 'status' },
            { header: 'Information', key: 'information' },
            { header: 'Weekly Process Update', key: 'weeklyProcessUpdate' },
            { header: 'Reason', key: 'reason' },
            { header: 'Compliance Review >25M', key: 'complianceReview' },
            { header: 'Tanggal Compliance Review', key: 'tanggalComplianceReview' },
        ];
    }

    private _addProposalData(worksheet: ExcelJS.Worksheet, proposal: any, index: number) {
        const filteredProduct = proposal.product.filter(prod => prod.pengajuan !== 'Existing')

        filteredProduct.forEach(product => {
            const row = {
                no: worksheet.rowCount,
                debtorsName: proposal.debtorName,
                requestedByBranch: proposal.branchNameRM,
                requestedByRm: proposal.rmFirstName + ' ' + proposal.rmLastName,
                pic: proposal.dataAssignToLegalOfficerName,
                picTimeline: this._getPicTimeline(proposal.timeLineCreditProposal),
                summary: product.pengajuan,
                tanggalJatuhTempo: this._getTanggalJatuhTempo(product),
                segmentation: proposal.regionalName,
                startedDate: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'OL Assigned', 'Date'),
                startedMonth: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'OL Assigned', 'Month'),
                startedYear: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'OL Assigned', 'Year'),
                dpdlDate: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'DPDL Finalize', 'Date'),
                dpdlMonth: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'DPDL Finalize', 'Month'),
                dpdlYear: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'DPDL Finalize', 'Year'),
                fasilitasKredit: product.facility,
                currency: product.currency,
                nominal: product.totalPlafond,
                status: this._getStatusData(proposal),
                information: '',
                weeklyProcessUpdate: proposal.status,
                reason: '',
                complianceReview: proposal.isCompliance,
                tanggalComplianceReview: this._getTanggalComplianceReview(proposal)
            }

            worksheet.addRow(row);
        })
    }

    private _getPicTimeline(timeLineCreditProposal) {
        return timeLineCreditProposal.filter(timeline => timeline.fromStatusDescription === 'DPPK Finalize').map(timeline => timeline.personName).join(',\n');
    }

    private _getTanggalJatuhTempo(product) {
        const allowedTypes = [
            'Renewal + Others',
            'Renewal + Decrease',
            'Renewal + Additional Renewal',
        ]

        if (allowedTypes.includes(product.pengajuan)) {
            return this.formatDateID(product.mainProduct[0].maturityDate).getFullDate();
        } else {
            return ''
        }

    }

    private _getStartedAndDpdl(timeLine: any, status: string, param: 'Date' | 'Month' | 'Year') {

        const data = timeLine.filter(timeline => timeline.statusDescription === status)
        data.sort((a, b) => b.id - a.id)
        const date = data[0].fromDate

        if (param === 'Date') {
            return this.formatDateID(date).getDay();
        } else if (param === 'Month') {
            return this.formatDateID(date).getMonth();
        } else if (param === 'Year') {
            return this.formatDateID(date).getYear();
        } else {
            return '';
        }
    }

    private _getTanggalComplianceReview(proposal) {

        if (proposal.isCompliance === 'Yes') {
            const date = proposal.timeLineCreditProposal.filter(timeline => timeline.fromStatusDescription === 'Compliance Director').map(timeline => timeline.fromDate)
            return this.formatDateID(date).getFullDate();
        } else {
            return '';
        }

    }

    private _getStatusData(proposal: any): string {
        const statusMap = {
            done: [
                'DPPK Finalize',
                'DPPK Review',
                'Loan Ops Ditribution',
                'Loan Ops Checking',
                'Loan Ops Review',
                'Complete',
            ],
            pending: [
                'OL Distribution',
                'OL Finalize',
                'OL Assigned',
                'Legal Head Review',
                'Legal Lead Review',
                'Legal Team Lead Review',
                'PK Finalize',
                'PK Generated',
                'Return To OL',
                'PK Legal Lead Review',
                'PK Team Lead Review',
                'DPDL Finalize',
                'DPDL Legal Head Review',
                'DPDL Legal Lead Review',
                'DPDL Team Lead Review',
            ],
            cancel: ['Cancel'],
        };

        const status = proposal.status;

        if (statusMap.done.includes(status)) {
            return 'DONE';
        }

        if (statusMap.pending.includes(status)) {
            return 'PENDING';
        }

        if (statusMap.cancel.includes(status)) {
            return 'CANCEL';
        }

        return '';
    }
}