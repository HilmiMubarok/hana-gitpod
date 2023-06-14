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
import { ICPFacilityTable } from 'app/entities/credit-proposal/exposure/total-exposure/cp-facility-table-model';
import { ICPFacility } from 'app/shared/model/cp-facility.models';
import { DebtorDataService } from '../debtor-data.service';
import { IDebtorDataFacility } from '../debtor-data-facility.model';
import { DebtorDataFacilityService } from '../debtor-data-facility.service';
// import { FacilityInfoDebiturDialogComponent } from './facility-info-dialog/facility-info-debitur-dialog.component';

@Component({
  selector: 'jhi-facility-info-debitur',
  templateUrl: './facility-info-debitur.component.html',
  styleUrls: ['./facility-info-debitur.style.css'],
})
export class FacilityInfoDebiturComponent implements OnChanges {
  public debtorDataFacility: IDebtorDataFacility[];

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
    'appraisalNo',
    'facilityCategory',
    'bank',
    'limit',
    'loantype',
    // 'os',
    'facilityType',
    'rate',
    'period',
    'collateralType',
    'collateralValue',
    'tenor',
    'lastKol',
    'action',
  ];
  public aYear: any = [];

  @Input() public dialogType: any;

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
    public debtorDataService: DebtorDataFacilityService,
    protected _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyCif']) {
      this.getDebtorData();
    }
    if (changes['debtorData']) {
      this.dataFacility = JSON.parse(this.debtorData.attributes['cpFacility']);
      this.mapingData();
    }
    if (changes['dataGroup']) {
      if (this.dialogType === 'group') {
        this.dataFacility = this.dataGroup;
        // this.mapingData();
      }
    }
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

  public openDialog(params: IDebtorDataFacility) {
    const preData = lodash.clone(params);
    if (this.dialogType === 'debitur') {
      const dialogRef = this.dialog.open(FacilityInfoDebiturDialogComponent, {
        width: '80vw',
        data: {
          debtorData: params,
        },
      });
      dialogRef.afterClosed().subscribe((data: IDebtorDataFacility) => {
        if (data) {
          const index = this.debtorDataFacility.findIndex(x => x.id === params.id);
          this.debtorDataFacility[index] = data;
          this.debtorDataService.update(data).subscribe(res => {});
        } else {
          const index = this.debtorDataFacility.findIndex(x => x.id === params.id);
          this.debtorDataFacility[index] = preData;
        }
      });
    }
  }

  // // group
  // public openDialogGroup(params: IDebtorData) {
  //   if (this.dialogType === 'group') {
  //     const dialogRef = this.dialog.open(FacilityInfoDebiturDialogComponent, {
  //       width: '80vw',
  //       data: params,
  //     });
  //     dialogRef.afterClosed().subscribe(res => {
  //       if (res) {
  //         this.data = lodash.cloneDeep(res);
  //       }
  //     });
  //   }
  // }

  getDebtorData() {
    this.debtorDataService.getDebtorData(this.partyCif.partyId).subscribe(res => {
      this.debtorDataFacility = res.body;
    });
  }

  public getSublimit(element) {
    if (element === false) {
      return 'NO';
    }
    if (element === true) {
      return 'YES';
    }
    return '';
  }
}
