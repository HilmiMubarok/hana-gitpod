import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CommEventComponent } from './comm-event.component';
import { CommEventDetailComponent } from './comm-event-detail.component';
import { CommEventUpdateComponent } from './comm-event-update.component';
import { commEventRoute } from './comm-event.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(commEventRoute)],
  declarations: [CommEventComponent, CommEventDetailComponent, CommEventUpdateComponent],
  entryComponents: [CommEventComponent, CommEventUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCommEventModule {}
