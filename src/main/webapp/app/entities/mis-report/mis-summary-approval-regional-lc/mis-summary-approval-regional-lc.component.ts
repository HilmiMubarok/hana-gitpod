import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import moment from 'moment';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { SummaryApprovalService } from '../summary-approval-compare/summary-approval.service';
import { getSampleTableData, processConditions } from './mis-summary-approval.helper';

interface FormDataConfig {
  form: FormGroup;
  menuType: 'Regional' | 'Approval LC';
  allSelectedSegment: boolean;
  allSelectedLc: boolean;
  allSelectedCondition: boolean;
  allSelectedDebtorStatus: boolean;
  allSelectedAmountType: boolean;
  name: string;
}

@Component({
  selector: 'jhi-mis-summary-approval-regional-lc',
  templateUrl: './mis-summary-approval-regional-lc.component.html',
  styleUrls: ['./mis-summary-approval.style.css'],
})
export class MisSummaryApprovalRegionalLCComponent extends AbstractExcelMISReport implements OnInit {
  public formConfigs: FormDataConfig[] = [];
  public formData: FormGroup;
  public lovAmount: any[] = [];
  public lovCondition: any[] = [];
  public lovSegment: any[] = [];
  public lovLc = {
    form: [],
  };
  public allDataLovLc: any;
  public lovProposalType: any;
  public lovDebtorStatus: any[] = [];
  public loadingGenerate = false;

  constructor(
    public summaryApprovalService: SummaryApprovalService,
    public message: MessageService,
    public misReportService: MisReportService
  ) {
    super(misReportService);
    this.lovAmount = [];
    this.lovCondition = [];
    this.lovSegment = [];
    this.lovProposalType;
    this.lovDebtorStatus = [];
    this.formData = this.createFormGroup();
    this.formConfigs = [
      {
        form: this.formData,
        menuType: 'Regional',
        allSelectedSegment: false,
        allSelectedLc: false,
        allSelectedCondition: false,
        allSelectedDebtorStatus: false,
        allSelectedAmountType: false,
        name: 'form1',
      },
    ];
  }

  ngOnInit(): void {
    this._initialize();
    this._setupDateFormatters();
  }

