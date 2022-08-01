import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb, MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ANIMATION } from 'app/shared/constants/base.constants';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import * as _ from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-update-custom',
  templateUrl: './credit-proposal-update-custom.component.html',
  styleUrls: ['./credit-proposal-custom.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CreditProposalUpdateCustomComponent implements OnInit, AfterViewInit {
  public selectedMenuId: String;
  public selectedMenuText: String;
  public changeForm: Boolean = false;
  public selectedPartyType: String;
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
    {
      id: 'Home',
      text: 'Home',
    },
  ];

  public creditProposal: ICreditProposal = new CreditProposal();
  public animation: object = ANIMATION;
  constructor(private creditProposalService: CreditProposalService, private route: ActivatedRoute, private router: Router) {}

  ngAfterViewInit(): void {
    if (this.creditProposal.prospectPerson) {
      this.selectedPartyType = 'individual';
    } else {
      this.selectedPartyType = 'corporate';
    }
  }

  ngOnInit(): void {
    this.creditProposal = this.route.snapshot.data['content'];
    this.selectedMenuId = 'customer-info';
    this.selectedMenuText = 'New';
  }

  public selectMenuItem(args: MenuEventArgs): void {
    const id = args.item.id;
    this.selectedMenuId = id;

    const text = args.item.text;
    this.selectedMenuText = text;
  }
  public save(): void {
    if (this.creditProposal.id) {
      this.creditProposalService.update(this.creditProposal).subscribe((res: HttpResponse<ICreditProposal>) => {
        this.router.navigate(['./credit-proposal']);
      });
    } else {
      this.creditProposalService.create(this.creditProposal).subscribe((res: HttpResponse<ICreditProposal>) => {
        this.router.navigate(['./credit-proposal']);
      });
    }
  }

  public selectPartyType(param: string): void {
    this.selectedPartyType = param.toLowerCase();
    if (!this.creditProposal.id) {
      this.changeForm = true;
      const _selectedPartyType = this.selectedPartyType.toLowerCase() === 'individual' ? 'PERSON' : 'default';
      this.creditProposalService.template(_selectedPartyType).subscribe((res: HttpResponse<ICreditProposal>) => {
        this.creditProposal = res.body;
        this.changeForm = false;
      });
    }
  }
}
