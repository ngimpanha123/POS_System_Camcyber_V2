// ================================================================>> Core Library
import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';
import { provideHttpClient, withInterceptors }  from '@angular/common/http';

// ================================================================>> Custom Library
import { authInterceptor }                      from 'app/core/auth/auth.interceptor';
import { AuthService }                          from 'app/core/auth/auth.service';
import { IconsService }                         from '../icons/icons.service';

// Define a function that provides an array of providers for injecting IconsService
export const provideIcons = (): Array<Provider | EnvironmentProviders> => {
    return [
        {
            // Use the ENVIRONMENT_INITIALIZER token to provide initialization logic
            provide: ENVIRONMENT_INITIALIZER,
            // Use the inject function to get an instance of IconsService
            useValue: () => inject(IconsService),
            // Multi-flag is set to true to allow multiple providers with the same token
            multi: true,
        },
    ];
};
