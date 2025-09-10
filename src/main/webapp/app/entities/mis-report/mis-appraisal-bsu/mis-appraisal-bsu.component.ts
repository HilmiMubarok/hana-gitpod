import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { PageEvent } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { APPLICATION_TYPE } from 'app/shared/constants/base.constants';
import { InternalService } from 'app/entities/internal/internal.service';

@Component({
  selector: 'jhi-mis-appraisal-bsu',
  templateUrl: './mis-appraisal-bsu.component.html',
  styleUrls: ['./mis-appraisal-bsu.css', '../mis-report.css', '../disabled-style.scss'],
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
export class MisAppraisalBsuComponent extends AbstractExcelMISReport implements OnInit {
  public lovStatusAppraisal = [];
  private readonly parentIds = ['9901', '9902', '9903', '9904', '9905'];
  public lovBranch = [];
  public lovAppraisalType: string[] = ['Internal', 'External'];
  public lovGeo = [];
  public lovRegional = [];
  data = '';
  date1: any;
  date2: any;
  allSelectedGeo = false;
  allSelectedAppraisal = false;
  allSelectedBranch = false;
  allSelectedAppraisalType = false;
  allSelectedRegional = false;
  MISReportAppraisal: FormGroup;

  displayedColumns: string[] = ['appraisalNumber', 'cif', 'debtorName', 'appraisalType', 'appraisalDate', 'statusDescription'];

  @ViewChild('formContainer', { static: true }) formContainer: ElementRef;

  changeOption(event) {
    console.log('test', event.value);
  }

  constructor(public misReportService: MisReportService, public messageService: MessageService, public internalService: InternalService) {
    super(misReportService);

    this.MISReportAppraisal = new FormGroup({
      date1: new FormControl('', [Validators.required]),
      date2: new FormControl(''),
      geoBoundaries: new FormControl(null),
      statusAppraisal: new FormControl(''),
      branch: new FormControl(null),
      appraisalType: new FormControl(null),
      regional: new FormControl(null),
      query: new FormControl(''),
    });

    this.MISReportAppraisal.get('date1')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportAppraisal.get('date1')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.MISReportAppraisal.get('date2')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportAppraisal.get('date2')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.MISReportAppraisal.get('statusAppraisal')?.valueChanges.subscribe(statusAppraisal => {
      if (typeof statusAppraisal === 'object' && statusAppraisal.length === 0) {
        this.MISReportAppraisal.get('statusAppraisal')?.setValue('');
      }
    });

    this.MISReportAppraisal.get('branch')?.valueChanges.subscribe(branch => {
      if (branch && typeof branch === 'object' && Array.isArray(branch) && branch.length === 0) {
        this.MISReportAppraisal.get('branch')?.setValue(null);
      }
    });

    this.MISReportAppraisal.get('appraisalType')?.valueChanges.subscribe(appraisalType => {
      this.checkFieldStatus();
      if (appraisalType && typeof appraisalType === 'object' && Array.isArray(appraisalType) && appraisalType.length === 0) {
        this.MISReportAppraisal.get('appraisalType')?.setValue(null);
      }
    });

    this.MISReportAppraisal.get('date1')?.valueChanges.subscribe(() => this.checkFieldStatus());
    this.MISReportAppraisal.get('date2')?.valueChanges.subscribe(() => this.checkFieldStatus());
    this.MISReportAppraisal.get('statusAppraisal')?.valueChanges.subscribe(() => this.checkFieldStatus());
    this.MISReportAppraisal.get('regional')?.valueChanges.subscribe(() => this.checkFieldStatus());

    this.MISReportAppraisal.get('branch')?.valueChanges.subscribe(() => {
      this.checkFieldStatus();
      // if type is array and length 0, change to null
      if (Array.isArray(this.MISReportAppraisal.get('branch')?.value) && this.MISReportAppraisal.get('branch')?.value.length === 0) {
        this.MISReportAppraisal.get('branch')?.setValue(null);
      }
    });

    this.getStatusesAppraisal();
    this.getBoundaries();
    this.getBranch();
    this.getRegional();
  }

  ngOnInit(): void {
    this.MISReportAppraisal.get('query')?.valueChanges.subscribe(value => {
      if (value === '') {
        this.clearSearch();
      }
    });
  }

  checkFieldStatus() {
    const date1 = this.MISReportAppraisal.get('date1')?.value;
    const date2 = this.MISReportAppraisal.get('date2')?.value;
    const status = this.MISReportAppraisal.get('statusAppraisal')?.value;
    const branch = this.MISReportAppraisal.get('branch')?.value;
    const appraisalType = this.MISReportAppraisal.get('appraisalType')?.value;
    const regional = this.MISReportAppraisal.get('regional')?.value;

    if (
      date1 ||
      date2 ||
      (status && status.length > 0) ||
      (branch && branch.length > 0) ||
      (appraisalType && appraisalType.length > 0) ||
      (regional && regional.length > 0)
    ) {
      this.MISReportAppraisal.get('query')?.disable();
      this.applyDisabledStyle(this.formContainer.nativeElement, true);
    } else {
      this.MISReportAppraisal.get('query')?.enable();
      this.applyDisabledStyle(this.formContainer.nativeElement, false);
    }
  }

  getStatusesAppraisal() {
    this.misReportService.getStatuses('MIS_APPRAISAL_BSU').subscribe({
      next: res => (this.lovStatusAppraisal = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Status Appraisals' });
      },
    });
  }

  onStatusOpenedChange(opened: boolean) {
    if (opened) {
      this.MISReportAppraisal.get('query')?.disable();
    } else {
      this.checkFieldStatus();
    }
  }

  public onSearchFocus() {
    this.MISReportAppraisal.get('date1')?.disable();
    this.MISReportAppraisal.get('date2')?.disable();
    this.MISReportAppraisal.get('statusAppraisal')?.disable();
    this.MISReportAppraisal.get('branch')?.disable();
    this.MISReportAppraisal.get('appraisalType')?.disable();
    this.MISReportAppraisal.get('regional')?.disable();
    this.applyDisabledStyle(this.formContainer.nativeElement, true);
  }

  onSearchBlur() {
    const searchValue = this.MISReportAppraisal.get('query')?.value;
    if (!searchValue) {
      this.MISReportAppraisal.get('date1')?.enable();
      this.MISReportAppraisal.get('date2')?.enable();
      this.MISReportAppraisal.get('statusAppraisal')?.enable();
      this.MISReportAppraisal.get('branch')?.enable();
      this.MISReportAppraisal.get('appraisalType')?.enable();
      this.MISReportAppraisal.get('regional')?.enable();
      this.applyDisabledStyle(this.formContainer.nativeElement, false);
    }
  }

  onDateRangeFocus() {
    this.MISReportAppraisal.get('query')?.disable();
    this.applyDisabledStyle(this.formContainer.nativeElement, true);
  }

  onDateRangeBlur() {
    this.checkFieldStatus(); // This ensures search field behavior is updated accordingly
  }

  dateRangeHasValue(): boolean {
    return this.MISReportAppraisal.get('date1')?.value && this.MISReportAppraisal.get('date2')?.value;
  }

  clearDateRange(): void {
    this.MISReportAppraisal.get('date1')?.reset();
    this.MISReportAppraisal.get('date2')?.reset();
  }

  public clearSearch(): void {
    this.MISReportAppraisal.get('query')?.setValue('', { emitEvent: false });
    this.searchResult = null;
  }

  public searchResult = null;
  public pageSize = 10;
  public currentPage = 0;
  public totalItems = 0;
  public pageSizeOptions: number[] = [5, 10, 25, 50];
  public loadingSearch = false;

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

  public doSearch(pageEvent?: PageEvent): void {
    this.loadingSearch = true;

    if (pageEvent) {
      this.currentPage = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    }

    const query = this.MISReportAppraisal.get('query')?.value;

    const predicate: object = {
      page: this.currentPage,
      query,
      size: this.pageSize,
      sort: ['id,desc'],
      idPosition: this.getLocStor('POS'),
    };

    predicate['target'] = 'appraisal-result-inquiry';

    this.misReportService.searchAppraisalBSU(predicate).subscribe({
      next: res => {
        this.searchResult = res.body || [];
        const totalCount = res.headers.get('X-Total-Count');
        this.totalItems = totalCount ? parseInt(totalCount, 10) : 0;
        this.loadingSearch = false;

        if (query !== null && query !== undefined) {
          this.MISReportAppraisal.get('query')?.setValue(query, { emitEvent: false });
        }
      },
      error: (res: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
        this.loadingSearch = false;

        if (query !== null && query !== undefined) {
          this.MISReportAppraisal.get('query')?.setValue(query, { emitEvent: false });
        }
      },
    });
  }

  skeletonData = [
    {
      appraisalNumber: '',
      cif: '',
      debtorName: '',
      appraisalType: '',
      appraisalDate: '',
      statusDescription: '',
    },
  ];

  getBranch() {
    this.misReportService.getBranches().subscribe({
      next: res => {
        console.log('API Response:', res);

        const branchFacilities = res
          .filter((employee: any) => employee.internalTypeId === 'BRANCH')
          .map((employee: any) => ({
            facilityName: employee.facilityName,
            id: employee.id,
          }));

        console.log('Filtered Branch Facilities:', branchFacilities);

        this.lovBranch = branchFacilities.sort((a: any, b: any) => a.facilityName.localeCompare(b.facilityName));

        console.log('Sorted Branch List:', this.lovBranch);
      },
      error: err => {
        console.error('Error Fetching Branches:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get Branch',
        });
      },
    });
  }

  getRegional() {
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
            .map(internal => ({ id: internal.id, name: internal.facilityName }))
        )
      )
      .subscribe({
        next: internals => (this.lovRegional = internals),
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Regional Data' }),
      });
  }

  getBoundaries() {
    this.misReportService.getGeoBoundaries().subscribe({
      next: res => {
        this.lovGeo = res.sort((a: any, b: any) => a.description.localeCompare(b.description));
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Geo Boundaries' });
      },
    });
  }

  toggleSelectAllAppraisal(): void {
    this.allSelectedAppraisal = !this.allSelectedAppraisal;
    if (this.allSelectedAppraisal) {
      this.MISReportAppraisal.get('statusAppraisal')?.setValue([
        ...this.lovStatusAppraisal.map(statusAppraisal => statusAppraisal.statusId),
      ]);
    } else {
      this.MISReportAppraisal.get('statusAppraisal')?.setValue('');
    }
  }

  toggleSelectAllGeo(): void {
    this.allSelectedGeo = !this.allSelectedGeo;
    if (this.allSelectedGeo) {
      this.MISReportAppraisal.get('geoBoundaries')?.setValue([...this.lovGeo.map(geoBoundaries => geoBoundaries.id)]);
    } else {
      this.MISReportAppraisal.get('geoBoundaries')?.setValue(null);
    }
  }

  toggleSelectAllRegional(): void {
    this.allSelectedRegional = !this.allSelectedRegional;
    if (this.allSelectedRegional) {
      this.MISReportAppraisal.get('regional')?.setValue([...this.lovRegional.map(regional => regional.id)]);
    } else {
      this.MISReportAppraisal.get('regional')?.setValue(null);
    }
  }

  toggleSelectBranch(): void {
    this.allSelectedBranch = !this.allSelectedBranch; // Toggle status Select All / Deselect All
    // const branchControl = this.MISReportAppraisal.get('branch');

    // if (this.allSelectedBranch) {
    //   branchControl?.setValue([...this.lovBranch]);
    // } else {
    //   branchControl?.setValue(null);
    // }

    if (this.allSelectedBranch) {
      this.MISReportAppraisal.get('branch')?.setValue([...this.lovBranch.map(branch => branch.id)]);
    } else {
      this.MISReportAppraisal.get('branch')?.setValue(null);
    }
  }

  toggleSelectAllAppraisalType(): void {
    this.allSelectedAppraisalType = !this.allSelectedAppraisalType;
    if (this.allSelectedAppraisalType) {
      this.MISReportAppraisal.get('appraisalType')?.setValue([...this.lovAppraisalType]);
    } else {
      this.MISReportAppraisal.get('appraisalType')?.setValue(null);
    }
  }

  public previousState(): void {
    window.history.back();
  }

  private _convertLov(lov: Array<string> | null | string): string {
    if (lov === null) {
      return null;
    }

    if (typeof lov === 'string') {
      return '';
    }

    if (lov.length === 0) {
      return '';
    }
    return lov.join(',');
  }

  protected processData(data: any[]): void {
    data.sort((a, b) => {
      const dateA = new Date(a.fromDate);
      const dateB = new Date(b.fromDate);

      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        return 0;
      }

      return dateA.getTime() - dateB.getTime();
    });

    data.forEach((proposal, index) => {
      this._processGenerate;
    });

    this._resetData();
  }

  generateMISReportAppraisalBsu(): void {
    let params: any = {};

    if (this.MISReportAppraisal.get('query')?.value) {
      params.query = this.MISReportAppraisal.get('query')?.value;
    } else {
      if (
        (!this.MISReportAppraisal.get('date1')?.value || this.MISReportAppraisal.get('date1')?.value.length === 0) &&
        (!this.MISReportAppraisal.get('date2')?.value || this.MISReportAppraisal.get('date2')?.value.length === 0) &&
        (!this.MISReportAppraisal.get('statusAppraisal')?.value || this.MISReportAppraisal.get('statusAppraisal')?.value.length === 0)
      ) {
        this.messageService.add({
          severity: 'error',
          summary: 'Warning',
          detail: 'Please, Select Parameter.',
        });
        return;
      }

      if (!this.MISReportAppraisal.get('date1')?.value || this.MISReportAppraisal.get('date2')?.value.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Warning',
          detail: 'Please, entry Date Range.',
        });
        return;
      }

      if (!this.MISReportAppraisal.get('statusAppraisal')?.value || this.MISReportAppraisal.get('statusAppraisal')?.value.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Warning',
          detail: 'Please, entry Status.',
        });
        return;
      }

      params = {
        startDate: this.MISReportAppraisal.get('date1')?.value,
        endDate: this.MISReportAppraisal.get('date2')?.value,
        status: this._convertStatusToString(this.MISReportAppraisal.get('statusAppraisal')?.value),
        branch: this._convertStatusToString(this.MISReportAppraisal.get('branch')?.value),
        appraisalType: this._convertStatusToString(this.MISReportAppraisal.get('appraisalType')?.value),
      };
    }

    this.misReportService.getMISReportAppraisal(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_Appraisal_BSU'),
      error: error => {
        console.error('Error: ', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate document' });
        this._resetData();
        this.misReportService.setLoading(false);
      },
      complete: () => {
        this._resetData();
        this.misReportService.setLoading(false);
      },
    });
  }

  _processTimelinePersonName(personName: string) {
    const personNameArray = personName.split(' ');

    const filteredPersonNameArray = personNameArray.filter(name => name !== 'null');

    return filteredPersonNameArray.join(' ');
  }

  _formatDateToCustom(date: string | Date): string {
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  }

  private _getLandAreaBasedOnPhysicalConditions(row: any): string {
    if (row.appraisalType === 'Internal') {
      return (
        (row.propertyDetail || [])
          .flatMap(property => property.landInternal || [])
          .map(land => `${land.landSizePerCertificate || ''}`)
          .join('\n') || ''
      );
    }

    if (row.appraisalType === 'External') {
      return (
        (row.propertyDetail || [])
          .flatMap(property => property.landAndBuildingExternal || [])
          .map(land => `${land.totalLuasTanahFisik || ''}`)
          .join('\n') || ''
      );
    }

    return '';
  }

  private _getbuildingAreaBasedOnPhysicalCondition(row: any): string {
    if (row.appraisalType === 'Internal') {
      return (row.propertyDetail || [])
        .flatMap(property => property.buildingInternal || [])
        .map(building => building.area || '')
        .join('\n');
    }

    if (row.appraisalType === 'External') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landAndBuildingExternal || [])
        .map(building => building.totalLuasBangunanFisik || '')
        .join('\n');
    }

    return '';
  }

  private _getMarketValueLandPhysicalCondition(row: any): string {
    if (row.appraisalType === 'Internal') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landInternal || [])
        .map(mvPhysical => mvPhysical.marketValue || '')
        .join('\n');
    }

    if (row.appraisalType === 'External') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landAndBuildingExternal || [])
        .map(
          mvPhysicalExternal => (mvPhysicalExternal.totalLuasTanahFisik || 0) * (mvPhysicalExternal.appraisalValueLandPerMeter || 0) || ''
        )
        .join('\n');
    }

    return '';
  }

  private _getmarketValueBuildingPhysicalCondition(row: any): string {
    if (row.appraisalType === 'Internal') {
      return (row.propertyDetail || [])
        .flatMap(property => property.buildingInternal || [])
        .map(mvBuilding => mvBuilding.marketValue || '')
        .join('\n');
    }

    if (row.appraisalType === 'External') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landAndBuildingExternal || [])
        .map(
          mvBuildingExternal =>
            (mvBuildingExternal.totalLuasBangunanFisik || 0) * (mvBuildingExternal.appraisalValueBuildingPerMeter || 0) || ''
        )
        .join('\n');
    }

    return '';
  }

  private _getliquidationValueLandPhysicalCondition(row: any): string {
    if (row.appraisalType === 'Internal') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landInternal || [])
        .map(liquidationInternal => liquidationInternal.liquidationValue || '')
        .join('\n');
    }

    if (row.appraisalType === 'External') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landAndBuildingExternal || [])
        .map(land => land.appraisalLiquidationLand || '')
        .join('\n');
    }

    return '';
  }

  private _getliquidationValueBuildingPhysicalCondition(row: any): string {
    if (row.appraisalType === 'Internal') {
      return (row.propertyDetail || [])
        .flatMap(property => property.buildingInternal || [])
        .map(liquidationInternal => liquidationInternal.liquidationValue || '')
        .join('\n');
    }

    if (row.appraisalType === 'External') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landAndBuildingExternal || [])
        .map(liquidationExternal => liquidationExternal.appraisalLiquidationBuilding || '')
        .join('\n');
    }

    return '';
  }

  private _getlandAreaBasedOnIMB(row: any): string {
    if (row.appraisalType === 'Internal') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landInternal || [])
        .map(land => land.landSizePerCertificate || '')
        .join('\n');
    }

    if (row.appraisalType === 'External') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landAndBuildingExternal || [])
        .map(land => land.totalLuasTanahIMB || '')
        .join('\n');
    }

    return '';
  }

  private _getBuildingAreaBasedOnIMB(row: any): string {
    if (row.appraisalType === 'Internal') {
      return (row.propertyDetail || [])
        .flatMap(property => property.buildingInternal || [])
        .map(building => building.imbArea || '')
        .join('\n');
    }

    if (row.appraisalType === 'External') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landAndBuildingExternal || [])
        .map(building => building.totalLuasBangunanIMB || '')
        .join('\n');
    }

    return '';
  }

  private _getMarketValueLandIMB(row: any): string {
    if (row.appraisalType === 'Internal') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landInternal || [])
        .map(land => land.marketValueIMB || '')
        .join('\n');
    }

    if (row.appraisalType === 'External') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landAndBuildingExternal || [])
        .map(land => (land.totalLuasTanahIMB || 0) * (land.appraisalValueIMBPerMeterLand || 0) || '')
        .join('\n');
    }

    return '';
  }

  private _getmarketValueBuildingPhysicalConditionIMB(row: any): string {
    if (row.appraisalType === 'Internal') {
      return (row.propertyDetail || [])
        .flatMap(property => property.buildingInternal || [])
        .map(building => building.marketValueIMB || '')
        .join('\n');
    }

    if (row.appraisalType === 'External') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landAndBuildingExternal || [])
        .map(building => (building.totalLuasBangunanIMB || 0) * (building.appraisalValueIMBTataKotaBuilding || 0) || '')
        .join('\n');
    }

    return '';
  }

  private _getLiquidationValueLandPhysicalConditionIMB(row: any): string {
    if (row.appraisalType === 'Internal') {
      return (row.propertyDetail || [])
        .flatMap(property => property.landInternal || [])
        .map(land => land.liquidationValueIMB || '')
        .join('\n');
    }

    return '';
  }

  private _getLiquidationValueBuildingPhysicalConditionIMB(row: any): string {
    if (row.appraisalType === 'Internal') {
      return (row.propertyDetail || [])
        .flatMap(property => property.buildingInternal || [])
        .map(building => building.liquidationValueIMB || '')
        .join('\n');
    }

    return '';
  }

  private _getApprovedFromDate(cp: any): string {
    if (Array.isArray(cp)) {
      const approvedDate = cp
        .filter(item => item.appraisalType === 'Internal')
        .flatMap(item => item.timeLine || [])
        .find(timeline => timeline.statusDescription === 'Approved')?.fromDate;

      return approvedDate ? this._formatDate(approvedDate) : '';
    }

    if (cp?.appraisalType === 'Internal') {
      const approvedDate = cp.timeLine?.find(timeline => timeline.statusDescription === 'Approved')?.fromDate;
      return approvedDate ? this._formatDate(approvedDate) : '';
    }

    if (cp?.appraisalType === 'External') {
      return (cp.propertyDetail || [])
        .flatMap(property => property.landAndBuildingExternal || [])
        .map(dateExternal => (dateExternal.reportDate ? this._formatDate(dateExternal.reportDate) : ''))
        .join('\n');
    }

    return '';
  }

  public getTypeOfApplication(jenisPermohonan: any): string {
    return Array.isArray(jenisPermohonan) ? jenisPermohonan.join('\n') : '';
  }

  public getCertificateNumbers(row: any): string {
    const certificates = row?.collateral?.[0]?.landCertificates;
    return Array.isArray(certificates) && certificates.length > 0 ? certificates.map(cert => cert?.certNumber || '').join('\n') : '';
  }

  private _processGenerate(data, outputName: string): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Add header Columns
    worksheet.columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Appraisal Number', key: 'appraisalNumber', width: 17 },
      { header: 'Segment', key: 'segment', width: 25 },
      { header: 'Regional', key: 'regional', width: 25 },
      { header: 'Branch', key: 'branch', width: 22 },
      { header: 'Marketing', key: 'marketing', width: 30 },
      { header: 'Customer Name', key: 'customerName', width: 30 },
      { header: 'ID', key: 'collateralId', width: 5 },
      { header: 'Collateral Type', key: 'collateralType', width: 20 },
      { header: 'Collateral', key: 'collateral', width: 15 },
      { header: 'Certificate Number', key: 'certificateNumber', width: 70 },
      { header: 'Property Usage', key: 'propertyUsage', width: 15 },
      { header: 'Marketability', key: 'marketAbility', width: 15 },
      { header: 'Land Area Based on Physical Conditions', key: 'landAreaBasedOnPhysicalConditions', width: 40 },
      { header: 'Building Area Based on Physical Condition', key: 'buildingAreaBasedOnPhysicalCondition', width: 40 },
      { header: 'Market Value (MV) Land on Physical Condition', key: 'marketValueLandPhysicalCondition', width: 40 },
      { header: 'Market Value (MV) Building on Physical Condition', key: 'marketValueBuildingPhysicalCondition', width: 45 },
      { header: 'Liquidation Value (LV) Land on Physical Condition', key: 'liquidationValueLandPhysicalCondition', width: 45 },
      { header: 'Liquidation Value (LV) Building on Physical Condition', key: 'liquidationValueBuildingPhysicalCondition', width: 50 },
      { header: 'Land Area Based on IMB', key: 'landAreaBasedOnIMB', width: 30 },
      { header: 'Building Area Based on IMB', key: 'buildingAreaBasedOnIMB', width: 30 },
      { header: 'Market Value (MV) Land on IMB', key: 'marketValueLandPhysicalConditionIMB', width: 30 },
      { header: 'Market Value (MV) Building on IMB', key: 'marketValueBuildingPhysicalConditionIMB', width: 40 },
      { header: 'Liquidation Value (LV) Land on IMB', key: 'liquidationValueLandPhysicalConditionIMB', width: 40 },
      { header: 'Liquidation Value (LV) Building on IMB', key: 'liquidationValueBuildingPhysicalConditionIMB', width: 40 },
      { header: 'Location', key: 'location', width: 30 },
      { header: 'Village', key: 'village', width: 30 },
      { header: 'District', key: 'district', width: 30 },
      { header: 'City', key: 'city', width: 30 },
      { header: 'Province', key: 'provinceName', width: 22 },
      { header: 'Appraisal Type', key: 'appraisalType', width: 14 },
      { header: 'Type of Application', key: 'typeOfApplication', width: 20 },
      { header: 'Plafond', key: 'plafond', width: 20 },
      { header: 'Credit Maturity Date', key: 'creditMaturityDate', width: 15 },
      { header: 'Appraiser', key: 'appraiser', width: 35 },
      { header: 'Market Value (MV)', key: 'nilaiMV', width: 20 },
      { header: 'Liquidation Value (LV)', key: 'nilaiLV', width: 20 },
      { header: 'KJPP', key: 'kjppName', width: 35 },
      { header: 'KJPP Market Value (MV)', key: 'totalMVKJPP', width: 25 },
      { header: 'KJPP Liquidation Value (LV)', key: 'totalLVKJPP', width: 25 },
      { header: 'Date of Application', key: 'tanggalPermohonan', width: 19 },
      { header: 'Visited Date', key: 'visitedDate', width: 15 },
      { header: 'Assessment Date', key: 'tanggalPenilaian', width: 15 },
      { header: 'Report Date', key: 'tanggalLaporan', width: 15 },
      { header: 'Reviewer', key: 'reviewer', width: 35 },
      { header: 'Negative List Collateral', key: 'negativeList', width: 35 },
      { header: 'Timeline', key: 'timeline', width: 65 },
      { header: 'Status', key: 'status', width: 25 },
    ];

    let sortedData;
    sortedData = data.sort((a, b) => {
      const dateA = new Date(a.appraisalDate).getTime();
      const dateB = new Date(b.appraisalDate).getTime();
      return dateA - dateB;
    });

    const regionalIds = this.MISReportAppraisal.get('regional')?.value;
    if (regionalIds?.length > 0) {
      sortedData = sortedData.filter(row => regionalIds.includes(row.regionalDebiturId));
    }

    sortedData.forEach((row, index) => {
      const visitedTimeline = row.timeLine
        ?.filter(timeline => timeline.statusDescription === 'Approved')
        .sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());

      const visitedDate = visitedTimeline?.length ? this._formatDate(visitedTimeline[0].fromDate) : '';

      const approvalTimeline = row.timeLine
        ?.filter(timeline => timeline.statusDescription === 'Approval Team Leader')
        .sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());

      const tanggalPenilaian = approvalTimeline?.length ? this._formatDate(approvalTimeline[0].fromDate) : '';

      const approvedTimeline = row.timeLine
        ?.filter(timeline => timeline.statusDescription === 'Approved')
        .sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());

      // const tanggalLaporan = approvedTimeline?.length ? this._formatDateToCustom(approvedTimeline[0].fromDate) : '';
      const tanggalPermohonan = row.tanggalPermohonan ? this._formatDate(row.tanggalPermohonan) : 'Data tidak tersedia';

      const timeLineData = row.timeLine ? row.timeLine.sort((a, b) => a.id - b.id) : [];

      if (timeLineData.length >= 1) {
        timeLineData.shift();
      }

      worksheet.addRow({
        no: index + 1 || '',
        appraisalNumber: row.appraisalNumber || '',
        segment: row.segmentRMName || '',
        regional: row.regionalDebiturName || '',
        branch: row.branch || '',
        marketing: row.marketing || '',
        customerName: row.customerName || '',
        tanggalPermohonan: row.appraisalDate ? this._formatDate(row.appraisalDate) : '',
        collateralId: row.collateral?.[0]?.id || '', // Gunakan optional chaining
        collateralType: row.collateral?.[0]?.collateralType || '',
        collateral: row.collateral?.[0]?.collateral || '',
        certificateNumber: this.getCertificateNumbers(row),
        propertyUsage: row.collateral?.[0]?.propertyUsage || '',
        marketAbility:
          row.marketAbility === 'baik' ? 'Good' : row.marketAbility === 'cukup' ? 'Fair' : row.marketAbility === 'kurang' ? 'Minus' : '',
        landAreaBasedOnPhysicalConditions: this._getLandAreaBasedOnPhysicalConditions(row),

        buildingAreaBasedOnPhysicalCondition: this._getbuildingAreaBasedOnPhysicalCondition(row),

        marketValueLandPhysicalCondition: this._getMarketValueLandPhysicalCondition(row),

        marketValueBuildingPhysicalCondition: this._getmarketValueBuildingPhysicalCondition(row),
        liquidationValueLandPhysicalCondition: this._getliquidationValueLandPhysicalCondition(row),
        liquidationValueBuildingPhysicalCondition: this._getliquidationValueBuildingPhysicalCondition(row),
        landAreaBasedOnIMB: this._getlandAreaBasedOnIMB(row),
        buildingAreaBasedOnIMB: this._getBuildingAreaBasedOnIMB(row),
        marketValueLandPhysicalConditionIMB: this._getMarketValueLandIMB(row),

        marketValueBuildingPhysicalConditionIMB: this._getmarketValueBuildingPhysicalConditionIMB(row),
        liquidationValueLandPhysicalConditionIMB: this._getLiquidationValueLandPhysicalConditionIMB(row),
        liquidationValueBuildingPhysicalConditionIMB: this._getLiquidationValueBuildingPhysicalConditionIMB(row),
        location: row.collateral?.[0]?.location || '',
        village: row.collateral?.[0]?.villageName || '',
        district: row.collateral?.[0]?.districtName || '',
        city: row.collateral?.[0]?.city || '',
        provinceName: row.collateral?.[0]?.provinceName || '',
        appraisalType: row.appraisalType || '',
        typeOfApplication: this.getTypeOfApplication(row.jenisPermohonan),
        plafond: row.plafond || '',
        creditMaturityDate: row.tglJatemKredit || '',
        appraiser: row.appraiser || '',
        nilaiMV: row.totalMVInternal || '',
        nilaiLV: row.totalLiquidationInternal || '',
        kjppName: row.kjppName || '',
        totalMVKJPP: row.totalMVKJPP || '',
        totalLVKJPP: row.totalLVKJPP || '',
        visitedDate,
        tanggalPenilaian,
        tanggalLaporan: this._getApprovedFromDate(row),
        reviewer: row.reviewerBy || '',
        negativeList: row.scoreCard ? row.scoreCard.map((sc: any) => sc.criteria).join('\n') : '',
        timeline:
          timeLineData
            ?.map(timeline => {
              const formattedDate = timeline.fromDate ? this._formatDateToCustom(timeline.fromDate) : '';
              return `${timeline.fromStatusDescription || ''} : ${formattedDate || ''} : ${
                this._processTimelinePersonName(timeline.personName) || ''
              }`;
            })
            .join('\n') || '',
        status: row.status || '',
      });
    });

    worksheet.columns.forEach((column, index) => {
      worksheet.getCell(1, index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '71ad9e' },
      };
      worksheet.getColumn(column.key as string | number).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // enable wrap text for timeline cell

    worksheet.getColumn('negativeList').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('liquidationValueBuildingPhysicalConditionIMB').alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    worksheet.getColumn('liquidationValueLandPhysicalConditionIMB').alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    worksheet.getColumn('liquidationValueBuildingPhysicalCondition').alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };

    worksheet.getColumn('marketValueBuildingPhysicalConditionIMB').alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    worksheet.getColumn('marketValueLandPhysicalConditionIMB').alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    worksheet.getColumn('buildingAreaBasedOnIMB').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('landAreaBasedOnIMB').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('liquidationValueLandPhysicalCondition').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('marketValueBuildingPhysicalCondition').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('marketValueLandPhysicalCondition').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('landAreaBasedOnPhysicalConditions').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('buildingAreaBasedOnPhysicalCondition').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('timeline').alignment = { wrapText: true, vertical: 'middle' };
    worksheet.getColumn('location').alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('certificateNumber').alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

    const timelineColumnIndex = worksheet.columns.findIndex(column => column.header === 'Timeline') + 1;
    if (timelineColumnIndex > 0) {
      worksheet.getRow(1).getCell(timelineColumnIndex).alignment = { vertical: 'middle', horizontal: 'center' };
    }

    // Apply styles
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).height = 20;

    worksheet.eachRow({ includeEmpty: true }, row => {
      row.eachCell({ includeEmpty: true }, cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Set the output name
    const date = new Date();
    const fileName = `${outputName}_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`;

    // Generate and save file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, fileName);
      this.misReportService.setLoading(false);
      this.misReportService.generateDocumentLabel.next('Generate Document');
    });
  }
}
