import { Component, OnInit, ViewChild } from '@angular/core';
import { IRequestSlik } from './request-slik.model';
import { Observable, finalize, map } from 'rxjs';
import { RequestSlikService } from './request-slik.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { IOptionNode } from 'app/shared/model/option-node.model';

@Component({
  selector: 'jhi-request-slik-bucket',
  templateUrl: './request-slik-bucket.component.html',
  styleUrls: ['../credit-proposal/credit-proposal-list.css'],
})
export class RequestSlikBucketComponent implements OnInit {
  requestSliks$: Observable<IRequestSlik[]>;
  isLoading: Boolean = true;
  items: IRequestSlik[];
  displayedColumns: string[] = ['id', 'requestNumber', 'cif', 'debtorName', 'customerType', 'segment', 'requestDate', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private requestSlikService: RequestSlikService) {
    this.requestSliks$ = this.requestSlikService.getData().pipe(finalize(() => (this.isLoading = false)));
    this.getStatus();
  }

  public previousState(): void {
    window.history.back();
  }

  get requestSliks() {
    return this.items;
  }

  set requestSliks(requestSlik: IRequestSlik[]) {
    this.items = requestSlik;
  }

  totalItemCount;
  getData(page = 1, size = 10, sort = 'id,desc') {
    this.requestSlikService.getDataServerSidePagination(page, size, sort).subscribe({
      next: data => {
        // console.log('data', data);
        this.dataSource = new MatTableDataSource(data);
        this.totalItemCount = data.length;
        this.dataSource.paginator = this.paginator;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getData();
  }

  sortData(event: any) {
    const sort = event.active + ',' + event.direction;
    this.getData(1, 10, sort);
  }

  public requestSlikStatusCodes: IOptionNode[] = [];
  getStatus() {
    this.requestSlikService.getStatuses().subscribe(res => (this.requestSlikStatusCodes = res));
  }
  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.requestSlikStatusCodes, event.previousIndex, event.currentIndex);
  }

  public clickedChip;
  trackByFn(index, item) {
    return item.id; // or any other unique identifier
  }

  public chipClick(option): void {
    console.log(option);
    // this.page = 0;
    if (this.clickedChip === option) {
      document.getElementById('statusOption').style.backgroundColor = 'whitesmoke';
      this.clickedChip = '';
      // this.loadAll();
      this.isLoading = true;
      this.getData();
    } else {
      this.clickedChip = option;
      this.isLoading = true;
      this.requestSlikService.searchByStatus(option).subscribe({
        next: data => {
          // console.log('data', data);
          this.dataSource.data = data;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
      // this.requestSlikService.searchByStatus(option.id).subscribe(res => console.log(res));
    }
  }

  clearSearch() {
    this.searchCif = null;
    this.isLoading = true;
    this.getData();
  }

  searchCif: number;
  searchByCif(cif) {
    this.isLoading = true;
    this.requestSlikService.searchByCif(cif).subscribe({
      next: data => {
        // console.log('data', data);
        this.dataSource.data = data;
      },
      complete: () => {
        this.isLoading = false;
      },
    });

    // this.dataSource.data = cif && this.requestSlikService.searchByCif(cif).pipe(finalize(() => (this.isLoading = false)));
  }

  paginate(event: any) {
    const page = event.pageIndex + 1;
    const limit = event.pageSize;
    this.getData(page, limit, 'id,desc');
  }

  pageIndex;
  pageSize;
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getData(this.pageIndex, this.pageSize, 'id,desc');
  }
}
