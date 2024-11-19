import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { FACILITY_TYPE } from '../../../../shared/constants/base.constants';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { DebtorDataSlikUploadComponent } from './debtor-data-silk-upload/debtor-data-slik-upload.component';
import { ActivatedRoute } from '@angular/router';
import { left } from '@popperjs/core';
import { toLower } from 'lodash';
import { PartySlikService } from 'app/entities/party-slik/party-slik.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'jhi-debtor-data-slik-summary-debitur-dialog',
  templateUrl: './debtor-data-slik-summary-debitur-dialog.component.html',
  styleUrls: ['../slik.css'],
})
export class DebtorDataSlikSummaryDebiturDialogComponent extends AbstractEntityMaterialComponent<IPartySlik> implements OnInit {
  public partySlik: IPartySlik;
  public partyCif: IPartyCif;
  public mode: any;
  public cif: string;
  public viewData: any;
  public selectedDataId: any;
  public facility_types: any = FACILITY_TYPE;
  public bulan: any = [
    { id: 1, name: 'Jan' },
    { id: 2, name: 'Feb' },
    { id: 3, name: 'Mar' },
    { id: 4, name: 'Apr' },
    { id: 5, name: 'Mei' },
    { id: 6, name: 'Jun' },
    { id: 7, name: 'Jul' },
    { id: 8, name: 'Agu' },
    { id: 9, name: 'Sep' },
    { id: 10, name: 'Okt' },
    { id: 11, name: 'Nov' },
    { id: 12, name: 'Des' },
  ];

  public displayColumns: string[] = [
    'no',
    'collateralType',
    'ownershipDocument',
    'collateralValue',
    'collateralValueNJOP',
    'collateralValueIndependentAppraisal',
    'banksAppraisalDate',
    'independentAppraisalDate',
  ];

  public collateralInfoList: any = [];
  public totalCollateralValue = 0;
  public totalNJOP = 0;
  public totalMarketValue = 0;
  public pageLength: String;
  public dataSource = [];

  id: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      selectedDataId: any;
      viewData: any;
      object: IPartyCif;
      partySlik: IPartySlik;
      mode: string;
      cif: string;
    },
    public partySlikService: PartySlikService,
    protected _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _dialog: MatDialogRef<DebtorDataSlikSummaryDebiturDialogComponent>,
    protected activatedRoute: ActivatedRoute
  ) {
    super(_snackBar, partySlikService);
    this.loading = false;
    this.itemsPerPage = 10;
    this.page = 0;
    this.selectedDataId = this.data.selectedDataId;
    this.viewData = this.data.viewData;
    this.partyCif = this.data.object;
    this.partySlik = this.data.partySlik;
    this.mode = this.data.mode;
    this.cif = this.data.cif;
  }
  ngOnInit(): void {
    this.dataSource = this.formattedDataSource;
    this.paginatorLength = this.countPageLength(this.dataSource);
    this.totalCollateralValue = this.countTotalCollateralValue(this.dataSource);
    this.totalNJOP = this.countTotalNJOP(this.dataSource);
    this.totalMarketValue = this.countTotlMarketValue(this.dataSource);
  }

  get formattedDataSource() {
    const data = JSON.parse(this.data.partySlik.attributes.partySlikCollaterals) || [];

    const columnsToBeNumerize = ['collateralIdrMio', 'nilaiNJOP', 'nilaiPenilai'];
    data.map(item => {
      columnsToBeNumerize.map(column => {
        item[column] = parseInt(item[column].replace(/\./g, ''), 10) || 0;
      });
    });

    return data;
  }

  public countPageLength(element: any): number {
    let totalCount: number;
    totalCount = 0;
    if (element) {
      for (let index = 0; index < element.length; index++) {
        totalCount = totalCount + 1;
      }
    }
    return totalCount;
  }

  protected postLoadDataLazy(): void {
    this.collateralInfoList;
  }

  public numberInputChanged(value: string): number {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  public inputChanged(value: string): string {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
  }

  public save(): void {
    this._dialog.close(this.partySlik);
  }

  public openDialog(): void {
    const predicate: object = {
      width: '80vw',
      data: {
        cif: this.data.cif,
      },
    };

    const dialogRef = this.dialog.open(DebtorDataSlikUploadComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.partySlik = res.body[0];
        this.partySlik.attributes = [];
        this.partySlik.limit = Number(this.partySlik.limit.toString().replace(/\./g, ''));
        this.partySlik.rate = Number(this.partySlik.rate.toString().replace(' %', ''));
        this.partySlik.tenor = Number(this.partySlik.tenor.toString().replace(' bulan', ''));
        this.partySlik.outstanding = Number(this.partySlik.outstanding);
        this.partySlik.collateralIdrMio = Number(this.partySlik.collateralIdrMio);
        this.partySlik.restructureFrequency = Number(res.body[0].frekuensiRestrukturasi);
        this.partySlik.arrearsFrequency = Number(res.body[0].frekuensiTunggakan);
        this.partySlik.arrearsBase = Number(res.body[0].tunggakanPokok);
        this.partySlik.arrearsInterest = Number(res.body[0].tunggakanBunga);
        this.partySlik.lastCollectability = Number(res.body[0].kolTerakhir.substring(0, 1));
        this.partySlik.worstCollectability = Number(res.body[0].kolTerburuk.substring(0, 1));
        this.partySlik.collateralType = this.partySlik.collateralType == null ? '' : this.partySlik.collateralType;
        this.partySlik.facilityType = this.partySlik.facilityType == null ? '' : this.partySlik.facilityType;
        this.partySlik.attributes = {};
        this.partySlik.period = this.partySlik.period == null ? '' : this.partySlik.period;
      }
    });
  }

  onNoClick(): void {
    this._dialog.close();
  }

  // Count Total Collateral Value
  public countTotalCollateralValue(element: any): number {
    let totalCollateralValue: number;
    totalCollateralValue = 0;
    if (element) {
      for (let i = 0; i < element.length; i++) {
        if (element[i].collateralIdrMio) {
          totalCollateralValue = totalCollateralValue + Number(element[i].collateralIdrMio);
        }
      }
    }
    return totalCollateralValue;
  }

  // Count Total NJOP
  public countTotalNJOP(element: any): number {
    let totalNJOP: number;
    totalNJOP = 0;
    if (element) {
      for (let i = 0; i < element.length; i++) {
        if (element[i].nilaiNJOP) {
          totalNJOP = totalNJOP + Number(element[i].nilaiNJOP);
        }
      }
    }
    return totalNJOP;
  }

  // Count Total Market Value
  public countTotlMarketValue(element: any): number {
    let totalMarketValue: number;
    totalMarketValue = 0;
    if (element) {
      for (let i = 0; i < element.length; i++) {
        if (element[i].nilaiPenilai) {
          totalMarketValue = totalMarketValue + Number(element[i].nilaiPenilai);
        }
      }
    }
    return totalMarketValue;
  }
}
