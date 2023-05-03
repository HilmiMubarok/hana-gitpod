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
export class GroupCollateralListCpComponent implements OnInit, OnChanges {
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
  public listGroupCollateralItems = [];
  // public isChecked: boolean;
  public isChecked = false;

  constructor(protected partyCifService: PartyCifService, protected collateralService: CollateralService, protected creditProposalService: CreditProposalService) {}

  ngOnInit(): void {
    this.creditProposalService.triggerChanggedColRelByCPObservable.subscribe(updatedCP => {
	  if (updatedCP && this.listGroupCollateralItems) {
		if (updatedCP.collateralProductRelations.length > 0 && updatedCP.products.length > 0 && this.listGroupCollateralItems.length > 0) {
		  this.checkGroupAll(updatedCP);
		}
	  }
	});
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
			isActive: true
		  })
		  .subscribe(res => {
			for (let i = 0; i < res.body.length; i++ ) {
			  this.listGroupCollateralItems.push(res.body[i]);
			}
			this.checkGroupAll(this.creditProposal);
		  });
	  });
	}
  }

  private checkGroupAll(cp: ICreditProposal): void {
	if (cp.collateralProductRelations.length === 0) {
	  this.isChecked = false;
	} else {
	  if (cp.products.length > 0 && this.listGroupCollateralItems.length > 0) {
		const totalAllGroup = cp.products.length * this.listGroupCollateralItems.length;
		let countChecked = 0;

		for (let i = 0; i < cp.collateralProductRelations.length; i++) {
		  for (let j = 0; j < cp.products.length; j++) {
			for (let k = 0; k < this.listGroupCollateralItems.length; k++) {
			  if (cp.collateralProductRelations[i].applicationProduct.id === cp.products[j].id && cp.collateralProductRelations[i].collateralId === this.listGroupCollateralItems[k].id) {
				++countChecked;
			  }
			}
		  }
		}

		if (countChecked === totalAllGroup) {
		  this.isChecked = true;
		} else {
		  this.isChecked = false;
		}
	  } else {
		this.isChecked = false;
	  }
	}
  }

  public loadDataBy(): void {
    const cifNumber = this.creditProposal.customerNumber;
    this.partyCifService.getBusinessGroup(cifNumber).subscribe(res => {
      this.listGroupCollateral = res.body;
	  this.getAllColGroup();
    });
  }

  private cleanUpColGroupRel(): void {
	if (this.creditProposal.collateralProductRelations.length > 0 && this.creditProposal.products.length > 0 && this.listGroupCollateralItems.length > 0) {
	  /* for (let i = 0; i < this.creditProposal.collateralProductRelations.length; i++) {
		for (let j = 0; j < this.creditProposal.products.length; j++) {
		  for (let k = 0; k < this.listGroupCollateralItems.length; k++) {
			if (this.creditProposal.collateralProductRelations[i].applicationProduct.id === this.creditProposal.products[j].id && this.creditProposal.collateralProductRelations[i].collateralId === this.listGroupCollateralItems[k].id) {
			  this.creditProposal.collateralProductRelations.splice(i,1);
			}
		  }
		}
	  } */
	  for (let [index, item] of this.creditProposal.collateralProductRelations.entries()) {
		for (let j = 0; j < this.creditProposal.products.length; j++) {
		  for (let k = 0; k < this.listGroupCollateralItems.length; k++) {
			if (this.creditProposal.collateralProductRelations[index].applicationProduct.id === this.creditProposal.products[j].id && this.creditProposal.collateralProductRelations[index].collateralId === this.listGroupCollateralItems[k].id) {
			  this.creditProposal.collateralProductRelations.splice(index,1);
			}
		  }
		}
	  }
	}
  }

  public slideChange(event) {
    if (event === true) {
	  if (this.creditProposal.products.length > 0 && this.listGroupCollateralItems.length > 0) {
		this.cleanUpColGroupRel();
		for (let j = 0; j < this.creditProposal.products.length; j++) {
		  for (let k = 0; k < this.listGroupCollateralItems.length; k++) {
			const tempCollateralProductRelationObject = {
			  applicationProduct: this.creditProposal.products[j],
			  collateralId: this.listGroupCollateralItems[k].id,
			  bindingValue: 0
			};
			this.creditProposal.collateralProductRelations.push(tempCollateralProductRelationObject);
		  }
		}
	  }
    } else {
	  this.cleanUpColGroupRel();
    }
	this.creditProposalService.changeColRelByCP(this.creditProposal);
  }
}
