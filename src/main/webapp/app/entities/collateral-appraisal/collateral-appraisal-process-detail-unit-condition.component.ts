import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICollateralAppraisal } from './collateral-appraisal.model';
import { CollateralAppraisalService } from './collateral-appraisal.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { ICollateral, Collateral } from '../collateral/collateral.model';
import { CollateralService } from '../collateral/collateral.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-unit',
  templateUrl: './collateral-appraisal-process-detail-unit-condition.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalDetailProcessUnitConditionComponent implements OnInit {
  public item: ICollateral = new Collateral();

  constructor(private collateralService: CollateralService) {}
  ngOnInit(): void {
    this.getData();
  }

  saveCollateral() {
    this.collateralService.save(this.item).subscribe(response => console.log(response));
  }

  getData() {
    this.collateralService.query().subscribe((res: HttpResponse<ICollateral[]>) => {
      console.log('body collaterall', res.body);
    });
  }
}
