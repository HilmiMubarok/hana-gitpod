import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { ButtonComponent } from './button/button-component';
import { TextBoxComponent } from './text-box/text-box-component';
import { RibbonComponent } from './ribbon/ribbon-component';

export const sampleEjsRoute: Routes = [
  {
    path: 'buttonE',
    component: ButtonComponent,
  },
  {
    path: 'textboxE',
    component: TextBoxComponent,
  },
  {
    path: 'ribbonB',
    component: RibbonComponent,
  },
];
