import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ANIMATION } from 'app/shared/constants/base.constants';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';

@Component({
  selector: 'jhi-credit-proposal-update-custom',
  templateUrl: './credit-proposal-update-custom.component.html',
})
export class CreditProposalUpdateCustomComponent implements OnInit {
  public selectedMenuId: String;
  public menuItems: MenuItemModel[] = [
    {
      id: '1',
      text: 'Credit Grading',
    },
    {
      id: '2',
      text: 'Customer Info',
      items: [
        {
          id: '3',
          text: 'Personal Info',
        },
        {
          id: '4',
          text: 'Employment Data',
        },
      ],
    },
  ];
  public creditProposal: ICreditProposal = new CreditProposal();
  public animation: object = ANIMATION;

  constructor(private creditProposalService: CreditProposalService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.creditProposal = this.route.snapshot.data['content'];
    this.selectedMenuId = '1';
  }

  public selectMenuItem(args: MenuEventArgs): void {
    const id = args.item.id;
    this.selectedMenuId = id;
  }

  public save(): void {
    console.log('xxx', this.creditProposal);

    // if(this.creditProposal.id){
    //   this.creditProposalService.update(this.creditProposal).subscribe((res: HttpResponse<ICreditProposal>) => {
    //     this.router.navigate(['./']);
    //   });
    // }else{
    //   this.creditProposalService.create(this.creditProposal).subscribe((res: HttpResponse<ICreditProposal>) => {
    //     this.router.navigate(['./']);
    //   });
    // }
  }
}
