import { Clipboard } from '@angular/cdk/clipboard';
import { LoanCommitteeDelegationService } from './loan-committee-delegation.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'jhi-loan-committee-delegation',
  templateUrl: './loan-committee-delegation.component.html',
  styleUrls: ['../correction-application/correction-application.scss'],
})
export class LoanCommitteeDelegationComponent implements OnInit {
  searchForm: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public displayedColumns: string[] = ['no', 'applicationNumber', 'cif', 'customerName', 'internalName', 'status', 'actions'];

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  // Pagination
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: LoanCommitteeDelegationService, private clipBoard: Clipboard, protected _snackbar: MatSnackBar) {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  search(): void {
    this.isLoading.next(true);
    const params = {
      query: this.searchForm.value.search,
      page: this.currentPage.toString(),
      size: this.pageSize.toString(),
      sort: ['id,desc'],
    };

    this.service.getLoanCommitteeDelegation(params).subscribe(res => {
      this.dataSource.data = res.body;
      this.totalItems = Number(res.headers.get('X-Total-Count')) || 0;
      this.isLoading.next(false);
    });
  }

  loadData(): void {
    this.isLoading.next(true);
    const params = {
      page: this.currentPage.toString(),
      size: this.pageSize.toString(),
      sort: ['id,desc'],
    };

    this.service.getLoanCommitteeDelegation(params).subscribe(res => {
      this.dataSource.data = res.body;
      this.totalItems = Number(res.headers.get('X-Total-Count')) || 0;
      this.isLoading.next(false);
    });
  }

  clear(): void {
    this.searchForm.reset();
    this.loadData();
  }

  onPaginateChange(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    if (this.searchForm.value.search) {
      this.search();
    } else {
      this.loadData();
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  public copy(text: string): void {
    this.clipBoard.copy(text);
    this._snackbar.open('copy ' + text + ' successfully to your clipboard', null, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 1000,
    });
  }
}
