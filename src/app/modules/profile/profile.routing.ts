// ================================================================>> Core Library 
import * as router from '@angular/router';

// ================================================================>> Custom Library 
import * as profileComponent from './profile.component';

export default [
    {
        path: '',
        component: profileComponent.ProfileComponent
    },
] as router.Routes;
