import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IMasterProductParameter } from './master-product-parameter.model';
import { MasterProductParameterService } from './master-product-parameter.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MessageService } from 'primeng/api';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ProductCategoryService } from 'app/entities/product-category/product-category.service';
import { ProductClassificationService } from 'app/entities/product-classification/product-classification.service';
import { IProductClassification, ProductClassification } from 'app/entities/product-classification/product-classification.model';
import { CategoryProductDialogComponent } from './category-product-dialog/category-product-dialog.component';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
// import { CategoryProductDialogEditComponent } from './category-product-dialog/category-product-dialog-edit.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY/MM/DD',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY/MM/DD',
  },
};

@Component({
  selector: 'jhi-master-product-parameter-dialog',
  templateUrl: './master-product-parameter-dialog.component.html',
  styleUrls: ['./master-product.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MasterProductParameterDialogComponent implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  public statuses: any;
  public listGeneralLov: any;
  public productParameter: IMasterProductParameter;
  // public productClasification: IProductClassification;
  public view: boolean;
  public displayColumns: string[] = ['no', 'productName', 'category', 'action'];
  public displayedColumnsExpand = [...this.displayColumns, 'expand'];
  public productCategoryList = [];
  public categoryListGrid = [];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      productParameter: IMasterProductParameter;
      view: false;
    },
    private _dialog: MatDialogRef<MasterProductParameterDialogComponent>,
    protected productParameterService: MasterProductParameterService,
    protected productCategoryService: ProductCategoryService,
    protected productClasificationService: ProductClassificationService,
    protected messageService: MessageService,
    protected dialog: MatDialog
  ) {
    _dialog.disableClose = true;
    this.productParameter = this.data.productParameter;

    this.view = this.data.view;
  }
  ngOnInit(): void {
    this.loadAll();
  }
  public getFacilityType() {
    this.productParameterService.getLovFacilityType().subscribe(res => {
      this.listGeneralLov = res.body;
    });
  }

  public getProductClasification() {
    this.productClasificationService
      .queryFilterBy({
        idProduct: this.productParameter.id,
        page: 0,
        size: 9999,
        sort: ['asc'],
      })
      .subscribe(ress => {
        // this.productCategoryList = res.body;
        this.categoryListGrid = ress.body;
      });
  }

  public productClasification: IProductClassification;
  public openDialogCategory(element: IProductClassification = null): void {
    let predicate: IProductClassification;
    predicate = new ProductClassification();
    // const data = this.productParameterService.paramTypeId.subscribe((message: any) => {
    //   this.typeID = message;
    // });
    // predicate.productTypeId = this.typeID;

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(CategoryProductDialogComponent, {
      width: '100%',
      data: {
        productClasification: predicate,
        productId: this.productParameter,
      },
    });
    dialogRef.afterClosed().subscribe((res: IProductClassification) => {
      if (res) {
        if (res.id) {
          this.productClasificationService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.productClasificationService.create(res).subscribe(_res => {
            this.loadAll();
          });
        }
      }
    });
  }

  // public openDialogAddCategory(param: IMasterProductParameter): void {
  //   const dialogRef = this.dialog.open(CategoryProductDialogEditComponent, {
  //     width: '100%',
  //     data: {
  //       productClasification: this.productParameter.id,
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((res: IProductClassification) => {
  //     if (res) {
  //       if (res.id) {
  //         this.productClasificationService.create(res).subscribe(_res => {
  //           // this.loadAll();
  //         });
  //       }
  //     }
  //   });
  // }

  public loadAll() {
    this.getFacilityType();
    this.getProductClasification();
  }

  private _showNotification(severity: string, message: string): void {
    const severityCaptitalized = severity.charAt(0).toUpperCase() + severity.slice(1);
    this.messageService.add({ severity, summary: severityCaptitalized, detail: message, life: 3000 });
  }

  private _validateProcess(toValidate: object) {
    let isAllTrue = true;
    for (const key in toValidate) {
      if (Object.prototype.hasOwnProperty.call(toValidate, key)) {
        if (toValidate[key] === false) {
          isAllTrue = false;
          break;
        }
      }
    }
    return isAllTrue;
  }

  public checkMustValidated() {
    const mustValidate = {
      productCode: true,
      description: true,
      facilityType: true,
      introDate: true,
      discontinueDate: true,
      dateDiscontinue: true,
    };

    if (!this.productParameter.description) {
      this._showNotification('error', 'Masukkan Description terlebih dahulu');
      mustValidate.description = false;
    }
    if (!this.productParameter.code) {
      this._showNotification('error', 'Masukkan Product Code terlebih dahulu');
      mustValidate.productCode = false;
    }
    if (!this.productParameter.productTypeId) {
      this._showNotification('error', 'Masukkan Facility Type terlebih dahulu');
      mustValidate.facilityType = false;
    }
    if (!this.productParameter.introDate) {
      this._showNotification('error', 'Masukkan Intro Date terlebih dahulu');
      mustValidate.introDate = false;
    }
    if (!this.productParameter.discontinueDate) {
      this._showNotification('error', 'Masukkan Discontinue Date terlebih dahulu');
      mustValidate.discontinueDate = false;
    }
    if (this.productParameter.discontinueDate < this.productParameter.introDate) {
      this._showNotification('error', 'Value Discontinue Date Kurang Dari Intro Date');
      mustValidate.dateDiscontinue = false;
    }

    return this._validateProcess(mustValidate);
  }

  public validateMasterProduct(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Master Product Validated');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateMasterProduct().then(() => resolve(true));
    });
  }

  public save() {
    if (this.productParameter.id) {
      // update
      this.productParameterService.update(this.productParameter).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.productParameterService.create(this.productParameter).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this._dialog.close(res.body);
      });
    }
  }

  // Delete Confirmation
  public onDelete(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '40vw',
      data: {
        title: 'Delete Category',
        message: 'Are you sure to delete ' + element.categoryDescription,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.productClasificationService.delete(element.id).subscribe(() => {
          this.loadAll();
        });
        // this.productClasificationService.delete(res.id).subscribe(_res => {
        //   this.loadAll();
        // });
      }
    });
  }

  public onSave(): void {
    this.validate().then(() => this.save());
  }

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20vw',
      data: {
        title: '',
        message: 'Are you sure to cancel?',
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
