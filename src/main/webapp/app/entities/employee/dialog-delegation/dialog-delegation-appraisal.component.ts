import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { EmployeeService } from '../employee.service';
import { InternalService } from 'app/entities/internal/internal.service';
import { IInternal } from 'app/entities/internal/internal.model';
import { MatSelectChange } from '@angular/material/select';
import { IEmployee } from '../employee.model';
import { CashSurveyAppraisalsService } from 'app/entities/survey-appraisals/cash-survey-appraisal.service';
import { DelegationAppraisalRequest, IDelegationAppraisalRequest } from '../delegationApplicationRequest.model';
import { MessageService } from 'primeng/api';
import { CashPositionService } from 'app/entities/cash-position/cash-position.service';
import { IPositionType } from 'app/entities/position-type/position-type.model';
import { firstValueFrom } from 'rxjs';
import { IPosition } from 'app/entities/position/position.model';
import moment from 'moment';

@Component({
  selector: 'jhi-delegation-appraisal-dialog',
  templateUrl: './dialog-delegation-appraisal.component.html',
  styleUrls: ['../employee.css'],
})
export class DialogDelegationAppraisalComponent implements OnInit {
  private selectedPosition: string;

  public partyId: string;
  public internalData: IInternal[];
  public employeeData: IEmployee[];
  public dataDelegation = [];
  public isChecked = true;
  public selectedData = [];
  public fromEmployee: IEmployee;
  public employeeId: number;
  public positionTypes: IPositionType[];
  public positionTo: IPosition[];
  public delegationAppraisalRequest: IDelegationAppraisalRequest = new DelegationAppraisalRequest();
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
    private messageService: MessageService,
    private cashPositionService: CashPositionService
  ) {
    this.partyId = this.data.partyId;
    this.fromEmployee = this.data.fromEmployee;
    this.dataSelect = true;
    this.dataDelegation = [];
  }

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
      this.getMyAppraisal();
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
      await firstValueFrom(
        this.cashPositionService.getInternalByPartyIdAndPositionTypeId(idPositionType, idParty, {
          page: 0,
          size: 999,
        })
      )
    ).body;
  }

  public getMyAppraisal(): void {
    this.cashSurveyAppraisalsService
      .getMyAppraisal(this.partyId, this.selectedPosition, {
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
    if (this.delegationAppraisalRequest.fromDate === undefined || this.delegationAppraisalRequest.thruDate === undefined) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form date is required',
      });
    } else {
      if (this.selectedData.length > 0) {
        this.delegationAppraisalRequest.fromEmployeeId = this.fromEmployee.id;
        this.delegationAppraisalRequest.toEmployeeId = this.employeeId;
        this.delegationAppraisalRequest.appraisals = this.selectedData;
        this.delegationAppraisalRequest.roleId = this.selectedPosition;
        this.delegationAppraisalRequest.fromDate = moment(this.delegationAppraisalRequest.fromDate).toDate();
        this.delegationAppraisalRequest.thruDate = moment(this.delegationAppraisalRequest.thruDate).toDate();
        this.cashSurveyAppraisalsService.addDelegation(this.delegationAppraisalRequest).subscribe(
          () => {
            this._dialog.close();
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.detail,
            });
          }
        );
      } else if (this.selectedData.length < 1) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'List delegation required',
        });
      }
    }
  }

  public cancel(): void {
    this._dialog.close('cancel');
  }
}
