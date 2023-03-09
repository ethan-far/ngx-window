import { Component } from '@angular/core';

@Component({
    selector: 'ngx-test-resize-and-move-page',
    templateUrl: './resize-and-move-page.component.html',
    styleUrls: ['./resize-and-move-page.component.scss']
})
export class ResizeAndMovePageComponent {
    onDragOver(event: DragEvent) {
        event.preventDefault();
    }
}