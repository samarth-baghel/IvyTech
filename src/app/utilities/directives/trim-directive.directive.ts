import {
    Directive,
    ElementRef,
    forwardRef,
    HostListener,
    OnInit,
    Renderer2
} from '@angular/core';
import { Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const TRIM_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line:no-forward-ref
    useExisting: forwardRef(() => TrimDirectiveDirective),
    multi: true
};

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'input[ngTrim]',
    providers: [TRIM_VALUE_ACCESSOR]
})
export class TrimDirectiveDirective implements ControlValueAccessor, OnInit {
    // tslint:disable-next-line:no-input-rename
    @Input('ngTrim')
    onEvent: any = ("keyup" || "focusout");
    _onChange(_: any) { }
    _onTouched() { }
    registerOnChange(fn: (value: any) => any): void {
        this._onChange = fn;
    }
    registerOnTouched(fn: () => any): void {
        this._onTouched = fn;
    }
    constructor(private _renderer: Renderer2, private _elementRef: ElementRef) { }

    writeValue(value: any): void {
        const normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
        // if (value !== undefined && value !== null) {
        //     this._renderer.setProperty(
        //         this._elementRef.nativeElement,
        //         'value',
        //         value
        //     );
        // }else {
        //     this._renderer.setProperty(
        //         this._elementRef.nativeElement,
        //         'value',
        //         ''
        //     );
        // }
    }

    ngOnInit() {
        this.onEvent = this.onEvent || 'focusout';
    }

    @HostListener('keyup', ['$event'])
    @HostListener('focusout', ['$event'])
    _onKeyUp(event: Event) {
        if (this.onEvent === event.type) {
            const element = <HTMLInputElement>event.target;

            const val = element.value.trim();

            this.writeValue(val);
            this._onChange(val);
        }
    }
}