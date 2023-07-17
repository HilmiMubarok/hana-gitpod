import { Component, Input, ViewChild, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { CreditProposalCollateralInfoRemarksInformationComponent } from './remarks/credit-proposal-collateral-info-remarks-information.component';
import { CreditProposalCollateralInfoRemarksChecklistComponent } from './remarks/credit-proposal-collateral-info-remarks-checklist.component';
import { CreditProposalCollateralInfoChecklistComponent } from './checklist/credit-proposal-collateral-info-checklist.component';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IGroupCollateralTotal } from './group-collateral/group-collateral-total.model';
import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-collateral-info',
  templateUrl: './credit-proposal-collateral-info.component.html',
  styleUrls: ['./collateral-info-cp.style.scss'],
})
export class CreditProposalCollateralInfoComponent implements OnInit, OnChanges {
  public groupCollateraltotal: IGroupCollateralTotal[] = [];
  public listGroupCollateral: any;
  public collateralPropertyGroupData: ICollateralProperty[] = [];
  public pacth: any;
  public view: boolean;
  public customPath: Boolean = false;

  constructor(
    private router: Router,
    protected partyCifService: PartyCifService,
    protected collateralService: CollateralService,
    protected collateralPropertyService: CollateralPropertyService
  ) {}

  @Input() source = '';

  @ViewChild('creditProposalCollateralInfoRemarksInfoComponentAbove', {
    static: false,
  })
  creditProposalCollateralInfoRemarksInfoComponentAbove: CreditProposalCollateralInfoRemarksInformationComponent;

  @ViewChild('creditProposalCollateralInfoRemarksInfoComponentBelow', {
    static: false,
  })
  creditProposalCollateralInfoRemarksInfoComponentBelow: CreditProposalCollateralInfoRemarksInformationComponent;

  @ViewChild('creditProposalCollateralInfoRemarksInfoComponentBtb', {
    static: false,
  })
  creditProposalCollateralInfoRemarksInfoComponentBtb: CreditProposalCollateralInfoRemarksInformationComponent;

  @ViewChild('creditProposalCollateralInfoRemarksCheckComponent', {
    static: false,
  })
  creditProposalCollateralInfoRemarksCheckComponent: CreditProposalCollateralInfoRemarksChecklistComponent;

  @ViewChild('creditProposalCollateralInfoChecklistComponent', {
    static: false,
  })
  creditProposalCollateralInfoChecklistComponent: CreditProposalCollateralInfoChecklistComponent;
  private _creditProposal: ICreditProposal;
  private _collateralProperty: ICollateralProperty[];

