import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { MisReportService } from '../../mis-report.service';
import { MessageService } from 'primeng/api';
import * as ExcelJS from 'exceljs';
import { AbstractExcelMISReport } from '../../abstract-excel-report';
import { PageEvent } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { APPLICATION_TYPE } from 'app/shared/constants/base.constants';
import { map, switchMap, tap } from 'rxjs';
import { InternalService } from 'app/entities/internal/internal.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'jhi-mis-credit-legal-or',
  templateUrl: './mis-credit-legal-or.component.html',
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
        justify-content: flex-start;
        background-color: #fff;
        border-radius: 4px;
        padding: 16px;
        width: 90%;
        height: 100%;
        animation: skeleton-loading 1.5s ease-in-out infinite;
      }

      .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
      .mat-button-toggle-group-appearance-standard {
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
export class MisCreditLegalOrComponent extends AbstractExcelMISReport implements OnInit {
  public originalLovBranch;
  public selection = new SelectionModel<any>(true, []);
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
  public pageSize = 9999;
  public currentPage = 0;
  public totalItems = 0;
  public pageSizeOptions: number[] = [5, 10, 25, 50];
  public loadingSearch = false;
  private debounceTimer: any;
  public displayedColumns: string[] = ['proposalNumber', 'cif', 'debtorName', 'customerType', 'proposalDate', 'status', 'select'];
  public skeletonData = [
    {
      proposalNumber: '',
      cif: '',
      debtorName: '',
      customerType: '',
      proposalDate: '',
      status: '',
      select: '',
    },
  ];
  public statusMap = {
    done: ['DPPK Finalize', 'DPPK Review', 'Loan Ops Distribution', 'Loan Ops Checking', 'Loan Ops Review', 'Complete'],
    incoming: ['OL Assigned'],
    onProcess: [
      'OL Distribution',
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
    pending: ['Return To RM by Legal', 'Return To RM by PK', 'Return To RM(DPDL)'],
    cancel: ['Cancel'],
  };
  public outRegions: string[] = [
    '2101',
    '2201',
    '2501',
    '5202',
    '5101',
    '5301',
    '4201',
    '6101',
    '3101',
    '3201',
    '2401',
    '4102',
    '3102',
    '4101',
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
    this._resetForms();
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.searchResult.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.searchResult.length;
    return numSelected === numRows;
  }

  setAllSelectedSearch() {
    this.selection.select(...this.searchResult);
  }

  selectAll() {
    if (this.selection.selected.length > 0) {
      this.selection.clear();
    } else {
      this.selection.select(...this.searchResult);
    }
  }

  processSelectedItems() {
    const selectedData = this.selection.selected;
    if (!selectedData || selectedData.length === 0) {
      return [];
    }
    const selectedIds = selectedData.map((item: any) => item.id);
    return selectedIds;
  }

  private _resetForms(): void {
    if (this.form) {
      this.form.reset();
      this.allSelected = false;
      this.allSelectedUsername = false;
      this.allSelectedRegional = false;
      this.allSelectedBranch = false;
      this.allSelectedSummary = false;
      this.allSelectedProposalStatus = false;
    }
  }

  ngOnInit(): void {
    this.getStatusLOV('MIS_LEGAL_CL_OR').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });

    this.getUsernameLOV(' LEGALOFFICER_OUTREGION').subscribe({
      next: res => (this.lovUsername = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get pic' });
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
        map(internals =>
          internals
            .filter(internal => this.parentIds.includes(String(internal.parentId)))
            .map(internal => ({ id: internal.id, name: internal.facilityName, parentId: internal.parentId }))
        ),
        tap(filteredInternals => (this.lovRegional = filteredInternals)),
        switchMap(internals =>
          this.internalService
            .queryFilterBy({
              idInternalType: 'BRANCH',
              size: 9999,
              page: 0,
            })
            .pipe(
              map(response => response.body),
              map(branches =>
                branches
                  .filter(branch => internals.some(internal => this.outRegions.includes(String(branch.id))))
                  .map(branch => ({ id: branch.id, name: branch.facilityName, parentId: branch.parentId }))
              ),
              tap(filteredBranches => {
                this.originalLovBranch = filteredBranches;
                this.lovBranch = filteredBranches;
              })
            )
        )
      )
      .subscribe({
        next: () => console.log('Successfully loaded data'),
        error: err => {
          console.error('Error Occurred when loading data:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
        },
      });

    this.form.get('query')?.valueChanges.subscribe(value => {
      if (value === '') {
        this.clearSearch();
      }
    });
  }

  _handleRegionalChanges(regionalData) {
    if (regionalData === null || regionalData === '') {
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
      this.form.get('status')?.setValue('');
    }
  }

  public toggleSelectAllUsername(): void {
    this.allSelectedUsername = !this.allSelectedUsername;
    if (this.allSelectedUsername) {
      this.form.get('username')?.setValue([...this.lovUsername.map(username => username.userLogin)]);
    } else {
      this.form.get('username')?.setValue('');
    }
  }

  public toggleSelectRegionalAll(): void {
    this.allSelectedRegional = !this.allSelectedRegional;
    if (this.allSelectedRegional) {
      this.form.get('regional')?.setValue([...this.lovRegional.map(internal => internal.id)]);
    } else {
      this.form.get('regional')?.setValue('');
    }
  }

  public toggleSelectBranchAll(): void {
    this.allSelectedBranch = !this.allSelectedBranch;
    if (this.allSelectedBranch) {
      this.form.get('branch')?.setValue([...this.lovBranch.map(internal => internal.id)]);
    } else {
      this.form.get('branch')?.setValue('');
    }
  }

  public toggleSelectSummaryAll(): void {
    this.allSelectedSummary = !this.allSelectedSummary;
    if (this.allSelectedSummary) {
      this.form.get('summary')?.setValue([...this.lovApplicationType.map(appType => appType)]);
    } else {
      this.form.get('summary')?.setValue('');
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

      if (
        startDate ||
        endDate ||
        (status && status.length > 0) ||
        (regional && regional.length > 0) ||
        (username && username.length > 0) ||
        (branch && branch.length > 0) ||
        (summary && summary.length > 0) ||
        (proposalStatus && proposalStatus.length > 0)
      ) {
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
      status: new FormControl(''),
      username: new FormControl(''),
      regional: new FormControl(''),
      branch: new FormControl(''),
      summary: new FormControl(''),
      proposalStatus: new FormControl(''),
      query: new FormControl(''),
    });
  }

  private _handleFormChanges(): void {
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

    this.form.valueChanges.subscribe(changes => {
      if (Array.isArray(changes.status)) {
        if (changes.status.length === 0) {
          this._updateFormControl('status', '');
          this.allSelected = false;
        } else if (changes.status.length === this.lovStatus.length) {
          this.allSelected = true;
        }
      }

      if (Array.isArray(changes.username)) {
        if (changes.username.length === 0) {
          this._updateFormControl('username', '');
          this.allSelectedUsername = false;
        } else if (changes.username.length === this.lovUsername.length) {
          this.allSelectedUsername = true;
        }
      }

      if (changes.regional !== undefined) {
        this._handleRegionalChanges(changes.regional);
      }
    });

    this.form.get('query')?.valueChanges.subscribe(query => {
      if (query === '') {
        this.clearSearch();
      }
    });
  }

  private _updateFormControl(field: string, value: any): void {
    this.form.get(field)?.setValue(value, { emitEvent: false });
  }

  public generateMISCreditLegalOr(): void {
    const query = this.form.get('query')?.value;

    if (!query) {
      if (this.menu === 'dateFromStatus') {
        if ((!this.form.get('startDate')?.value || !this.form.get('endDate')?.value) && !this.form.get('status')?.value) {
          this.messageService.add({
            severity: 'error',
            summary: 'Warning',
            detail: 'Please, Select Parameter.',
          });
          return;
        }

        if (!this.form.get('startDate')?.value || !this.form.get('endDate')?.value) {
          this.messageService.add({
            severity: 'error',
            summary: 'Warning',
            detail: 'Please, Select Date Range.',
          });
          return;
        }

        if (!this.form.get('status')?.value) {
          this.messageService.add({
            severity: 'error',
            summary: 'Warning',
            detail: 'Please, Select Status.',
          });
          return;
        }
      } else if (this.menu === 'proposalDate') {
        if (!this.form.get('status')?.value) {
          this.messageService.add({
            severity: 'error',
            summary: 'Warning',
            detail: 'Please, Select Status.',
          });
          return;
        }
      }
    }

    this.misReportService.setLoading(true);

    let params;
    if (this.form.get('query')?.value) {
      params = {
        query: this.form.get('query')?.value,
        Region: 'R2',
      };
    } else {
      if (this.menu === 'dateFromStatus') {
        params = {
          startDate: this.form.get('startDate')?.value,
          endDate: this.form.get('endDate')?.value,
          status: this._convertStatusToString(this.form.get('status')?.value),
          userLogin: this.form.get('username')?.value ? this._convertStatusToString(this.form.get('username')?.value) : null,
          type: 'STATELOG',
        };
      } else {
        params = {
          startDate: null,
          endDate: null,
          status: this._convertStatusToString(this.form.get('status')?.value),
          userLogin: this.form.get('username')?.value ? this._convertStatusToString(this.form.get('username')?.value) : null,
          type: null,
        };
      }
    }

    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_LEGAL_CL_OR'),
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
    this.setUpColumns(this.columns);

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
    super.applyStyles('D3E9FF');
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
    const cp = this._filterCPBeforeGenerate(data);
    cp.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }

  private _filterCPBeforeGenerate(data) {
    data.forEach(proposal => {
      proposal.statusProposal = this._getStatusData(proposal);
    });

    const segmentation = this.form.get('regional')?.value;
    const branch = this.form.get('branch')?.value;
    const search = this.form.get('query')?.value;
    const statusProposal = this.form.get('proposalStatus')?.value;

    const selectedIds = this.processSelectedItems();

    let cp = data.filter(proposal => proposal.internalRegion === 'R2');

    if (selectedIds.length > 0) {
      return cp.filter(proposal => selectedIds.includes(proposal.id));
    }

    if (!search) {
      if (segmentation && segmentation.length > 0) {
        cp = cp.filter(proposal => segmentation.includes(proposal.regionalId));
      }

      if (branch && branch.length > 0) {
        cp = cp.filter(proposal => branch.includes(proposal.businessUnitRM));
      }

      if (statusProposal && statusProposal.length > 0) {
        cp = cp.filter(proposal => statusProposal.includes(proposal.statusProposal));
      }
    }

    return cp;
  }
  get columns() {
    return [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Debtor Name', key: 'debtorName' },
      { header: 'Requested By (Branch)', key: 'branch' },
      { header: 'Requested By (RM)', key: 'rm' },
      { header: 'PIC', key: 'pic' },
      { header: 'PIC Timeline', key: 'picTimeline' },
      { header: 'Summary', key: 'summary' },
      { header: 'Tanggal Jatuh Tempo', key: 'tanggalJatuhTempo' },
      { header: 'Segmentation', key: 'segmentation' },
      { header: 'Started (date)', key: 'started' },
      { header: 'Started (Month)', key: 'startedMonth' },
      { header: 'Year', key: 'year' },
      { header: 'DPDL (date)', key: 'dpdl' },
      { header: 'DPDL (Month)', key: 'dpdlMonth' },
      { header: 'DPDL (year)', key: 'dpdlYear' },
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
    const summary = this.form.get('summary')?.value;
    const search = this.form.get('query')?.value;
    let filteredProduct;
    if (summary && (search === '' || search === null)) {
      filteredProduct = proposal.product.filter(prod => summary.includes(prod.pengajuan));
    } else {
      filteredProduct = proposal.product.filter(prod => prod.pengajuan !== 'Existing');
    }

    filteredProduct.forEach(product => {
      const row = {
        no: worksheet.rowCount,
        debtorName: proposal.debtorName,
        branch: proposal.branchNameRM,
        rm: proposal.rmFirstName + ' ' + proposal.rmLastName,
        pic: this._getPic(proposal.timeLineCreditProposal),
        picTimeline: this._getPicTimeline(proposal.timeLineCreditProposal),
        summary: product.pengajuan,
        tanggalJatuhTempo: this._getTanggalJatuhTempo(product),
        segmentation: proposal.regionalName,
        started: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'OL Assigned', 'Date'),
        startedMonth: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'OL Assigned', 'Month'),
        year: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'OL Assigned', 'Year'),
        dpdl: this._getStartedAndDpdl(proposal.timeLineCreditProposal, 'DPDL Finalize', 'Date'),
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
        tanggalComplianceReview: this._getTanggalComplianceReview(proposal),
      };

      worksheet.addRow(row);
    });
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
    this.form.get('query')?.setValue('', { emitEvent: false }); // Ganti reset()
    this.searchResult = null;
    this.selection.clear();
  }

  public doSearch(pageEvent?: PageEvent): void {
    this.selection.clear();
    this.loadingSearch = true;

    if (pageEvent) {
      this.currentPage = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    }

    const queryValue = this.form.get('query')?.value;

    const predicate: object = {
      page: this.currentPage,
      query: queryValue,
      size: this.pageSize,
      sort: ['id,desc'],
      idPosition: this.getLocStor('POS'),
      Region: 'R2',
    };

    predicate['target'] = 'mis-cp-or-report';

    this.misReportService.searchCP(predicate).subscribe({
      next: res => {
        this.searchResult = res.body || [];
        const totalCount = res.headers.get('X-Total-Count');
        this.totalItems = totalCount ? parseInt(totalCount, 10) : 0;
        this.setAllSelectedSearch();
        this.loadingSearch = false;

        if (queryValue !== null && queryValue !== undefined) {
          this.form.get('query')?.setValue(queryValue, { emitEvent: false });
        }
      },
      error: (res: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
        this.loadingSearch = false;

        if (queryValue !== null && queryValue !== undefined) {
          this.form.get('query')?.setValue(queryValue, { emitEvent: false });
        }
      },
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

  private _getPicTimeline(timeLineCreditProposal) {
    return timeLineCreditProposal
      .filter(timeline => timeline.fromStatusDescription === 'DPDL Finalize')
      .map(timeline => timeline.personName)
      .join(',\n');
  }

  private _getPic(timeLineCreditProposal) {
    const filtered = timeLineCreditProposal.filter(timeline => timeline.fromStatusDescription === 'OL Assigned');

    const lastTimeline = filtered.length > 0 ? filtered[filtered.length - 1] : null;
    return lastTimeline ? lastTimeline.personName : '';
  }

  private _getTanggalJatuhTempo(product) {
    const allowedTypes = ['Renewal + Others', 'Renewal + Decrease', 'Renewal + Additional', 'Renewal'];

    if (allowedTypes.includes(product.pengajuan)) {
      const mainProd = product.mainProduct?.[0];
      if (mainProd?.maturityDate) {
        return this.formatDateID(mainProd.maturityDate).getFullDate();
      }
    }

    return '';
  }

  private _getStartedAndDpdl(timeLine: any, status: string, param: 'Date' | 'Month' | 'Year') {
    const data = timeLine?.filter(timeline => timeline.statusDescription === status);
    if (!data) {
      return '';
    }

    data.sort((a, b) => b.id - a.id);
    const firstData = data[0];
    const date = firstData?.fromDate;

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
      const date: string[] = proposal.timeLineCreditProposal
        .filter(timeline => timeline.fromStatusDescription === 'Compliance Director')
        .map(timeline => timeline.fromDate);
      const dateString = date[0];
      if (dateString === null || dateString === 'null' || dateString === undefined || !dateString || dateString.length === 0) {
        return '';
      }
      return this.formatDateID(dateString).getFullDate();
    } else {
      return '';
    }
  }

  private _getStatusData(proposal: any): string {
    const status = proposal.status;
    const timelineCP = proposal.timeLineCreditProposal;

    if (this.statusMap.done.includes(status)) {
      return 'DONE';
    }

    if (this.statusMap.incoming.includes(status)) {
      return 'INCOMING';
    }

    if (this.statusMap.onProcess.includes(status)) {
      return 'ON PROCESS';
    }

    if (this.statusMap.pending.includes(status)) {
      return 'PENDING';
    }

    if (this.statusMap.cancel.includes(status)) {
      const data = timelineCP?.find(timeline => timeline.statusDescription === 'DAR Checker' || timeline.statusDescription === 'DAR Notif');

      if (!data) {
        return '';
      }

      const createdDate = data?.fromDate;

      if (createdDate === null) {
        return '';
      }

      let threeMonthsAgo = new Date();
      const datestring = threeMonthsAgo.toISOString().split('T')[0];
      threeMonthsAgo = new Date(datestring);

      const year = threeMonthsAgo.getFullYear();
      const month = String(threeMonthsAgo.getMonth() + 1).padStart(2, '0');
      const day = String(threeMonthsAgo.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      if (createdDate < formattedDate) {
        return 'CANCEL';
      } else {
        return 'PENDING';
      }
    }

    return '';
  }
}
