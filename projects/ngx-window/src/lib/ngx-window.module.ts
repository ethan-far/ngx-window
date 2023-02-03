import { ApplicationRef, APP_BOOTSTRAP_LISTENER, Component, ComponentFactoryResolver, Injector, NgModule } from '@angular/core';
import { installWindowContainer } from './bootstrap-listener';
import { ElementPositionService } from './element-position.service';
import { WindowCloserDirective } from './window-closer.directive';
import { WindowContainerComponent } from './window-container.component';
import { WindowComponent } from './window.component';
import { WindowService } from './window.service';

@NgModule({
    imports: [
    ],
    providers: [
        WindowService,
        ElementPositionService,
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
    ],
    entryComponents: [
        WindowContainerComponent
    ]
})
export class NgxWindowModule { }