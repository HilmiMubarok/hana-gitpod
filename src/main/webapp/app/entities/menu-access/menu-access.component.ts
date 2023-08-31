import { Component, OnInit } from '@angular/core';
import { MenuAccessService } from './menu-access.service';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { IOptionNode } from 'app/shared/model/option-node.model';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'jhi-menu-access',
  templateUrl: './menu-access.component.html',
  styleUrls: ['./menu-access.style.css'],
})
export class MenuAccessComponent implements OnInit {
  // submenu Item
  public isOpen = false;
  public subMenu: IOptionNode[] = [
    {
      id: 'position',
      label: 'Position',
    },
    {
      id: 'status',
      label: 'Status',
    },
  ];

  constructor(private menuAccessService: MenuAccessService, protected router: Router) {}

  displayedColumns: string[] = ['no', 'id', 'description', 'action'];
  dataSource = [];
  dataSource$: Observable<Array<any>>;

  ngOnInit(): void {
    this.dataSource$ = this.menuAccessService.getMenuAccess().pipe(map(res => res.body.filter(e => e.parentId !== null)));
    console.log('aaaaaaaa', this.subMenu);
  }

  public previousState(): void {
    window.history.back();
  }

  public triggerToggle(): void {
    this.isOpen = !this.isOpen;
  }

  public routeSubMenu(menu: object): void {
    this.router.navigate(['./menu-access/' + menu]);
  }
}
