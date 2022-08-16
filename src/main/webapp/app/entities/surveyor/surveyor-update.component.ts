import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { ISurveyor, Surveyor } from './surveyor.model';
import { SurveyorService } from './surveyor.service';
import { IRoleType, RoleType } from 'app/entities/role-type/role-type.model';
import { RoleTypeService } from 'app/entities/role-type/role-type.service';
import { IPerson, Person } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/person.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

type SelectableEntity = IRoleType | IPerson;

@Component({
  selector: 'jhi-surveyor-update',
  templateUrl: './surveyor-update.component.html',
})
export class SurveyorUpdateComponent extends AbstractEntityUpdateComponent<ISurveyor> {
  roletypes: IRoleType[] = [];

  people: IPerson[] = [];
  roleId: string;
  personId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected surveyorService: SurveyorService,
    protected roleTypeService: RoleTypeService,
    protected personService: PersonService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, surveyorService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'surveyorListModification';
  }

  protected initialState(): any {
    return { item: new Surveyor(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['roleId']) {
        this.roleId = params['roleId'];
      }
      if (params['personId']) {
        this.personId = params['personId'];
      }
    });

    this.roleTypeService.loadCacheAll().subscribe((res: IRoleType[]) => (this.roletypes = res || []));

    this.personService.loadCacheAll().subscribe((res: IPerson[]) => (this.people = res || []));
  }

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

  trackRoleTypeById(index: number, item: IRoleType) {
    return item.id;
  }

  trackPersonById(index: number, item: IPerson) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get surveyor() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/Surveyor/pdf', {});
    return false;
  }
}
