import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { Collateral, ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_TYPE, COLLATERAL_BINDING_TYPE } from 'app/shared/constants/base.constants';

import lodash from 'lodash';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { MatDialog } from '@angular/material/dialog';

import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { IGroupCollateral } from 'app/shared/model/group-collateral.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { IPartyGroup } from 'app/entities/party-group/party-group.model';
import { DialogCollateralAppraisalCifComponent } from '../addSelect/dialog-collateral-appraisal-cif.component';
import { IPartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { PartyPostalAddressService } from 'app/entities/party-postal-address/party-postal-address.service';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
import { STATUS_COLLATERAL } from 'app/shared/constants/status.constants';

@Component({
  selector: 'jhi-group-collateral-appraisal',
  templateUrl: './group-collateral-appraisal.component.html',
  styleUrls: ['./group-collateral-list-appraisal.css'],
})
export class GroupCollateralAppraisalComponent implements OnChanges, OnInit {
  // @Output() outputCifGroup = new EventEmitter();
  @Output() outputDataGroup = new EventEmitter();
  @Output() outputgroupselected = new EventEmitter();
  public displayedColumns: string[] = ['select', 'no', 'jenisJaminan', 'alamat', 'kota', 'action'];
  public isCheckDebColfromParent: boolean;
  public statusCheckeds = [];
  private _collateral: ICollateral;
  public mappingStatusHelper: any = [];
  public statusCheckedGroup: boolean;
  postalAddress: IPostalAddress;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(data: ICollateral) {
    this._collateral = data;
  }
  private _partyCif: IPartyCif;
  @Input()
  get partyCif() {
    return this._partyCif;
  }
  set partyCif(data: IPartyCif) {
    this._partyCif = data;
  }
  public collateralsGroupData = [];
  // public collateralsGroupData = [];
  @Input() cif: string;
  @Input() isCheckDebColtoChild = false;
  @Input() partyId: string;
  constructor(
    private collateralService: CollateralService,
    public dialog: MatDialog,
    protected partyPostalAddressService: PartyPostalAddressService
  ) {}
  private setAvailableCollateralForAppraise(): void {
    this.collateralService
      .queryFilterBy({
        idParty: this.partyId,
        isActive: true,
      })
      .subscribe(res => {
        this.collateralsGroupData = lodash.filter(res.body, function (e) {
          return e.collateralTypeAppraise === true && e.statusId !== STATUS_COLLATERAL.CANCEL;
        });
        if (this.collateralsGroupData.length > 0) {
          for (let i = 0; i < this.collateralsGroupData.length; i++) {
            this.collateralsGroupData[i]['indexNum'] = i + 1;
          }
        }
      });
  }
  ngOnInit(): void {
    this.setAvailableCollateralForAppraise();
  }

  public groupSelect(event: MatCheckboxChange, index: number): void {
    if (event.checked === true) {
      this.statusCheckeds.push(this.collateralsGroupData[index]);
      this.statusCheckedGroup = true;
    } else {
      for (let i = 0; i < this.statusCheckeds.length; i++) {
        this.statusCheckeds.splice(i, 1);
        i = this.statusCheckeds.length - 1;
        this.statusCheckedGroup = false;
      }
    }
    this.outputDataGroup.emit(this.statusCheckeds);
    this.outputgroupselected.emit(this.statusCheckedGroup);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isCheckDebColtoChild']) {
      this.isCheckDebColfromParent = changes.isCheckDebColtoChild.currentValue;
    }
  }
  public onDetailClick(section: string, element: any): void {
    this.partyCif = element;
    if (section === 'collateral') {
      this.collateral = element;
      this.partyCif.partyId;
    }

    if (section === 'cif') {
      this.partyCif.partyId;
    }

    this.loadPartyPostalAddress(this.partyId, section);
  }
  private loadPartyPostalAddress(partyId: string, section: string): void {
    this.partyPostalAddressService.queryFilterBy({ idParty: partyId }).subscribe(res => {
      if (res.body.length > 0) {
        const partyPostalAddress: IPartyPostalAddress = lodash.find(res.body, function (o) {
          return o.purposeTypeId === 'PRIMARY_LOCATION';
        });
        if (partyPostalAddress) {
          const predicate = {
            height: '100%',
            width: '80vw',
            data: {
              collateral: this.collateral,
              partyId: this.partyCif.id,
              partyIds: this.partyCif.partyId,
              dialogSection: section,
              customerType: this.partyCif.customerType,
              postalAddress: partyPostalAddress,
            },
          };

          const dialogRef = this.dialog.open(DialogCollateralAppraisalCifComponent, predicate);
          dialogRef.afterClosed().subscribe();
          this.postalAddress = partyPostalAddress.address;
        }
      }
    });
  }
}
