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
          name: 'Sample Form',
          route: 'sample-form',
        },
        {
          name: 'Sample Form Nested',
          route: 'sample-form/nested',
        },
        {
          name: 'Postal Address',
          route: 'postal-address',
        },

        {
          name: 'Credit Facility',
          route: 'credit-facility',
        },
        {
          name: 'Credit Rating',
          route: 'credit-rating',
        },
        {
          name: 'Organization Management',
          route: 'organization-management',
        },
        {
          name: 'Collateral',
          route: 'collateral',
        },
        {
          name: 'Collateral Type',
          route: 'collateral-type',
        },
        {
          name: 'Organization Financial',
          route: 'organization-financial',
        },
        {
          name: 'Organization Legal',
          route: 'organization-legal',
        },
        {
          name: 'Customer Info',
          route: 'customer-info',
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
    if (currentUrl === '/' + route) {
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
