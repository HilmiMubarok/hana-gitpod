import { OnInit, OnDestroy, Input, Component, Output, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AbstractEntityService } from './abstract-entity.service';
import { BaseDataUtils } from './base-data-utils.service';

@Component({ template: '' })
export class AbstractEntityGridComponent<T> implements OnInit, OnDestroy {
  @Input() items: T[] = [];

  @Output() itemDelete: EventEmitter<T> = new EventEmitter<T>();
  @Output() itemSave: EventEmitter<T> = new EventEmitter<T>();
  @Output() updateMe: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  first: number;
  page: number;
  totalItems: number;
  itemsPerPage: number;
  rowsPerPage: number[];

  constructor(protected itemService: AbstractEntityService<T>, protected dataUtils?: BaseDataUtils) {
    this.first = 0;
    this.page = 1;
    this.rowsPerPage = [5, 10, 20];
    this.itemsPerPage = 5;
  }

  protected initialize() {}

  protected destroy() {}

  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy() {
    this.destroy();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.showFile(base64String, contentType);
  }
}
