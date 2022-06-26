import { OnInit, OnDestroy, ElementRef, Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, combineLatest, iif, Observable, of, ReplaySubject, throwError } from 'rxjs';
import { catchError, mergeMap, tap, map, shareReplay } from 'rxjs/operators';

import { CODE } from '../constants/base.constants';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { saveAs } from 'file-saver';
import { IProcessTask } from '../model/process-task.model';
import { Account } from 'app/core/auth/account.model';
import { BaseDataUtils } from './base-data-utils.service';

@Component({ template: '' })
export class AbstractEntityPageComponent<T> implements OnDestroy {
  readonly CODE: typeof CODE = CODE;

  protected destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  protected stateSubject = new BehaviorSubject<any>(this.initialState());

  state$: Observable<any> = this.stateSubject.asObservable();
  tasks$: Observable<IProcessTask[]> = this.state$.pipe(map(res => res.tasks));
  item$: Observable<T> = this.state$.pipe(map(res => res.item));

  protected currentAccount: Account;
  protected listChangeEventName: string;
  protected useTask: boolean;
  isSaving: boolean;

  constructor(
    protected dataUtils?: BaseDataUtils,
    protected entityService?: AbstractEntityService<T>,
    protected elementRef?: ElementRef,
    protected confirmationService?: ConfirmationService,
    protected messageService?: MessageService
  ) {
    this.useTask = false;
    this.isSaving = false;
  }

  protected initialState(): any {
    return { item: null, tasks: [] };
  }

  protected initialize() {}

  protected destroy() {}

  ngOnDestroy() {
    this.destroy();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  protected itemKey(): any {
    return null;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: any, entity: any, field: string, isImage: boolean) {
    this.dataUtils.setFileData(event, entity, field, isImage);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.stateSubject.getValue().item, this.elementRef, field, fieldContentType, idInput);
  }

  previousState() {
    window.history.back();
  }

  protected preSave(state: any) {}

  protected postSave(state: any) {}

  protected prepareSaveEffect(state: any): Observable<any> {
    return of(state);
  }

  protected buildDependencyEffect(state: any): Observable<any> {
    return of(state);
  }

  save(req?: any) {
    this.isSaving = true;
    const prevState = this.stateSubject.getValue();
    this.prepareSaveEffect(prevState)
      .pipe(
        tap(state => this.preSave(state)),
        mergeMap(state =>
          this.entityService.save(state.item, req).pipe(
            map(res => ({ ...state, item: res.body })),
            tap(res => this.postSave(res))
          )
        ),
        mergeMap(state => this.buildDependencyEffect(state)),
        shareReplay()
      )
      .subscribe({
        next: newState => {
          this.stateSubject.next(newState);
          this.onSaveSuccess(newState.item);
        },
        error: (res: HttpErrorResponse) => this.onSaveError(res),
      });
  }

  protected onSaveSuccess(res: T) {
    this.messageService.add({ severity: 'info', summary: 'Data Saved', detail: 'Data saved ...' });
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(res: HttpErrorResponse) {
    this.messageService.add({ severity: 'warning', summary: res.error.title, detail: res.error.detail });
    this.isSaving = false;
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
  }

  print() {}

  onUploadFile(event: any) {
    const files: FileList = event.target.files;

    if (files.length > 0) {
      const formData: FormData = new FormData();
      formData.append('file', files[0], files[0].name);
      this.entityService.uploadFile(formData, null).subscribe();
    }
  }

  downloadFile(fileName: string) {
    this.entityService.downloadFile(fileName).subscribe(res => {
      // const contentDisposition = res.headers.get('content-disposition') || '';
      // const matches = /filename=([^;]+)/gi.exec(contentDisposition);
      // const blobFileName = (matches[1] || 'untitled').trim();

      // const blob = new Blob([res.body], { type: 'application/octet-stream' });
      saveAs(res.body, fileName);
    });
  }

  protected executeTask(task: IProcessTask) {
    this.prepareSaveEffect(this.stateSubject.getValue())
      .pipe(
        tap(state => this.preSave(state)),
        mergeMap(state =>
          this.entityService.save(state.item).pipe(
            map(res => ({ ...state, item: res.body })),
            tap(res => this.postSave(res))
          )
        ),
        mergeMap(state => this.buildDependencyEffect(state)),
        mergeMap(() => this.entityService.processTask(task)),
        shareReplay()
      )
      .subscribe({
        next: taskResult => {
          const msg = taskResult.body.message;
          if (msg) {
            let sevr = 'info';
            let sumr = 'Task Summary';
            if (taskResult.body.statusResult === 99) {
              sevr = 'error';
              sumr = 'Error Information';
            }
            this.messageService.add({ severity: sevr, summary: sumr, detail: msg });
          }

          const prevState = this.stateSubject.getValue();
          iif(() => this.useTask, this.entityService.getTasks(prevState.item.id).pipe(map(res => res.body)), of([]))
            .pipe(
              map(res => ({ ...prevState, tasks: res })),
              mergeMap(state => this.entityService.find(state.item.id).pipe(map(res => ({ ...state, item: res.body })))),
              mergeMap(state => this.loadRelatedEntityEffect(state))
            )
            .subscribe(state => {
              this.stateSubject.next(state);
              if (state.tasks.length === 0) {
                this.previousState();
              }
            });
        },
        error: res => {
          this.isSaving = false;
          this.messageService.add({ severity: 'error', summary: 'Transaksi gagal, data Error', detail: res.message });
        },
      });
  }

  showFormValue(formKey: string, task: IProcessTask) {}

  completeFormValue(formKey: string, task: IProcessTask) {}

  processTask(task: IProcessTask) {
    this.isSaving = true;
    try {
      if (task.requiredConfirmation) {
        this.confirmationService.confirm({
          message: task.confirmationMessage,
          header: 'Confirmation',
          icon: 'fa fa-question-circle',
          accept: () => {
            if (task.formKey) {
              this.showFormValue(task.formKey, task);
            } else {
              this.executeTask(task);
            }
          },
        });
      } else if (task.formKey) {
        this.showFormValue(task.formKey, task);
      } else {
        this.executeTask(task);
      }
    } finally {
      this.isSaving = false;
    }
  }

  loadItem() {
    return of(this.stateSubject.getValue());
  }

  protected loadRelatedEntityEffect(state: any): Observable<any> {
    return of(state);
  }

  readOnly(): boolean {
    return false;
  }

  public setValue(item: any, id: string, value?: any) {
    if (!item) {
      item = {};
    }
    if (item[id] === undefined) {
      item[id] = null;
      if (value !== undefined) {
        item[id] = value;
      }
    }
    return item[id];
  }
}
