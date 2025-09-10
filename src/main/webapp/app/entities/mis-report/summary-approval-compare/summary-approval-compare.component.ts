import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SummaryApprovalService } from './summary-approval.service';
import moment from 'moment';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { MisReportService } from '../mis-report.service';
import { getSampleTableData, processConditions } from './summary-approval-compare.helper';

interface FormDataConfig {
  form: FormGroup;
  menuType: 'Regional' | 'Approval LC';
  allSelectedSegment: boolean;
  allSelectedLc: boolean;
  allSelectedCondition: boolean;
  allSelectedDebtorStatus: boolean;
  name: string;
}

@Component({
  selector: 'jhi-summary-approval-compare',
  templateUrl: './summary-approval-compare.component.html',
  styleUrls: ['./summary-approval-compare.style.css'],
})
export class SummaryApprovalCompareComponent extends AbstractExcelMISReport {
  public formConfigs: FormDataConfig[] = [];
  public formData1: FormGroup;
  public formData2: FormGroup;
  public lovAmount;
  public lovCondition; // multi select
  public lovSegment; // multi select
  public lovLc = {
    form1: [],
    form2: [],
  }; // multi select
  public allDataLovLc;
  public lovProposalType;
  public lovDebtorStatus;
  public loadingGenerate = false;

  constructor(
    public summaryApprovalService: SummaryApprovalService,
    public message: MessageService,
    public misReportService: MisReportService
  ) {
    super(misReportService);
    this.formData1 = this.createFormGroup();
    this.formData2 = this.createFormGroup();

    this.formConfigs = [
      {
        form: this.formData1,
        menuType: 'Regional',
        allSelectedSegment: false,
        allSelectedLc: false,
        allSelectedCondition: false,
        allSelectedDebtorStatus: false,
        name: 'form1',
      },
      {
        form: this.formData2,
        menuType: 'Regional',
        allSelectedSegment: false,
        allSelectedLc: false,
        allSelectedCondition: false,
        allSelectedDebtorStatus: false,
        name: 'form2',
      },
    ];

    this._setupDateFormatters();
    this._initialize();
  }

