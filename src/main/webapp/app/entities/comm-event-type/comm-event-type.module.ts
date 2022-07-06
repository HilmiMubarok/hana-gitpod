import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CommEventTypeComponent } from './comm-event-type.component';
import { CommEventTypeDetailComponent } from './comm-event-type-detail.component';
import { CommEventTypeUpdateComponent } from './comm-event-type-update.component';
import { commEventTypeRoute } from './comm-event-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(commEventTypeRoute)],
  declarations: [CommEventTypeComponent, CommEventTypeDetailComponent, CommEventTypeUpdateComponent],
  entryComponents: [CommEventTypeComponent, CommEventTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCommEventTypeModule {}
