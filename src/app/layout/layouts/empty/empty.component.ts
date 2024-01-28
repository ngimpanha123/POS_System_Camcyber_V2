// ================================================================>> Core Library
import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { RouterOutlet }                 from '@angular/router';
import { NgIf }                         from '@angular/common';


// ================================================================>> Third Party Library
import { Subject }                      from 'rxjs';

// ================================================================>> Custom Library
import { HelpersLoadingBarComponent }   from 'helpers/components/loading-bar';

@Component({
    selector     : 'empty-layout',
    templateUrl  : './empty.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [HelpersLoadingBarComponent, NgIf, RouterOutlet],
})
export class EmptyLayoutComponent implements OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
