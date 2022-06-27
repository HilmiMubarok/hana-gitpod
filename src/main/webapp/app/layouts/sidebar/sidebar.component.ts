import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { FlatNode, ISidebarMenuModel, SidebarMenuModel } from './sidebar.model';

import * as lodash from 'lodash';

@Component({
  selector: 'jhi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  public account: Account | null = null;
  private treeData: ISidebarMenuModel[] = [
    {
      name: 'Menu 1',
      children: [
        {
          name: 'Facility Type',
          route: 'facility-type',
        },
        {
          name: 'Menu 1.2',
        },
        {
          name: 'Menu 1.3',
        },
        {
          name: 'Menu 1.4',
        },
        {
          name: 'Menu 1.5',
        },
      ],
    },
    {
      name: 'Menu 2',
      children: [
        {
          name: 'Menu 2.1',
        },
        {
          name: 'Menu 2.2',
        },
        {
          name: 'Menu 2.3',
        },
        {
          name: 'Menu 2.4',
        },
        {
          name: 'Menu 2.5',
        },
      ],
    },
    {
      name: 'Menu 3',
      children: [
        {
          name: 'Menu 3.1',
        },
        {
          name: 'Menu 3.2',
        },
        {
          name: 'Menu 3.3',
        },
        {
          name: 'Menu 3.4',
        },
        {
          name: 'Menu 3.5',
        },
      ],
    },
  ];

  public treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  public treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  public dataSource: any = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private accountService: AccountService, private router: Router) {
    this.dataSource.data = this.treeData;
  }

  ngOnInit(): void {
    this.checkLogin();
  }

  ngAfterViewInit(): void {
    // set open first node for treeview
    this.treeControl.expand(this.treeControl.dataNodes[0]);
  }

  private checkLogin(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  public getClassActive(route: string): string {
    const currentUrl = this.router.url;
    if (currentUrl.indexOf(route) > -1) {
      return 'selected';
    }
    return null;
  }

  private transformer(node: SidebarMenuModel, lvl: number): any {
    const exp = !!node.children && node.children.length > 0;
    return {
      expandable: exp,
      name: node.name,
      level: lvl,
      route: node.route,
    };
  }

  public hasChild(_: number, node: FlatNode): any {
    return node.expandable;
  }
}
