import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { commEventRoute } from './comm-event.route';
import { CommEventViewComponent } from './comm-event-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(commEventRoute)],
  declarations: [CommEventViewComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCommEventModule {}
