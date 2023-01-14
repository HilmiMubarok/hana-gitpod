import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import lodash from 'lodash';

import { MatDialog } from '@angular/material/dialog';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacilityInfoDebiturDialogComponent } from './facility-info-dialog/facility-info-debitur-dialog.component';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { DebtorData, IDebtorData } from '../debtor-data.model';
import { CPFacilityTable, ICPFacilityTable } from 'app/entities/credit-proposal/exposure/total-exposure/cp-facility-table-model';
import { ICPFacility } from 'app/shared/model/cp-facility.models';
import { DebtorDataService } from '../debtor-data.service';
// import { FacilityInfoDebiturDialogComponent } from './facility-info-dialog/facility-info-debitur-dialog.component';

@Component({
  selector: 'jhi-facility-info-group',
  templateUrl: './facility-info-group.component.html',
})
export class FacilityInfoGroupComponent implements OnInit, OnChanges {
  public loading: boolean;
  public dataPartySlik: IPartySlik[];
  public data: ICPFacility[] = [];
  public dataFacility: ICPFacility[] = [];
  public _data: ICPFacility[] = [];
  public _deptorData: ICreditProposal;
  private _debtorData: IDebtorData;
  public _dataGroup = [];
  public availLimit: any = [];
  public cpFacility: ICPFacilityTable;

  public displayColumns: string[] = [
    'no',
    'customerName',
    'bank',
    'limit',
    'loantype',
    'os',
    'facilityType',
    'rate',
    'period',
    'collateralType',
    'collateralValue',
    'tenor',
    'lastKol',
  ];
  public aYear: any = [];

  @Input() public dialogType: any;
  @Input() public debtorDataGroup: IDebtorData[];

  @Input()
  get debtorData() {
    return this._debtorData;
  }

  set debtorData(params: IDebtorData) {
    this._debtorData = params;
  }

  // @Input()
  // get data() {
  //   return this._data;
  // }

  // set data(object: any[]) {
  //   this._data = object;
  // }

  @Input()
  get dataGroup() {
    return this._dataGroup;
  }

  set dataGroup(object: any[]) {
    this._dataGroup = object;
    this.dataFacility = this.dataGroup;
  }

  private _partyCif: IPartyCif;
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this._partyCif = object;
  }

  constructor(
    public partyCifService: PartyCifService,
    public debtorDataService: DebtorDataService,
    protected _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['debtorData']) {
      console.log('Debtor data nih', this.debtorData);
      this.mapingData();
    }
    if (changes['partyCif']) {
      if (this.dialogType === 'debitur') {
        this.dataFacility = JSON.parse(this.partyCif.debtorData.attributes['cpFacility']);
      }
    }
    if (changes['dataGroup']) {
      if (this.dialogType === 'group') {
        this.dataFacility = this.dataGroup;
        // this.mapingData();
      }
    }
    if (changes['debtorDataGroup']) {
      console.log('debtor data group', this.debtorDataGroup);
      this.filterBusinessGroupDebtorData(this.debtorDataGroup);
    }
  }

  ngOnInit(): void {
    console.log('ini data', this.data);
    console.log('collateral type', this.dialogType);
  }

  private mapingData() {
    for (let i = 0; i < this.dataFacility.length; i++) {
      const date1 = new Date(this.dataFacility[i].FXFIG_TRX_DT);
      const date2 = new Date(this.dataFacility[i].FILN10_TOT_EXP_IL);
    }
  }

  public showElement() {
    if (this.data[0].FILN11_COM_NM === 'CURRENT DEPOSITS') {
      return true;
    } else {
      return false;
    }
  }

  public openDialog(params: ICPFacility) {
    if (this.dialogType === 'debitur') {
      const dialogRef = this.dialog.open(FacilityInfoDebiturDialogComponent, {
        width: '80vw',
        data: {
          cpFacility: params,
        },
      });
      dialogRef.afterClosed().subscribe((data: ICPFacility) => {
        if (data) {
          const objectCPF: ICPFacility[] = JSON.parse(this.partyCif.debtorData.attributes['cpFacility']);
          const index = objectCPF.findIndex(x => x.LNB_BASE_AGR_REF_NO === params.LNB_BASE_AGR_REF_NO);

          objectCPF[index] = data;
          this.partyCif.debtorData.attributes['cpFacility'] = JSON.stringify(objectCPF);
          console.log(this.partyCif.debtorData);
          this.debtorDataService.update(this.partyCif.debtorData).subscribe(res => {
            console.log('save berhasil');
          });
        } else {
          this.dataFacility = JSON.parse(this.partyCif.debtorData.attributes['cpFacility']);
        }
      });
    }
  }

  // group
  public openDialogGroup(params: IDebtorData) {
    if (this.dialogType === 'group') {
      const dialogRef = this.dialog.open(FacilityInfoDebiturDialogComponent, {
        width: '80vw',
        data: params,
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.data = lodash.cloneDeep(res);
        }
      });
    }
  }

  private filterBusinessGroupDebtorData(param: IDebtorData[]): void {
    if (param.length > 0) {
      let no = 0;
      for (let i = 0; i < param.length; i++) {
        const item: IDebtorData = param[i];
        if (lodash.has(item.attributes, 'cpFacility')) {
          const source = JSON.parse(item.attributes['cpFacility']);

          if (source) {
            for (let y = 0; y < source.length; y++) {
              const parsed = new CPFacilityTable();
              const parsedAny = parsed;
              no = no + 1;
              parsed.no = no;
              parsed.GroupName = param[i].customerName;
              console.log('group name', parsed.GroupName);
            }
          }
        }
      }
    }
  }
}
