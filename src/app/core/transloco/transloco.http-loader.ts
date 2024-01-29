// ================================================================>> Core Library
import { HttpClient }                   from '@angular/common/http';
import { inject, Injectable }           from '@angular/core';

// ================================================================>> Third Party Library
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { Observable }                   from 'rxjs';


@Injectable({providedIn: 'root'})

export class TranslocoHttpLoader implements TranslocoLoader
{
    // HttpClient is injected into the service
    private _httpClient = inject(HttpClient);

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get translation
     *
     * @param lang
     */
    // Method to get translations for a specified language
    // It returns an Observable that emits Translation data

    getTranslation(lang: string): Observable<Translation> {

        // Uses HttpClient to perform a GET request to the translation file for the specified language
        // The path is constructed based on the language code, e.g., './assets/i18n/en.json'
        return this._httpClient.get<Translation>(`./assets/i18n/${lang}.json`);
    }

}
