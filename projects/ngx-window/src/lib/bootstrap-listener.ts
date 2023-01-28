import { ApplicationRef, Injector, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef } from '@angular/core';
import { WindowContainerComponent } from './window-container.component';

export function installWindowContainer(applicationRef: ApplicationRef, injector: Injector, componentFactoryResolver: ComponentFactoryResolver) {

    let windowContainerInstalled = false;

    return (component: ComponentRef<any>) => {
        if (!windowContainerInstalled) {
            let componentRef = componentFactoryResolver.resolveComponentFactory(WindowContainerComponent).create(injector);
            let domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

            applicationRef.attachView(componentRef.hostView);
            document.body.appendChild(domElem);

            windowContainerInstalled = true;
        }
    };
}