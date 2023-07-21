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
import { CashPositionService } from 'app/entities/cash-position/cash-position.service';
import { IPositionType } from 'app/entities/position-type/position-type.model';
import { firstValueFrom } from 'rxjs';
import { IPosition } from '@syncfusion/ej2-angular-grids';

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
  public positionTypes: IPositionType[];
  public positionTo: IPosition[];
  private selectedPosition: string;
  public DelegationApplicationReq = new DelegationApplicationRequest();
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
    private cashPositionService: CashPositionService
  ) {
    this.partyId = this.data.partyId;
    this.fromEmployee = this.data.fromEmployee;
    this.dataDelegation = [];
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
    this.DelegationApplicationReq.fromEmployeeId = this.fromEmployee.id;
    this.DelegationApplicationReq.toEmployeeId = this.employeeId;
    this.DelegationApplicationReq.loanApplications = this.selectedData;
    this.cashCreditProposalService.addDelegation(this.DelegationApplicationReq).subscribe(() => {
      this._dialog.close();
    });
  }

  public cancel(): void {
    this._dialog.close('cancel');
  }
}
