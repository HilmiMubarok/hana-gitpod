import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb, MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ANIMATION } from 'app/shared/constants/base.constants';
import { ICollateral, Collateral } from '../collateral/collateral.model';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import * as _ from 'lodash';
import { IProcessTask, ITaskResult } from 'app/shared/model/process-task.model';
import { IPartyGroup } from '../party-group/party-group.model';

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
  public collateral: ICollateral = new Collateral();
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
    this.collateral = this.creditProposal.collaterals[0];
    this.selectedMenuId = 'customer-info';
    this.selectedMenuText = 'New';
  }

  public selectMenuItem(args: MenuEventArgs): void {
    const id = args.item.id;
    this.selectedMenuId = id;
  }

  public previousState(): void {
    window.history.back();
  }

  private preSave(): void {
    if (this.creditProposal.prospectOrganization) {
      const _arr: object = {};
      const org: IPartyGroup = this.creditProposal.prospectOrganization;

      if (org.cif) {
        _arr['cif'] = org.cif;
      } else {
        _arr['cif'] = '';
      }

      if (org.identityTypeId) {
        _arr['identityTypeId'] = org.identityTypeId;
      } else {
        _arr['identityTypeId'] = '';
      }

      if (org.identityNumber) {
        _arr['identityNumber'] = org.identityNumber;
      } else {
        _arr['identityNumber'] = '';
      }

      if (org.endOfDate) {
        _arr['endOfDate'] = new Date(org.endOfDate);
      } else {
        _arr['endOfDate'] = '';
      }

      if (org.businessTypeId) {
        _arr['businessTypeId'] = org.businessTypeId;
      } else {
        _arr['businessTypeId'] = '';
      }

      if (org.npwp) {
        _arr['npwp'] = org.npwp;
      } else {
        _arr['npwp'] = '';
      }

      if (org.otherName) {
        _arr['otherName'] = org.otherName;
      } else {
        _arr['otherName'] = '';
      }

      if (org.lineOfBusinessId) {
        _arr['lineOfBusinessId'] = org.lineOfBusinessId;
      } else {
        _arr['lineOfBusinessId'] = '';
      }

      if (org.pic) {
        _arr['pic'] = org.pic;
      } else {
        _arr['pic'] = '';
      }

      if (org.koreanIdNumber) {
        _arr['koreanIdNumber'] = org.koreanIdNumber;
      } else {
        _arr['koreanIdNumber'] = '';
      }

      if (org.riskProfileId) {
        _arr['riskProfileId'] = org.riskProfileId;
      } else {
        _arr['riskProfileId'] = '';
      }

      if (org.pepId) {
        _arr['pepId'] = org.pepId;
      } else {
        _arr['pepId'] = '';
      }

      if (org.riskProfileId) {
        _arr['riskProfileId'] = org.riskProfileId;
      } else {
        _arr['riskProfileId'] = '';
      }

      if (org.deedOfEstablishNo) {
        _arr['deedOfEstablishNo'] = org.pepId;
      } else {
        _arr['deedOfEstablishNo'] = '';
      }

      if (org.notaryName) {
        _arr['notaryName'] = org.notaryName;
      } else {
        _arr['notaryName'] = '';
      }

      if (org.bodTermEndDate) {
        _arr['bodTermEndDate'] = new Date(org.bodTermEndDate);
      } else {
        _arr['bodTermEndDate'] = '';
      }
      this.creditProposal.prospectOrganization.attributes = _arr;
    }
  }

  public save(): void {
    console.log('this.creditProposal : ', this.creditProposal);
    this.preSave();
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

  public process(task: IProcessTask): void {
    this.creditProposalService.processTask(task).subscribe((res: HttpResponse<ITaskResult>) => {
      location.reload();
    });
  }
}
