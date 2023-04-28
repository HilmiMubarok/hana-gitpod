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
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-group-collateral-list-cp',
  templateUrl: './group-collateral-list-cp.component.html',
  styleUrls: ['./group-collateral-list-cp.css'],
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
export class GroupCollateralListCpComponent implements OnChanges {
  @Input() public cif: string;
  public listGroupCollateral: any;
  private _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }
  private _group: string;
  @Input()
  get group() {
    return this._group;
  }
  set group(data: string) {
    this._group = data;
  }

  public displayedColumns: string[] = ['no', 'name', 'cif'];
  public columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];

  constructor(protected partyCifService: PartyCifService) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log('data', changes);
    if (changes['creditProposal']) {
      if (this.creditProposal.customerNumber) {
        this.loadDataBy();
      }
    }
  }

  public loadDataBy(): void {
    const cifNumber = this.creditProposal.customerNumber;
    this.partyCifService.getBusinessGroup(cifNumber).subscribe(res => {
      this.listGroupCollateral = res.body;
      console.log('datagroup', this.listGroupCollateral);
    });
  }
}
