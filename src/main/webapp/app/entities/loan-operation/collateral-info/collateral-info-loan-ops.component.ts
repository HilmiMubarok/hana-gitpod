import { Component, Input, ViewChild, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model';
import lodash from 'lodash';
import { CreditProposalCollateralInfoChecklistComponent } from 'app/entities/credit-proposal/collateral-info/checklist/credit-proposal-collateral-info-checklist.component';
import { IGroupCollateralTotal } from 'app/entities/credit-proposal/collateral-info/group-collateral/group-collateral-total.model';
import { CreditProposalCollateralInfoRemarksChecklistComponent } from 'app/entities/credit-proposal/collateral-info/remarks/credit-proposal-collateral-info-remarks-checklist.component';
import { CreditProposalCollateralInfoRemarksInformationComponent } from 'app/entities/credit-proposal/collateral-info/remarks/credit-proposal-collateral-info-remarks-information.component';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

@Component({
  selector: 'jhi-collateral-info-loan-ops',
  templateUrl: './collateral-info-loan-ops.component.html',
  styleUrls: ['./collateral-info-loan-ops.style.scss'],
})
export class CollateralInfoLoanOpsComponent implements OnInit, OnChanges {
  public groupCollateraltotal: IGroupCollateralTotal[] = [];
  public listGroupCollateral: any;
  public pacth: any;
  public view: boolean;
  public customPath: Boolean = false;
  @Input() isElement: Boolean = false;
  @Input() isLabel: Boolean = false;
  public field: Boolean = false;
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
  private _collateralPropertyGroupData: ICollateralProperty[];
  private _creditProposal: ICreditProposal;
  private _collateralProperty: ICollateralProperty[];
  private _collateralSummaryData: ICollateral[];
  public parentPath = this.router.url.split('/')[1];
  public textBoxHidden = false;
  public statusDisabledOffering = false;
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

  @Input()
  get collateralPropertyGroupData() {
    return this._collateralPropertyGroupData;
  }
  set collateralPropertyGroupData(item: ICollateralProperty[]) {
    this._collateralPropertyGroupData = item;
  }

  @Input()
  get collateralSummaryData() {
    return this._collateralSummaryData;
  }

  set collateralSummaryData(item: ICollateral[]) {
    this._collateralSummaryData = item;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateralPropertyGroupData']) {
      this.loadDataBy();
    }
    if (changes['isElement']) {
      this.isElement = changes['isElement'].currentValue;
    }
    if (changes['isLabel']) {
      this.isLabel = changes['isLabel'].currentValue;
    }
  }
  public disableFields() {
    if (
      this.parentPath === 'finalize-pk' ||
      this.parentPath === 'review-pk' ||
      this.parentPath === 'finalize-dpdl' ||
      this.parentPath === 'review-dpdl' ||
      // this.parentPath === 'dar-revision' ||
      this.parentPath === 'dar-revision-checker' ||
      this.parentPath === 'finalize-dppk' ||
      this.parentPath === 'review-dppk' ||
      this.parentPath === 'loan-ops-distribution' ||
      this.parentPath === 'loan-ops-review' ||
      this.parentPath === 'loan-ops-checking'
    ) {
      // Default Disabled
      this.field = true;
    }
  }
  public hiddenField() {
    if (
      this.parentPath === 'finalize-pk' ||
      this.parentPath === 'review-pk' ||
      this.parentPath === 'finalize-dpdl' ||
      this.parentPath === 'review-dpdl' ||
      this.parentPath === 'dar-revision' ||
      this.parentPath === 'dar-revision-checker' ||
      this.parentPath === 'finalize-dppk' ||
      this.parentPath === 'review-dppk' ||
      this.parentPath === 'loan-ops-distribution' ||
      this.parentPath === 'loan-ops-review' ||
      this.parentPath === 'loan-ops-checking'
    ) {
      return true;
    }
    return false;
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
      this.router.url.split('/')[1] === 'confirmation' ||
      this.router.url.split('/')[1] === 'finalize-pk' ||
      this.router.url.split('/')[1] === 'review-pk' ||
      this.router.url.split('/')[1] === 'finalize-dpdl' ||
      this.router.url.split('/')[1] === 'review-dpdl' ||
      this.router.url.split('/')[1] === 'dar-revision' ||
      this.router.url.split('/')[1] === 'dar-revision-checker' ||
      this.router.url.split('/')[1] === 'finalize-dppk' ||
      this.router.url.split('/')[1] === 'review-dppk' ||
      this.router.url.split('/')[1] === 'loan-ops-distribution' ||
      this.router.url.split('/')[1] === 'loan-ops-review' ||
      this.router.url.split('/')[1] === 'loan-ops-checking'
    ) {
      this.customPath = true;
    }
    this.disableFields();
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
    this.conditionFieldInOfferingLetter();
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
                    if (res.body.length - 1 === i) {
                      this.generateForReport(res.body, this.listGroupCollateral[j]);
                    }
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
    let group: IGroupCollateralTotal;
    groupTotal.cif = parentCol.customerCIF;
    groupTotal.totalMV = this.countTotalMV(collaterals);
    groupTotal.totalLV = this.countTotalLV(collaterals);
    groupTotal.totalMVKJJP = this.countTotalMVKJJP(collaterals);
    groupTotal.totalLvKJJP = this.countTotalLVKJJP(collaterals);
    if (this.creditProposal.attributes['collateralInfoGroupTotalMvLv']) {
      group = this.creditProposal.attributes['collateralInfoGroupTotalMvLv'].find(obj => obj.cif === groupTotal.cif);
    }
    if (group) {
      const idx = this.creditProposal.attributes['collateralInfoGroupTotalMvLv'].findIndex(obj => obj.cif === group.cif);
      this.creditProposal.attributes['collateralInfoGroupTotalMvLv'][idx] = groupTotal;
    } else {
      this.groupCollateraltotal.push(groupTotal);
    }
    this.creditProposal.attributes['collateralInfoGroupTotalMvLv'] = this.groupCollateraltotal;
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

  public countTotalLVKJJP(collaterals: ICollateral[]): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === true);
          if (data !== undefined) {
            result = result + Number(data.liquidationValue);
          }
        }
      }
    }
    this._creditProposal.attributes['coverageTotal'].countTotalLVKJJP = result;

    return result;
  }

  public countTotalMVKJJP(collaterals: ICollateral[]): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        if (collaterals[i].id) {
          const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
          if (properties.length > 0) {
            data = properties.find(obj => obj.external === true);
            if (data !== undefined) {
              result = result + Number(data.marketValue);
            }
          }
        }
      }
    }
    this._creditProposal.attributes['coverageTotal'].countKJJPMV = result;
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

  public conditionFieldInOfferingLetter() {
    const queryParam = new URLSearchParams(this.router.url.split('?')[1]);
    const subroutes = queryParam.get('subroute');
    // Condition Offering Letter in Route Finalize
    if (this.parentPath === 'finalize') {
      // If Selected Menu Loan Facility Detail and not from Loan Facility, the fields can be displayed and can be changed
      if (subroutes === 'dec-collateral-info') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = false;
        // If the Menu Compare Approval Report field can be displayed and cannot be changed
      } else if (this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = true;
      } else {
        this.textBoxHidden = true;
        this.statusDisabledOffering = false;
      }

      // Condition Offering Letter in Route Distribution
    } else if (this.parentPath === 'distribution') {
      // If Selected Menu Loan Facility Detail and not from Loan Facility, the fields can be displayed and cannot be changed
      if (this.selectedMenu === 'INFORMATION') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = false;
        // If the Menu Compare Approval Report field can be displayed and cannot be changed
      } else if (this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = true;
      } else {
        this.textBoxHidden = true;
        this.statusDisabledOffering = true;
      }

      // Condition Offering Letter in Route Review
    } else if (this.parentPath === 'review' || this.parentPath === 'confirmation') {
      if (
        this.selectedMenu === 'loan-facility-detail' ||
        this.selectedMenu === 'compare-approval-report' ||
        this.selectedMenu === 'INFORMATION'
      ) {
        this.textBoxHidden = false;
        this.statusDisabledOffering = true;
      } else {
        this.textBoxHidden = true;
        this.statusDisabledOffering = true; // Menambahkan perubahan di sini
      }
    } else if (
      this.parentPath === 'finalize-dpdl' ||
      this.parentPath === 'review-dpdl' ||
      this.parentPath === 'review-pk' ||
      this.parentPath === 'review-dppk' ||
      this.parentPath === 'finalize-dppk' ||
      this.parentPath === 'loan-ops-distribution' ||
      this.parentPath === 'loan-ops-review' ||
      this.parentPath === 'dar-revision-checker' ||
      this.parentPath === 'dar-revision'
    ) {
      if (subroutes === 'collateral-info') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = true;
      } else {
        this.textBoxHidden = true;
      }
    } else {
      this.textBoxHidden = true;
      this.statusDisabledOffering = true; // Menambahkan perubahan di sini
    }
  }
}
