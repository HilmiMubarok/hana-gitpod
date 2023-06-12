import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IMainFacility } from 'app/entities/main-facility/main-facility.model';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { UOM_TYPE } from 'app/shared/constants/base.constants';
import { map, Observable, startWith } from 'rxjs';
import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-main-facility-dialog',
  templateUrl: './main-facility-dialog.component.html',
  styleUrls: ['./main-facility-dialog.component.scss'],
})
export class MainFacilityDialogComponent implements OnInit {
  public myControlCurrency = new FormControl();
  public optionsCurrency: IUom[];
  public mainCcy: IUom;
  public filteredOptionsCurrency: Observable<IUom[]>;
  public amountCcy: IUom;
  public mainFacility: IMainFacility;
  public dataItem: ICreditProposal;

  constructor(
    private dialog: MatDialog,
    private uomService: UomService,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      mainData: IMainFacility;
      creditProposal: ICreditProposal;
    },
    private _dialog: MatDialogRef<MainFacilityDialogComponent>
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.mainFacility = data.mainData;
    this.dataItem = data.creditProposal;
  }

  ngOnInit(): void {
    this.loadCurrencyMeasure();
    this.myControlCurrency.disable();
  }

  filteredCurrency() {
    this.filteredOptionsCurrency = this.myControlCurrency.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterCurrency(name as string) : this.optionsCurrency.slice();
      })
    );
  }

  displayFnCurrency(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }

  private _filterCurrency(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsCurrency.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  private loadCurrencyMeasure(): void {
    this.uomService
      .queryFilterBy({
        idUomType: UOM_TYPE.CURRENCY,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.optionsCurrency = res.body;
        this.filteredCurrency();
        this.mainCcy = this.optionsCurrency.find(obj => obj.id === this.mainFacility.currency);
      });
  }

  getMainCcy() {
    this.mainFacility.currency = this.mainCcy.id;
  }

  public save(): void {
    this._dialog.close(this.mainFacility);
  }
  // public cancel(): void {
  //   this._dialog.close();
  // }

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