  private createFormGroup(): FormGroup {
    return new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      proposalType: new FormControl(''),
      segment: new FormControl([]),
      lc: new FormControl([]),
      amountType: new FormControl([]),
      condition: new FormControl([]),
      debtorStatus: new FormControl([]),
    });
  }

  private _setupDateFormatters(): void {
    const dateFields = ['startDate', 'endDate'];
    const forms = [this.formData];

    forms.forEach(form => {
      dateFields.forEach(fieldName => {
        form.get(fieldName)?.valueChanges.subscribe(date => {
          if (moment.isMoment(date)) {
            const formattedDate = date.format('YYYY-MM-DD');
            form.get(fieldName)?.setValue(formattedDate, { emitEvent: false });
          }
        });
      });
    });

    this._setupSelectAllDetection();
  }

  private _setupSelectAllDetection(): void {
    setTimeout(() => {
      this.formConfigs.forEach((config, index) => {
        config.form.get('segment')?.valueChanges.subscribe(selectedValues => {
          if (config.menuType === 'Regional' && this.lovSegment && this.lovSegment.length > 0) {
            const allRegionalItems = this.lovSegment.map(item => item.facilityName);
            config.allSelectedSegment = this._areArraysEqual(selectedValues, allRegionalItems);
          }
        });

        config.form.get('lc')?.valueChanges.subscribe(selectedValues => {
          if (config.menuType === 'Approval LC' && this.lovLc[config.name] && this.lovLc[config.name].length > 0) {
            const allLcItems = this.lovLc[config.name].map(item => item.id);
            config.allSelectedLc = this._areArraysEqual(selectedValues, allLcItems);
          }
        });

        config.form.get('condition')?.valueChanges.subscribe(selectedValues => {
          if (this.lovCondition && this.lovCondition.length > 0) {
            config.allSelectedCondition = this._areArraysEqual(selectedValues, this.lovCondition);
          }
        });

        config.form.get('debtorStatus')?.valueChanges.subscribe(selectedValues => {
          if (this.lovDebtorStatus && this.lovDebtorStatus.length > 0) {
            config.allSelectedDebtorStatus = this._areArraysEqual(selectedValues, this.lovDebtorStatus);
          }
        });

        config.form.get('amountType')?.valueChanges.subscribe(selectedValues => {
          if (this.lovAmount && this.lovAmount.length > 0) {
            config.allSelectedAmountType = this._areArraysEqual(selectedValues, this.lovAmount);
          }
        });
      });
    }, 100);
  }

  private _areArraysEqual(arr1: any[], arr2: any[]): boolean {
    if (!arr1 || !arr2) {
      return false;
    }

    if (arr1.length !== arr2.length) {
      return false;
    }

    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    return sortedArr1.every((val, idx) => val === sortedArr2[idx]);
  }

  private _initialize(): void {
    // Get Proposal Type
    this.summaryApprovalService.getProposalType().subscribe({
      next: res => {
        this.lovProposalType = res || [];
      },
      error: error => {
        console.error('Error loading proposal type:', error);
        this.lovProposalType = [];
      },
    });

    // Get Segment
    this.summaryApprovalService.getSegment().subscribe({
      next: res => {
        this.lovSegment = res || [];
      },
      error: error => {
        console.error('Error loading segment:', error);
        this.lovSegment = [];
      },
    });

    // Get Amount Type
    try {
      this.lovAmount = this.summaryApprovalService.getAmountType() || [];
    } catch (error) {
      console.error('Error loading amount type:', error);
      this.lovAmount = [];
    }

    // Get LC
    this.summaryApprovalService.getLc().subscribe({
      next: res => {
        this.allDataLovLc = res || {};
        if (this.allDataLovLc[this.formConfigs[0].name] && this.allDataLovLc[this.formConfigs[0].name].defaultLc) {
          this.lovLc[this.formConfigs[0].name] = this.allDataLovLc[this.formConfigs[0].name].defaultLc;
        } else {
          this.lovLc[this.formConfigs[0].name] = [];
        }

        // Setup proposal type change listener
        this.formConfigs[0].form.get('proposalType')?.valueChanges.subscribe(selectedValues => {
          if (selectedValues === 'Total Exposure Back to Back') {
            this.formConfigs[0].allSelectedLc = false;
            this.formConfigs[0].form.get('lc')?.setValue([]);
            this.lovLc[this.formConfigs[0].name] = this.allDataLovLc[this.formConfigs[0].name]?.btb || [];
          } else {
            this.formConfigs[0].allSelectedLc = false;
            this.formConfigs[0].form.get('lc')?.setValue([]);
            this.lovLc[this.formConfigs[0].name] = this.allDataLovLc[this.formConfigs[0].name]?.nbtb || [];
          }
        });
      },
      error: error => {
        console.error('Error loading LC data:', error);
        this.allDataLovLc = {};
        this.lovLc[this.formConfigs[0].name] = [];
      },
    });

    // Get Condition
    try {
      this.lovCondition = this.summaryApprovalService.getCondition() || [];
    } catch (error) {
      console.error('Error loading condition:', error);
      this.lovCondition = [];
    }

    // Get Debtor Status
    try {
      this.lovDebtorStatus = this.summaryApprovalService.getDebtorStatus() || [];
    } catch (error) {
      console.error('Error loading debtor status:', error);
      this.lovDebtorStatus = [];
    }
  }

  public toggleMenu() {
    this.formConfigs[0].menuType = this.formConfigs[0].menuType === 'Regional' ? 'Approval LC' : 'Regional';
    this.formConfigs[0].form.get('startDate')?.setValue('');
    this.formConfigs[0].form.get('endDate')?.setValue('');
    this.formConfigs[0].form.get('segment')?.setValue([]);
    this.formConfigs[0].form.get('lc')?.setValue([]);
    this.formConfigs[0].form.get('debtorStatus')?.setValue([]);
    this.formConfigs[0].form.get('amountType')?.setValue([]);
    this.formConfigs[0].form.get('condition')?.setValue([]);
    this.formConfigs[0].allSelectedSegment = false;
    this.formConfigs[0].allSelectedLc = false;
  }

  public toggleSelectAllSegment() {
    this.formConfigs[0].allSelectedSegment = !this.formConfigs[0].allSelectedSegment;

    if (this.formConfigs[0].allSelectedSegment) {
      const allSegmentValues = this.lovSegment?.map(item => item.facilityName) || [];
      this.formConfigs[0].form.get('segment')?.setValue(allSegmentValues);
    } else {
      this.formConfigs[0].form.get('segment')?.setValue([]);
    }
  }

  public toggleSelectAllLc() {
    this.formConfigs[0].allSelectedLc = !this.formConfigs[0].allSelectedLc;

    if (this.formConfigs[0].allSelectedLc) {
      const allLcValues = this.lovLc[this.formConfigs[0].name]?.map(item => item.id) || [];
      this.formConfigs[0].form.get('lc')?.setValue(allLcValues);
    } else {
      this.formConfigs[0].form.get('lc')?.setValue([]);
    }
  }

  public toggleSelectAllCondition() {
    this.formConfigs[0].allSelectedCondition = !this.formConfigs[0].allSelectedCondition;

    if (this.formConfigs[0].allSelectedCondition) {
      this.formConfigs[0].form.get('condition')?.setValue([...this.lovCondition]);
    } else {
      this.formConfigs[0].form.get('condition')?.setValue([]);
    }
  }

  public toggleSelectAllDebtorStatus() {
    this.formConfigs[0].allSelectedDebtorStatus = !this.formConfigs[0].allSelectedDebtorStatus;

    if (this.formConfigs[0].allSelectedDebtorStatus) {
      this.formConfigs[0].form.get('debtorStatus')?.setValue([...this.lovDebtorStatus]);
    } else {
      this.formConfigs[0].form.get('debtorStatus')?.setValue([]);
    }
  }

  public toggleSelectAllAmountType() {
    this.formConfigs[0].allSelectedAmountType = !this.formConfigs[0].allSelectedAmountType;
    if (this.formConfigs[0].allSelectedAmountType) {
      this.formConfigs[0].form.get('amountType')?.setValue([...this.lovAmount]);
    } else {
      this.formConfigs[0].form.get('amountType')?.setValue([]);
    }
  }
  public validateForms(formData: FormGroup) {
    const startDate = formData.get('startDate')?.value;
    const endDate = formData.get('endDate')?.value;
    const proposalType = formData.get('proposalType')?.value;
    const errors = [];

    if (!startDate && !endDate && !proposalType) {
      errors.push({ isValid: false, errorMessage: 'Please Select Data' });
    }

    if (!startDate || !endDate) {
      errors.push({ isValid: false, errorMessage: 'Please Select Date Range Data' });
    }

    if (!proposalType) {
      errors.push({ isValid: false, errorMessage: 'Please Select Proposal Type Data' });
    }

    return errors.length ? errors : [{ isValid: true, errorMessage: null }];
  }
  private _getValidationMessages() {
    const form1 = this.validateForms(this.formData);
    const errorMessages = [];

    if (Array.isArray(form1)) {
      form1.forEach(item => {
        if (!item.isValid) {
          errorMessages.push(item.errorMessage);
        }
      });
    }
    return errorMessages;
  }

  private _generateData() {
    const payloadData = this.summaryApprovalService.generatePayloadFormat(this.formData, this.formConfigs[0].menuType);
    const data$ = this.summaryApprovalService.generate(payloadData, this.summaryApprovalService.getEndpoint(this.formConfigs[0].menuType));

    return data$;
  }

  public generate() {
    this.loadingGenerate = true;
    const validationMessages = this._getValidationMessages();

    if (validationMessages.length > 0) {
      validationMessages.forEach(message => {
        this.message.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: message,
        });
      });
      this.loadingGenerate = false;
      return;
    }

    this._generateData().subscribe({
      next: data => {
        this.processGenerate(data);
      },
      error: error => {
        console.error('Error generating data:', error);
        this.message.add({
          severity: 'error',
          summary: 'Generation Error',
          detail: 'An error occurred while generating the report',
        });
        this.loadingGenerate = false;
      },
    });
  }

  public processGenerate(data: any): void {
    if (!data) {
      if (this.worksheet) {
        this._setAutoWidthForAllColumns();
        this.downloadFile('MIS_SUMMARY_APPROVAL');
      }
      this.loadingGenerate = false;
      return;
    }
    const processedData = {
      data1: getSampleTableData(data[0]),
      payloadData1: this.summaryApprovalService.generatePayloadFormat(this.formData, this.formConfigs[0].menuType),
    };
    this.processData(processedData);

    if (this.worksheet) {
      this._setAutoWidthForAllColumns();
      if (this.formConfigs[0].menuType === 'Regional') {
        this.downloadFile('MIS_Summary_Approval_Regional_Report_');
      } else {
        this.downloadFile('MIS_Summary_Approval_LC_Report_');
      }
    }

    this._resetData();
    this.loadingGenerate = false;
  }

  protected processData(data: any): void {
    const ws = this.worksheet;
    const dateRangeRow = ws.getRow(1);
    dateRangeRow.getCell('A').value = 'Date Range';
    dateRangeRow.getCell('B').value = data.payloadData1.startDate + ' - ' + data.payloadData1.endDate;

    const proposalTypeRow = ws.getRow(2);
    proposalTypeRow.getCell('A').value = 'Proposal Type';
    proposalTypeRow.getCell('B').value = data.payloadData1.proposalType;

    // Process Data
    let indexRow = 0;
    data.data1.forEach((item: any, index: number) => {
      const conditionsLength = processConditions(data.payloadData1.condition, data.payloadData1.debtorStatus).length;
      indexRow += conditionsLength + 5;
      this.summaryApprovalService.createTableInWorksheet(
        ws,
        item,
        index * (conditionsLength + 5) + 6,
        data.payloadData1.condition,
        data.payloadData1.debtorStatus,
        data.payloadData1.amountType
      );
    });
  }
}
