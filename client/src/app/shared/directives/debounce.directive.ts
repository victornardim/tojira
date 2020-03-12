import { Directive, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
    selector: '[tojiraDebounce]'
})
export class DebounceDirective {
    @Output() debounceCallback = new EventEmitter();
    @Input() debounceEvent = 'click';
    @Input() debounceDelay = 300;

    constructor(element: ElementRef) {
        fromEvent(element.nativeElement, this.debounceEvent)
            .pipe(debounceTime(this.debounceDelay))
            .subscribe(() => this.debounceCallback.emit());
    }
}