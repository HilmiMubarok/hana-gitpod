import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { IPerson, Person } from '../../person/person.model';
import { IPartyGroup, PartyGroup } from '../../party-group/party-group.model';
import { ICollateral, Collateral } from '../../collateral/collateral.model';
import { ICollateralAppraisal, CollateralAppraisal } from '../collateral-appraisal.model';

import { PartyCifService } from '../../party-cif/party-cif.service';
import { IPartyCif, PartyCif } from '../../party-cif/party-cif.model';

import { CreditProposalService } from '../../credit-proposal/credit-proposal.service';
import { ICreditProposal, CreditProposal } from '../../credit-proposal/credit-proposal.model';

import { Observable, of } from 'rxjs';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-grids';
import { PageSettingsModel, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'jhi-collateral-appraisal-list',
  templateUrl: './collateral-appraisal-list.component.html',
  styleUrls: ['./collateral-appraisal-list.css'],
})
export class CollateralAppraisalListComponent implements OnInit {
  @ViewChild('template') template: DialogComponent;
  @Input() cifNumber: string;
  public cifType?: string;

  private partyCif?: IPartyCif;
  public partyCifData: Observable<{
    result: any[];
    count: number;
  }>;
  private collateral?: ICollateral;
  private collateralsData?: ICollateral[];
  public dataSelectedCheckbox?: ICollateral[] = [];
  private person?: IPerson;
  private partyGroup?: IPartyGroup;
  private collateralAppraisal: ICollateralAppraisal = new CollateralAppraisal();

  public dialogSection: string;
  public showCollateral = false;
  public dialogVisible: boolean;
  public width = '90%';
  public height = '90%';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  public pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 2, pageSize: 5 };

  constructor(
    protected router: Router,
    protected partyCifService: PartyCifService,
    protected creditProposalService: CreditProposalService
  ) {}

  // Implement onInit only because not extend from abstractEJ2 with new service that get cifData with elastic --  Start
  ngOnInit() {
    // Use this because mock only at creditProposalService -- Start
    this.creditProposalService.find('cif/' + this.cifNumber).subscribe((res: HttpResponse<ICreditProposal>) => {
      this.getPartyCif();
    });
    // Use this because mock only at creditProposalService -- End
  }
  // Implement onInit only because not extend from abstractEJ2 with new service that get cifData with elastic --  End

  private getPartyCif(): void {
    const passPartyCifData = {
      result: [],
      count: 0,
    };
    /* const passCollateralsData = {
      result: [],
      count: 0,
    };*/

    this.partyCifService.find('cif/' + this.cifNumber).subscribe((res: HttpResponse<IPartyCif>) => {
      this.partyCif = res.body;

      // Can do this because only return 1 object with current service & if using new service that get cifData with elastic, this will throw error -- Start
      passPartyCifData.result.push(res.body);
      passPartyCifData.result[0]['indexNum'] = 1;
      passPartyCifData.result[0]['name'] =
        res.body['customerType'] === 'PERSONAL' ? res.body['prospectPerson']['name'] : res.body['prospectOrganization']['name'];
      // Can do this because only return 1 object with current service & if using new service that get cifData with elastic, this will throw error -- Start
      passPartyCifData.count = 1;
      this.partyCifData = of(passPartyCifData);

      this.cifType = res.body['customerType'];
      this.person = res.body['customerType'] === 'PERSONAL' ? res.body['prospectPerson'] : new Person();
      this.partyGroup = res.body['customerType'] === 'CORPORATE' ? res.body['prospectOrganization'] : new PartyGroup();
    });
  }

  // Implement dataStateChange only because not extend from abstractEJ2 with new service that get cifData with elastic --  Start
  public dataStateChange(state: DataStateChangeEventArgs): void {
    console.log('dataStateChange');
  }
  // Implement dataStateChange only because not extend from abstractEJ2 with new service that get cifData with elastic --  End

  public onCifSelected(args: RowSelectEventArgs) {
    this.showCollateral = true;

    this.collateralsData = args.data['collaterals'];
  }

  // When onDetailClick, onCifSelected triggered after onDetailClick -- Because if clicked just a little bit outside element then 2 function fir

  public onDetailClick(section: string, data: ICollateral | any): void {
    this.dialogVisible = true;
    this.dialogSection = section;

    this.collateral = data;
  }

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }

  public onChecked(value: ICollateral): void {
    if (this.dataSelectedCheckbox.length === 0) {
      this.dataSelectedCheckbox.push(value);
    } else {
      this.dataSelectedCheckbox = this.dataSelectedCheckbox.filter(item => item.id !== value.id);
    }
  }

  public onAdd(): void {
    console.log('this.collateralAppraisal : ', this.collateralAppraisal);
    for (let i = 0; i < this.dataSelectedCheckbox.length; i++) {
      /* this.collateralAppraisal['statusId'] = 'DRAFT';
      this.collateralAppraisal['statusDescription'] = 'Draft';
      this.collateralAppraisal['applicationId'] = this.partyCif['id'];*/
      this.collateralAppraisal['collateralId'] = this.dataSelectedCheckbox[i]['id'];

      this.partyCif['appraisals'].push(this.collateralAppraisal);
    }

    console.log('this.partyCif : ', this.partyCif);
    console.log('this.dataSelectedCheckbox : ', this.dataSelectedCheckbox);

    this.partyCifService.save(this.partyCif).subscribe((res: HttpResponse<IPartyCif>) => {
      console.log('res.body save partyCif : ', res.body);
      this.router.navigate(['./collateral-appraisal']);
    });
  }
}
