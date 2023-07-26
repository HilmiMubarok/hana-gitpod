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
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-group-collateral-list-history',
  templateUrl: './group-collateral-list-history.component.html',
  styleUrls: ['./group-collateral-list-history.css'],
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
export class GroupCollateralListHistoryComponent extends AbstractEntityMaterialComponent<IGroupCollateral> implements OnChanges, OnInit {
  @Input() public cif: string;

  public listGroupCollateral: any;
  private _creditProposal: ICreditProposal;
  public _collateralProperty: ICollateralProperty[];
  groupChecklisCollaterals: any;
  public parsedData: any;
  @Input() isOnCompareData: Boolean = false;

  @Input() isCompareDar: Boolean = false;
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
  public historyData() {
    // if isOnCompare and not isCompareDar, then set dynamic data to previousReturn
    if (this.isOnCompareData && !this.isCompareDar) {
      return this.parsedData.previousReturn;
    } else if (this.isOnCompareData && this.isCompareDar) {
      // return dataDar
      return {
        collaterals: this.creditProposal.collaterals,
        insurance: this.creditProposal.attributes.insurance,
        binding: this.creditProposal.attributes.binding,
        creditProposalCollateralData: this.creditProposal.attributes.creditProposalCollateralData,
        products: this.creditProposal.products,
        groupChecklisCollateral: this.creditProposal.attributes.groupChecklisCollateral,
      };
    } else {
      return this.parsedData.previousHistory;
    }
  }
  ngOnInit(): void {
    this.parsedData = parsePreviousAtrribute(this.creditProposal);
    if (this.historyData().creditProposalCollateralData.crossCollateralGroup === '') {
      this.historyData().creditProposalCollateralData.crossCollateralGroup = 'No';
    }
    if (this.historyData().creditProposalCollateralData.crossCollateralGroup === 'Yes') {
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

  public loadDataBy(): void {
    const cifNumber = this.creditProposal.customerNumber;
    this.partyCifService.getBusinessGroup(cifNumber).subscribe(res => {
      this.listGroupCollateral = res.body;
    });
  }
  public slideChange(event) {
    if (event === true) {
      this.isChecked = true;
      this.historyData().creditProposalCollateralData.crossCollateralGroup = 'Yes';
    } else {
      this.historyData().creditProposalCollateralData.crossCollateralGroup = 'No';
    }
  }
}
