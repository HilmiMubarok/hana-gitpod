import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MenuAccessStatusService } from './menu-access-status.service';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-menu-access-status',
  templateUrl: './menu-access-status.component.html',
  styleUrls: ['../menu-access.style.css'],
})
export class MenuAccessStatusComponent implements OnInit {
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

  constructor(private menuAccessStatusService: MenuAccessStatusService, protected router: Router) {}

  displayedColumns: string[] = ['no', 'id', 'description', 'action'];
  dataSource = [];
  dataSource$: Observable<Array<any>>;

  ngOnInit(): void {
    this.dataSource$ = this.menuAccessStatusService.getAccessStatus().pipe(map(res => res.body.filter(e => e.parentId !== null)));
  }

  public previousState(): void {
    window.history.back();
  }

  public triggerToggle(): void {
    this.isOpen = !this.isOpen;
  }

  public routeSubMenu(menu: any): void {
    menu.id === 'status' ? null : this.router.navigate(['./menu-access/']);
  }
}
