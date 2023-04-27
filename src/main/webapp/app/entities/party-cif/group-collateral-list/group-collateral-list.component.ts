import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { OrganizationManagementDialogComponent } from 'app/entities/organization-management/organization-management-dialog.component';
import {
  IOrganizationManagement,
  OrganizationManagement,
  OrganizationManagementAttributeManagementData,
  OrganizationManagementAttributeShareholder,
} from 'app/entities/organization-management/organization-management.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OrganizationManagementService } from 'app/entities/organization-management/organization-management.service';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import lodash from 'lodash';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { PartyCifService } from '../party-cif.service';
@Component({
  selector: 'jhi-group-collateral-list',
  templateUrl: './group-collateral-list.component.html',
  styleUrls: ['./group-collateral-list.css'],
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
export class GroupCollateralListComponent implements OnChanges {
  @Input() public cif: string;
  private _partyCif: IPartyCif;
  public listGroupCollateral: any;
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this._partyCif = object;
  }

  public displayedColumns: string[] = ['no', 'name', 'cif'];
  public columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];

  constructor(protected partyCifService: PartyCifService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyCif']) {
      this.loadDataBy();
    }
  }

  public loadDataBy(): void {
    const cifNumber = this.partyCif.customerNumber;
    this.partyCifService.getBusinessGroup(cifNumber).subscribe(res => {
      this.listGroupCollateral = res.body;
      console.log('datagroup', this.listGroupCollateral);
    });
  }
}
