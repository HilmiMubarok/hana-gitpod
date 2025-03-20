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
import { CredamService } from 'app/entities/dppk-finalize/credam.service';
import { Router } from '@angular/router';
import moment from 'moment';

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
  public isCredamOnDppkFinalize = false;

  constructor(
    private dialog: MatDialog,
    private uomService: UomService,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      mainData: IMainFacility;
      creditProposal: ICreditProposal;
    },
    private _dialog: MatDialogRef<MainFacilityDialogComponent>,
    private credamService: CredamService,
    private router: Router
  ) {
    if (this.data.creditProposal.statusId === 'DRAFT') {
      _dialog.disableClose = true;
      _dialog.backdropClick().subscribe(_ => {
        this.openCancelDialog();
      });
    }
    this.mainFacility = data.mainData;
    this.dataItem = data.creditProposal;
  }

  ngOnInit(): void {
    if (this.dataItem) {
      this.isCredamOnDppkFinalize = this.checkIsCredamOnDPPKFinalize(this.dataItem);
    }
    this.loadCurrencyMeasure();
    this.myControlCurrency.disable();
    if (!this.mainFacility.startPeriodDate) {
      this.mainFacility.startPeriodDate = this.mainFacility.lastAgreementDate;
    }
    if (!this.mainFacility.endPeriodDate) {
      this.mainFacility.endPeriodDate = this.mainFacility.maturityDate;
    }
    console.log('ini date default ', this.mainFacility.startPeriodDate, 'end ', this.mainFacility.endPeriodDate);
  }

  public checkIsCredamOnDPPKFinalize(cp: ICreditProposal): boolean {
    const listOfPic = cp.listOfPic;

    return this.credamService.isCredamOnDppkFinalize(this.router, listOfPic);
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
    if (this.mainFacility.startPeriodDate) {
      this.mainFacility.startPeriodDate = this.setDate(this.mainFacility.startPeriodDate);
    }
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
  private setDate(data: any) {
    const staticDate = moment(new Date(data)).format().substring(0, 19) + 'Z';
    return staticDate;
  }
}
