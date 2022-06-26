import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ILoanApplication } from './loan-application.model';
import { LoanApplicationService } from './loan-application.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

@Component({
  selector: 'jhi-loan-application',
  templateUrl: './loan-application.component.html',
})
export class LoanApplicationComponent extends AbstractEntityComponent<ILoanApplication> {
  constructor(
    protected loanApplicationService: LoanApplicationService,
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
    super(
      loanApplicationService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );

    this.parentRoute = '/loan-application';
    this.listChangeEventName = 'loanApplicationListModification';
    this.entityKeyName = 'id';

    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
      activatedRoute.queryParams.subscribe(params => {
        this.itemsPerPage = params['size'] || ITEMS_PER_PAGE;
        this.first = (this.page - 1) * this.itemsPerPage || 0;
      });
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  trackId(index: number, item: ILoanApplication) {
    return item.id;
  }

  aging(item: ILoanApplication) {
    let timeDiff = new Date().getTime() - new Date(item.createdDate).getTime();
    
    timeDiff = timeDiff / 1000;
    const seconds = Math.floor(timeDiff % 60);
    const secondsAsString = seconds < 10 ? '0' + seconds : seconds;

    timeDiff = timeDiff / 60;
    const minutes = Math.floor(timeDiff) % 60;
    const minutesAsString = minutes < 10 ? "0" + minutes : minutes;
    
    timeDiff = timeDiff / 60;
    const hours = Math.floor(timeDiff) % 24;
    const hoursAsString = hours < 10 ? "0" + hours : hours;

    timeDiff = Math.floor(timeDiff / 24);
    const days = Math.floor(timeDiff);
    const daysAsString = days < 10 ? "0" + days : days;

    return  daysAsString + ' days ' + hoursAsString + ' hours ' + minutesAsString + ' mins ';
  }

  get loanApplications() {
    return this.items;
  }

  set loanApplications(loanApplication: ILoanApplication[]) {
    this.items = loanApplication;
  }

}
