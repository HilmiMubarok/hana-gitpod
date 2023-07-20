import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { IDocumentType } from 'app/entities/document-type/document-type.model';
import { EmployeeService } from '../employee.service';
import { InternalService } from 'app/entities/internal/internal.service';
import { IInternal } from 'app/entities/internal/internal.model';
import { MatSelectChange } from '@angular/material/select';
import { IEmployee } from '../employee.model';
import { CashSurveyAppraisalsService } from 'app/entities/survey-appraisals/cash-survey-appraisal.service';
import { DelegationAppraisalRequest } from '../delegationApplicationRequest.model';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'jhi-delegation-appraisal-dialog',
  templateUrl: './dialog-delegation-appraisal.component.html',
  styleUrls: ['../employee.css'],
})
export class DialogDelegationAppraisalComponent implements OnInit {
  public partyId: string;
  public internalData: IInternal[];
  public employeeData: IEmployee[];
  public dataDelegation = [];
  public isChecked = true;
  public selectedData = [];
  public fromEmployee: IEmployee;
  public employeeId: number;
  public DelegationAppraisalreq = new DelegationAppraisalRequest();
  public displayedColumnsExpand: string[] = [
    'no',
    'appraisalNumber',
    'cif',
    'customerName',
    'customerType',
    'createdDate',
    'collateralType',
    'status',
    'action',
  ];
  public dataSelect: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      partyId: string;
      fromEmployee: IEmployee;
    },
    private _dialog: MatDialogRef<DialogDelegationAppraisalComponent>,

    public reportUtilService: ReportUtilService,
    public employeeService: EmployeeService,
    public internalService: InternalService,
    public cashSurveyAppraisalsService: CashSurveyAppraisalsService,
    private messageService: MessageService
  ) {
    this.partyId = this.data.partyId;
    this.fromEmployee = this.data.fromEmployee;
    this.dataSelect = true;
  }

  ngOnInit(): void {
    this.internalService.pageSize().subscribe((res: any) => {
      this.internalData = res.body;
    });
    this.delegationAppraisalData();
  }

  public delegationAppraisalData() {
    this.cashSurveyAppraisalsService
      .cashSurveyAppraisalMyApplication(this.partyId, {
        size: 9999,
        page: 0,
        sort: ['asc'],
      })
      .subscribe((res: any) => {
        this.dataDelegation = res.body.map(data => ({
          ...data,
          attributes: {
            selected: true,
          },
        }));
        this.selectedData = this.dataDelegation;
      });
  }

  public changeEvent(event: MatSelectChange): void {
    this.employeeService
      .queryFilterBy({
        idInternal: event.value,
        size: 9999,
        page: 0,
        sort: ['asc'],
      })
      .subscribe((res: any) => {
        this.employeeData = res.body;
      });
  }

  onCheckboxChange(row: any) {
    row.attributes.selected = !row.attributes.selected;

    if (!row.attributes.selected) {
      this.selectedData.push(row);
    } else {
      row.attributes.selected = !row.attributes.selected;
      const index = this.selectedData.findIndex(data => data === row);
      if (index > -1) {
        this.selectedData.splice(index, 1);
      }
    }
  }

  public unCheck(value: any) {
    if (value === false) {
      for (const obj of this.selectedData) {
        obj.attributes.selected = false;
      }
      this.selectedData = [];
    } else if (value === true) {
      this.selectedData = this.dataDelegation;
      for (const obj of this.selectedData) {
        obj.attributes.selected = true;
      }
    }
  }

  protected postLoadDataLazy() {}

  public save(): void {
    if (this.selectedData.length < 1) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'List delegation required' });
    } else {
      const result = this.employeeData.filter(data => data.id === this.employeeId);
      this.DelegationAppraisalreq.fromEmployee = this.fromEmployee;
      this.DelegationAppraisalreq.toEmployee = result[0];
      this.DelegationAppraisalreq.appraisals = this.selectedData;
      this.cashSurveyAppraisalsService.addDelegation(this.DelegationAppraisalreq).subscribe(
        () => {
          this._dialog.close();
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail });
          // Fungsi ini akan dijalankan ketika terjadi respons error

          // Lakukan penanganan error sesuai kebutuhan, misalnya menampilkan pesan kesalahan ke pengguna
        }
      );
    }
  }

  public cancel(): void {
    this._dialog.close('cancel');
  }
}
