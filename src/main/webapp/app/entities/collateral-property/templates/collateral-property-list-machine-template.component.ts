import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import lodash from 'lodash';
import { ICollateralProperty } from '../collateral-property.model';
import { CollateralPropertyService } from '../collateral-property.service';

@Component({
  selector: 'jhi-collateral-property-list-machine-template',
  templateUrl: './collateral-property-list-machine-template.component.html',
})
export class CollateralPropertyListMachineTemplateComponent implements OnChanges {
  @Output() openDialogEvent = new EventEmitter<ICollateralProperty>();

  private _dataSource: ICollateralProperty[];
  private _collateral: ICollateral;
  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProperty[]) {
    this._dataSource = param;
  }

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }
  public displayColumns: string[] = ['no', 'machineName', 'documentType', 'noDocument', 'date', 'from', 'amount', 'action'];

  constructor(private collateralPropertyService: CollateralPropertyService) {}

  public openDialog(element: ICollateralProperty): void {
    this.openDialogEvent.emit(element);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral']) {
      this.loadData(this.collateral);
    }
  }

  public reloadData(): void {
    this.loadData(this.collateral);
  }

  public loadData(collateral: ICollateral): void {
    console.log('load data terjadi');
    this.collateralPropertyService
      .queryFilterBy({ idCollateral: collateral.id, idPropertyType: CollateralPropertyType.MACHINE, size: 9999, page: 0 })
      .subscribe(res => {
        this.dataSource = lodash.filter(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.MACHINE;
        });
      });
  }

  public delete(element) {
    this.collateralPropertyService.delete(element.id).subscribe(() => {
      this.loadData(this.collateral);
    });
  }
}
