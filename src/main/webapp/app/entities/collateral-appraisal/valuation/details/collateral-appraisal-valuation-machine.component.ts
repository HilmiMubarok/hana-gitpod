import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralAppraisalValuationMachineDialogComponent } from '../dialogs/collateral-appraisal-valuation-machine-dialog.component';

@Component({
  selector: 'jhi-collateral-appraisal-valuation-machine',
  templateUrl: './collateral-appraisal-valuation-machine.component.html',
})
export class CollateralAppraisalValuationMachineComponent implements OnChanges {
  @Input() collateral: ICollateral;

  public collateralProperties: ICollateralProperty[];
  public displayedColumns: string[] = [
    'no',
    'machineName',
    'brand',
    'madeBy',
    'mfgDate',
    'marketValue',
    'liquidVal',
    'percentage',
    'action',
  ];
  constructor(public dialog: MatDialog, private collateralPropertyService: CollateralPropertyService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral']) {
      this.loadData(this.collateral);
    }
  }

  public openDialog(colProp: ICollateralProperty = null): void {
    const predicate: object = {
      width: '80vw',
      data: { collateralProperty: colProp },
    };
    const dialogRef = this.dialog.open(CollateralAppraisalValuationMachineDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadData(this.collateral);
      }
    });
  }

  public loadData(collateral: ICollateral): void {
    this.collateralPropertyService.queryFilterBy({ idCollateral: collateral.id }).subscribe(res => {
      this.collateralProperties = res.body;
    });
  }
}
