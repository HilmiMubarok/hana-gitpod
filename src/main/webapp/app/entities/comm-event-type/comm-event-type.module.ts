import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { commEventTypeRoute } from './comm-event-type.route';
import { CommEventTypeViewComponent } from './comm-event-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(commEventTypeRoute)],
  declarations: [CommEventTypeViewComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCommEventTypeModule {}
