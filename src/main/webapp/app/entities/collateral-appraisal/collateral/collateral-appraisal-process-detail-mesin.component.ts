import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventManager } from 'app/core/util/event-manager.service';
import { CollateralProperty, ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import lodash from 'lodash';
import { CollateralMachineDialogComponent } from './dialogs/collateral-machine-dialog.component';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-mesin',
  templateUrl: './collateral-appraisal-process-detail-mesin.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-mesin.css'],
})
export class CollateralAppraisalDetailProcessMesinComponent implements OnChanges {
  @Input()
  public collateralId: number;

  @Input()
  public collateralAppraisalId: number;

  public displayColumns: string[] = ['no', 'machineName', 'documentType', 'noDocument', 'date', 'from', 'amount', 'action'];
  public items: ICollateralProperty[];
  constructor(public dialog: MatDialog, private collateralPropertyService: CollateralPropertyService, private eventManager: EventManager) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateralId'] && changes['collateralAppraisalId']) {
      this.getData();
    }
  }

  private getData(): void {
    this.collateralPropertyService.queryFilterBy({ idCollateral: this.collateralId }).subscribe(res => {
      this.items = lodash.filter(res.body, function (o) {
        return o.propertyType === CollateralPropertyType.MACHINE;
      });
    });
  }

  public openDialog(property: ICollateralProperty = null): void {
    const predicate = {
      width: '80vw',
    };

    // init variable collateralproperty
    if (property) {
      predicate['data'] = { collateralProperty: property };
    } else {
      const colProp: ICollateralProperty = new CollateralProperty();
      colProp.collateralId = this.collateralId;
      colProp.propertyType = CollateralPropertyType.MACHINE;
      predicate['data'] = { collateralProperty: colProp };
    }

    const dialogRef = this.dialog.open(CollateralMachineDialogComponent, predicate);

    dialogRef.afterClosed().subscribe(res => {
      this.getData();
    });
  }
}
