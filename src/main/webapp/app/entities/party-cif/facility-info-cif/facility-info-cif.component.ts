import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CPFacilityTable, ICPFacilityTable } from 'app/entities/credit-proposal/exposure/total-exposure/cp-facility-table-model';
import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model';

import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import lodash from 'lodash';
import { MessageService } from 'primeng/api';
import { PartyCifService } from '../party-cif.service';

@Component({
  selector: 'jhi-facility-info-cif',
  templateUrl: './facility-info-cif.component.html',
})
export class FacilityInfoCifComponent extends AbstractEntityMaterialComponent<IPartyCif> implements OnInit {
  public loading: boolean;
  public debtorData: IDebtorData;
  public debtorDataGroup: IDebtorData;

  constructor(public partyCifService: PartyCifService, protected _snackBar: MatSnackBar, protected messageService: MessageService) {
    super(_snackBar, partyCifService, messageService);
  }
  public data = [];
  public dataGroup = [];
  public myBusinessGroupCPFacility: ICPFacilityTable[];

  private _partyCif: IPartyCif;
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this._partyCif = object;
  }

  ngOnInit(): void {
    this.loadDataGroup();
    this.loadDataBy();
  }

  public loadDataBy(): void {
    this.partyCifService.find('cif/retrieve-cp-facility/' + this.partyCif.customerNumber).subscribe((res: any) => {
      if (res.status === 200) {
        this.data = JSON.parse(res.body.debtorData.attributes['cpFacility']);
        this.debtorData = res.body.debtorData;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Update Data From HOBIS Successful!',
        });
      } else if (res.status === 500) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Update Data From HOBIS Failed!',
        });
      }
    });
  }

  public loadDataGroup(): void {
    this.partyCifService.getBusinessGroup(this.partyCif.customerNumber).subscribe((res: any) => {
      this.debtorDataGroup = res.body;
      this.filterBusinessGroupDebtorData(res.body);
    });
  }

  private filterBusinessGroupDebtorData(param: IDebtorData[]): void {
    this.myBusinessGroupCPFacility = [];
    if (param.length > 0) {
      for (let i = 0; i < param.length; i++) {
        const item: IDebtorData = param[i];
        console.log('param i ', i, param[i]);
        if (lodash.has(item.attributes, 'cpFacility')) {
          const parsed = new CPFacilityTable();
          const source = JSON.parse(item.attributes['cpFacility']);
          console.log('source', source);
          if (source) {
            for (let y = 0; y < source.length; y++) {
              this.myBusinessGroupCPFacility = lodash.concat(this.myBusinessGroupCPFacility, source[y]);
              const removeundefined = lodash.remove(this.myBusinessGroupCPFacility, function (n) {
                return n === undefined;
              });
            }

            this.dataGroup = this.myBusinessGroupCPFacility;
          }
        }
      }
    }
  }
}
