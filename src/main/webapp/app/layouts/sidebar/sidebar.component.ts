import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { FlatNode, ISidebarMenuModel, SidebarMenuModel } from './sidebar.model';

@Component({
  selector: 'jhi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  public account: Account | null = null;
  private treeData: ISidebarMenuModel[] = [
    {
      name: 'Fruit',
      children: [
        {
          name: 'Apple',
          route: 'facility-type',
        },
        {
          name: 'Banana',
          route: 'facility-type',
        },
        {
          name: 'Fruit loops',
          route: 'facility-type',
        },
      ],
    },
    {
      name: 'Vegetables',
      children: [
        {
          name: 'Green',
          route: 'faciltiy-types',
        },
        {
          name: 'Orange',
          route: 'faciltiy-types',
        },
      ],
    },
    {
      name: 'Vegetables',
      children: [
        {
          name: 'Green',
        },
        {
          name: 'Orange',
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

  constructor(private accountService: AccountService) {
    this.dataSource.data = this.treeData;
  }

  ngOnInit(): void {
    this.checkLogin();
  }

  private checkLogin(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
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
