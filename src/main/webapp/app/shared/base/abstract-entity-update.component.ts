import { OnInit, OnDestroy, ElementRef, Component } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { BaseDataUtils } from './base-data-utils.service';
import { ActivatedRoute } from '@angular/router';
import { AbstractEntityPageComponent } from './abstract-entity-page.component';
import { map, mergeMap, tap } from 'rxjs/operators';
import { iif, of } from 'rxjs';

@Component({ template: '' })
export class AbstractEntityUpdateComponent<T> extends AbstractEntityPageComponent<T> implements OnInit, OnDestroy {
  constructor(
    protected dataUtils?: BaseDataUtils,
    protected entityService?: AbstractEntityService<T>,
    protected elementRef?: ElementRef,
    protected confirmationService?: ConfirmationService,
    protected messageService?: MessageService,
    protected activatedRoute?: ActivatedRoute
  ) {
    super(dataUtils, entityService, elementRef, confirmationService, messageService);
  }

  ngOnInit() {
    this.isSaving = false;
    this.initialize();

    // Get Data
    this.activatedRoute.params
      .pipe(
        map(res => ({ ...this.stateSubject.getValue(), id: res['id'] })),
        mergeMap(state => this.activatedRoute.data.pipe(map(res => ({ ...state, item: res.content })))),
        mergeMap(state =>
          iif(() => this.useTask && state.id, this.entityService.getTasks(state.item.id).pipe(map(res => res.body)), of([])).pipe(
            map(res => ({ ...state, tasks: res }))
          )
        ),
        mergeMap(state => {
          if (!state.id) {
            return of(state);
          }
          return this.loadRelatedEntityEffect(state);
        })
      )
      .subscribe(state => {
        this.stateSubject.next(state);
      });
  }

  get item() {
    return this.stateSubject.getValue().item;
  }

  validate() {
    this.prepareSaveEffect(this.stateSubject.getValue())
      .pipe(
        tap(state => this.preSave(state)),
        mergeMap(state =>
          this.entityService.save(state.item).pipe(
            map(res => ({ ...state, item: res.body })),
            tap(res => this.postSave(res))
          )
        ),
        mergeMap(state => this.buildDependencyEffect(state))
      )
      .subscribe(state => this.stateSubject.next(state));
  }
}
