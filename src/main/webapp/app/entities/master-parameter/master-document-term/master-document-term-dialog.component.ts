import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { MessageService } from 'primeng/api';
import { MasterCompanyTypeDialogComponent } from '../master-company-type/master-company-type-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDocumentTerm, SchedulerType } from './master-document-term.model';
import { BehaviorSubject, Observable } from 'rxjs';
import * as lodash from 'lodash';
import { MasterDocumentTermService } from './master-document-term.service';

@Component({
  selector: 'jhi-master-document-term-dialog',
  templateUrl: './master-document-term-dialog.component.html',
  styleUrls: ['../master-company-type/master-company-type.css'],
})
export class MasterDocumentTermDialogComponent implements OnInit {
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
      schedulerEmail: [this.data.documentTerm.emailTo],
      schedulerType: [this.data.documentTerm.interval, Validators.required],
      daysTo: [{ value: this.data.documentTerm.daysTo, disabled: this.data.documentTerm.interval === 'DAILY' }, Validators.required],
      status: [this.data.documentTerm.statusId, Validators.required],
    });

    if (this.data.documentTerm.interval === 'WEEKLY') {
      this._spesificDateLov.next(this.weeklySpesificDate);
    } else {
      this._spesificDateLov.next(this.monthlySpesificDate);
    }
  }

  ngOnInit(): void {
    this.masterDocumentTerm.get('schedulerType').valueChanges.subscribe(value => {
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
  }

  public save() {
    // check if form is valid
    if (!this.masterDocumentTerm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in the required fields',
      });
    } else {
      const newDocumentTerm = lodash.cloneDeep(this.documentTerm);

      Object.keys(this.masterDocumentTerm.value).forEach(key => {
        newDocumentTerm[key] = this.masterDocumentTerm.value[key];
      });

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

  // cancel confrimation dialog
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
