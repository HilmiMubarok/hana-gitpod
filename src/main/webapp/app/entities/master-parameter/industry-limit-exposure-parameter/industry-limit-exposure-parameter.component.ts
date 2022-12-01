import { Component, OnInit } from '@angular/core';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import lodash from 'lodash';
import { IIndustryLimitExposureParameter } from './industry-limit-exposure-parameter.model';
import { IndustryLimitExposureParameterService } from './industry-limit-exposure-parameter.service';
import { MatDialog } from '@angular/material/dialog';
import { MasterParameterIndustryLimitExposureDialogComponent } from './industry-limit-exposure-parameter-dialog.component';

@Component({
  selector: 'jhi-industry-limit-exposure-parameter',
  templateUrl: './industry-limit-exposure-parameter.component.html',
})
export class MasterParameterIndustryLimitExposureComponent
  extends AbstractEntityMaterialComponent<IIndustryLimitExposureParameter>
  implements OnInit
{
  public displayColumns: string[] = [
    'no',
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

  public openDialog(element: IIndustryLimitExposureParameter): void {
    const dialogRef = this.dialog.open(MasterParameterIndustryLimitExposureDialogComponent, {
      width: '100%',
      data: {
        industryLimitExposure: element,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.industryLimitExposureParameterService.update(res).subscribe(_res => {
          this.page = 0;
          this.loadAll();
        });
      }
    });
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }
}
