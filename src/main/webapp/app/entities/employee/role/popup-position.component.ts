import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  DOCUMENT_TYPE_COLLATERAL_MACHINE,
  DOCUMENT_TYPE_COLLATERAL_PROPERTY,
  DOCUMENT_TYPE_COLLATERAL_VEHICLE,
  DOCUMENT_TYPE_APPRAISAL,
} from 'app/shared/constants/base.constants';
// import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
// import { ICollateral } from '../collateral/collateral.model';
// import { StorageService } from '../storage/storage.service';
// import { Document, IDocument } from './document.model';
import moment from 'moment';
import { AccountService } from 'app/core/auth/account.service';
// import { Document, IDocument } from '../document/document.model';
// import { DocumentUploadDialogComponent } from '../document/document-upload-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { Document, IDocument } from 'app/entities/document/document.model';
import { StorageService } from '../../storage/storage.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { IEmployee } from '../employee.model';
import { PositionTypeService } from 'app/entities/position-type/position-type.service';
import { Position } from 'app/entities/position/position.model';
import { InternalService } from 'app/entities/internal/internal.service';
// import { ISurveyBatch } from './survey-batch.model';

@Component({
  selector: 'jhi-popup-position',
  templateUrl: './popup-position.component.html',
  styleUrls: ['./popup-position.scss'],
})
export class PopupPositionComponent implements OnInit {
  public datas = [];
  public files: File[] = [];
  public file: File;
  public document: IDocument;
  public documentTypes: any;
  public object: ICollateral | ICollateralAppraisal;
  public multiple: Boolean = false;
  public indeks = 0;
  label: string;
  positionType: any;
  desc: {
    id: string;
    description: string;
  }[];
  postiion: any;
  branchtype: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { idx: string },
    private positionTypeService: PositionTypeService,
    private internalService: InternalService,
    private storageService: StorageService,
    private _dialog: MatDialogRef<PopupPositionComponent>,
    private _snackBar: MatSnackBar,
    private accountService: AccountService,
    protected http?: HttpClient
  ) {
    this.document = new Document();
    this.file = null;
  }

  ngOnInit(): void {
    console.log('this dialog', this.data);
    if (this.data.idx) {
      this.label = 'Update Position';
    } else {
      this.label = 'Add New Position';
    }
    this.postiion = new Position();
    this.postiion = this.data;
    this.desc = [
      {
        id: 'ACTIVE',
        description: 'Active',
      },
      {
        id: 'NON_ACTIVE',
        description: 'Non Active',
      },
      {
        id: 'DRAFT',
        description: 'Draft',
      },
    ];

    this.positionTypeService
      .query({
        page: 0,
        size: 999,
      })
      .subscribe(response => {
        this.positionType = response.body;
        console.log('this.positionType', this.positionType);
      });

    this.internalService
      .query({
        page: 0,
        size: 999,
      })
      .subscribe(response => {
        this.branchtype = response.body;
      });
  }

  public choosedPosition(value): void {
    console.log('value', value);
    for (let a = 0; a < this.positionType.length; a++) {
      if (this.positionType[a].id === value) {
        this.postiion.positionTypeDescription = this.positionType[a].title;
      }
    }
  }

  public chossedStatus(value): void {
    console.log('value', value);
    for (let a = 0; a < this.desc.length; a++) {
      if (this.desc[a].id === value) {
        this.postiion.statusDescription = this.desc[a].description;
      }
    }
  }

  public choosedInternal(value): void {
    console.log('value', value);
    for (let a = 0; a < this.branchtype.length; a++) {
      if (this.branchtype[a].id === value) {
        this.postiion.internalName = this.branchtype[a].name;
      }
    }
  }

  public save(): void {
    console.log('save popup', this.postiion);
    this._dialog.close(this.postiion);
  }

  public close(): void {
    this._dialog.close();
  }
}
