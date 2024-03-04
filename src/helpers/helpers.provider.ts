import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ENVIRONMENT_INITIALIZER, EnvironmentProviders, importProvidersFrom, inject, Provider } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { HELPERS_MOCK_API_DEFAULT_DELAY, mockApiInterceptor } from 'helpers/mock-api';
import { HelpersConfig } from 'helpers/services/config';
import { HELPERS_CONFIG } from 'helpers/services/config/config.constants';
import { HelpersConfirmationService } from 'helpers/services/confirmation';
import { helpersLoadingInterceptor, HelpersLoadingService } from 'helpers/services/loading';
import { HelpersMediaWatcherService } from 'helpers/services/media-watcher';
import { HelpersPlatformService } from 'helpers/services/platform';
import { HelpersSplashScreenService } from 'helpers/services/splash-screen';
import { HelpersUtilsService } from 'helpers/services/utils';

export type HelpersProviderConfig = {
    mockApi?: {
        delay?: number;
        services?: any[];
    },
    helpers?: HelpersConfig
}

/**
 * Helper provider
 */
export const provideHelpers = (config: HelpersProviderConfig): Array<Provider | EnvironmentProviders> =>
{
    // Base providers
    const providers: Array<Provider | EnvironmentProviders> = [
        {
            // Disable 'theme' sanity check
            provide : MATERIAL_SANITY_CHECKS,
            useValue: {
                doctype: true,
                theme  : false,
                version: true,
            },
        },
        {
            // Use the 'outline' appearance on Angular Material form fields by default
            provide : MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'outline',
            },
        },
        {
            provide : HELPERS_MOCK_API_DEFAULT_DELAY,
            useValue: config?.mockApi?.delay ?? 0,
        },
        {
            provide : HELPERS_CONFIG,
            useValue: config?.helpers ?? {},
        },

        importProvidersFrom(MatDialogModule),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(HelpersConfirmationService),
            multi   : true,
        },

        provideHttpClient(withInterceptors([helpersLoadingInterceptor])),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(HelpersLoadingService),
            multi   : true,
        },

        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(HelpersMediaWatcherService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(HelpersPlatformService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(HelpersSplashScreenService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(HelpersUtilsService),
            multi   : true,
        },
    ];

    // Mock Api services
    if ( config?.mockApi?.services )
    {
        providers.push(
            provideHttpClient(withInterceptors([mockApiInterceptor])),
            {
                provide   : APP_INITIALIZER,
                deps      : [...config.mockApi.services],
                useFactory: () => (): any => null,
                multi     : true,
            },
        );
    }

    // Return the providers
    return providers;
};
