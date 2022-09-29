import { Component, OnInit } from '@angular/core';
import { IPartyCif } from './party-cif.model';
import { PartyCifService } from './party-cif.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'jhi-party-cif',
  templateUrl: './party-cif.component.html',
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({
          height: '0px',
          minHeight: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PartyCifComponent extends AbstractEntityMaterialComponent<IPartyCif> implements OnInit {
  get partyCifs() {
    return this.items;
  }

  set partyCifs(partyCif: IPartyCif[]) {
    this.items = partyCif;
  }

  public displayedColumns: string[] = ['no', 'cif', 'customerName', 'customerType', 'createdDate', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public expandedElement: IPartyCif | null;

  constructor(protected partyCifService: PartyCifService, protected _snackBar: MatSnackBar) {
    super(_snackBar, partyCifService);

    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }

  ngOnInit(): void {
    this.loadData();
  }

  protected postLoadDataLazy(): void {
    this.loadData();
  }

  public search() {
    console.log('xxx');
  }

  private loadData() {
    this.loading = true;
    if (this.currentSearch) {
      this.partyCifService
        .search({
          page: this.page - 1,
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sortData(),
        })
        .pipe(map((res: HttpResponse<IPartyCif[]>) => this.preLoad(res)))
        .subscribe({
          next: (res: HttpResponse<IPartyCif[]>) => this.initDataForMatTable(res.body, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }

    this.partyCifService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe({
        next: (res: HttpResponse<IPartyCif[]>) => this.initDataForMatTable(res, res.headers),
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }
}
