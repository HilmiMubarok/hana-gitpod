import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AbstractExcelMISReport } from "../../abstract-excel-report";
import { MisReportService } from "../../mis-report.service";
import { MessageService } from "primeng/api";
import { FormControl, FormGroup } from "@angular/forms";
import moment from "moment";
import * as ExcelJS from 'exceljs';
import { PageEvent } from "@angular/material/paginator";
import { HttpErrorResponse } from "@angular/common/http";
import { InternalService } from "app/entities/internal/internal.service";
import { APPLICATION_TYPE } from "app/shared/constants/base.constants";
import { map, switchMap, tap } from "rxjs";

@Component({
    selector: "jhi-mis-credit-legal-ho-report",
    templateUrl: "./mis-credit-legal-ho-report.component.html",
    styleUrls: ['../../disabled-style.scss'],
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

      .skeleton-loading {
        display: flex;
        align-items: center;
        justify-content: start;
        background-color: #fff;
        border-radius: 4px;
        padding: 16px;
        width: 90%;
        height: 100%;
        animation: skeleton-loading 1.5s ease-in-out infinite;
      }

      .mat-button-toggle-standalone.mat-button-toggle-appearance-standard, .mat-button-toggle-group-appearance-standard {
        border: none !important;
      }

      .mat-button-toggle {
        margin: 0 3px;
        border-radius: 5px !important;
        font-weight: 400;
      }

      .mat-button-toggle-appearance-standard {
        background: #e5e5e5;
      }

      .mat-button-toggle-group-appearance-standard .mat-button-toggle + .mat-button-toggle {
        border: none;
      }

      .mat-button-toggle-checked {
        color: rgb(255 255 255 / 87%);
        background: #48a5a0;
      }

      @keyframes skeleton-loading {
        0% {
          background-color: #e2e2e2;
        }
        50% {
          background-color: #f2f2f2;
        }
        100% {
          background-color: #e2e2e2;
        }
      }
    `,
    ],
})
export class MisCreditLegalHoReportComponent extends AbstractExcelMISReport implements OnInit {

    public originalLovBranch;
    public menu = 'dateFromStatus';
    public lovStatus = [];
    public lovUsername = [];
    public lovRegional = [];
    public lovBranch = [];
    public lovProposalStatus = ['DONE', 'INCOMING', 'ON PROCESS', 'PENDING', 'CANCEL'];
    public lovApplicationType = [
        'New',
        'Additional / Top Up',
        'Renewal',
        'Restructure',
        'Others',
        'Renewal + Additional',
        'Renewal + Decrease',
        'Decrease',
        'Renewal + Others',
        'Additional + Others',
        'Decrease + Others',
    ];
    public form: FormGroup;
    public allSelected = false;
    public allSelectedUsername = false;
    public allSelectedRegional = false;
    public allSelectedBranch = false;
    public allSelectedSummary = false;
    public allSelectedProposalStatus = false;
    public searchResult = null;
    public pageSize = 10;
    public currentPage = 0;
    public totalItems = 0;
    public pageSizeOptions: number[] = [5, 10, 25, 50];
    public loadingSearch = false;
    private debounceTimer: any;
    public displayedColumns: string[] = ['proposalNumber', 'cif', 'debtorName', 'customerType', 'proposalDate', 'status'];
    public skeletonData = [
        {
            proposalNumber: '',
            cif: '',
            debtorName: '',
            customerType: '',
            proposalDate: '',
            status: '',
        },
    ];

    public inRegions: string[] = [
        '1101', '1113', '1129', '1139', '1111', '1135', '1106', '1110', '1104', '1142',
        '1115', '1105', '1124', '2301', '2302', '1102', '1127', '1122', '1107', '1133',
        '1114', '1108', '1118', '1136'
    ];

    private readonly parentIds = ['9901', '9902', '9903', '9904', '9905'];
    @ViewChild('formContainer', { static: true }) formContainer: ElementRef;

    constructor(public misReportService: MisReportService, public messageService: MessageService, public internalService: InternalService) {
        super(misReportService);
        this._initializeForm();
        this._handleFormChanges();
    }

    onMenuChanged(): void {
        this._initializeForm();
    }

    ngOnInit(): void {
        this.getStatusLOV('MIS_LEGAL_CL_HO').subscribe({
            next: res => (this.lovStatus = res),
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
            },
        })

        this.misReportService.getPicLegalHO().subscribe({
            next: res => this.lovUsername = res.sort((a: any, b: any) => a.employeeFirstName?.localeCompare(b.employeeFirstName)),
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to get PIC',
                });
            },
        });

        this.internalService
            .queryFilterBy({
                idInternalType: APPLICATION_TYPE.BUSINESS_UNIT,
                size: 9999,
                page: 0,
            })
            .pipe(
                map(response => response.body),
                map(internals => internals
                    .filter(internal => this.parentIds.includes(String(internal.parentId)))
                    .map(internal => ({ id: internal.id, name: internal.facilityName, parentId: internal.parentId }))
                ),
                tap(filteredInternals => this.lovRegional = filteredInternals),
                switchMap(internals => this.internalService.queryFilterBy({
                    idInternalType: 'BRANCH',
                    size: 9999,
                    page: 0,
                }).pipe(
                    map(response => response.body),
                    map(branches => branches
                        .filter(branch => internals.some(internal => this.inRegions.includes(String(branch.id))))
                        .map(branch => ({ id: branch.id, name: branch.facilityName, parentId: branch.parentId }))
                    ),
                    tap(filteredBranches => {
                        this.originalLovBranch = filteredBranches;
                        this.lovBranch = filteredBranches;
                    })
                ))
            )
            .subscribe({
                next: () => console.log("Successfully loaded data"),
                error: err => {
                    console.error('Error Occurred when loading data:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
                },
            });
    }

    _handleRegionalChanges(regionalData) {
        if (regionalData === null) {
            return;
        }

        const copyBranches = [...this.originalLovBranch];
        this.lovBranch = copyBranches.filter(branch => regionalData.some(region => region === branch.parentId));
    }

    public toggleSelectAll(): void {
        this.allSelected = !this.allSelected;
        if (this.allSelected) {
            this.form.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
        } else {
            this.form.get('status')?.setValue(null);
        }
    }

    public toggleSelectAllUsername(): void {
        this.allSelectedUsername = !this.allSelectedUsername;
        if (this.allSelectedUsername) {
            this.form.get('username')?.setValue([...this.lovUsername.map(username => username.partyId)]);
        } else {
            this.form.get('username')?.setValue(null);
        }
    }

    public toggleSelectRegionalAll(): void {
        this.allSelectedRegional = !this.allSelectedRegional;
        if (this.allSelectedRegional) {
            this.form.get('regional')?.setValue([...this.lovRegional.map(internal => internal.id)]);
        } else {
            this.form.get('regional')?.setValue(null);
        }
    }

    public toggleSelectBranchAll(): void {
        this.allSelectedBranch = !this.allSelectedBranch;
        if (this.allSelectedBranch) {
            this.form.get('branch')?.setValue([...this.lovBranch.map(internal => internal.id)]);
        } else {
            this.form.get('branch')?.setValue(null);
        }
    }

    public toggleSelectSummaryAll(): void {
        this.allSelectedSummary = !this.allSelectedSummary;
        if (this.allSelectedSummary) {
            this.form.get('summary')?.setValue([...this.lovApplicationType.map(appType => appType)]);
        } else {
            this.form.get('summary')?.setValue(null);
        }
    }

    public toggleSelectProposalStatus(): void {
        this.allSelectedProposalStatus = !this.allSelectedProposalStatus;
        if (this.allSelectedProposalStatus) {
            this.form.get('proposalStatus')?.setValue([...this.lovProposalStatus.map(prop => prop)]);
        } else {
            this.form.get('proposalStatus')?.setValue(null);
        }
    }

    public clearDateRange(): void {
        this.form.get('startDate')?.reset();
        this.form.get('endDate')?.reset();
    }

    onDateRangeFocus() {
        this.form.get('query')?.disable();
        this.applyDisabledStyle(this.formContainer.nativeElement, true);
    }

    onDateRangeBlur() {
        this.checkFieldStatus();
    }

    checkFieldStatus() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            const startDate = this.form.get('startDate')?.value;
            const endDate = this.form.get('endDate')?.value;
            const status = this.form.get('status')?.value;
            const username = this.form.get('username')?.value;
            const regional = this.form.get('regional')?.value;
            const branch = this.form.get('branch')?.value;
            const proposalStatus = this.form.get('proposalStatus')?.value;
            const summary = this.form.get('summary')?.value;

            if ((startDate || endDate) || (status && status.length > 0) || (regional && regional.length > 0) || (username && username.length > 0) || (branch && branch.length > 0) || (summary && summary.length > 0) || (proposalStatus && proposalStatus.length > 0)) {
                this.form.get('query')?.disable();
                this.applyDisabledStyle(this.formContainer.nativeElement, true);
            } else {
                this.form.get('query')?.enable();
                this.applyDisabledStyle(this.formContainer.nativeElement, false);
            }
        }, 50);
    }

    public dateRangeHasValue(): boolean {
        return this.form.get('startDate')?.value && this.form.get('endDate')?.value;
    }

    private _initializeForm() {
        this.form = new FormGroup({
            startDate: new FormControl(''),
            endDate: new FormControl(''),
            status: new FormControl(null),
            username: new FormControl(null),
            regional: new FormControl(null),
            branch: new FormControl(''),
            summary: new FormControl(''),
            proposalStatus: new FormControl(''),
            query: new FormControl(''),
        });
    }

    private _handleFormChanges(): void {
        this.form.valueChanges.subscribe(changes => {

            if (moment.isMoment(changes.startDate)) {
                this._updateFormControl('startDate', changes.startDate.format('YYYY-MM-DD'));
            }

            if (moment.isMoment(changes.endDate)) {
                this._updateFormControl('endDate', changes.endDate.format('YYYY-MM-DD'));
            }

            if (Array.isArray(changes.status)) {
                if (changes.status.length === 0) {
                    this._updateFormControl('status', null);
                    this.allSelected = false;
                } else if (changes.status.length === this.lovStatus.length) {
                    this.allSelected = true;
                }
            }

            if (Array.isArray(changes.username)) {
                if (changes.username.length === 0) {
                    this._updateFormControl('username', null);
                    this.allSelectedUsername = false;
                } else if (changes.username.length === this.lovUsername.length) {
                    this.allSelectedUsername = true;
                }
            }

            if (changes.regional !== undefined) {
                this._handleRegionalChanges(changes.regional);
            }
        });
    }

    private _updateFormControl(field: string, value: any): void {
        this.form.get(field)?.setValue(value, { emitEvent: false });
    }

    public generateMISLegalReport(): void {
        this.misReportService.setLoading(true);

        let params;
        if (this.form.get('query')?.value) {
            params = {
                query: this.form.get('query')?.value,
            };
        } else {

            if (this.menu === 'dateFromStatus') {
                params = {
                    startDate: this.form.get('startDate')?.value,
                    endDate: this.form.get('endDate')?.value,
                    status: this._convertStatusToString(this.form.get('status')?.value),
                    // userName: this._convertStatusToString(this.form.get('username')?.value),
                    assignTo: "dataAssignToLegalOfficer",
                    // regionalRM: this._convertStatusToString(this.form.get('regional')?.value),
                    type: 'STATELOG',
                };
            } else {
                params = {
                    startDate: null,
                    endDate: null,
                    status: this._convertStatusToString(this.form.get('status')?.value),
                    // userName: this._convertStatusToString(this.form.get('username')?.value),
                    assignTo: "dataAssignToLegalOfficer",
                    // regionalRM: this._convertStatusToString(this.form.get('regional')?.value),
                    type: null,
                };
            }

        }

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
        const branch = this.form.get('branch')?.value;
        const search = this.form.get('query')?.value;
        let cp

        if (branch !== '' && search === '') {
            cp = data.filter(proposal => proposal.branchNameRM === branch);
        } else {
            cp = data
        }

        cp.forEach((proposal, index) => {
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

        const summary = this.form.get('summary')?.value
        const search = this.form.get('query')?.value
        let filteredProduct;
        if (summary !== '' && search === '') {
            filteredProduct = proposal.product.filter(prod => prod.pengajuan === summary)
        } else {
            filteredProduct = proposal.product
        }

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

    // ==== Form Search Section ==== //
    public onSearchBlur() {
        const searchValue = this.form.get('query')?.value;
        if (!searchValue) {
            this.form.get('startDate')?.enable();
            this.form.get('endDate')?.enable();
            this.form.get('status')?.enable();
            this.form.get('username')?.enable();
            this.form.get('regional')?.enable();
            this.form.get('branch')?.enable();
            this.form.get('proposalStatus')?.enable();
            this.form.get('summary')?.enable();

            this.applyDisabledStyle(this.formContainer.nativeElement, false);
        }
    }

    public onSearchFocus() {
        this.form.get('startDate')?.disable();
        this.form.get('endDate')?.disable();
        this.form.get('status')?.disable();
        this.form.get('username')?.disable();
        this.form.get('regional')?.disable();
        this.form.get('branch')?.disable();
        this.form.get('proposalStatus')?.disable();
        this.form.get('summary')?.disable();

        this.applyDisabledStyle(this.formContainer.nativeElement, true);
    }

    public clearSearch(): void {
        this.form.get('query')?.reset();
        this.searchResult = null;
    }

    public doSearch(pageEvent?: PageEvent): void {
        this.loadingSearch = true;

        if (pageEvent) {
            this.currentPage = pageEvent.pageIndex;
            this.pageSize = pageEvent.pageSize;
        }

        const predicate: object = {
            page: this.currentPage,
            query: this.form.get('query')?.value,
            size: this.pageSize,
            sort: ['id,desc'],
            idPosition: this.getLocStor('POS'),
        };

        predicate['target'] = 'credit_proposal_status';

        this.misReportService.searchCP(predicate).subscribe({
            next: res => {
                this.searchResult = res.body || [];
                const totalCount = res.headers.get('X-Total-Count');
                this.totalItems = totalCount ? parseInt(totalCount, 10) : 0;
                this.loadingSearch = false;
            },
            error: (res: HttpErrorResponse) => console.error(res.message),
        });
    }

    private getLocStor(cookieName: string) {
        let result = null;
        const cookies: string[] = document.cookie.split(';');

        cookies.forEach(o => {
            const cookie: string[] = o.split('=');
            const name: string = cookie[0].trim();
            if (name === cookieName) {
                result = cookie[1];
            }
        });

        return result;
    }

    // ==== End Form Search Section ==== //

    private _getPicTimeline(timeLineCreditProposal) {
        return timeLineCreditProposal.filter(timeline => timeline.fromStatusDescription === 'DPDL Finalize').map(timeline => timeline.personName).join(',\n');
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
            incoming: ['OL Assigned'],
            onProcess: [
                "OL Distribution",
                "Legal Head Review",
                "Legal Lead Review",
                "Legal Team Lead Review",
                "PK Finalize",
                "PK Generated",
                "Return To OL",
                "PK Legal Lead Review",
                "PK Team Lead Review",
                "DPDL Finalize",
                "DPDL Legal Head Review",
                "DPDL Legal Lead Review",
                "DPDL Team Lead Review"
            ],
            pending: [
                'Return To RM by Legal',
                'Return To RM by PK',
                'Return To RM(DPDL)',
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