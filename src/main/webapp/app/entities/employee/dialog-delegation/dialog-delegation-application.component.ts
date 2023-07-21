import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { IDocumentType } from 'app/entities/document-type/document-type.model';
import { IInternal } from 'app/entities/internal/internal.model';
import { IEmployee } from '../employee.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { CashCreditProposalService } from 'app/entities/credit-proposal/cash-credit-proposal.service';
import { MatSelectChange } from '@angular/material/select';
import { EmployeeService } from '../employee.service';
import { DelegationApplicationRequest } from '../delegationApplicationRequest.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-delegation-application-dialog',
  templateUrl: './dialog-delegation-application.component.html',
  styleUrls: ['../employee.css'],
})
export class DialogDelegationApplicationComponent implements OnInit {
  public partyId: string;
  public internalData: IInternal[];
  public employeeData: IEmployee[];
  public dataDelegation = [];
  public isChecked = true;
  public selectedData = [];
  public employeeId: any;
  public filesStatus: string;
  public filesdueDate: string;
  public filesRemarks: string;
  public filesDescription: string;
  public fromEmployee: IEmployee;
  public dataSelect: boolean;
  public DelegationApplicationReq = new DelegationApplicationRequest();
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      partyId: string;
      fromEmployee: IEmployee;
    },
    private _dialog: MatDialogRef<DialogDelegationApplicationComponent>,

    public reportUtilService: ReportUtilService,
    public internalService: InternalService,
    public cashCreditProposalService: CashCreditProposalService,
    public employeeService: EmployeeService,
    private messageService: MessageService
  ) {
    this.partyId = this.data.partyId;
    this.fromEmployee = this.data.fromEmployee;
    this.dataSelect = true;
  }

  public displayedColumnsExpand: string[] = [
    'no',
    'proposalNumber',
    'cif',
    'customerName',
    'customerType',
    'createdDate',
    'status',
    'action',
  ];

  ngOnInit(): void {
    this.internalService.pageSize().subscribe((res: any) => {
      this.internalData = res.body;
    });
    this.delegationAppicationData();
  }

  public delegationAppicationData() {
    this.cashCreditProposalService
      .cashCreditProposalMyApplication(this.partyId, {
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

  public save(): void {
    if (this.selectedData.length < 1) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'List delegation required' });
    } else {
      const result = this.employeeData.filter(data => data.id === this.employeeId);
      this.DelegationApplicationReq.fromEmployee = this.fromEmployee;
      this.DelegationApplicationReq.toEmployee = result[0];
      this.DelegationApplicationReq.loanApplications = this.selectedData;
      this.cashCreditProposalService.addDelegation(this.DelegationApplicationReq).subscribe(
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
