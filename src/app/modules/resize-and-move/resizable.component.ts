import { Component } from '@angular/core';
import { WindowOptions } from '../../../../projects/ngx-window/src/public-api';

@Component({
    selector: 'ngx-test-resizable',
    templateUrl: './resizable.component.html',
    styleUrls: ['./resizable.component.scss']
})
export class ResizableComponent {
    topWindowOptions: WindowOptions = {
        visibility: {
            startOpen: true,
            keepOpen: {
                onClickOutside: true,
                onIntersection: true
            }
        },
        alignment: {
            window: { vertical: 'bottom', horizontal: 'center' },
            reference: { horizontal: 'center' }
        }
    };

    leftWindowOptions: WindowOptions = {
        visibility: {
            startOpen: true,
            keepOpen: {
                onClickOutside: true,
                onIntersection: true
            }
        },
        alignment: {
            window: { horizontal: 'right', vertical: 'center' },
            reference: { vertical: 'center' }
        }
    };

    rightWindowOptions: WindowOptions = {
        visibility: {
            startOpen: true,
            keepOpen: {
                onClickOutside: true,
                onIntersection: true
            }
        },
        alignment: {
            reference: { horizontal: 'right', vertical: 'center' },
            window: { vertical: 'center' }
        }
    };

    bottomWindowOptions: WindowOptions = {
        visibility: {
            startOpen: true,
            keepOpen: {
                onClickOutside: true,
                onIntersection: true
            }
        },
        alignment: {
            reference: { vertical: 'bottom', horizontal: 'center' },
            window: { horizontal: 'center' }
        }
    };
}