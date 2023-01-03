import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { FACILITY_TYPE } from '../../../../shared/constants/base.constants';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { DebtorDataSlikUploadComponent } from './debtor-data-silk-upload/debtor-data-slik-upload.component';
import { ActivatedRoute } from '@angular/router';
import { left } from '@popperjs/core';
import { toLower } from 'lodash';

@Component({
  selector: 'jhi-debtor-data-slik-summary-debitur-dialog',
  templateUrl: './debtor-data-slik-summary-debitur-dialog.component.html',
  styleUrls: ['../slik.css'],
})
export class DebtorDataSlikSummaryDebiturDialogComponent {
  public partySlik: IPartySlik;
  public partyCif: IPartyCif;
  public mode: string;
  public cif: string;
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
  id: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      object: IPartyCif;
      partySlik: IPartySlik;
      mode: string;
      cif: string;
    },
    public dialog: MatDialog,
    private _dialog: MatDialogRef<DebtorDataSlikSummaryDebiturDialogComponent>,
    protected activatedRoute: ActivatedRoute
  ) {
    this.partyCif = this.data.object;
    this.partySlik = this.data.partySlik;
    this.mode = this.data.mode;
    this.cif = this.data.cif;
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  inputChanged(value) {
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
        this.partySlik.facilityType = 0;
        this.partySlik.attributes = {};
        this.partySlik.period = this.partySlik.period == null ? '' : this.partySlik.period;

        // const findPeriod = this.bulan.find(obj => obj.name === res.body[0].period.substring(3, 6));
        // this.partySlik.period = findPeriod.id;
      }

      // bank: "BANK CIMB NIAGA BANK CIMB NIAGA KPO "
      // caraRestrukturasi:""
      // collateralIdrMio:null
      // collateralType:null
      // denda:"0"
      // facilityType:"Kartu Kredit atau Kartu Pembiayaan Syariah"
      // frekuensiRestrukturasi:"0"
      // frekuensiTunggakan:"0"
      // keterangan:""
      // kolTerakhir:"1 (0 hari)"
      // kolTerburuk:"1 (0 hari)"
      // limit:"20.000.000"
      // outstanding:"0"
      // period:"12 Oktober 2020"
      // rate:" 2 % "
      // sebabMacet:""
      // tanggalMacet:""
      // tanggalRestrukturasiAkhir:""
      // tenor:"48 bulan"
      // tunggakanBunga:"0"
      // tunggakanPokok:"0"
    });
  }

  onNoClick(): void {
    this._dialog.close();
  }
}