  private createFormGroup(): FormGroup {
    return new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      proposalType: new FormControl(''),
      segment: new FormControl(''),
      lc: new FormControl(''),
      amountType: new FormControl(''),
      condition: new FormControl(''),
      debtorStatus: new FormControl(''),
    });
  }

  private _setupDateFormatters(): void {
    const dateFields = ['startDate', 'endDate'];
    const forms = [this.formData1, this.formData2];

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
    this.formConfigs.forEach((config, index) => {
      if (config.menuType === 'Regional') {
        config.form.get('segment')?.valueChanges.subscribe(selectedValues => {
          const allRegionalItems = this.lovSegment.map(item => item.facilityName);
          config.allSelectedSegment = this._areArraysEqual(selectedValues, allRegionalItems);
        });
      }

      if (config.menuType === 'Approval LC') {
        config.form.get('lc')?.valueChanges.subscribe(selectedValues => {
          const allLcItems = this.lovLc[config.name].map(item => item.id);
          config.allSelectedLc = this._areArraysEqual(selectedValues, allLcItems);
        });
      }

      config.form.get('condition')?.valueChanges.subscribe(selectedValues => {
        config.allSelectedCondition = this._areArraysEqual(selectedValues, this.lovCondition);
      });
    });
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
    this.summaryApprovalService.getProposalType().subscribe(res => {
      this.lovProposalType = res;
    });

    // Get Segment
    this.summaryApprovalService.getSegment().subscribe(res => {
      this.lovSegment = res;
    });

    // Get Amount Type
    this.lovAmount = this.summaryApprovalService.getAmountType();

    // Get LC
    this.summaryApprovalService.getLc().subscribe(res => {
      this.allDataLovLc = res;
      this.lovLc[this.formConfigs[0].name] = this.allDataLovLc[this.formConfigs[0].name].defaultLc;
      this.lovLc[this.formConfigs[1].name] = this.allDataLovLc[this.formConfigs[1].name].defaultLc;

      // if proposal type changes
      this.formConfigs[0].form.get('proposalType')?.valueChanges.subscribe(selectedValues => {
        if (selectedValues === 'Total Exposure Back to Back') {
          if (this.formConfigs[0].allSelectedLc) {
            this.formConfigs[0].allSelectedLc = false;
          }
          this.formConfigs[0].form.get('lc')?.setValue([]);
          this.lovLc[this.formConfigs[0].name] = this.allDataLovLc[this.formConfigs[0].name].btb;
        } else {
          if (this.formConfigs[0].allSelectedLc) {
            this.formConfigs[0].allSelectedLc = false;
          }
          this.formConfigs[0].form.get('lc')?.setValue([]);
          this.lovLc[this.formConfigs[0].name] = this.allDataLovLc[this.formConfigs[0].name].nbtb;
        }
      });

      // if proposal type changes
      this.formConfigs[1].form.get('proposalType')?.valueChanges.subscribe(selectedValues => {
        if (selectedValues === 'Total Exposure Back to Back') {
          if (this.formConfigs[1].allSelectedLc) {
            this.formConfigs[1].allSelectedLc = false;
          }
          this.formConfigs[1].form.get('lc')?.setValue([]);
          this.lovLc[this.formConfigs[1].name] = this.allDataLovLc[this.formConfigs[1].name].btb;
        } else {
          if (this.formConfigs[1].allSelectedLc) {
            this.formConfigs[1].allSelectedLc = false;
          }
          this.formConfigs[1].form.get('lc')?.setValue([]);
          this.lovLc[this.formConfigs[1].name] = this.allDataLovLc[this.formConfigs[1].name].nbtb;
        }
      });
    });

    // Get Condition
    this.lovCondition = this.summaryApprovalService.getCondition();

    // Get Debtor Status
    this.lovDebtorStatus = this.summaryApprovalService.getDebtorStatus();
  }

  public toggleMenu(whichMenu: 'menuData1' | 'menuData2') {
    const index = whichMenu === 'menuData1' ? 0 : 1;
    this.formConfigs[index].menuType = this.formConfigs[index].menuType === 'Regional' ? 'Approval LC' : 'Regional';

    this.formConfigs[index].form.get('segment')?.setValue([]);
    this.formConfigs[index].allSelectedSegment = false;
    this.formConfigs[index].allSelectedLc = false;
  }

  public toggleSelectAllSegment(formIndex: number) {
    this.formConfigs[formIndex].allSelectedSegment = !this.formConfigs[formIndex].allSelectedSegment;

    if (this.formConfigs[formIndex].allSelectedSegment) {
      this.formConfigs[formIndex].form.get('segment')?.setValue(this.lovSegment.map(item => item.facilityName));
    } else {
      this.formConfigs[formIndex].form.get('segment')?.setValue([]);
    }
  }

  public toggleSelectAllLc(formIndex: number) {
    this.formConfigs[formIndex].allSelectedLc = !this.formConfigs[formIndex].allSelectedLc;

    if (this.formConfigs[formIndex].allSelectedLc) {
      this.formConfigs[formIndex].form.get('lc')?.setValue(this.lovLc[this.formConfigs[formIndex].name].map(item => item.id));
    } else {
      this.formConfigs[formIndex].form.get('lc')?.setValue([]);
    }
  }

  public toggleSelectAllCondition(formIndex: number) {
    this.formConfigs[formIndex].allSelectedCondition = !this.formConfigs[formIndex].allSelectedCondition;

    if (this.formConfigs[formIndex].allSelectedCondition) {
      this.formConfigs[formIndex].form.get('condition')?.setValue([...this.lovCondition]);
    } else {
      this.formConfigs[formIndex].form.get('condition')?.setValue([]);
    }
  }

  public toggleSelectAllDebtorStatus(formIndex: number) {
    this.formConfigs[formIndex].allSelectedDebtorStatus = !this.formConfigs[formIndex].allSelectedDebtorStatus;

    if (this.formConfigs[formIndex].allSelectedDebtorStatus) {
      this.formConfigs[formIndex].form.get('debtorStatus')?.setValue([...this.lovDebtorStatus]);
    } else {
      this.formConfigs[formIndex].form.get('debtorStatus')?.setValue([]);
    }
  }

  private _getValidationMessages() {
    const form1 = this.summaryApprovalService.validateForm(this.formData1, '1');
    const form2 = this.summaryApprovalService.validateForm(this.formData2, '2');

    const errorMessages = [];

    if (Array.isArray(form1)) {
      form1.forEach(item => {
        if (!item.isValid) {
          errorMessages.push(item.errorMessage);
        }
      });
    }

    if (Array.isArray(form2)) {
      form2.forEach(item => {
        if (!item.isValid) {
          errorMessages.push(item.errorMessage);
        }
      });
    }

    const data1Messages = errorMessages.filter(message => message.includes('Data 1'));
    const data2Messages = errorMessages.filter(message => message.includes('Data 2'));

    if (data1Messages.length > 0) {
      const pleaseSelectData1 = data1Messages.find(message => message.includes('Please Select Data 1'));
      if (pleaseSelectData1) {
        this.message.add({ severity: 'error', summary: 'Error', detail: pleaseSelectData1 });
      } else {
        const data1MessagesFiltered = data1Messages.filter(message => !message.includes('Please Select Data 1'));
        data1MessagesFiltered.forEach(message => {
          this.message.add({ severity: 'error', summary: 'Error', detail: message });
        });
      }
    }

    if (data2Messages.length > 0 && data1Messages.length === 0) {
      const pleaseSelectData2 = data2Messages.find(message => message.includes('Please Select Data 2'));
      if (pleaseSelectData2) {
        this.message.add({ severity: 'error', summary: 'Error', detail: pleaseSelectData2 });
      } else {
        const data2MessagesFiltered = data2Messages.filter(message => !message.includes('Please Select Data 2'));
        data2MessagesFiltered.forEach(message => {
          this.message.add({ severity: 'error', summary: 'Error', detail: message });
        });
      }
    }

    return errorMessages;
  }

  private _generateData() {
    const payloadData1 = this.summaryApprovalService.generatePayloadFormat(this.formData1, this.formConfigs[0].menuType);
    const payloadData2 = this.summaryApprovalService.generatePayloadFormat(this.formData2, this.formConfigs[1].menuType);

    const data1$ = this.summaryApprovalService.generate(
      payloadData1,
      this.summaryApprovalService.getEndpoint(this.formConfigs[0].menuType)
    );
    const data2$ = this.summaryApprovalService.generate(
      payloadData2,
      this.summaryApprovalService.getEndpoint(this.formConfigs[1].menuType)
    );

    return forkJoin([data1$, data2$]);
  }

  public generate() {
    if (this._getValidationMessages().length > 0) {
      return;
    }

    this._generateData().subscribe(([data1, data2]) => {
      this.processGenerate(data1, data2);
    });
  }

  public processGenerate(data1, data2): void {
    if (!data1 || !data2) {
      this._setAutoWidthForAllColumns();
      this.downloadFile('MIS_SUMMARY_APPROVAL_COMPARE');
      return;
    }

    const processedData = {
      data1: getSampleTableData(data1[0]),
      data2: getSampleTableData(data2[0]),
      payloadData1: this.summaryApprovalService.generatePayloadFormat(this.formData1, this.formConfigs[0].menuType),
      payloadData2: this.summaryApprovalService.generatePayloadFormat(this.formData2, this.formConfigs[1].menuType),
    };

    this.processData(processedData);
    this._setAutoWidthForAllColumns();

    this.downloadFile('Summary_Approval_Compare_');
    this._resetData();
  }

  protected processData(data): void {
    const ws = this.worksheet;

    // Data 1
    const dateRangeRow = ws.getRow(1);
    dateRangeRow.getCell('A').value = 'Date Range';
    dateRangeRow.getCell('B').value = data.payloadData1.startDate + ' - ' + data.payloadData1.endDate;

    const proposalTypeRow = ws.getRow(2);
    proposalTypeRow.getCell('A').value = 'Proposal Type';
    proposalTypeRow.getCell('B').value = data.payloadData1.proposalType;

    const amountTypeRow = ws.getRow(3);
    amountTypeRow.getCell('A').value = 'Amount Type';
    amountTypeRow.getCell('B').value = data.payloadData1.amountType;

    // Process Data 1
    let indexRow = 0;
    data.data1.forEach((item, index) => {
      indexRow += processConditions(data.payloadData1.condition, data.payloadData1.debtorStatus).length + 5;
      this.summaryApprovalService.createTableInWorksheet(
        ws,
        item,
        index * (processConditions(data.payloadData1.condition, data.payloadData1.debtorStatus).length + 5) + 6,
        data.payloadData1.condition,
        data.payloadData1.debtorStatus
      );
    });

    const lastRow = indexRow + 6;
    // Data 2
    const dateRangeRow2 = ws.getRow(lastRow);
    dateRangeRow2.getCell('A').value = 'Date Range';
    dateRangeRow2.getCell('B').value = data.payloadData2.startDate + ' - ' + data.payloadData2.endDate;

    const proposalTypeRow2 = ws.getRow(dateRangeRow2.number + 1);
    proposalTypeRow2.getCell('A').value = 'Proposal Type';
    proposalTypeRow2.getCell('B').value = data.payloadData2.proposalType;

    const amountTypeRow2 = ws.getRow(proposalTypeRow2.number + 1);
    amountTypeRow2.getCell('A').value = 'Amount Type';
    amountTypeRow2.getCell('B').value = data.payloadData2.amountType;

    // Process Data 2
    data.data2.forEach((item, index) => {
      const indexRowData2 = processConditions(data.payloadData2.condition, data.payloadData2.debtorStatus).length + 5;
      this.summaryApprovalService.createTableInWorksheet(ws, item, lastRow + 2 + index * indexRowData2 + 3, data.payloadData2.condition, data.payloadData2.debtorStatus);
    });
  }
}
