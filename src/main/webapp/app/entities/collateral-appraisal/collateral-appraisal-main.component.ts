import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { CollateralAppraisalService } from './collateral-appraisal.service';
import { ICollateralAppraisal, CollateralAppraisal } from './collateral-appraisal.model';
import { PersonService } from '../person/person.service';
import { IPerson, Person } from '../person/person.model';
import { PartyGroupService } from '../party-group/party-group.service';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';
import { CollateralPropertyService } from '../collateral-property/collateral-property.service';
import { ICollateralProperty, CollateralProperty } from '../collateral-property/collateral-property.model';

import { IPostalAddress, PostalAddress } from '../postal-address/postal-address.model';
import { CollateralService } from '../collateral/collateral.service';
import { ICollateral, Collateral } from '../collateral/collateral.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { ICreditProposal, CreditProposal } from '../credit-proposal/credit-proposal.model';
import { PartyCifService } from '../party-cif/party-cif.service';
import { IPartyCif, PartyCif } from '../party-cif/party-cif.model';

// import { Observable, of } from 'rxjs';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { MenuComponent, FieldSettingsModel } from '@syncfusion/ej2-angular-navigations';

import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

@Component({
  selector: 'jhi-collateral-appraisal-main',
  templateUrl: './collateral-appraisal-main.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalMainComponent implements OnInit {
  /* Test */
  constructor(
    private collateralAppraisalService: CollateralAppraisalService,
    private personService: PersonService,
    private partyGroupService: PartyGroupService,
    private collateralPropertyService: CollateralPropertyService,
    private collateralService: CollateralService,
    private creditProposalService: CreditProposalService,
    private partyCifService: PartyCifService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {}

  @ViewChild('menu')
  private menuObj: MenuComponent;
  public menuFields: FieldSettingsModel = {
    text: ['text'],
  };
  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [
    {
      text: 'Appraisal Info',
    },
    {
      text: 'Customer Info',
    },
    {
      text: 'Collateral Info',
    },
  ];

  public collateralAppraisal: ICollateralAppraisal = new CollateralAppraisal();
  public person: IPerson = new Person();
  public partyGroup: IPartyGroup = new PartyGroup();
  // Temporary var for temporary show -- Start
  public collateralTypes = ['VEHICLE', 'MACHINE', 'REALESTATE'];
  public selectedCollateralType = 'REALESTATE';
  // Temporary var for temporary show -- End
  public collateralType: string;
  public collateralProperty: ICollateralProperty = new CollateralProperty();

  public partyType: string;
  public tipeOfficerAppraisal?: string;
  public primaryAddress: IPostalAddress = new PostalAddress();
  // public applicationId: number;
  // public applicationNumber: string;
  // public applicationNumber: Observable<string>;
  // public collateral: ICollateral = new Collateral();
  // public creditProposal: ICreditProposal = new CreditProposal();
  // public partyCif: IPartyCif = new PartyCif();

  ngOnInit(): void {
    this.selectedMenu = 'Appraisal Info';

    /* this.collateralAppraisalService
      .find(this.activatedRoute.snapshot.paramMap.get('id'))
      .subscribe((res: HttpResponse<ICollateralAppraisal>) => {
        console.log('res.body collateral appraisal: ', res.body);
        this.collateralAppraisal = res.body;
        // this.collateralType = res.body['collateralDescription']; @Hartono -> + collateral appraisal
        this.getCustomerInfo();
        // this.getCollateralProperties();
      }); */
  }

  private getCustomerInfo(): void {
    this.partyType = this.activatedRoute.snapshot.paramMap.get('customerType') === 'PERSON' ? 'Individual' : 'Corporate';
    this.getPartyCif(this.activatedRoute.snapshot.paramMap.get('number'));
  }

  private getPartyCif(cifNumber: string): void {
    this.partyCifService.find('/cif' + cifNumber).subscribe((res: HttpResponse<IPartyCif>) => {
      console.log('res.body party cif : ', res.body);
      // this.primaryAddress = res.body['postalAddresses'];
      if (res.body['customerType'] === 'CORPORATE') {
        this.getPerson(res.body['partyId']);
      } else {
        this.getPartyGroup(res.body['partyId']);
      }
    });
  }

  private getPerson(partyId: string): void {
    this.personService.find(partyId).subscribe((res: HttpResponse<IPerson>) => {
      console.log('res.body person : ', res.body);
      this.person = res.body;
    });
  }

  private getPartyGroup(partyId: string): void {
    this.partyGroupService.find(partyId).subscribe((res: HttpResponse<IPartyGroup>) => {
      console.log('res.body party group : ', res.body);
      this.partyGroup = res.body;
    });
  }

  /* private getCollateralProperties() void {
	this.collateralPropertyService.find().subscribe((res: HttpResponse<ICollateralProperty>) => {
		console.log('res.body collateral properties : ', res.body);
		this.collateralProperty = res.body;
	});
  }*/

  public onSave(ev: any): void {
    this.router.navigate(['./collateral-appraisal']);
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public onValTipeOfficerAppraisalChanged(ev): void {
    this.tipeOfficerAppraisal = ev;
    if (ev === 'external') {
      this.menuItems = [
        {
          text: 'Appraisal Info',
        },
        {
          text: 'Customer Info',
        },
        {
          text: 'Collateral Info',
        },
        {
          text: 'External Officer Info',
        },
      ];
    } else {
      this.menuItems = [
        {
          text: 'Appraisal Info',
        },
        {
          text: 'Customer Info',
        },
        {
          text: 'Collateral Info',
        },
        {
          text: 'Valuation',
        },
        {
          text: 'Negative Collateral',
        },
        {
          text: 'Comparison Data',
        },
        {
          text: 'Foto Object Jaminan',
        },
        {
          text: 'Summary',
        },
      ];
    }
  }
}
