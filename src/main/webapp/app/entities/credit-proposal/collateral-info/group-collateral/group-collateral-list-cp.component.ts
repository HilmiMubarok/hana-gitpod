import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { IGroupCollateral } from 'app/shared/model/group-collateral.model';
import { PageEvent } from '@angular/material/paginator';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { STATUS_COLLATERAL } from 'app/shared/constants/status.constants';
import { IGroupCollateralChecklis } from './group-collateral-total.model';

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
export class GroupCollateralListCpComponent extends AbstractEntityMaterialComponent<IGroupCollateral> implements OnChanges, OnInit {
  @Input() public cif: string;

  public listGroupCollateral: any;
  private _creditProposal: ICreditProposal;
  public _collateralProperty: ICollateralProperty[];
  groupChecklisCollaterals: IGroupCollateralChecklis[];
  @Input()
  get collateralProperties() {
    return this._collateralProperty;
  }
  set collateralProperties(item: ICollateralProperty[]) {
    this._collateralProperty = item;
  }
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
  public listGroupCollateralItems = [];
  // public isChecked: boolean;
  public isChecked = false;

  constructor(
    protected partyCifService: PartyCifService,
    protected collateralService: CollateralService,
    protected creditProposalService: CreditProposalService,
    protected _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    super(_snackBar, partyCifService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.displayedColumns = null;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }

  ngOnInit(): void {
    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === 'Yes') {
      this.isChecked = true;
    }
  }
  loadDataLazy(event?: PageEvent) {
    this.items = null;
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.postLoadDataLazy();
  }

  protected postLoadDataLazy(): void {
    this.loadDataBy();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      if (this.creditProposal.customerNumber) {
        this.loadDataBy();
      }
    }
  }

  private getAllColGroup(): void {
    if (this.listGroupCollateral.length > 0) {
      this.listGroupCollateral.forEach(item => {
        this.collateralService
          .queryFilterBy({
            idParty: item.partyId,
            isActive: true,
          })
          .subscribe(res => {
            for (let i = 0; i < res.body.length; i++) {
              this.listGroupCollateralItems.push(res.body[i]);
            }
            // this.checkGroupAll(this.creditProposal);
          });
      });
    }
  }

  // private checkGroupAll(cp: ICreditProposal): void {
  //   if (cp.collateralProductRelations.length === 0) {
  //     this.isChecked = false;
  //   } else {
  //     if (cp.products.length > 0 && this.listGroupCollateralItems.length > 0) {
  //       for (let i = 0; i < cp.collateralProductRelations.length; i++) {
  //         for (let j = 0; j < cp.products.length; j++) {
  //           for (let k = 0; k < this.listGroupCollateralItems.length; k++) {
  //             if (
  //               cp.collateralProductRelations[i].applicationProduct.id === cp.products[j].id &&
  //               cp.collateralProductRelations[i].collateralId === this.listGroupCollateralItems[k].id
  //             ) {
  //               // this.isChecked = true;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  public loadDataBy(): void {
    const cifNumber = this.creditProposal.customerNumber;
    this.partyCifService.getBusinessGroup(cifNumber).subscribe(res => {
      this.listGroupCollateral = res.body;
      this.getAllColGroup();
    });
  }

  private cleanUpColGroupRel(): void {
    this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralGroup = 'No';
    if (
      this.creditProposal.collateralProductRelations.length > 0 &&
      this.creditProposal.products.length > 0 &&
      this.listGroupCollateralItems.length > 0
    ) {
      /* for (let i = 0; i < this.creditProposal.collateralProductRelations.length; i++) {
    for (let j = 0; j < this.creditProposal.products.length; j++) {
      for (let k = 0; k < this.listGroupCollateralItems.length; k++) {
      if (this.creditProposal.collateralProductRelations[i].applicationProduct.id === this.creditProposal.products[j].id && this.creditProposal.collateralProductRelations[i].collateralId === this.listGroupCollateralItems[k].id) {
        this.creditProposal.collateralProductRelations.splice(i,1);
      }
      }
    }
    } */
      for (let index = 0; index < this.creditProposal.collateralProductRelations.length; index++) {
        for (let j = 0; j < this.creditProposal.products.length; j++) {
          for (let k = 0; k < this.listGroupCollateralItems.length; k++) {
            if (
              this.creditProposal.collateralProductRelations[index].applicationProduct.id === this.creditProposal.products[j].id &&
              this.creditProposal.collateralProductRelations[index].collateralId === this.listGroupCollateralItems[k].id
            ) {
              this.creditProposal.collateralProductRelations.splice(index);
            }
          }
        }
      }
    }
  }

  public slideChange(event: boolean): void {
    if (event) {
      this.isChecked = true;
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'Yes';
      this.addCollateralRelations();
    } else {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'No';
      this.dataChecklis(this.listGroupCollateralItems);
      this.cleanUpColGroupRel();
    }

    // Notify service about changes
    this.creditProposalService.changeColRelByCP(this.creditProposal);
  }

  // Add collateral-product relations
  private addCollateralRelations(): void {
    if (this.creditProposal.products.length === 0 || this.listGroupCollateralItems.length === 0) {
      return;
    }

    for (const product of this.creditProposal.products) {
      for (const collateral of this.listGroupCollateralItems) {
        if (this.shouldAddCollateral(collateral)) {
          this.addCollateralRelation(product, collateral);
        }
      }
    }
  }

  // Check if a collateral should be added
  private shouldAddCollateral(collateral: any): boolean {
    const excludedStatuses = [STATUS_COLLATERAL.CANCEL, STATUS_COLLATERAL.TO_BE_RELEASED, STATUS_COLLATERAL.RELEASE];

    return collateral.collateralTypeId !== 'CORPORATEPERSONALGUARANTEE' && !excludedStatuses.includes(collateral.statusId);
  }

  // Add a single collateral-product relation and update the checklist
  private addCollateralRelation(product: any, collateral: any): void {
    const relation = {
      applicationProduct: product,
      collateralId: collateral.id,
      bindingValue: 0,
    };
    this.creditProposal.collateralProductRelations.push(relation);

    const data: IGroupCollateralChecklis = this.creditProposal.attributes['groupChecklisCollateral'].find(
      obj => obj.collateralId === collateral.id
    );
    if (data) {
      data.checklis = this.isChecked;
    }
  }
  private dataChecklis(collaterals: any[]): void {
    collaterals.forEach(collateral => {
      const data: IGroupCollateralChecklis = this.creditProposal.attributes['groupChecklisCollateral'].find(
        obj => obj.collateralId === collateral.id
      );

      if (data) {
        // If the data is found, update the 'checklis' property with the value of 'isChecked'
        data.checklis = this.isChecked;
      }
    });
  }
}
