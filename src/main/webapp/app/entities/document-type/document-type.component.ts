import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { IDocumentType, DocumentType } from './document-type.model';
import { DocumentTypeService } from './document-type.service';
import { MatTableDataSource } from '@angular/material/table';
import lodash from 'lodash';

@Component({
  selector: 'jhi-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.css'],
})
export class DocumentTypeComponent extends AbstractEntityMaterialComponent<IDocumentType> implements OnInit {
  public displayColumns: string[] = ['no', 'description', 'category', 'statusDescription', 'action'];
  public displayedColumnsExpand = [...this.displayColumns, 'expand'];
  public clickedChip: Object;
  public iconTimeline: any;
  public docTypeValue = [];
  public documentType: IDocumentType = new DocumentType();
  public parentIdValue: IDocumentType[];
  public isView: Boolean;

  constructor(
    private documentTypeService: DocumentTypeService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService
  ) {
    super(_snackBar, documentTypeService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
    this.clickedChip = {
      id: '',
      label: '',
    };
    this.iconTimeline = faTimeline;
    this.items = [];
    this.isView = true;
    this.documentType.rootId = '';
    this.parentIdValue = [];
    this.docTypeValue = [];
  }

  ngOnInit(): void {
    this.selectParentIdValue();
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public doSearch(value: string): void {
    if (value !== '') {
      this.loadAll();
      this.isView = false;
    } else {
      this.documentType.parentId = '';
      this.parentIdValue = [];
      this.items = [];
      this.isView = true;
    }
    console.log('cccc', this.documentType.parentId);

    console.log('valuess', value);
  }

  private loadAll(): void {
    this.loading = true;
    this.documentTypeService
      .filterTableData({
        lvl2: true,
        parentId: this.documentType.parentId,
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id', 'asc'],
      })
      .subscribe({
        next: (res: HttpResponse<IDocumentType[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  public selectParentIdValue() {
    this.documentTypeService
      .query({
        // lvl2: true,
        sort: ['asc'],
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.docTypeValue = res.body.filter(obj => obj.parentId === null);
        if (this.documentType.rootId !== '') {
          for (let i = 0; i < this.docTypeValue.length; i++) {
            this.documentType.rootId = this.docTypeValue[i].id;
            this.documentType.rootDescription = this.docTypeValue[i].description;
          }
        }
      });
  }

  public changeDocumentType(event: any): void {
    this.documentType.rootId = '';
    if (event.value === this.documentType.rootId) {
      if (event.value !== '') {
        this.items = [];
        this.documentTypeService.listDocumentType(event.value).subscribe(res => {
          this.parentIdValue = res.body;
          console.log('gggg', this.parentIdValue);
        });
        this.isView = true;
      } else {
        this.parentIdValue = [];
        this.items = [];
        this.isView = true;

        console.log('zxzxzxz', this.parentIdValue);
      }
    }
    console.log('zz', this.documentType.rootId);
  }

  public findDocumentType(): void {
    if (this.documentType.rootId !== '') {
      console.log('xxxxx', this.documentType.rootId);
      if (this.parentIdValue.length > 0) {
        for (let i = 0; i < this.parentIdValue.length; i++) {
          this.documentType.parentId = this.parentIdValue[i].id;
          this.documentType.parentDescription = this.parentIdValue[i].description;
        }
        console.log('parent', this.documentType.parentId);
        console.log('parent dsc', this.documentType.parentDescription);
      }
    }
  }

  previousState(): void {
    window.history.back();
  }
}
