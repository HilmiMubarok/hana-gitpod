import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { OrganizationManagementDialogComponent } from 'app/entities/organization-management/organization-management-dialog.component';
import { OrganizationManagementService } from 'app/entities/organization-management/organization-management.service';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import lodash from 'lodash';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CollateralService } from 'app/entities/collateral/collateral.service';

@Component({
  selector: 'jhi-group-collateral-list-appraisal',
  templateUrl: './group-collateral-list-appraisal.component.html',
  styleUrls: ['./group-collateral-list-appraisal.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({
          height: '0px',
          minHeight: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupCollateralListAppraisalComponent implements OnChanges {
  @Output() outputGroupDatas = new EventEmitter();
  @Output() outputGetsCifs = new EventEmitter();
  @Input() public cif: string;
  @Output() outputgroupListselected = new EventEmitter();
  public listGroupCollateral: any;
  @Input() cifNumber: string;
  private _collateral: ICollateral;
  public isCheckDebColtoChild: boolean;
  public statusCheckedGroupEmit: boolean;
  public statusCheckedGroup: boolean;
  @Input() public isCheckDebCol = false;
  listDataGroup = [];
  getCifs: any;
  selectedPartyCif: IPartyCif;
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
  @Input() public partyId: string;
  public displayedColumns: string[] = ['no', 'name', 'cif'];
  public columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];

  constructor(protected partyCifService: PartyCifService, protected collateralService: CollateralService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cifNumber']) {
      if (this.cifNumber) {
        this.loadDataBy();
      }
    }
    if (changes['isCheckDebCol']) {
      this.isCheckDebColtoChild = changes.isCheckDebCol.currentValue;
    }
  }

  public getGroupData(statusCheckeds: any): void {
    this.listDataGroup = statusCheckeds;
    this.outputGroupDatas.emit(this.listDataGroup);
  }
  public getGroupSelected(statusCheckedGroup: boolean): void {
    this.statusCheckedGroupEmit = statusCheckedGroup;
    this.outputgroupListselected.emit(this.statusCheckedGroupEmit);
  }
  private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }
  public loadDataBy(): void {
    const predicate = {
      page: 0,
      size: 9999,
      idPosition: this.getLocStor('POS'),
      sort: ['id', 'desc'],
    };
    this.partyCifService.findLikeCifSegregasi(this.cifNumber, predicate).subscribe(res => {
      if (res.body.length > 0) {
        this.partyCifService.getBusinessGroup(this.cifNumber).subscribe(ress => {
          this.listGroupCollateral = ress.body;
          this.outputGetsCifs.emit(this.listGroupCollateral);
        });
      }
    });
  }
}
