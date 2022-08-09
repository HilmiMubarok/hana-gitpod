import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { PartyCifService } from '../party-cif/party-cif.service';
import { PartyCif, IPartyCif } from '../party-cif/party-cif.model';
import { Collateral, ICollateral } from '../collateral/collateral.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { ICreditProposal, CreditProposal } from '../credit-proposal/credit-proposal.model';
import { ICollateralAppraisal, CollateralAppraisal } from './collateral-appraisal.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-collateral-appraisal-list',
  templateUrl: './collateral-appraisal-list.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalListComponent implements OnInit {
  @ViewChild('template') template: DialogComponent;
  @Input() cif: string;
  public data: ICollateral[];
  public dialogVisible: boolean;
  public width?: string;
  public height?: string;
  public animationSettings?: Object;
  public dataSelectedCheckbox?: ICollateral[] = [];
  public partyCif: IPartyCif = new PartyCif();
  public collateralAppraisal: ICollateralAppraisal = new CollateralAppraisal();

  constructor(
    protected partyCifService: PartyCifService,
    protected creditProposalService: CreditProposalService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    this.width = '90%';
    this.height = '900px';
    this.dialogVisible = false;
    this.animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };
  }

  faEye = faEye;

  ngOnInit() {
    this.collateralAppraisal = this.route.snapshot.data['content'];

    this.creditProposalService.find('cif/' + this.cif).subscribe((res: HttpResponse<ICreditProposal>) => {
      console.log('res.body creditProposal cif : ', res.body);
      this.data = res.body[0]['collaterals'];
      this.getPartyCifbyId(res.body[0]['cif']['id']);
    });
  }

  public getPartyCifbyId(id: number): void {
    this.partyCifService.find(id).subscribe((res: HttpResponse<IPartyCif>) => {
      console.log('res.body cif : ', res.body);
      this.partyCif = res.body;
    });
  }

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }

  public detailClick(): void {
    this.dialogVisible = true;
  }

  public checkValue(value: ICollateral): void {
    const data = this.dataSelectedCheckbox.filter(item => item.id === value.id);

    if (data.length === 0) {
      this.dataSelectedCheckbox.push(value);
    } else {
      this.dataSelectedCheckbox = this.dataSelectedCheckbox.filter(item => item.id !== value.id);
    }
  }

  public save(ev: any): void {
    for (let i = 0; i < this.dataSelectedCheckbox.length; i++) {
      this.collateralAppraisal['statusId'] = 'DRAFT';
      this.collateralAppraisal['statusDescription'] = 'Draft';
      this.collateralAppraisal['applicationId'] = this.partyCif['id'];
      this.collateralAppraisal['collateralId'] = this.dataSelectedCheckbox[i]['id'];

      this.partyCif['appraisals'].push(this.collateralAppraisal);
    }

    console.log('this.partyCif : ', this.partyCif);
    console.log('this.data/collateral : ', this.data);
    console.log('this.dataSelectedCheckbox : ', this.dataSelectedCheckbox);

    this.partyCifService.save(this.partyCif).subscribe((res: HttpResponse<IPartyCif>) => {
      console.log('res.body save partyCif : ', res.body);
      this.router.navigate(['./collateral-appraisal']);
    });
  }
}
