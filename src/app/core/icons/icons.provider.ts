// ================================================================>> Core Library
import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';

// ================================================================>> Custom Library
import { IconsService }     from 'app/core/icons/icons.service';

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
