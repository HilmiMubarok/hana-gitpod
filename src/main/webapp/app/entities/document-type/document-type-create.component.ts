import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
// import { PartnerService } from './partner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { DocumentTypeService } from './document-type.service';
import { DOCUMENT_TYPE_PARAM } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { DocumentType, IDocumentType } from './document-type.model';

@Component({
  selector: 'jhi-document-type-create-create',
  templateUrl: './document-type-create.component.html',
  styleUrls: ['./document-type.css'],
})
export class DocumentTypeCreateComponent extends AbstractEntityMaterialComponent<IDocumentType> implements OnInit {
  public documentType: IDocumentType;
  // public docTypeValue = ['DOC_IDD', 'DOC_CP'];
  public statusValue = ['Active', 'Non Active'];
  public categoryValue = ['A', 'B', 'C'];
  public docTypeValue: IDocumentType[];
  private id: string;

  constructor(
    private documentTypeService: DocumentTypeService,
    private formBuilder: FormBuilder,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    protected messageService: MessageService,
    private applicationStateLogService: ApplicationStateLogService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(_snackBar, documentTypeService);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.documentType = new DocumentType();
    this.findValueById();
  }

  public submit() {
    this.documentTypeService.create(this.documentType).subscribe(res => {
      console.log('ini res', res.body);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Save Success',
      });

      if (res.body) {
        this.router.navigate(['/document-type']);
      }
    });
  }
  public parentIdValue: IDocumentType[];
  public documentName: IDocumentType[];
  public values = [];

  public findValueById() {
    this.documentTypeService.find(this.id).subscribe(result => {
      this.documentType.rootId = result.body.parentId;
      this.documentType.rootDescription = result.body.parentDescription;
      this.documentType.parentId = result.body.id;
      this.documentType.parentDescription = result.body.description;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
