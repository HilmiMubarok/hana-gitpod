import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(protected activatedRoute: ActivatedRoute, private router: Router) {}

  @ViewChild('creditProposalCollateralInfoRemarksInfoComponent', {
    static: false,
  })
  creditProposalCollateralInfoRemarksInfoComponent: CreditProposalCollateralInfoRemarksInformationComponent;

  @ViewChild('creditProposalCollateralInfoRemarksCheckComponent', {
    static: false,
  })
  creditProposalCollateralInfoRemarksCheckComponent: CreditProposalCollateralInfoRemarksChecklistComponent;

  ngOnInit(): void {
    console.log(this.creditProposal.attributes['proposalType']);
  }
  private _creditProposal: ICreditProposal;

  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'CHECKLIST' }];
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @Input() isViewMode?: Boolean = false;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  public triggeredSave() {
    this.creditProposalCollateralInfoRemarksInfoComponent.triggeredSave();
    this.creditProposalCollateralInfoRemarksCheckComponent.triggeredSave();
  }
}
