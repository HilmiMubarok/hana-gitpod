import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ANIMATION } from 'app/shared/constants/base.constants';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import * as _ from 'lodash';
import { CreditRating } from '../credit-rating/credit-rating.model';

@Component({
  selector: 'jhi-credit-proposal-update-custom',
  templateUrl: './credit-proposal-update-custom.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CreditProposalUpdateCustomComponent implements OnInit {
  public selectedMenuId: String;
  public changeForm: Boolean = false;
  public partyTypes: string[] = ['Individual', 'Corporate'];
  public selectedPartyType: String = 'Individual';
  public menuItems: MenuItemModel[] = [
    {
      id: 'customer-info',
      text: 'Customer Info',
    },
    {
      id: 'credit-rating',
      text: 'Credit Rating',
    },
    {
      id: 'collateral-info',
      text: 'Collateral Info',
    },
    {
      id: 'facility-info',
      text: 'Facility Info',
    },
    {
      id: 'financial-info',
      text: 'Financial Info',
    },
    {
      id: 'slik',
      text: 'SLIK',
    },
    {
      id: 'decision-approval-report',
      text: 'Decision Approval Report',
    },
  ];
  public creditProposal: ICreditProposal = new CreditProposal();
  public animation: object = ANIMATION;

  constructor(private creditProposalService: CreditProposalService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.creditProposal = this.route.snapshot.data['content'];
    this.selectedMenuId = 'customer-info';
  }

  public selectMenuItem(args: MenuEventArgs): void {
    const id = args.item.id;
    this.selectedMenuId = id;
  }

  public save(): void {
    if (this.creditProposal.id) {
      console.log('xxx', this.creditProposal);

      this.creditProposalService.update(this.creditProposal).subscribe((res: HttpResponse<ICreditProposal>) => {
        this.router.navigate(['./credit-proposal']);
      });
    } else {
      this.creditProposalService.create(this.creditProposal).subscribe((res: HttpResponse<ICreditProposal>) => {
        this.router.navigate(['./credit-proposal']);
      });
    }
  }

  public selectPartyType(args: any): void {
    const value: String = args['value'];
    if (!this.creditProposal.id) {
      this.changeForm = true;
      const _selectedPartyType = value.toLowerCase() === 'individual' ? 'PERSON' : 'default';
      this.creditProposalService.template(_selectedPartyType).subscribe((res: HttpResponse<ICreditProposal>) => {
        this.creditProposal = res.body;
        this.creditProposal.creditRatings.push(new CreditRating());
        this.changeForm = false;
      });
    }
  }
}
