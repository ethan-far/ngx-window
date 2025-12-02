import { APP_BOOTSTRAP_LISTENER, ApplicationRef, ComponentFactoryResolver, Injector, NgModule } from '@angular/core';
import { AlignmentService } from './alignment.service';
import { installWindowContainer } from './bootstrap-listener';
import { ElementPositionService } from './element-position.service';
import { WindowCloserDirective } from './window-closer.directive';
import { WindowContainerComponent } from './window-container.component';
import { WindowComponent } from './window.component';

@NgModule({
    imports: [],
    providers: [
        ElementPositionService,
        AlignmentService,
        {
            provide: APP_BOOTSTRAP_LISTENER,
            multi: true,
            useFactory: installWindowContainer,
            deps: [ApplicationRef, Injector, ComponentFactoryResolver]
        }
    ],
    declarations: [
        WindowComponent,
        WindowContainerComponent,
        WindowCloserDirective
    ],
    exports: [
        WindowComponent,
        WindowCloserDirective
    ]
})
export class NgxWindowModule { }