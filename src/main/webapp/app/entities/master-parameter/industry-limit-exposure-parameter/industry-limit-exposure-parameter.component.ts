import { Component, OnInit } from '@angular/core';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import lodash, { size } from 'lodash';
import { IIndustryLimitExposureParameter, IndustryLimitExposureParameter } from './industry-limit-exposure-parameter.model';
import { IndustryLimitExposureParameterService } from './industry-limit-exposure-parameter.service';
import { MatDialog } from '@angular/material/dialog';
import { MasterParameterIndustryLimitExposureDialogComponent } from './industry-limit-exposure-parameter-dialog.component';
import { MasterParameterIndustryLimitExposureDownloadComponent } from './industry-limit-exposure-parameter-download.component';
import { firstValueFrom } from 'rxjs';
import * as FileSaver from 'file-saver';
import { MasterParameterIndustryLimitExposureUploadComponent } from './industry-limit-exposure-parameter-upload.component';

@Component({
  selector: 'jhi-industry-limit-exposure-parameter',
  templateUrl: './industry-limit-exposure-parameter.component.html',
  styleUrls: ['./industry-limit-exposure-parameter.css'],
})
export class MasterParameterIndustryLimitExposureComponent
  extends AbstractEntityMaterialComponent<IIndustryLimitExposureParameter>
  implements OnInit
{
  public displayColumns: string[] = [
    'no',
    'industryCode',
    'industry',
    'limitPercentage',
    'limitNominal',
    'remainingBalance',
    'industryLimitExposure',
    'status',
    'actions',
  ];

  constructor(
    protected _snackBar: MatSnackBar,
    protected industryLimitExposureParameterService: IndustryLimitExposureParameterService,
    protected dialog: MatDialog
  ) {
    super(_snackBar, industryLimitExposureParameterService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }
  ngOnInit(): void {
    this.loadAll();
  }

  public loadAll(): void {
    this.industryLimitExposureParameterService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe({
        next: res => this.initDataForMatTable(res, res.headers),
        error: res => this.onError(res.message),
      });
  }

  public upload(): void {
    const dialogRef: any = this.dialog.open(MasterParameterIndustryLimitExposureUploadComponent, {
      width: '1024px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadAll();
    });
  }

  public async download(): Promise<void> {
    const dialogRef: any = this.dialog.open(MasterParameterIndustryLimitExposureDownloadComponent, {
      width: '300px',
    });
    const data: IIndustryLimitExposureParameter[] = (
      await firstValueFrom(
        this.industryLimitExposureParameterService.query({
          page: 0,
          size: 9999,
          sort: this.sortData(),
        })
      )
    ).body;
    await new Promise(f => setTimeout(f, 4000));
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(data); // Sale Data
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const result: Blob = new Blob([excelBuffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(result, 'master_exposure_export_' + new Date().getTime() + EXCEL_EXTENSION);

      dialogRef.close();
    });
  }

  public openDialog(element: IIndustryLimitExposureParameter = new IndustryLimitExposureParameter()): void {
    let predicate: IIndustryLimitExposureParameter;
    // predicate = new IndustryLimitExposureParameter();

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MasterParameterIndustryLimitExposureDialogComponent, {
      width: '100%',
      data: {
        industryLimitExposure: element,
      },
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (res.id) {
          console.log('edit', res);
          this.industryLimitExposureParameterService.update(res).subscribe(_res => {
            this.page = 0;
            this.loadAll();
          });
        } else {
          console.log('create', res);
          this.industryLimitExposureParameterService.create(res).subscribe(_res => {
            this.loadAll();
          });
        }
      }
    });
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  previousState(): void {
    window.history.back();
  }
}
