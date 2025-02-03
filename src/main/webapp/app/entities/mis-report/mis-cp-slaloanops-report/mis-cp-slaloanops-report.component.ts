import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import * as ExcelJS from 'exceljs';
import { AbstractExcelMISReport } from '../abstract-excel-report';

@Component({
    selector: "jhi-mis-cp-slaloanops-report",
    templateUrl: "./mis-cp-slaloanops-report.component.html",
    styleUrls: ['../mis-sla-credit-insurance/mis-sla-credit-insurance.css', '../mis-report.css'],
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
    `,
    ],
})
export class MisCpSlaloanopsReportComponent extends AbstractExcelMISReport implements OnInit {

    public lovStatus = [];
    listOfValue = [];
    misLoanOpsForm: FormGroup;
    allSelected = false;

    constructor(
        public misReportService: MisReportService,
        public messageService: MessageService
    ) {
        super(misReportService);

        this.misLoanOpsForm = new FormGroup({
            startDate: new FormControl(''),
            endDate: new FormControl(''),
            status: new FormControl(''),
        });

        this.misLoanOpsForm.get('startDate')?.valueChanges.subscribe(date => {
            if (moment.isMoment(date)) {
                const formattedDate = date.format('YYYY-MM-DD');
                this.misLoanOpsForm.get('startDate').setValue(formattedDate, { emitEvent: false });
            }
        });

        this.misLoanOpsForm.get('endDate')?.valueChanges.subscribe(date => {
            if (moment.isMoment(date)) {
                const formattedDate = date.format('YYYY-MM-DD');
                this.misLoanOpsForm.get('endDate').setValue(formattedDate, { emitEvent: false });
            }
        });
    }

    public previousState(): void {
        window.history.back();
    }

    ngOnInit(): void {
        this.getStatusLOV('MIS_SLA_LOANOPS').subscribe({
            next: res => (this.lovStatus = res),
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
            },
        });
    }

    toggleSelectAll(): void {
        this.allSelected = !this.allSelected;
        if (this.allSelected) {
            this.misLoanOpsForm.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
        } else {
            this.misLoanOpsForm.get('status')?.setValue('');
        }
    }

    convertStatusToString(status: Array<string>): string {
        // if length is 0, return empty string
        if (status.length === 0) {
            return '';
        }

        return status.join(',');
    }

    dateRangeHasValue(): boolean {
        return this.misLoanOpsForm.get('startDate')?.value && this.misLoanOpsForm.get('endDate')?.value;
    }

    clearDateRange(): void {
        this.misLoanOpsForm.get('startDate')?.reset();
        this.misLoanOpsForm.get('endDate')?.reset();
    }

    generateMISLoanOps() {
        this.misReportService.setLoading(true);
        const params = {
            startDate: this.misLoanOpsForm.get('startDate')?.value,
            endDate: this.misLoanOpsForm.get('endDate')?.value,
            status: this._convertStatusToString(this.misLoanOpsForm.get('status')?.value),
            type: 'STATELOG',
        };

        this.misReportService.getMISReportCPCredam(params).subscribe({
            next: res => this._processGenerate(res.body, 'MIS_SLA_LOANOPS'),
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
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        // this._setUpColumns(worksheet);
        this.setUpColumns(this.columns);

        // if data is empty, generate an empty file
        if (!data || data.length === 0) {
            this.applyStyles('ff2c9a48');
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

    get columns(): any[] {
        return [
            { header: 'No', key: 'no' },
            { header: 'Proposal Number', key: 'proposalNumber' },
            { header: 'DPK Number', key: 'dpkNumber' },
            { header: 'PIC Loan Ops', key: 'picLoanOps' },
            { header: 'Debtor', key: 'debtor' },
            { header: 'Loan Ops (Distribution) In Date', key: 'loanOpsDistributionInDate' },
            { header: 'Loan Ops (Distribution) In Time', key: 'loanOpsDistributionInTime' },
            { header: 'Loan Ops (Officer) Out Date', key: 'loanOpsOfficerOutDate' },
            { header: 'Loan Ops (Officer) Out Time', key: 'loanOpsOfficerOutTime' },
            { header: 'Loan Ops (Officer) Spv Out Name', key: 'loanOpsOfficerSpvOutName' },
            { header: 'Loan Ops (Officer) Spv Out Date', key: 'loanOpsOfficerSpvOutDate' },
            { header: 'Loan Ops (Officer) Spv Out Time', key: 'loanOpsOfficerSpvOutTime' },
            { header: 'Completed Name', key: 'completedName' },
            { header: 'Completed Date', key: 'completedDate' },
            { header: 'Completed Time', key: 'completedTime' },
            { header: 'TAT Date', key: 'tatDate' },
            { header: 'TAT Time', key: 'tatTime' },
            { header: 'Status', key: 'status' },
            { header: 'Transaksi', key: 'transaksi' },
            { header: 'Fasilitas', key: 'fasilitas' },
            { header: 'CCY', key: 'ccy' },
            { header: 'Nominal', key: 'nominal' },
            { header: 'Tgl Efektif Fasilitas', key: 'tglEfektifFasilitas' },
            { header: 'Jenis Jaminan', key: 'jenisJaminan' },
            { header: 'Segmentasi', key: 'segmentasi' },
            { header: 'Branch', key: 'branch' },
            { header: 'RM', key: 'rm' },
            { header: 'Keterangan', key: 'keterangan' },
            { header: 'Deviasi', key: 'deviasi' },
            { header: 'TBO', key: 'tbo' }
        ]
    }

    protected processData(data: any[]): void {

        const statuses = ['Loan Ops Ditribution', 'Loan Ops Checking', 'Loan Ops Review', 'Complete']
        const sortedCreditProposals = this.sortCreditProposalByEarliestDate(data, statuses);

        sortedCreditProposals.forEach((proposal, index) => {
            this._addProposalData(this.worksheet, proposal, index);
        });
    }

    private _addProposalData(ws: ExcelJS.Worksheet, prop: any, idx: number): void {
        prop.product?.forEach((prod: any, index: number) => {
            const dataRow = {
                no: ws.rowCount,
                proposalNumber: prop.proposalNumber || '',
                dpkNumber: prop.dppkNumber || '',
                picLoanOps: prop.dataAssignToLoanOpsOfficerName || '',
                debtor: prop.debtorName || '',
                loanOpsDistributionInDate: this._formatDateSLA(this.getLoanOpsDistributionInDate(prop)),
                loanOpsDistributionInTime: this.getLoanOpsDistributionInTime(prop),
                loanOpsOfficerOutDate: this._formatDateSLA(this.getLoanOpsOfficerOutDate(prop)),
                loanOpsOfficerOutTime: this.getLoanOpsOfficerOutTime(prop),
                loanOpsOfficerSpvOutName: this.getLoanOpsOfficerSpvOutName(prop),
                loanOpsOfficerSpvOutDate: this._formatDateSLA(this.getLoanOpsOfficerSpvOutDate(prop)),
                loanOpsOfficerSpvOutTime: this.getLoanOpsOfficerSpvOutTime(prop),
                completedName: this.getCompletedName(prop),
                completedDate: this.getCompletedDate(prop),
                completedTime: this.getCompletedTime(prop),
                tatDate: this.getTatDate(prop),
                tatTime: this.getTatTime(prop),
                status: prop.status || '',
                transaksi: prod.pengajuan || '',
                fasilitas: prod.facility || '',
                ccy: prod.currency || '',
                nominal: prod.totalPlafond || '',
                tglEfektifFasilitas: this.getTanggalEfektifFasilitas(prod),
                jenisJaminan: prop.collateral.map(coll => coll.collateralCode).join(',\n'),
                segmentasi: prop.regionalParentRM || '',
                branch: prop.bookingBranchName || '',
                rm: prop.rmFirstName + ' ' + prop.rmLastName || '',
                keterangan: '',
                deviasi: prop.covenant ? 'YES' : 'NO',
                tbo: prop.statusDocumentTbo || ''
            };

            ws.addRow(dataRow);
        });
    }

    private _applyStyles(): void {
        super.applyStyles('ff2c9a48');
        const columnsToBeWraped = [
            'loanOpsDistributionInDate',
            'loanOpsDistributionInTime',
            'loanOpsOfficerOutDate',
            'loanOpsOfficerOutTime',
            'loanOpsOfficerSpvOutName',
            'loanOpsOfficerSpvOutDate',
            'loanOpsOfficerSpvOutTime',
            'completedName',
            'completedDate',
            'completedTime'
        ];
        this.columns.forEach(column => {
            const col = this.worksheet.getColumn(column.key);
            console.log({ column, col });
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

    private getLoanOpsDistributionInDate(proposal: any): string {
        return proposal.timeLineCreditProposal
            .filter((t: any) => t.statusDescription === 'Loan Ops Ditribution')
            .map((timeline: any) => timeline.fromDate)
            .join(',\n');
    }

    private getLastLoanOpsDistributionInDate(product: any): string {
        const timelines = product.timeLineCreditProposal
            .sort((a: any, b: any) => a.id - b.id)
            .filter((t: any) => t.statusDescription === 'Loan Ops Ditribution');
        return timelines.length > 0 ? timelines[0].fromDate : '';
    }

    private getLoanOpsDistributionInTime(proposal: any): string {
        return proposal.timeLineCreditProposal
            .filter((t: any) => t.statusDescription === 'Loan Ops Ditribution')
            .map((timeline: any) => timeline.fromTime.split(':').slice(0, 2).join(':'))
            .join(',\n');
    }

    private getLastLoanOpsDistributionInTime(proposal: any): string {
        const timelines = proposal.timeLineCreditProposal
            .sort((a: any, b: any) => a.id - b.id)
            .filter((t: any) => t.statusDescription === 'Loan Ops Ditribution')

        return timelines[timelines.length - 1].fromTime
    }

    private getLoanOpsOfficerOutDate(proposal: any): string {
        return proposal.timeLineCreditProposal
            .filter((t: any) => t.statusDescription === 'Loan Ops Checking')
            .map((timeline: any) => timeline.fromDate)
            .join(',\n');
    }

    private getLoanOpsOfficerOutTime(proposal: any): string {
        return proposal.timeLineCreditProposal
            .filter((t: any) => t.statusDescription === 'Loan Ops Checking')
            .map((timeline: any) => timeline.fromTime.split(':').slice(0, 2).join(':'))
            .join(',\n');
    }

    private getLoanOpsOfficerSpvOutName(proposal: any): string {
        return proposal.timeLineCreditProposal
            .filter((t: any) => t.statusDescription === 'Loan Ops Review')
            .map((timeline: any) => timeline.personName)
            .join(',\n');
    }

    private getLoanOpsOfficerSpvOutDate(proposal: any): string {
        return proposal.timeLineCreditProposal
            .filter((t: any) => t.statusDescription === 'Loan Ops Review')
            .map((timeline: any) => timeline.fromDate)
            .join(',\n');
    }

    private getLoanOpsOfficerSpvOutTime(proposal: any): string {
        return proposal.timeLineCreditProposal
            .filter((t: any) => t.statusDescription === 'Loan Ops Review')
            .map((timeline: any) => timeline.fromTime.split(':').slice(0, 2).join(':'))
            .join(',\n');
    }

    private getCompletedName(proposal: any): string {
        return proposal.timeLineCreditProposal
            .filter((t: any) => t.statusDescription === 'Complete')
            .map((timeline: any) => timeline.personName)
            .join(',\n');
    }

    private getCompletedDate(proposal: any): string {
        return proposal.timeLineCreditProposal
            .sort((a: any, b: any) => a.id - b.id)
            .filter((t: any) => t.statusDescription === 'Complete')
            .map((timeline: any) => this._formatDateSLA(timeline.fromDate))
            .join(',\n');
    }

    private getLastCompletedDate(proposal: any): string {
        const timelines = proposal.timeLineCreditProposal
            .sort((a: any, b: any) => a.id - b.id)
            .filter((t: any) => t.statusDescription === 'Complete');

        return timelines[timelines.length - 1].fromDate;
    }

    private getCompletedTime(proposal: any): string {
        return proposal.timeLineCreditProposal
            .sort((a: any, b: any) => a.id - b.id)
            .filter((t: any) => t.statusDescription === 'Complete')
            .map((timeline: any) => timeline.fromTime.split(':').slice(0, 2).join(':'))
            .join(',\n');
    }

    private getLastCompletedTime(proposal: any): string {
        const timelines = proposal.timeLineCreditProposal
            .sort((a: any, b: any) => a.id - b.id)
            .filter((t: any) => t.statusDescription === 'Complete')

        return timelines[timelines.length - 1].fromTime
    }

    private getTatDate(prop): string {
        const completedDate = new Date(this.getLastCompletedDate(prop))
        // this.getCompletedDate(prop)[this.getCompletedDate(prop).length - 1]
        const loanOpsDistributionInDate = new Date(this.getLastLoanOpsDistributionInDate(prop))
        // this.getLoanOpsDistributionInDate(prop)[this.getLoanOpsDistributionInDate(prop).length - 1]
        const diffDays = Math.abs(completedDate.getTime() - loanOpsDistributionInDate.getTime()) / (1000 * 60 * 60 * 24);

        if (!completedDate || !loanOpsDistributionInDate) {
            return '';
        }
        return diffDays.toString();

    }

    private getTatTime(prop): string {
        const tatDate = Number(this.getTatDate(prop));
        const completedTime = this.getLastCompletedTime(prop);
        const loanOpsDistributionInTime = this.getLastLoanOpsDistributionInTime(prop);

        const date = new Date().toLocaleDateString();
        const dateCompletedTime = new Date(date + ' ' + completedTime);
        const dateLoanOpsDistributionInTime = new Date(date + ' ' + loanOpsDistributionInTime);
        const eightHours = new Date(date + ' 08:00:00');

        let diffInMinutes: number;

        if (tatDate === 0) {
            diffInMinutes = (dateLoanOpsDistributionInTime.getTime() - dateCompletedTime.getTime()) / (1000 * 60);
        } else {
            diffInMinutes = (dateCompletedTime.getTime() - eightHours.getTime()) / (1000 * 60);
        }

        const hours = Math.floor(diffInMinutes / 60);
        const minutes = Math.floor(diffInMinutes % 60);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    private getTanggalEfektifFasilitas(prod: any) {
        switch (prod.pengajuan) {
            case 'New':
                return `${prod.tenorFasilitas}  ${prod.periodType}` || ''
            case 'Renewal':
                return `${prod.mainProduct.maturityDate} s/d ${prod.mainProduct.proposeMaturityDate}` || ''
            case 'Renewal + Additional':
                return ``
            case 'Renewal + Decrease':
                return ``
            case 'Existing':
                return ``
            case 'Additional / Top Up':
                return prod.mainProduct.proposeMaturityDate || ''
            default:
                return prod.mainProduct.endPeriodRemark || ''
        }
    }
}