// ================================================================>> Core Library
import { Injectable }                   from '@angular/core';

// ================================================================>> Third Party Library
import { Observable, ReplaySubject }    from 'rxjs';

// ================================================================>> Custom Library
import { User }                         from 'app/core/user/user.types';

// Injectable decorator marks the service as injectable and provides it throughout the application
@Injectable({ providedIn: 'root' })
export class UserService {

    // ReplaySubject to store and broadcast the user data with buffer size 1
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    
    // ReplaySubject to store and broadcast the user role with buffer size 1
    private _role: ReplaySubject<string> = new ReplaySubject<string>(1);

    // Setter for updating the user data
    set user(value: User) {
        
        // Pushes the new user value to the ReplaySubject, broadcasting it to all subscribers
        this._user.next(value);
    }

    // Setter for updating the user role
    set role(value: string) {

        // Pushes the new role value to the ReplaySubject, broadcasting it to all subscribers
        this._role.next(value)
    }

    // Getter for accessing the user data as an observable
    get user$(): Observable<User> {

        // Exposes the ReplaySubject as an observable for external components to subscribe
        return this._user.asObservable();
    }

    // Getter for accessing the user role as an observable
    get role$(): Observable<string> {

        // Exposes the ReplaySubject as an observable for external components to subscribe
        return this._role.asObservable();
    }
}
