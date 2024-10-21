import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { MessageService } from 'primeng/api';
import { MasterCompanyTypeDialogComponent } from '../master-company-type/master-company-type-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDocumentTerm, SchedulerParticipant, SchedulerType } from './master-document-term.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { MasterDocumentTermService } from './master-document-term.service';
import { PositionTypeService } from 'app/entities/position-type/position-type.service';
import { HttpResponse } from '@angular/common/http';
import { PositionService } from 'app/entities/position/position.service';
import { IPosition } from 'app/entities/position/position.model';
import { IPositionType } from 'app/entities/position-type/position-type.model';
import * as lodash from 'lodash';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'jhi-master-document-term-dialog',
  templateUrl: './master-document-term-dialog.component.html',
  styleUrls: ['../master-company-type/master-company-type.css'],
  styles: [
    `
      ::ng-deep .participant .mat-form-field-wrapper {
        margin-bottom: 0px !important;
        padding-bottom: 0px !important;
      }

      .ng-invalid:not(form) {
        border: none !important;
      }
    `,
  ],
})
export class MasterDocumentTermDialogComponent implements OnInit {
  public participants: MatTableDataSource<SchedulerParticipant> = new MatTableDataSource([]);
  public schedulerParticipant: SchedulerParticipant;
  public filterPositionLov = ['LEGAL_OFFICER', 'LEGALOFFICER_OUTREGION', 'LEGAL_HEAD', 'CREDIT_LEGAL_LEAD', 'LEGAL_TEAM_LEAD'];
  public positionLov: string[] = [];
  public nameLov: string[] = [];
  public employeeData: IPosition[];
  public schedulerTypes: SchedulerType;
  public masterDocumentTerm: FormGroup;
  public documentTerm: MasterDocumentTerm;
  public _spesificDateLov: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public spesificDateLov: Observable<number[]> = this._spesificDateLov.asObservable();
  public weeklySpesificDate: number[] = [1, 2, 3, 4, 5, 6, 7];
  public monthlySpesificDate: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    protected messageService: MessageService,
    protected positionTypeService: PositionTypeService,
    protected positionService: PositionService,
    protected activatedRoute: ActivatedRoute,
    protected masterDocumentTermService: MasterDocumentTermService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      documentTerm: MasterDocumentTerm;
      schedulerTypes: SchedulerType;
    },
    private _dialog: MatDialogRef<MasterCompanyTypeDialogComponent>
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });

    this.documentTerm = this.data.documentTerm;
    this.schedulerTypes = this.data.schedulerTypes;

    this.masterDocumentTerm = this.fb.group({
      reminderType: [{ value: this.data.documentTerm.name, disabled: true }, Validators.required],
      fromDays: [this.data.documentTerm.fromDays, Validators.required],
      toDays: [this.data.documentTerm.toDays, Validators.required],
      interval: [this.data.documentTerm.interval, Validators.required],
      daysTo: [{ value: this.data.documentTerm.daysTo, disabled: this.data.documentTerm.interval === 'DAILY' }, Validators.required],
      statusId: [this.data.documentTerm.statusId, Validators.required],
      schedulerEmail: this.fb.group({
        position: [this.positionLov],
        name: [{ value: '', disabled: true }],
      }),
    });

    if (this.data.documentTerm.interval === 'WEEKLY') {
      this._spesificDateLov.next(this.weeklySpesificDate);
    } else {
      this._spesificDateLov.next(this.monthlySpesificDate);
    }
  }

  setValidatorsBasedOnDataLength() {
    if (this.participants.data.length === 0) {
      this.masterDocumentTerm.get('schedulerEmail').get('position').setValidators(Validators.required);
      this.masterDocumentTerm.get('schedulerEmail').get('name').setValidators(Validators.required);
    } else {
      this.masterDocumentTerm.get('schedulerEmail').get('position').clearValidators();
      this.masterDocumentTerm.get('schedulerEmail').get('name').clearValidators();
    }

    // Update the validity state of the controls
    this.masterDocumentTerm.get('schedulerEmail').get('position').updateValueAndValidity();
    this.masterDocumentTerm.get('schedulerEmail').get('name').updateValueAndValidity();
  }

  deleteParticipant(id: number) {
    this.masterDocumentTermService.deleteParticipant(id).subscribe((res: any) => {
      this.getParticipants();
      this.setValidatorsBasedOnDataLength();
    });
  }

  addParticipant() {
    this.setParticipant().then(participant => {
      this.masterDocumentTermService.saveParticipant(participant).subscribe((res: any) => {
        this.getParticipants();
        this.setValidatorsBasedOnDataLength();

        // Clear form fields
        this.masterDocumentTerm.get('schedulerEmail').get('position').setValue('');
        this.masterDocumentTerm.get('schedulerEmail').get('name').setValue('');
      });
    });
  }

  getParticipants() {
    this.masterDocumentTermService
      .getParticipantBySchedule(this.data.documentTerm.id)
      .subscribe((res: HttpResponse<SchedulerParticipant>) => {
        this.participants = new MatTableDataSource<SchedulerParticipant>(res.body as any);
        this.setValidatorsBasedOnDataLength();
      });
  }

  ngOnInit(): void {
    this.masterDocumentTerm.get('interval').valueChanges.subscribe(value => {
      switch (value) {
        case 'DAILY':
          this.masterDocumentTerm.get('daysTo').setValue(1);
          this.masterDocumentTerm.get('daysTo').disable();
          break;

        case 'WEEKLY':
          this._spesificDateLov.next(this.weeklySpesificDate);
          this.masterDocumentTerm.get('daysTo').setValue(this.masterDocumentTerm.get('daysTo').value);
          this.masterDocumentTerm.get('daysTo').enable();
          break;

        case 'MONTHLY':
          this._spesificDateLov.next(this.monthlySpesificDate);
          this.masterDocumentTerm.get('daysTo').setValue(this.masterDocumentTerm.get('daysTo').value);
          this.masterDocumentTerm.get('daysTo').enable();
          break;

        default:
          this._spesificDateLov.next(this.monthlySpesificDate);
          this.masterDocumentTerm.get('daysTo').setValue(this.masterDocumentTerm.get('daysTo').value);
          this.masterDocumentTerm.get('daysTo').enable();
          break;
      }
    });

    this.masterDocumentTerm
      .get('schedulerEmail')
      .get('position')
      .valueChanges.subscribe(value => {
        if (value) {
          this.masterDocumentTerm.get('schedulerEmail.name').enable();
          this.getNameByPosition(value);
        } else {
          this.masterDocumentTerm.get('schedulerEmail.name').disable();
        }
      });

    this.getLOVPosition();
    this.getParticipants();
    this.setValidatorsBasedOnDataLength();
  }

  getLOVPosition(): void {
    this.positionTypeService
      .query({
        page: 0,
        size: 999,
        sort: ['id', 'asc'],
      })
      .pipe(map((res: HttpResponse<IPositionType[]>) => res.body.filter(data => this.filterPositionLov.includes(data.id)) || []))
      .subscribe(position => {
        this.positionLov = [...position.map(item => item.id)];
      });
  }

  getNameByPosition(positionTypeId: string) {
    this.positionService
      .queryFilterBy({
        page: 0,
        size: 999,
        idPositionType: positionTypeId,
      })
      .pipe(map((res: HttpResponse<IPosition[]>) => res.body || []))
      .subscribe(employeeData => {
        this.employeeData = employeeData;

        // Create filtered Employee. This is used for the name LOV with filtering, when the employeeData is exists inside this.participants data array, then remove it.
        const filteredEmployee = employeeData.filter(
          data => !this.participants.data.some(participant => participant.employeeId === data.employeeId)
        );

        this.nameLov = [...filteredEmployee.map(item => item.employeeFirstName + ' ' + item.employeeLastName)];
      });
  }

  setParticipant(): Promise<SchedulerParticipant> {
    return new Promise((resolve, reject) => {
      const employeeName = this.masterDocumentTerm.get('schedulerEmail').get('name').value.split(' ');

      const firstName = employeeName[0];

      // last name is index 1 and the rest
      const lastName = employeeName.slice(1).join(' ');

      // Search in employeeData where employeeFirstName and employeeLastName is equal to firstName and lastName
      const employee = this.employeeData.find(data => data.employeeFirstName === firstName && data.employeeLastName === lastName);

      if (!employee) {
        reject('Employee not found');
        return;
      }

      this.schedulerParticipant = {
        schedulerId: this.data.documentTerm.id,
        employeeId: employee.employeeId,
      };

      resolve(this.schedulerParticipant);
    });
  }

  public save() {
    delete this.masterDocumentTerm.value.schedulerEmail;

    // check if form is valid
    if (!this.masterDocumentTerm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in the required fields',
      });
    } else {
      const newDocumentTerm = lodash.cloneDeep(this.documentTerm);

      Object.keys(this.masterDocumentTerm.getRawValue()).forEach(key => {
        newDocumentTerm[key] = this.masterDocumentTerm.getRawValue()[key];
      });

      if (this.participants.data.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please add a participant',
        });
        return;
      }
      delete newDocumentTerm['schedulerEmail'];

      this.masterDocumentTermService.updateMasterDocumentTerm(newDocumentTerm).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this._dialog.close(res);
      });
    }
  }

  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
