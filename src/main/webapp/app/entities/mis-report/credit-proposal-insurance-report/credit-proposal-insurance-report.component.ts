import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AbstractExcelMISReport } from "../abstract-excel-report";
import { FormControl, FormGroup } from "@angular/forms";
import { MessageService } from "primeng/api";
import { MisReportService } from "../mis-report.service";
import moment from 'moment';
import * as ExcelJS from 'exceljs';

@Component({
    selector: 'jhi-credit-proposal-insurance-report',
    templateUrl: './credit-proposal-insurance-report.component.html',
    styleUrls: ['../credit-proposal/mis-report-credit-proposal.css', '../mis-report.css'],
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
export class CreditProposalInsuranceReportComponent extends AbstractExcelMISReport implements OnInit {

    public lovStatus = []
    public startDate: any
    public endDate: any
    public allSelected = false
    public MISReportCPInsuranceReport: FormGroup

    constructor(public misReportService: MisReportService, public messageService: MessageService) {
        super(misReportService);
        this.MISReportCPInsuranceReport = new FormGroup({
            startDate: new FormControl(''),
            endDate: new FormControl(''),
            status: new FormControl(''),
        });

        this.MISReportCPInsuranceReport.get('startDate')?.valueChanges.subscribe(date => {
            if (moment.isMoment(date)) {
                const formattedDate = date.format('YYYY-MM-DD');
                this.MISReportCPInsuranceReport.get('startDate')?.setValue(formattedDate, { emitEvent: false });
            }
        });

        this.MISReportCPInsuranceReport.get('endDate')?.valueChanges.subscribe(date => {
            if (moment.isMoment(date)) {
                const formattedDate = date.format('YYYY-MM-DD');
                this.MISReportCPInsuranceReport.get('endDate')?.setValue(formattedDate, { emitEvent: false });
            }
        });
    }

    dateRangeHasValue(): boolean {
        return this.MISReportCPInsuranceReport.get('date1')?.value && this.MISReportCPInsuranceReport.get('date2')?.value;
    }

    clearDateRange(): void {
        this.MISReportCPInsuranceReport.get('date1')?.reset();
        this.MISReportCPInsuranceReport.get('date2')?.reset();
    }

    get columns(): any[] {
        return [
            { header: 'No', key: 'no', width: 5 },
            { header: 'CIF Number', key: 'cifNumber', width: 15 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Collateral No', key: 'collateralNo', width: 15 },
            { header: 'Branch Code', key: 'branchCode', width: 10 },
            { header: 'Branch Name', key: 'branchName', width: 20 },
            { header: 'Business Unit', key: 'businessUnit', width: 15 },
            { header: 'Open Date', key: 'openDate', width: 15 },
            { header: 'Expiry Date', key: 'expiryDate', width: 15 },
            { header: 'Approval Number', key: 'approvalNumber', width: 20 },
            { header: 'Name', key: 'productName', width: 20 },
            { header: 'Plafond', key: 'plafond', width: 15 },
            { header: 'Outstanding (IDR)', key: 'outstanding', width: 20 },
            { header: 'Collateral Type', key: 'collateralType', width: 15 },
            { header: 'Collateral Detail', key: 'collateralDetail', width: 20 },
            { header: 'Collateral Code', key: 'collateralCode', width: 15 },
            { header: 'Certificate Number', key: 'certificateNumber', width: 20 },
            { header: 'Location', key: 'location', width: 20 },
            { header: 'Collateral Owner', key: 'collateralOwner', width: 20 },
            { header: 'Insurance Number', key: 'insuranceNumber', width: 20 },
            { header: 'Insurance Code', key: 'insuranceCode', width: 15 },
            { header: 'Insurance Name', key: 'insuranceName', width: 20 },
            { header: 'Policy Number', key: 'policyNumber', width: 20 },
            { header: 'Expiry Date', key: 'expiryDate', width: 15 },
            { header: 'Insurance Currency', key: 'insuranceCurrency', width: 20 },
            { header: 'Insurance Amount', key: 'insuranceAmount', width: 20 },
            { header: 'Company Name', key: 'companyName', width: 25 },
            { header: 'Status Banker Clause', key: 'statusBankerClause', width: 25 },
            { header: 'Policy Document', key: 'policyDocument', width: 20 },
            { header: 'Payment Status', key: 'paymentStatus', width: 15 },
            { header: 'Time', key: 'time', width: 10 },
            { header: 'Operator Name', key: 'operatorName', width: 20 },
            { header: 'Remark', key: 'remark', width: 25 }
        ]
    }

    ngOnInit(): void {
        this.getStatusLOV('MIS_CREDIT_INSURANCE').subscribe({
            next: res => (this.lovStatus = res),
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
            },
        });
    }


    public toggleSelectAll(): void {
        this.allSelected = !this.allSelected;
        if (this.allSelected) {
            this.MISReportCPInsuranceReport.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
        } else {
            this.MISReportCPInsuranceReport.get('status')?.setValue('');
        }
    }

    public generateMISReportCPInsuranceReport(): void {
        this.misReportService.setLoading(true)

        const params = {
            startDate: this.MISReportCPInsuranceReport.get('startDate')?.value,
            endDate: this.MISReportCPInsuranceReport.get('endDate')?.value,
            status: this._convertStatusToString(this.MISReportCPInsuranceReport.get('status')?.value),
            type: 'STATELOG'
        }

        this.misReportService.getMISReportCPCredam(params).subscribe({
            next: res => this._processGenerate(res.body, 'MIS_CP_CREDIT_INSURANCE_REPORT'),
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate MIS Report' });
                this._resetData();
                this.misReportService.setLoading(false);
            },
            complete: () => {
                this._resetData();
                this.misReportService.setLoading(false);
            }
        })
    }

    private _processGenerate(data, fileName) {
        this.setUpColumns(this.columns);

        // if data is empty, generate an empty file
        if (!data || data.length === 0) {
            this.applyStyles('ff007f7f');
            this.downloadFile(fileName);
            return;
        }

        // Add data to worksheet
        this.processData(data);

        this._applyStyles();
        this.downloadFile(fileName);
        this._resetData();
    }

    protected processData(data: any[]): void {
        data.forEach((proposal, index) => {
            this._addData(this.worksheet, proposal);
        });
    }

    private _addData(worksheet: ExcelJS.Worksheet, proposal: any): void {
        const baseData = {
            no: worksheet.rowCount,
            cifNumber: proposal.cif || '',
            name: proposal.debtorName || '',
            branchCode: proposal.bookingBranchId || '',
            branchName: proposal.bookingBranchName || '',
            businessUnit: proposal.segmentParentRM || '',
            openDate: proposal.product
                .map(product => (product.firstDisbursementDate !== 'null' ? this._formatDateSLA(product.firstDisbursementDate) : ''))
                .join(',\n') || '',
            expiryDate: proposal.product
                .map(product => (product.mainProduct.maturityDate !== 'null' ? this._formatDateSLA(product.mainProduct.maturityDate) : ''))
                .join(',\n') || '',
            approvalNumber: proposal.product.map(product => product.approvalNumber).join(',\n') || '',
            productName: proposal.product.map(product => product.productName).join(',\n') || '',
            plafond: proposal.subTotalPlafondEqToIDR || '',
            outstanding: proposal.totalOsEqToIDR || ''
        };

        if (!proposal.collateral || proposal.collateral.length === 0) {
            worksheet.addRow(baseData);
        }

        const filteredCollateral = proposal.collateral.filter((collateral) =>
            ['Real Estate', 'Machine', 'Vehicle', 'Personal Property'].includes(collateral.collateralType) && collateral.collateralTypeInsurance === "true")

        // Process each collateral
        filteredCollateral.forEach((collateral) => {

            const collateralData = {
                ...baseData,
                no: worksheet.rowCount,
                collateralType: collateral.collateralType || '',
                collateralDetail: collateral.collateralCode || '',
                collateralCode: collateral.collateralProposePricing || '',
                certificateNumber: collateral.certificateAppraisal ? collateral.certificateAppraisal.map(certificate => certificate.certificateNumber).join(',\n') : '',
                location: collateral.collateralAddress || '',
                collateralOwner: collateral.collateralOwnerIDD || ''
            };

            if (!collateral.collateralInsurance || collateral.collateralInsurance.length === 0) {
                worksheet.addRow(collateralData);
            } else {
                // Process each insurance
                collateral.collateralInsurance.forEach((insurance) => {
                    const rowData = {
                        ...collateralData,
                        no: worksheet.rowCount,
                        insuranceNumber: '',
                        insuranceCode: insurance.insuranceTypeCode || '',
                        insuranceName: insurance.insuranceTypeName || '',
                        policyNumber: insurance.policyNo || '',
                        expiryDate: insurance.expiryDate ? this._formatDateSLA(insurance.expDate) : '',
                        insuranceCurrency: insurance.currency || '',
                        insuranceAmount: insurance.insuranceAmount || '',
                        companyName: insurance.corpName || '',
                        statusBankerClause: insurance.statusBankerClause || '',
                        policyDocument: insurance.policyDocument || '',
                        paymentStatus: insurance.paymentStatus || '',
                        time: '',
                        operatorName: '',
                        remark: insurance.remarks || ''
                    };
                    worksheet.addRow(rowData);
                });
            }
        });
    }

    private _applyStyles(): void {
        super.applyStyles('ff007f7f');

        const columnsToBeWraped = [
            'collateralNo',
            'openDate',
            'expiryDate',
            'approvalNumber',
            'productName',
            'certificateNumber',
        ];

        columnsToBeWraped.forEach(column => {
            this.worksheet.getColumn(column).alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true,
            };

            const columnValue = this.worksheet.getColumn(column);

            const newValue = columnValue.values.map(value => {
                if (value) {
                    return this._clearEmptyEntries(value.toString());
                }
                return value;
            });

            columnValue.values = newValue;
        });
    }

}