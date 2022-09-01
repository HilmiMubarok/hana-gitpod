import { HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({ template: '' })
export class AbstractEntityMaterialComponent<T> implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public items: any;
  public paginatorLength: number;
  public paginatorPageSize: number;
  public pageEvent: PageEvent;
  public paginatorPageSizeOption: number[] = [10, 20, 30];
  public loading: boolean;
  public itemsPerPage: any;
  public page: number;

  constructor() {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  addIdx(data: Object[]) {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i]['idx'] = i;
      }
    }

    return data;
  }

  initDataForMatTable(data: any, headers: HttpHeaders) {
    this.items = new MatTableDataSource(this.addIdx(data.body));
    if (!this.items) {
      this.items.paginator = this.paginator;
    }
    this.items.sort = this.sort;
    this.paginatorLength = parseInt(headers.get('X-Total-Count'), 10);
    this.paginatorPageSize = this.paginator.pageSize;
    this.loading = false;
  }

  loadDataLazy(event?: PageEvent) {
    this.items = null;
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.postLoadDataLazy();
  }

  protected postLoadDataLazy() {}
}