  public selectedMenu: string;
  public menuItemx: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'SUMMARY' }];
  public menuItems: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'CHECKLIST' }, { text: 'SUMMARY' }];
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @Input() isViewMode?: Boolean = false;
  @Input() takeOutCompare?: Boolean = false;

  @Input() parentSource?: String = '';

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  @Input()
  get collateralProperties() {
    return this._collateralProperty;
  }
  set collateralProperties(item: ICollateralProperty[]) {
    this._collateralProperty = item;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      this.loadDataBy();
    }
  }

  ngOnInit(): void {
    this.selectedMenu = 'INFORMATION';
    // View Sub Menu Collateral Info in Loan And Offering Letter
    if (
      this.router.url.split('/')[1] === 'la-distribution' ||
      this.router.url.split('/')[1] === 'la-analyst' ||
      this.router.url.split('/')[1] === 'la-SME-CRC' ||
      this.router.url.split('/')[1] === 'la-approval' ||
      this.router.url.split('/')[1] === 'loan-committee-approval' ||
      // this.router.url.split('/')[1] === 'la-approval-inquiry' ||
      this.router.url.split('/')[1] === 'dar-final' ||
      this.router.url.split('/')[1] === 'dar-checker' ||
      // this.router.url.split('/')[1] === 'dar-notif' ||
      // this.router.url.split('/')[1] === 'cc-distribution' ||
      this.router.url.split('/')[1] === 'cc-checking' ||
      this.router.url.split('/')[1] === 'cc-review' ||
      // this.router.url.split('/')[1] === 'cc-inquiry' ||
      // this.router.url.split('/')[1] === 'loan-analys-and-approval-monitoring' ||
      this.router.url.split('/')[1] === 'finalize' ||
      this.router.url.split('/')[1] === 'review' ||
      this.router.url.split('/')[1] === 'confirmation'
    ) {
      this.customPath = true;
    }

    if (this.creditProposal.attributes['collateralInfoGroupTotalMvLv']) {
      while (typeof this.creditProposal.attributes['collateralInfoGroupTotalMvLv'] === 'string') {
        this.creditProposal.attributes['collateralInfoGroupTotalMvLv'] = JSON.parse(
          this.creditProposal.attributes['collateralInfoGroupTotalMvLv']
        );
        this.groupCollateraltotal = this.creditProposal.attributes['collateralInfoGroupTotalMvLv'];
      }
    } else {
      this.creditProposal.attributes['groupChecklisCollateral'] = [];
    }
  }

  public triggeredSave(proposalType: any) {
    if (this.source === '') {
      if (this.selectedMenu === 'CHECKLIST') {
        this.creditProposalCollateralInfoRemarksCheckComponent.triggeredSave();
        this.creditProposalCollateralInfoChecklistComponent?.refresh();
      } else if (this.selectedMenu === 'INFORMATION') {
        if (proposalType === 'Total Exposure > IDR 15 Bio') {
          this.creditProposalCollateralInfoRemarksInfoComponentAbove.triggeredSave();
          this.creditProposalCollateralInfoChecklistComponent?.refresh();
        } else if (proposalType === 'Total Exposure <= IDR 15 Bio') {
          this.creditProposalCollateralInfoRemarksInfoComponentBelow.triggeredSave();
        } else if (proposalType === 'Total Exposure Back to Back') {
          this.creditProposalCollateralInfoRemarksInfoComponentBtb.triggeredSave();
        }
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

  private getAllColGroup() {
    return new Promise((resolve, reject) => {
      if (this.listGroupCollateral.length > 0) {
        for (let j = 0; j < this.listGroupCollateral.length; j++) {
          this.collateralService
            .queryFilterBy({
              idParty: this.listGroupCollateral[j].partyId,
              isActive: true,
            })
            .subscribe(res => {
              if (res.body) {
                for (let i = 0; i < res.body.length; i++) {
                  if (res.body[i].id) {
                    this.collateralPropertyService.queryFilterBy({ idCollateral: res.body[i].id, page: 0, size: 9999 }).subscribe(res2 => {
                      this.collateralPropertyGroupData = [...this.collateralPropertyGroupData, ...res2.body];
                      if (res.body.length - 1 === i) {
                        this.generateForReport(res.body, this.listGroupCollateral[j]);
                      }
                    });
                  }
                }
              }
              resolve(this.collateralPropertyGroupData);
            });
        }
      }
    });
  }

  // Mulai dari stage ini kebawah dibuat untuk kebutuhan REPORT

  public generateForReport(collaterals: ICollateral[], parentCol: IDebtorData) {
    const groupTotal: IGroupCollateralTotal = {};
    groupTotal.cif = parentCol.customerCIF;
    groupTotal.totalMV = this.countTotalMV(collaterals);
    groupTotal.totalLV = this.countTotalLV(collaterals);
    this.groupCollateraltotal.push(groupTotal);
    this.creditProposal.attributes['groupChecklisCollateral'] = this.groupCollateraltotal;
  }

  public countTotalLV(collaterals: ICollateral[]): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === false);
          if (data !== undefined) {
            result = result + Number(data.liquidationValue);
          }
        }
      }
    }
    this._creditProposal.attributes['coverageTotal'].countTotalLV = result;

    return result;
  }

  public countTotalMV(collaterals: ICollateral[]): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        if (collaterals[i].id) {
          const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
          if (properties.length > 0) {
            data = properties.find(obj => obj.external === false);
            if (data !== undefined) {
              result = result + Number(data.marketValue);
            }
          }
        }
      }
    }
    this._creditProposal.attributes['coverageTotal'].countTotalMV = result;
    return result;
  }

  private filterPropertiesFilterGurante(collateral: ICollateral): ICollateralProperty[] {
    let properties: ICollateralProperty[];
    properties = [];
    // for machine
    if (collateral.collateralTypeId !== 'CORPORATEPERSONALGUARANTEE') {
      if (collateral.collateralTypeId !== '' || collateral.collateralTypeId !== undefined) {
        properties = lodash.filter(this.collateralPropertyGroupData, function (o) {
          return o.propertyType === 'GENERAL' && o.collateralId === collateral.id;
        });
      }
    }
    return properties;
  }
}
