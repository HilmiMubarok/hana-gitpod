import { Component } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'jhi-mis-appraisal',
  templateUrl: './mis-appraisal.component.html',
  styleUrls: ['./mis-appraisal.css', '../mis-report.css'],
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
export class MisAppraisalComponent {
  public lovStatusAppraisal = [];
  public lovOfficerSurveyor = [];
  public lovAppraisalType: string[] = ['Internal', 'External'];
  public lovGeo = [];
  data = '';
  date1: any;
  date2: any;
  listOfValue = [];
  changeOption(event) {
    console.log('test');
  }

  changeOptionGeoBoundaries(event) {
    console.log('test2');
  }

  changeOptionStatusAppraisal(event) {
    console.log('test3');
  }

  changeOptionOfficerSurveyor(event) {
    console.log('test4');
  }

  changeOptionAppraisalType(event) {
    console.log('test4');
  }

  MISReportCP: FormGroup;

  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    this.MISReportCP = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      geoBoundaries: new FormControl(''),
      statusAppraisal: new FormControl(''),
      officerSurveyor: new FormControl(''),
      appraisalType: new FormControl(''),
    });
    // Listen to changes on the date fields
    this.MISReportCP.get('date1')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportCP.get('date1')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.MISReportCP.get('date2')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportCP.get('date2')?.setValue(formattedDate, { emitEvent: false });
      }
    });
    // this.getStatus();
    this.getStatusesAppraisal();
    this.getBoundaries();
    this.getOfficerSurveyors();
  }

  getStatusesAppraisal() {
    this.misReportService.getStatuses('MIS_APPRAISAL').subscribe({
      next: res => (this.lovStatusAppraisal = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Status Appraisals' });
      },
    });
  }

  getOfficerSurveyors() {
    this.misReportService.getOfficerSurveyors().subscribe({
      next: res => (this.lovOfficerSurveyor = res),

      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Officer Surveyors' });
      },
    });
  }

  getBoundaries() {
    this.misReportService.getGeoBoundaries().subscribe({
      next: res => (this.lovGeo = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Geo Boundaries' });
      },
    });
  }

  convertGeoBoundariesToString(geoBoundaries: Array<string>): string {
    // if length is 0, return empty string
    if (geoBoundaries.length === 0) {
      return '';
    }

    return geoBoundaries.join(',');
  }

  convertOfficerSurveyorToString(officerSurveyor: Array<string>): string {
    // if length is 0, return empty string
    if (officerSurveyor.length === 0) {
      return '';
    }

    return officerSurveyor.join(',');
  }

  convertStatusAppraisalToString(statusAppraisal: Array<string>): string {
    // if length is 0, return empty string
    if (statusAppraisal.length === 0) {
      return '';
    }

    return statusAppraisal.join(',');
  }

  convertAppraisalTypeToString(appraisalType: Array<string>): string {
    // if length is 0, return empty string
    if (appraisalType.length === 0) {
      return '';
    }

    return appraisalType.join(',');
  }

  generateMISReportCP() {
    const template_report_data = [
      { key: 'No.', valueFrom: '', format: 'string' },
      { key: 'Proposal Number', valueFrom: 'proposalNumber', format: 'string' },
      { key: 'Proposal Date', valueFrom: 'proposalDate', format: 'string' },
      { key: 'Segment', valueFrom: 'segment', format: 'string' },
      { key: 'Customer Status', valueFrom: 'customerStatus', format: 'string' },
      { key: 'Program', valueFrom: 'program', format: 'string' },
      { key: 'UMKM', valueFrom: 'umkm', format: 'string' },
      { key: 'Kategori Usaha Debitur', valueFrom: 'kategoriUsahaDebitur', format: 'string' },
      { key: 'Refferal', valueFrom: 'refferal', format: 'string' },
      { key: 'RM First Name', valueFrom: 'rmFirstName', format: 'string' },
      { key: 'RM Last Name', valueFrom: 'rmLastName', format: 'string' },
      { key: 'BM', valueFrom: 'bm', format: 'string' },
      { key: 'Head Name', valueFrom: 'headName', format: 'string' },
      { key: 'CIF', valueFrom: 'cif', format: 'string' },
      { key: 'Debtor Name', valueFrom: 'debtorName', format: 'string' },
      { key: 'ID Card Number', valueFrom: 'idCardNumber', format: 'string' },
      { key: 'Date of Birth', valueFrom: 'dateOfBirth', format: 'date' },
      { key: 'Deed of RCNT Number', valueFrom: 'deedOfRCNTNumber', format: 'string' },
      { key: 'Deed of RCNT Date', valueFrom: 'deedOfRCNTDate', format: 'date' },
      { key: 'Line of Business', valueFrom: 'lineOfBusiness', format: 'string' },
      { key: 'Total Exposure Group', valueFrom: 'totalExposureGroup', format: 'string' },
      { key: 'Sector Industry', valueFrom: 'sectorIndustry', format: 'string' },
      { key: 'Sales Verified', valueFrom: 'salesVerified', format: 'string' },
      { key: 'Collectability Status', valueFrom: 'collectibilityStatus', format: 'string' },
      { key: 'Deviation', valueFrom: 'deviation', format: 'string' },
      { key: 'Based on FS (in IDR MN)', valueFrom: 'basedOnFS', format: 'moneyIDR' },
      { key: 'Based on Average Balance (in IDR MN)', valueFrom: 'basedOnAvgBalance', format: 'string' },
      { key: 'Based on Credit Mutation (in IDR MN)', valueFrom: 'basedOnCreditMutation', format: 'string' },
      { key: 'Credit Grading', valueFrom: 'creditGrading', format: 'string' },
      { key: 'Modal Usaha', valueFrom: 'modalUsaha', format: 'string' },
      { key: 'STO / Penjualan Tahunan', valueFrom: 'penjualanTahunan', format: 'string' },
      { key: 'Total Changes Eq to IDR', valueFrom: 'totalChangesEqToIDR', format: 'string' },
      { key: 'Total Plafond Debtor Only (IDR)', valueFrom: 'totalPlafondDebtorOnlyIDR', format: 'string' },
      { key: 'Total Plafond Debtor Only (USD)', valueFrom: 'totalPlafondDebtorOnlyUSD', format: 'string' },
      { key: 'Total Plafond Group (IDR)', valueFrom: 'totalPlafondGroupIDR', format: 'string' },
      { key: 'Sub Total Plafon Eq to IDR (Debtor)', valueFrom: 'subTotalPlafondEqToIDR', format: 'string' },
      { key: 'Grand Total Plafon Eq to IDR (Include Group)', valueFrom: 'grandTotalPlafondEqToIDR', format: 'string' },
      { key: 'Total MV Internal', valueFrom: 'totalMVInternal', format: 'string' },
      { key: 'Total LV Internal', valueFrom: 'totalLVInternal', format: 'string' },
      { key: 'Total MV KJPP', valueFrom: 'totalMVKJPP', format: 'string' },
      { key: 'Total LV KJPP', valueFrom: 'totalLVKJPP', format: 'string' },
      { key: 'Collateral Coverage MV Internal (%)', valueFrom: 'colCoverageMVInternal', format: 'string' },
      { key: 'Collateral Coverage MV KJPP (%)', valueFrom: 'colCoverageMVKJPP', format: 'string' },
      { key: 'Collateral Coverage LV Internal (%)', valueFrom: 'colCoverageLVInternal', format: 'string' },
      { key: 'Collateral Coverage LV KJPP (%)', valueFrom: 'colCoverageLVKJPP', format: 'string' },
      { key: 'Status', valueFrom: 'status', format: 'string' },
    ];

    const params = {
      startDate: this.MISReportCP.get('date1')?.value,
      endDate: this.MISReportCP.get('date2')?.value,
      statusAppraisal: this.convertStatusAppraisalToString(this.MISReportCP.get('statusAppraisal')?.value),
      geoBoundaries: this.convertGeoBoundariesToString(this.MISReportCP.get('geoBoundaries')?.value),
      officerSurveyor: this.convertOfficerSurveyorToString(this.MISReportCP.get('officerSurveyor')?.value),
      appraisalType: this.convertAppraisalTypeToString(this.MISReportCP.get('appraisalType')?.value),
    };

    this.misReportService
      .generateMisReport(template_report_data, this.misReportService.getMisReportCP(params), 'MIS_Report_Credit_Proposal')
      .subscribe({
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate document' });
        },
      });
  }

  allSelectedGeo = false;
  allSelectedAppraisal = false;
  allSelectedOfficerSurveyor = false;
  allSelectedAppraisalType = false;

  toggleSelectAllAppraisal(): void {
    this.allSelectedAppraisal = !this.allSelectedAppraisal;
    if (this.allSelectedAppraisal) {
      this.MISReportCP.get('statusAppraisal')?.setValue([...this.lovStatusAppraisal.map(statusAppraisal => statusAppraisal.statusCode)]);
    } else {
      this.MISReportCP.get('statusAppraisal')?.setValue('');
    }
  }

  toggleSelectAllOfficerSurveyor(): void {
    this.allSelectedOfficerSurveyor = !this.allSelectedOfficerSurveyor;
    if (this.allSelectedOfficerSurveyor) {
      this.MISReportCP.get('officerSurveyor')?.setValue([...this.lovOfficerSurveyor.map(officerSurveyor => officerSurveyor.code)]);
    } else {
      this.MISReportCP.get('officerSurveyor')?.setValue('');
    }
  }

  toggleSelectAllGeo(): void {
    this.allSelectedGeo = !this.allSelectedGeo;
    if (this.allSelectedGeo) {
      this.MISReportCP.get('geoBoundaries')?.setValue([...this.lovGeo.map(geoBoundaries => geoBoundaries.code)]);
    } else {
      this.MISReportCP.get('geoBoundaries')?.setValue('');
    }
  }

  toggleSelectAllAppraisalType(): void {
    this.allSelectedAppraisalType = !this.allSelectedAppraisalType;
    if (this.allSelectedAppraisalType) {
      this.MISReportCP.get('appraisalType')?.setValue([...this.lovAppraisalType]);
    } else {
      this.MISReportCP.get('appraisalType')?.setValue([]);
    }
  }

  public previousState(): void {
    window.history.back();
  }
}
