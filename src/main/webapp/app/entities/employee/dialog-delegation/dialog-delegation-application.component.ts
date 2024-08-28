import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { IInternal } from 'app/entities/internal/internal.model';
import { IEmployee } from '../employee.model';
import { CashCreditProposalService } from 'app/entities/credit-proposal/cash-credit-proposal.service';
import { MatSelectChange } from '@angular/material/select';
import { EmployeeService } from '../employee.service';
import { DelegationApplicationRequest, IDelegationApplicationRequest } from '../delegationApplicationRequest.model';
import { CashPositionService } from 'app/entities/cash-position/cash-position.service';
import { IPositionType } from 'app/entities/position-type/position-type.model';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { IPosition } from 'app/entities/position/position.model';
import moment from 'moment';

@Component({
  selector: 'jhi-delegation-application-dialog',
  templateUrl: './dialog-delegation-application.component.html',
  styleUrls: ['../employee.css'],
  providers: [{ provide: 'MAT_DATE_LOCALE', useValue: 'in_ID' }],
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
  public positionTypes: IPositionType[];
  public positionTo: IPosition[];
  private selectedPosition: string;
  public dataSelect: boolean;
  public delegationApplicationRequest: IDelegationApplicationRequest = new DelegationApplicationRequest();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      partyId: string;
      fromEmployee: IEmployee;
    },
    private _dialog: MatDialogRef<DialogDelegationApplicationComponent>,

    public reportUtilService: ReportUtilService,
    public cashCreditProposalService: CashCreditProposalService,
    public employeeService: EmployeeService,
    private messageService: MessageService,
    private cashPositionService: CashPositionService
  ) {
    this.partyId = this.data.partyId;
    this.fromEmployee = this.data.fromEmployee;
    this.dataDelegation = [];
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
    this.loadPositionByIdParty(this.partyId);
  }

  public async loadPositionByIdParty(idParty: string): Promise<void> {
    this.positionTypes = (
      await firstValueFrom(
        this.cashPositionService.getPositionTypeByPartyId(idParty, {
          page: 0,
          size: 9999,
        })
      )
    ).body;
  }

  public changePositions(event: MatSelectChange): void {
    this.selectedPosition = event.value;
    if (this.selectedPosition !== '') {
      this.getInternalByPositionAndIdParty(this.selectedPosition, this.partyId);
      this.getMyApplication();
    } else {
      this.dataDelegation = [];
      this.internalData = [];
      this.positionTo = [];
      this.disableField();
    }
  }

  public disableField(): boolean {
    return true;
  }

  public async getInternalByPositionAndIdParty(idPositionType: string, idParty: string): Promise<void> {
    this.internalData = (
      await firstValueFrom(this.cashPositionService.getInternalByPartyIdAndPositionTypeId(idPositionType, idParty, { page: 0, size: 999 }))
    ).body;
  }

  public getMyApplication() {
    this.cashCreditProposalService
      .getMyApplication(this.partyId, this.selectedPosition, {
        size: 9999,
        page: 0,
        sort: ['asc'],
      })
      .subscribe((res: any) => {
        console.log('length res body', res.body.length);
        this.dataDelegation = res.body.map(data => ({
          ...data,
          attributes: {
            selected: true,
          },
        }));
        this.selectedData = this.dataDelegation;
      });
  }

  public async changeInternal(event: MatSelectChange): Promise<void> {
    const value: string = event.value;
    if (value !== '') {
      this.positionTo = (
        await firstValueFrom(
          this.cashPositionService.filterBy({
            idPositionType: this.selectedPosition,
            idInternal: value,
            active: true,
            page: 0,
            size: 999,
          })
        )
      ).body;
    } else {
      this.positionTo = [];
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
    console.log('xxx', moment(this.delegationApplicationRequest.fromDate).add(7, 'h'));

    if (this.delegationApplicationRequest.fromDate === undefined || this.delegationApplicationRequest.thruDate === undefined) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form date is required',
      });
    } else {
      if (this.selectedData.length > 0) {
        this.delegationApplicationRequest.fromEmployeeId = this.fromEmployee.id;
        this.delegationApplicationRequest.toEmployeeId = this.employeeId;
        this.delegationApplicationRequest.loanApplications = this.selectedData;
        this.delegationApplicationRequest.roleId = this.selectedPosition;
        this.delegationApplicationRequest.fromDate = moment(this.delegationApplicationRequest.fromDate).add(7, 'h').toDate();
        this.delegationApplicationRequest.thruDate = moment(this.delegationApplicationRequest.thruDate).add(7, 'h').toDate();
        this.cashCreditProposalService.addDelegation(this.delegationApplicationRequest).subscribe(
          () => {
            this._dialog.close();
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail });
          }
        );
      } else if (this.selectedData.length < 1) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'List delegation required' });
      }
    }
  }

  public cancel(): void {
    this._dialog.close('cancel');
  }
}
