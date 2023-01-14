import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { CreditProposalCollateralInfoRemarksInformationComponent } from './remarks/credit-proposal-collateral-info-remarks-information.component';
import { CreditProposalCollateralInfoRemarksChecklistComponent } from './remarks/credit-proposal-collateral-info-remarks-checklist.component';

@Component({
  selector: 'jhi-credit-proposal-collateral-info',
  templateUrl: './credit-proposal-collateral-info.component.html',
  styleUrls: ['./collateral-info-cp.style.scss'],
})
export class CreditProposalCollateralInfoComponent implements OnInit {
  public pacth: any;
  public view: boolean;
  public customPath: Boolean = false;

  constructor(private router: Router) {}

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

  private _creditProposal: ICreditProposal;

  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'CHECKLIST' }];
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @Input() isViewMode?: Boolean = false;

  @Input() parentSource?: String = '';

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  ngOnInit(): void {
    // View Sub Menu Collateral Info in Loan And Offering Letter
    if (
      // this.router.url.split('/')[1] === 'la-distribution' ||
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
  }

  public triggeredSave(proposalType: any) {
    if (this.selectedMenu === 'CHECKLIST') {
      this.creditProposalCollateralInfoRemarksCheckComponent.triggeredSave();
    } else {
      if (proposalType === 'Total Exposure > IDR 15 Bn') {
        this.creditProposalCollateralInfoRemarksInfoComponentAbove.triggeredSave();
      } else if (proposalType === 'Total Exposure <= IDR 15 Bn') {
        this.creditProposalCollateralInfoRemarksInfoComponentBelow.triggeredSave();
      } else if (proposalType === 'Total Exposure Back to Back') {
        this.creditProposalCollateralInfoRemarksInfoComponentBtb.triggeredSave();
      }
    }
  }
}
