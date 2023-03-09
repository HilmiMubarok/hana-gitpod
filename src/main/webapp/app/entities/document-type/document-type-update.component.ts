import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDocumentType, DocumentType } from './document-type.model';
import { DocumentTypeService } from './document-type.service';
import { MessageService } from 'primeng/api';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';

@Component({
  selector: 'jhi-document-type-update',
  templateUrl: './document-type-update.component.html',
  styleUrls: ['./document-type.css'],
})
export class DocumentTypeUpdateComponent extends AbstractEntityBaseViewComponent<IDocumentType> implements OnInit {
  public documentType: IDocumentType;
  public parentIdValue: IDocumentType[];
  public idDocumentType = [];
  public statusValue = ['Active', 'Non Active'];
  public categoryValue = ['A', 'B', 'C'];
  public documentName: IDocumentType[];

  private id: string;

  post: any = '';
  organizationData: any = '';

  constructor(
    private documentTypeService: DocumentTypeService,
    private formBuilder: FormBuilder,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    protected messageService: MessageService,
    private applicationStateLogService: ApplicationStateLogService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(documentTypeService);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.loadData();
    this.selectParentIdValue();
  }

  loadData(): void {
    this.documentType = new DocumentType();
    this.documentTypeService.find(this.id).subscribe(result => {
      this.documentType = result.body;
    });
  }

  public selectParentIdValue() {
    this.documentTypeService
      .filterTableData({
        lvl2: true,
        sort: ['asc'],
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.parentIdValue = res.body;
      });
  }

  public submit() {
    if (this.documentType.id) {
      this.documentTypeService.update(this.documentType).subscribe(res => {
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
  }

  previousState(): void {
    window.history.back();
  }
}
