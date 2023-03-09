import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentType, IDocumentType } from './document-type.model';
import { DocumentTypeService } from './document-type.service';
import { MessageService } from 'primeng/api';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import lodash from 'lodash';

@Component({
  selector: 'jhi-document-type-view',
  templateUrl: './document-type-view.component.html',
  styleUrls: ['./document-type.css'],
})
export class DocumentTypeViewComponent extends AbstractEntityMaterialComponent<IDocumentType> implements OnInit {
  public documentType: IDocumentType;
  public parentIdValue: IDocumentType[];
  public idDocumentType: any = [];

  id: any;
  public docTypeValue = ['DOC_IDD', 'DOC_CP'];
  public statusValue = ['Active', 'Non Active'];
  public categoryValue = ['A', 'B', 'C'];

  constructor(
    private documentTypeService: DocumentTypeService,
    private formBuilder: FormBuilder,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    protected messageService: MessageService,
    private applicationStateLogService: ApplicationStateLogService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(_snackBar, documentTypeService);
  }

  ngOnInit(): void {
    this.documentType = new DocumentType();

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadDataAll(this.id);
    this.selectParentIdValue();
  }

  loadDataAll(id) {
    this.documentTypeService.find(id).subscribe(response => {
      this.documentType = response.body;
    });
  }

  public selectParentIdValue() {
    this.documentTypeService
      .query({
        page: this.page,
        size: 9999,
        sort: ['id', 'asc'],
      })
      .subscribe(res => {
        this.parentIdValue = res.body;
      });
  }

  previousState(): void {
    window.history.back();
  }
}
