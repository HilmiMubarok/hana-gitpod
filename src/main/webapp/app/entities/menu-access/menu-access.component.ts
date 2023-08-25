import { Component, OnInit } from '@angular/core';
import { MenuAccessService } from './menu-access.service';
import { Observable, map } from 'rxjs';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'jhi-menu-access',
  templateUrl: './menu-access.component.html',
})
export class MenuAccessComponent implements OnInit {
  constructor(private menuAccessService: MenuAccessService) {}

  displayedColumns: string[] = ['no', 'id', 'description', 'action'];
  dataSource = [];
  dataSource$: Observable<Array<any>>;

  ngOnInit(): void {
    this.dataSource$ = this.menuAccessService.getMenuAccess().pipe(map(res => res.body));
  }

  previousState(): void {
    window.history.back();
  }
}
