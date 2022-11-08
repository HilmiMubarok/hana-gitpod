import { Component, Input, OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { MatDialog } from '@angular/material/dialog';
import { CollateralAppraisalComparisonDialogComponent } from './collateral-appraisal-comparison-dialog.component';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CollateralAppraisalService } from '../collateral-appraisal.service';
import { ICollateralAppraisal } from '../collateral-appraisal.model';

@Component({
  selector: 'jhi-collateral-appraisal-comparison',
  templateUrl: './collateral-appraisal-comparison.component.html',
  styleUrls: ['./collateral-appraisal-comparison.css'],
})
export class CollateralAppraisalComparisonComponent implements OnChanges {
  @Input() collateralAppraisal: ICollateralAppraisal;
  @Input()
  public collateralId: number;
  public displayedColumns: string[] = ['no', 'description', 'action'];
  public dataCollateralAppraisal: ICollateralAppraisal;
  public collateralProperties: ICollateralProperty[];

  constructor(
    public dialog: MatDialog,
    private collateralPropertyService: CollateralPropertyService,
    private collateralAppraisalService: CollateralAppraisalService
  ) {
    this.collateralProperties = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataCollateralAppraisal = changes.collateralAppraisal.currentValue;
    if (changes['collateralId']) {
      this.getCollateralPropertyByCollateralId(this.collateralId);
    }
  }

  private getCollateralPropertyByCollateralId(id: number): void {
    this.collateralPropertyService
      .queryFilterBy({ idCollateral: id, page: 0, size: 9999, idPropertyType: CollateralPropertyType.COMPARISON })
      .subscribe(res => {
        this.collateralProperties = res.body;
        this.collateralAppraisalService.totalDataComparison = res.body;
      });
  }

  public edit(param: ICollateralProperty): void {
    const dialogRef = this.dialog.open(CollateralAppraisalComparisonDialogComponent, {
      data: { collateralId: this.collateralId, collateralProperty: param, collateralAppraisal: this.dataCollateralAppraisal },
      width: '80vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCollateralPropertyByCollateralId(this.collateralId);
      }
    });
  }

  public deleteCpRealEstate(element): void {
    this.collateralPropertyService.delete(element.id).subscribe(() => {
      this.getCollateralPropertyByCollateralId(this.collateralId);
    });
  }

  public openDialog() {
    const dialogRef = this.dialog.open(CollateralAppraisalComparisonDialogComponent, {
      data: { collateralId: this.collateralId, collateralAppraisal: this.dataCollateralAppraisal },
      width: '80vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCollateralPropertyByCollateralId(this.collateralId);
      }
    });
  }
}
