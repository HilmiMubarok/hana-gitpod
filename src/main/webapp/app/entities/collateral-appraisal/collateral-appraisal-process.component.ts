import { Component, ViewChild } from '@angular/core';
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
import { ItemModel, OpenCloseMenuEventArgs, DropDownButtonComponent } from '@syncfusion/ej2-angular-splitbuttons';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'jhi-collateral-appraisal-process',
  templateUrl: './collateral-appraisal-process.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalProcessComponent {
  public BlodType: string[] = ['Objek Jaminan', '.........'];
  @ViewChild('dropdownbutton')
  public dropdownbutton: DropDownButtonComponent;
  public data: ItemModel[] = [
    {
      text: 'Rincian',
    },
    {
      text: 'Hapus',
    },
  ];

  public onOpen(args: OpenCloseMenuEventArgs) {
    args.element.parentElement.style.top =
      this.dropdownbutton.element.getBoundingClientRect().top - args.element.parentElement.offsetHeight + 'px';
  }
}
