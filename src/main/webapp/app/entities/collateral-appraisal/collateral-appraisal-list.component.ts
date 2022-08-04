import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICollateralAppraisal, CollateralAppraisal } from './collateral-appraisal.model';
import { ICreditProposal, CreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { CollateralAppraisalService } from './collateral-appraisal.service';
import { CollateralService } from '../collateral/collateral.service';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { PartyCifService } from '../party-cif/party-cif.service';
import { PartyCif, IPartyCif } from '../party-cif/party-cif.model';
import { Collateral, ICollateral } from '../collateral/collateral.model';

import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-collateral-appraisal-list',
  templateUrl: './collateral-appraisal-list.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
// export class CollateralAppraisalListComponent extends AbstractEntityEj2GridComponent<ICollateralAppraisal> implements OnInit {
export class CollateralAppraisalListComponent implements OnInit {
  public data: ICollateral[];
  @ViewChild('template') template: DialogComponent;
  @Input() cif: string;
  public dialogVisible: boolean;
  public width?: string;
  public height?: string;
  public animationSettings?: Object;
  public dataSelectedCheckbox?: ICollateral[] = [];
  public partyCif: IPartyCif = new PartyCif();
  public collateralAppraisal: ICollateralAppraisal = new CollateralAppraisal();

  constructor(
    protected partyCifService: PartyCifService,
    protected collateralService: CollateralService,
    protected collateralAppraisalService: CollateralAppraisalService,
    protected creditProposalService: CreditProposalService,
    protected parseLinks: ParseLinks,
    protected alertService: AlertService,
    public accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: BaseDataUtils,
    protected router: Router,
    protected eventManager: EventManager,
    protected messageService: MessageService,
    protected modalService: NgbModal,
    protected confirmationService: ConfirmationService
  ) {
    this.width = '90%';
    this.height = '900px';
    this.dialogVisible = false;
    this.animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };
  }
  faEye = faEye;

  ngOnInit() {
    this.creditProposalService.find('cif/' + this.cif).subscribe((res: HttpResponse<ICreditProposal>) => {
      console.log('res.body creditProposal cif : ', res.body);
      this.data = res.body[0]['collaterals'];
      this.collateralAppraisal = res.body[0]['appraisals'][0];
      if (res.body[0]['prospectPerson']) {
        this.getPartyCif(res.body[0]['prospectPerson']['id']);
      } else {
        this.getPartyCif(res.body[0]['prospectOrganization']['id']);
      }
    });
  }

  getPartyCif(partyId: string): void {
    console.log('partyId : ', partyId);
    this.partyCifService.search().subscribe((res: HttpResponse<IPartyCif[]>) => {
      console.log('res.body party-cif: ', res.body);
      for (let i = 0; i < res.body.length; i++) {
        if (res.body[i]['partyId'] === partyId) {
          this.partyCif = res.body[i];
        }
      }
    });
  }

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }

  public detailClick(): void {
    this.dialogVisible = true;
  }

  checkValue(value: ICollateral): void {
    const data = this.dataSelectedCheckbox.filter(item => item.id === value.id);

    if (data.length === 0) {
      this.dataSelectedCheckbox.push(value);
    } else {
      this.dataSelectedCheckbox = this.dataSelectedCheckbox.filter(item => item.id !== value.id);
    }
  }

  save(): void {
    for (let i = 0; i < this.data.length; i++) {
      this.partyCif['collaterals'].push(this.data[i]);
    }
    this.partyCif['appraisals'].push(this.collateralAppraisal);
    // This is an example, because if want to put selected collateral (that can be more than 1) into appraisal,
    // then the appraisal must return more than 1 id
    this.partyCif['appraisals'][0]['collateralId'] = this.dataSelectedCheckbox[0]['id'];
    /* for(let i = 0; i < this.dataSelectedCheckbox.length; i++){
		this.partyCif['appraisals'][i]['collateralId'] = this.dataSelectedCheckbox[i]['id'];
		// Or
		this.partyCif['appraisals'].push(this.dataSelectedCheckbox[i]);
	} */

    console.log('this.partyCif : ', this.partyCif);
    console.log('this.collateralAppraisal : ', this.collateralAppraisal);
    console.log('this.data : ', this.data);
    console.log('this.dataSelectedCheckbox : ', this.dataSelectedCheckbox);

    this.savePartyCif();
    this.saveCollateralAppraisal();
  }

  savePartyCif(): void {
    console.log('this.partyCif : ', this.partyCif);
    /* this.partyCifService.save(this.partyCif).subscribe((res: HttpResponse<IPartyCif>) => {
      console.log('res.body save partyCif : ', res.body);
    });*/
  }

  saveCollateralAppraisal(): void {
    /* this.collateralAppraisalService.save(this.collateralAppraisal).subscribe((res: HttpResponse<ICollateralAppraisal>) => {
      console.log('res.body save collateralAppraisal : ', res.body);
	  this.router.navigate(['./collateral-appraisal']);
    }); */
    this.router.navigate(['./collateral-appraisal']);
  }
}
