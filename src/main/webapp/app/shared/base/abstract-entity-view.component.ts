import { OnDestroy, Input, ContentChild, TemplateRef, ElementRef, Output, EventEmitter, Component } from '@angular/core';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { AccountService } from 'app/core/auth/account.service';
import {
  CardViewDirective,
  EditViewDirective,
  ItemViewDirective,
  SimpleViewDirective,
  HeaderViewDirective,
  FooterViewDirective,
} from 'app/shared/base/abstract-entity-view.directive';
import { MessageService } from 'primeng/api';
import { Observable, of, ReplaySubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { BaseDataUtils } from './base-data-utils.service';
import { EventManager } from 'app/core/util/event-manager.service';

@Component({ template: '' })
export class AbstractEntityBaseViewComponent<T> implements OnDestroy {
  // Output
  @Output() validatedEmit: EventEmitter<T> = new EventEmitter<T>();
  @Output() saveItem: EventEmitter<T> = new EventEmitter<T>();
  @Output() deleteItem: EventEmitter<T> = new EventEmitter<T>();

  // Input
  @Input() mode: 'card' | 'item' | 'edit' | 'simple' = 'edit';
  @Input() isSaving: boolean;
  @Input() viewLabel: string;

  @Input() hiddenDefaultEdit = false;
  @Input() hiddenDefaultCard = false;
  @Input() hiddenDefaultItem = false;
  @Input() hiddenDefaultSimple = false;
  @Input() hiddenFooter = true;
  @Input() hiddenHeader = true;

  @ContentChild(CardViewDirective, { read: TemplateRef, static: false }) cardViewTemplate: any;
  @ContentChild(EditViewDirective, { read: TemplateRef, static: false }) editViewTemplate: any;
  @ContentChild(ItemViewDirective, { read: TemplateRef, static: false }) itemViewTemplate: any;
  @ContentChild(SimpleViewDirective, { read: TemplateRef, static: false }) simpleViewTemplate: any;
  @ContentChild(HeaderViewDirective, { read: TemplateRef, static: false }) headerViewTemplate: any;
  @ContentChild(FooterViewDirective, { read: TemplateRef, static: false }) footerViewTemplate: any;

  protected destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  protected _item: T;

  constructor(
    protected entityService: AbstractEntityService<T>,
    protected messageService?: MessageService,
    protected elementRef?: ElementRef,
    protected dataUtils?: BaseDataUtils,
    protected accountService?: AccountService,
    protected eventManager?: EventManager
  ) {}

  protected initialize() {}

  protected destroy() {}

  ngOnDestroy() {
    this.destroy();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  @Input()
  get item() {
    return this._item;
  }

  set item(item: T) {
    this._item = item;
  }

  protected onError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.showFile(base64String, contentType);
  }

  setFileData(event: any, entity: any, field: string, isImage: boolean) {
    this.dataUtils.setFileData(event, entity, field, isImage);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.item, this.elementRef, field, fieldContentType, idInput);
  }

  itemKey(): any {}

  protected preSave() {}

  protected buildDependencies(): Observable<T> {
    return of(this.item);
  }

  itemToSave() {
    this.preSave();
    if (this.itemKey() !== undefined) {
      return this.buildDependencies().pipe(mergeMap(() => this.entityService.update(this.item)));
    } else {
      return this.buildDependencies().pipe(mergeMap(() => this.entityService.create(this.item)));
    }
  }

  save() {
    this.itemToSave().subscribe(() => {});
  }

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
      const contentDisposition = res.headers.get('content-disposition') || '';
      const matches = /filename=([^;]+)/gi.exec(contentDisposition);
      const blobFileName = (matches[1] || 'untitled').trim();

      const blob = new Blob([res.body], { type: 'application/octet-stream' });
      saveAs(blob, blobFileName);
    });
  }

  validate() {
    if (this.validatedEmit) {
      this.validatedEmit.emit();
    }
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
