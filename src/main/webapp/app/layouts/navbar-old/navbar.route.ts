import { Route } from '@angular/router';

import { NavbarOldComponent } from './navbar.component';

export const navbarRoute: Route = {
  path: '',
  component: NavbarOldComponent,
  outlet: 'navbar',
};
