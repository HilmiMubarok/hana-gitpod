import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import moment from 'moment';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import * as ExcelJS from 'exceljs';
import { HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { InternalService } from 'app/entities/internal/internal.service';
import { APPLICATION_TYPE } from 'app/shared/constants/base.constants';
import { map, tap, switchMap } from 'rxjs';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { IGeneralParameter } from 'app/entities/master-parameter/general-parameter/general-parameter.model';

@Component({
  selector: 'jhi-mis-laporan-admin-legal',
  templateUrl: './mis-laporan-admin-legal.component.html',
  styleUrls: ['../disabled-style.scss'],
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
export class MisLaporanAdminLegalComponent extends AbstractExcelMISReport implements OnInit {
  public inRegions: string[] = [
    '1101',
    '1113',
    '1129',
    '1139',
    '1111',
    '1135',
    '1106',
    '1110',
    '1104',
    '1142',
    '1115',
    '1105',
    '1124',
    '2301',
    '2302',
    '1102',
    '1127',
    '1122',
    '1107',
    '1133',
    '1114',
    '1108',
    '1118',
    '1136',
  ];
  public menu = 'dateFromStatus';
  public lovStatus = [];
  public lovUsername = [];
  public lovRegional = [];
  public lovBranch = [];
  public lovJenisPengikatan = ['Notaril', 'Un-Notaril'];
  public lovAggrementType = ['NEW', 'ADDENDUM', 'Perubahan dan Pernyataan Kembali'];
  public lovAkta: IGeneralParameter[] = [];
  public form: FormGroup;
  public allSelected = false;
  public allSelectedJenisPengikatan = false;
  public allSelectedRegional = false;
  public allSelectedBranch = false;
  public allSelectedAkta = false;
  public searchResult = null;
  public pageSize = 10;
  public currentPage = 0;
  public totalItems = 0;
  public pageSizeOptions: number[] = [5, 10, 25, 50];
  public loadingSearch = false;
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

  private readonly parentIds = ['9901', '9902', '9903', '9904', '9905'];
  @ViewChild('formContainer', { static: true }) formContainer: ElementRef;
  originalLovBranch: { id: number; name: string; parentId: number }[];
  allSelectedjenisPk: boolean;
  allSelectedAggrementType: any;

  constructor(
    public misReportService: MisReportService,
    public messageService: MessageService,
    public internalService: InternalService,
    public generalParameterService: GeneralParameterService
  ) {
    super(misReportService);
    this._initializeForm();
    this._handleFormChanges();
  }

  onMenuChanged(): void {
    this._resetForms();
  }

  private _resetForms(): void {
    if (this.form) {
      this.form.reset();
      this.allSelected = false;
      this.allSelectedAkta = false;
      this.allSelectedRegional = false;
      this.allSelectedBranch = false;
      this.allSelectedjenisPk = false;
      this.allSelectedAggrementType = false;
      this.allSelectedJenisPengikatan = false;
      this.searchResult = null;
    }
  }
  ngOnInit(): void {
    this.getStatusLOV('MIS_LEGAL_ADM_LA').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
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
                  .filter(branch => internals.some(internal => this.inRegions.includes(String(branch.id))))
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
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVERNOTE_LAINNYA',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.lovAkta = res.body;
        console.log('lovAkta', this.lovAkta);
      });
  }

  _handleRegionalChanges(regionalData) {
    if (regionalData === null) {
      return;
    }
    if (!Array.isArray(regionalData)) {
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

  public toggleSelectAktaAll(): void {
    this.allSelectedAkta = !this.allSelectedAkta;
    if (this.allSelectedAkta) {
      this.form.get('akta')?.setValue([...this.lovAkta.map(akta => akta.value)]);
    } else {
      this.form.get('akta')?.setValue(null);
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

  public toggleSelectAllJenisPengikatan(): void {
    this.allSelectedJenisPengikatan = !this.allSelectedJenisPengikatan;
    if (this.allSelectedJenisPengikatan) {
      this.form.get('jenisPengikatan')?.setValue([...this.lovJenisPengikatan.map(lovJenisPengikatan => lovJenisPengikatan)]);
    } else {
      this.form.get('jenisPengikatan')?.setValue(null);
    }
  }

  public toggleSelectAggrementTypeAll(): void {
    this.allSelectedAggrementType = !this.allSelectedAggrementType;
    if (this.allSelectedAggrementType) {
      this.form.get('aggrementType')?.setValue([...this.lovAggrementType.map(lovAggrementType => lovAggrementType)]);
    } else {
      this.form.get('aggrementType')?.setValue(null);
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
  private debounceTimer: any;
  checkFieldStatus() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      const startDate = this.form.get('startDate')?.value;
      const endDate = this.form.get('endDate')?.value;
      const status = this.form.get('status')?.value;
      const jenisPengikatan = this.form.get('jenisPengikatan')?.value;
      const regional = this.form.get('regional')?.value;
      const branch = this.form.get('branch')?.value;
      const akta = this.form.get('akta')?.value;
      const aggrementType = this.form.get('aggrementType')?.value;

      if (
        startDate ||
        endDate ||
        (status && status.length > 0) ||
        (jenisPengikatan && jenisPengikatan.length > 0) ||
        (regional && regional.length > 0) ||
        (branch && branch.length > 0) ||
        (akta && akta.length > 0) ||
        (aggrementType && aggrementType.length > 0)
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
      jenisPengikatan: new FormControl(''),
      regional: new FormControl(''),
      branch: new FormControl(''),
      akta: new FormControl(''),
      aggrementType: new FormControl(''),
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
          this._updateFormControl('status', null);
          this.allSelected = false;
        } else if (changes.status.length === this.lovStatus.length) {
          this.allSelected = true;
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

  public generateMISLaporanAdminLegalReport(): void {
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
      };
    } else {
      if (this.menu === 'dateFromStatus') {
        params = {
          startDate: this.form.get('startDate')?.value,
          endDate: this.form.get('endDate')?.value,
          status: this._convertStatusToString(this.form.get('status')?.value),
          type: 'STATELOG',
        };
      } else {
        params = {
          startDate: null,
          endDate: null,
          status: this._convertStatusToString(this.form.get('status')?.value),
          type: null,
        };
      }
    }
    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_LEGAL_ADM_LA'),
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
  _filterCPBeforeGenerate(data) {
    const branch = this.form.get('branch')?.value;
    const akta = this.form.get('akta')?.value;
    const search = this.form.get('query')?.value;

    let cp = data;

    if (!search) {
      if (akta && akta.length > 0) {
        cp = cp.filter(proposal => proposal.legalCovernote?.some(item => item.covernoteTask?.some(task => akta.includes(task.code))));
      }

      if (branch && branch.length > 0) {
        cp = cp.filter(proposal => branch.includes(proposal.businessUnitRM));
      }
    }

    return cp;
  }

  protected processData(data: any[]): void {
    const cp = this._filterCPBeforeGenerate(data);
    cp.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }

  get columns() {
    return [
      { header: 'No.', key: 'no' },
      { header: 'Tanggal DPDL', key: 'tanggalDpdl' },
      { header: 'Bulan', key: 'bulan' },
      { header: 'Tahun', key: 'tahun' },
      { header: 'Nama Debitur', key: 'namaDebitur' },
      { header: 'Cabang', key: 'cabang' },
      { header: 'RM', key: 'rm' },
      { header: 'Segmentasion', key: 'segmentation' },
      { header: 'PIC', key: 'pic' },
      { header: 'Tanggal Pembagian Tugas', key: 'tglPemTgs' },
      { header: 'Tanggal Akad', key: 'tglAkad' },
      { header: 'Jenis Pengikatan', key: 'jnsPengikatan' },
      { header: 'Nama Notaris', key: 'namaNotaris' },
      { header: 'Jenis PK', key: 'jenisPK' },
      { header: 'Akta', key: 'akta' },
      { header: 'No. Akta', key: 'noAkta' },
      { header: 'Tanggal Akta', key: 'tglAkta' },
      { header: 'Tanggal Target Penyelesaian', key: 'tglTargetPenyelesaian' },
      { header: 'Tanggal Mulai HT - EL', key: 'tglMulaiHtEl' },
      { header: 'Tanggal Selesai HT - EL', key: 'tglSelesaiHtEl' },
      { header: 'Tanggal Selesai Akta', key: 'tglSelesaiAkta' },
      { header: 'Checking by PIC Legal', key: 'checkingbyPicLegal' },
      { header: 'Tanggal Tanda Terima Custody', key: 'tglTandaTerimaCus' },
      { header: 'Note', key: 'note' },
    ];
  }

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal: any, index: number) {
    const timeLineData = proposal.timeLineCreditProposal?.sort((a, b) => a.id - b.id) || [];
    const latestDppkFinalizeDate = timeLineData
      .filter(item => item.statusDescription === 'DPPK Finalize')
      .sort((b, a) => new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime());

    const dppkFinalizeLatestDate =
      latestDppkFinalizeDate.length > 0 ? new Date(latestDppkFinalizeDate[0].fromDate).getDate().toString().padStart(2, '0') : '';
    const dppkFinalizeLatestMonth =
      latestDppkFinalizeDate.length > 0 ? (new Date(latestDppkFinalizeDate[0].fromDate).getMonth() + 1).toString().padStart(2, '0') : '';
    const dppkFinalizeLatestYear =
      latestDppkFinalizeDate.length > 0 ? new Date(latestDppkFinalizeDate[0].fromDate).getFullYear().toString() : '';

    const firstOlAssign = timeLineData
      .filter(item => item.statusDescription === 'OL Assigned')
      .sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());

    const legalCovernotes = proposal.legalCovernote;

    if (legalCovernotes?.length) {
      legalCovernotes.forEach(prod => {
        prod.covernoteTask?.forEach(task => {
          worksheet.addRow({
            no: index + 1 || '',
            tanggalDpdl: dppkFinalizeLatestDate || '',
            bulan: dppkFinalizeLatestMonth || '',
            tahun: dppkFinalizeLatestYear || '',
            namaDebitur: proposal.debtorName || '',
            cabang: proposal.branchNameRM || '',
            rm: (proposal.rmFirstName || '') + ' ' + (proposal.rmLastName || ''),
            segmentation: proposal.regionalParentRM || '',
            pic: latestDppkFinalizeDate.length > 0 ? latestDppkFinalizeDate[0].personName : '',
            tglPemTgs: firstOlAssign.length > 0 ? this._convertDate(firstOlAssign[0].fromDate) : '',
            tglAkad: this._convertDate(proposal.agreement?.dateAgreement) || '',
            jnsPengikatan: proposal.agreement?.isNotaril || '',
            namaNotaris: proposal.agreement?.isNotaril === 'Notaril' ? proposal.agreement.notaryName : ' - ',
            jenisPK: proposal.agreement?.agreementType || '',
            akta: task.code || '',
            noAkta: proposal.agreement?.isNotaril === 'Notaril' ? proposal.agreement.notaryNumber : proposal.agreement.agreementNumber,
            tglAkta: this._convertDate(proposal.agreement?.dateAgreement) || '',
            tglTargetPenyelesaian: '',
            tglMulaiHtEl: '',
            tglSelesaiHtEl: '',
            tglSelesaiAkta: '',
            checkingbyPicLegal: '',
            tglTandaTerimaCus: '',
            note: '',
          });
        });
      });
    } else {
      // Kalau tidak ada legalCovernote, tetap tambahkan baris dengan akta kosong
      worksheet.addRow({
        no: index + 1 || '',
        tanggalDpdl: dppkFinalizeLatestDate || '',
        bulan: dppkFinalizeLatestMonth || '',
        tahun: dppkFinalizeLatestYear || '',
        namaDebitur: proposal.debtorName || '',
        cabang: proposal.branchNameRM || '',
        rm: (proposal.rmFirstName || '') + ' ' + (proposal.rmLastName || ''),
        segmentation: proposal.regionalParentRM || '',
        pic: latestDppkFinalizeDate.length > 0 ? latestDppkFinalizeDate[0].personName : '',
        tglPemTgs: firstOlAssign.length > 0 ? this._convertDate(firstOlAssign[0].fromDate) : '',
        tglAkad: this._convertDate(proposal.agreement?.dateAgreement) || '',
        jnsPengikatan: proposal.agreement?.isNotaril || '',
        namaNotaris: proposal.agreement?.isNotaril === 'Notaril' ? proposal.agreement.notaryName : ' - ',
        jenisPK: proposal.agreement?.agreementType || '',
        akta: '', // kosong karena tidak ada covernote
        noAkta: proposal.agreement?.isNotaril === 'Notaril' ? proposal.agreement.notaryNumber : proposal.agreement.agreementNumber,
        tglAkta: this._convertDate(proposal.agreement?.dateAgreement) || '',
        tglTargetPenyelesaian: '',
        tglMulaiHtEl: '',
        tglSelesaiHtEl: '',
        tglSelesaiAkta: '',
        checkingbyPicLegal: '',
        tglTandaTerimaCus: '',
        note: '',
      });
    }
  }

  // ==== Form Search Section ==== //
  public onSearchBlur() {
    const searchValue = this.form.get('query')?.value;
    if (!searchValue) {
      this.form.get('startDate')?.enable();
      this.form.get('endDate')?.enable();
      this.form.get('status')?.enable();
      this.form.get('regional')?.enable();
      this.form.get('branch')?.enable();
      this.form.get('akta')?.enable();
      this.form.get('jenisPengikatan')?.enable();
      this.form.get('aggrementType')?.enable();

      this.applyDisabledStyle(this.formContainer.nativeElement, false);
    }
  }

  public onSearchFocus() {
    this.form.get('startDate')?.disable();
    this.form.get('endDate')?.disable();
    this.form.get('status')?.disable();
    this.form.get('regional')?.disable();
    this.form.get('branch')?.disable();
    this.form.get('akta')?.disable();
    this.form.get('jenisPengikatan')?.disable();
    this.form.get('aggrementType')?.disable();

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

    const queryValue = this.form.get('query')?.value;

    const predicate: object = {
      page: this.currentPage,
      query: queryValue,
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
  private _convertDate(date: string): string {
    if (!date) {
      return '';
    }
    return moment(date).format('DD-MM-YYYY');
  }
}
