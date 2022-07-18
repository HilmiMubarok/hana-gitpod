import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { DataStateChangeEventArgs } from '@syncfusion/ej2-grids';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'jhi-credit-proposal',
  templateUrl: './credit-proposal.component.html',
})
export class CreditProposalComponent extends AbstractEntityComponent<ICreditProposal> {
  public data: Observable<DataStateChangeEventArgs[]>;
  public pageOptions: Object;
  public state: DataStateChangeEventArgs;

  private BASE_URL = 'https://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Orders';

  constructor(
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
    protected confirmationService: ConfirmationService,
    private http: HttpClient
  ) {
    super(
      creditProposalService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );

    this.parentRoute = '/credit-proposal';
    this.listChangeEventName = 'creditProposalListModification';
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

  /* public dataStateChange(state: DataStateChangeEventArgs): void {
    this.execute(state);
   }

   public ngOnInit(): void {
	this.pageOptions = { pageSize: 5, pageCount: 4 };
	const state = { skip: 0, take: 5 };
	this.execute(state);
   }

   public execute(state: any): void {
	this.getData(state).subscribe(x => {
		console.log('x : ', x['count']);
		this.data = of(x);
		console.log('this.data : ', this.data);
	});
   }

   public getData(state: DataStateChangeEventArgs): Observable<DataStateChangeEventArgs[]> {
	const pageQuery = `$skip=${state.skip}&$top=${state.take}`;

	return this.http.get(`${this.BASE_URL}?${pageQuery}&$inlinecount=allpages&$format=json`)
	.pipe(map((response: any) => (<any>{
		result: response['d']['results'],
		count: parseInt(response['d']['__count'], 10)
	})))
   }*/

  /* Start Here */
  public ngOnInit(): void {
    const state = { skip: 0, take: 5 };
    this.loadAllA(state);
  }

  public dataStateChange(state: DataStateChangeEventArgs): void {
    console.log('state @dataStateChange: ', state);
    this.loadAllA(state);
  }
  /* End Here */

  trackId(index: number, item: ICreditProposal) {
    return item.id;
  }

  get creditProposals() {
    return this.items;
  }

  set creditProposals(creditProposal: ICreditProposal[]) {
    this.items = creditProposal;
  }
}
