import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { ICollateralAppraisal, CollateralAppraisal } from './collateral-appraisal.model';
import { CollateralAppraisalService } from './collateral-appraisal.service';
import { ILoanApplication, LoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { ICollateral, Collateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { IParty } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { EmitType } from '@syncfusion/ej2-base';
import { CifService } from '../cif/cif.service';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { IPerson, Person } from '../person/person.model';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';

type SelectableEntity = ILoanApplication | ICollateral | IParty;

@Component({
  selector: 'jhi-appraisal-data-nasabah',
  templateUrl: './collateral-appraisal-form-cif.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalFormCifComponent extends AbstractEntityUpdateComponent<ICollateralAppraisal> {
  public Person: IPerson = new Person();
  public PartyGroub: IPartyGroup = new PartyGroup();

  public responseCif: string;
  public searchInput: string;

  public dataPerson: Person = {
    firstName: 'name',
  };

  baseapplications: ILoanApplication[] = [];

  collaterals: ICollateral[] = [];
  prospectPerson: IPerson[] = [];
  parties: IParty[] = [];
  applicationId: number;
  collateralId: number;
  partyId: number;

  constructor(
    private creditProposalService: CreditProposalService,
    private cifService: CifService,
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected collateralAppraisalService: CollateralAppraisalService,
    protected loanApplicationService: LoanApplicationService,
    protected collateralService: CollateralService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, collateralAppraisalService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'collateralAppraisalListModification';
  }

  protected initialState(): any {
    return { item: new CollateralAppraisal(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['applicationId']) {
        this.applicationId = params['applicationId'];
      }
      if (params['collateralId']) {
        this.collateralId = params['collateralId'];
      }
      if (params['partyId']) {
        this.partyId = params['partyId'];
      }
    });

    this.loanApplicationService.loadCacheAll().subscribe((res: ILoanApplication[]) => (this.baseapplications = res || []));

    this.collateralService.loadCacheAll().subscribe((res: ICollateral[]) => (this.collaterals = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
  }

  // response data

  protected loadRelatedEntityEffect(state: any): Observable<any> {
    const result = of(state);
    return result;
  }

  protected buildDependencyEffect(state: any): Observable<any> {
    return of(state);
  }

  protected prepareSaveEffect(state: any): Observable<any> {
    return of(state);
  }

  trackBaseApplicationById(index: number, item: ILoanApplication) {
    return item.id;
  }

  trackCollateralById(index: number, item: ICollateral) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get collateralAppraisal() {
    return this.item;
  }

  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef }) container: ElementRef;
  // The Dialog shows within the target element.
  public targetElement: HTMLElement;

  //To get all element of the dialog component after component get initialized.
  ngOnInit() {
    this.initilaizeTarget();
  }

  searchData(event: any) {
    console.log(this.responseCif);
  }

  // Initialize the Dialog component's target element.
  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  public visible: Boolean = false;
  // Hide the Dialog when click the footer button.

  // Sample level code to handle the button click action
  onOpenDialog(event: any): void {
    this.creditProposalService.find('cif/' + this.searchInput).subscribe(response => {
      this.responseCif = response.body[0].partyTypeId;
      this.prospectPerson = response.body[0].prospectPerson;
    });
  }
}
