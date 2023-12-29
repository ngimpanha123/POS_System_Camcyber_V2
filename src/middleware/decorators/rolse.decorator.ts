import { SetMetadata } from "@nestjs/common";

export enum UserRoleDecorator {
    ADMIN = 'Admin',
    STAFF = 'Staff'
}

export const Roles = (...roles: UserRoleDecorator[]) => SetMetadata('roles', roles)