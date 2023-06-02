import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IProductCategory, ProductCategory } from './product-category.model';
import { ProductCategoryService } from './product-category.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ProductCategoryDialogComponent } from './product-category-dialog.component';
import { ProductCategoryEditDialogComponent } from './product-category-edit-dialog.component';

@Component({
  selector: 'jhi-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['../master-parameter/master-product/master-product.css'],
})
export class ProductCategoryComponent extends AbstractEntityMaterialComponent<IProductCategory> implements OnInit {
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  public displayColumns: string[] = ['no', 'code', 'description', 'status', 'action'];
  public displayedColumnsExpand = [...this.displayColumns, 'expand'];

  public productCategory: IProductCategory;
  public listProductCategories;
  // public typeID: string;
  constructor(
    protected productCategoryService: ProductCategoryService,
    protected _snackbar: MatSnackBar,
    protected parseLinks: ParseLinks,
    protected alertService: AlertService,
    public accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: BaseDataUtils,
    protected router: Router,
    protected eventManager: EventManager,
    protected messageService: MessageService,
    protected modalService: NgbModal,
    protected confirmationService: ConfirmationService,
    protected reportUtils: ReportUtilService,
    protected dialog: MatDialog
  ) {
    super(_snackbar, productCategoryService);

    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.items = [];
    this.listProductCategories = [];
  }
  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProductCategory) {
    return item.id;
  }
  private loadAll(): void {
    this.loading = true;

    this.productCategoryService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id', 'asc'],
      })
      .subscribe({
        next: (res: HttpResponse<IProductCategory[]>) => {
          console.log('res', res);
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public openEditDialog(element: IProductCategory = null): void {
    let predicate: IProductCategory;
    predicate = new ProductCategory();

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(ProductCategoryEditDialogComponent, {
      width: '100%',
      data: {
        productParameter: predicate,
      },
    });
    dialogRef.afterClosed().subscribe((res: IProductCategory) => {
      console.log('res', res);
      if (res) {
        if (res.id) {
          this.productCategoryService.update(res).subscribe(_res => {
            this.loadAll();
          });
        }
      }
    });
  }

  public openDialog(element: IProductCategory = null): void {
    let predicate: IProductCategory;
    predicate = new ProductCategory();

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(ProductCategoryDialogComponent, {
      width: '100%',
      data: {
        productParameter: predicate,
      },
    });
    dialogRef.afterClosed().subscribe((res: IProductCategory) => {
      console.log('res', res);
      if (res) {
        if (res.id) {
          this.productCategoryService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.productCategoryService.create(res).subscribe(_res => {
            this.loadAll();
          });
        }
      }
    });
  }

  get productCategories() {
    return this.items;
  }

  set productCategories(productCategory: IProductCategory[]) {
    this.items = productCategory;
  }

  downloadFile(name: string) {
    this.itemService
      .process(
        {
          fileName: name,
          header: 'id',
          fields: 'id',
        },
        { processName: 'buildDownloadFile' }
      )
      .subscribe(() => {
        this.itemService.downloadFile(name).subscribe(res => {
          const blobFileName = name;
          const blob = new Blob([res.body], { type: 'application/octet-stream' });
          saveAs(blob, blobFileName);
        });
      });
  }

  print() {
    this.reportUtils.viewFile('/api/report/ProductCategory/pdf', {});
  }

  previousState(): void {
    window.history.back();
  }
}
