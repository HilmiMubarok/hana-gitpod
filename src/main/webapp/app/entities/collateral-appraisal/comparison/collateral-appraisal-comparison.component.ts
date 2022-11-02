import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { MatDialog } from '@angular/material/dialog';
import { CollateralAppraisalComparisonDialogComponent } from './collateral-appraisal-comparison-dialog.component';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';

@Component({
  selector: 'jhi-collateral-appraisal-comparison',
  templateUrl: './collateral-appraisal-comparison.component.html',
  styleUrls: ['./collateral-appraisal-comparison.css'],
})
export class CollateralAppraisalComparisonComponent implements OnChanges {
  @Input()
  public collateralId: number;
  public displayedColumns: string[] = ['no', 'description', 'action'];

  public collateralProperties: ICollateralProperty[];

  constructor(public dialog: MatDialog, private collateralPropertyService: CollateralPropertyService) {
    this.collateralProperties = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateralId']) {
      this.getCollateralPropertyByCollateralId(this.collateralId);
    }
  }

  private getCollateralPropertyByCollateralId(id: number): void {
    this.collateralPropertyService
      .queryFilterBy({ idCollateral: id, page: 0, size: 9999, idPropertyType: CollateralPropertyType.COMPARISON })
      .subscribe(res => {
        this.collateralProperties = res.body;
      });
  }

  public edit(param: ICollateralProperty): void {
    const dialogRef = this.dialog.open(CollateralAppraisalComparisonDialogComponent, {
      data: { collateralId: this.collateralId, collateralProperty: param },
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
      data: { collateralId: this.collateralId },
      width: '80vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCollateralPropertyByCollateralId(this.collateralId);
      }
    });
  }
}
