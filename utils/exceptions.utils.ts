import { HttpStatus } from "./http-status.utils";

export class HttpException<T> extends Error {
    statusCode: number;
    message: string;
    error?: T;

    constructor(message: string, code: number, error?: T) {
        super(message);
        this.statusCode = code;
        this.message = message || 'This is a bad request.';
        this.error = error || undefined;
    }
}

export class BadRequestException extends Error {
    statusCode: number;
    message: string;
    error: string;

    constructor(message?: string, error?: string) {
        super(message);
        this.statusCode = HttpStatus.BAD_REQUEST;
        this.message = message || 'This is a bad request.';
        this.error = error || 'Bad Request';
    }
}

export class ConflictException extends Error {
    statusCode: number;
    message: string;
    error: string;

    constructor(message?: string, error?: string) {
        super(message);
        this.statusCode = HttpStatus.CONFLICT;
        this.message = message || 'Conflict';
        this.error = error || 'Conflict';
    }
}

export class NotFoundException extends Error {
    statusCode: number;
    message: string;
    error: string;

    constructor(message?: string, error?: string) {
        super(message);
        this.statusCode = HttpStatus.NOT_FOUND;
        this.message = message || 'Not Found';
        this.error = error || 'Not Found';
    }
}

export class ForbiddenException extends Error {
    statusCode: number;
    message: string;
    error: string;

    constructor(message?: string, error?: string) {
        super(message);
        this.statusCode = HttpStatus.FORBIDDEN;
        this.message = message || 'Forbidden';
        this.error = error || 'Forbidden';
    }
}

export class BadGatewayException extends Error {
    statusCode: number;
    message: string;
    error: string;

    constructor(message?: string, error?: string) {
        super(message);
        this.statusCode = HttpStatus.BAD_GATEWAY;
        this.message = message || 'Bad geteway';
        this.error = error || 'Bad Geteway';
    }
}

export class UnauthorizedException extends Error {
    statusCode: number;
    message: string;
    error: string;

    constructor(message?: string, error?: string) {
        super(message);
        this.statusCode = HttpStatus.UNAUTHORIZED;
        this.message = message || 'Unauthorized';
        this.error = error || 'Unauthorized';
    }
}

export class NotAcceptableException extends Error {
    statusCode: number;
    message: string;
    error: string;

    constructor(message?: string, error?: string) {
        super(message);
        this.statusCode = HttpStatus.NOT_ACCEPTABLE;
        this.message = message || 'Not acceptable';
        this.error = error || 'Not Acceptable';
    }
}

export class GatewayTimeoutException extends Error {
    statusCode: number;
    message: string;
    error: string;

    constructor(message?: string, error?: string) {
        super(message);
        this.statusCode = HttpStatus.GATEWAY_TIMEOUT;
        this.message = message || 'Geteway timeout';
        this.error = error || 'Geteway Timeout';
    }
}

export class NotImplementedException extends Error {
    statusCode: number;
    message: string;
    error: string;

    constructor(message?: string, error?: string) {
        super(message);
        this.statusCode = HttpStatus.NOT_IMPLEMENTED;
        this.message = message || 'Not implemented';
        this.error = error || 'Not Implemented';
    }
}

export class RequestTimeoutException extends Error {
    statusCode: number;
    message: string;
    error: string;

    constructor(message?: string, error?: string) {
        super(message);
        this.statusCode = HttpStatus.REQUEST_TIMEOUT;
        this.message = message || 'Request timeout';
        this.error = error || 'Request Timeout';
    }
}

export class InternalServerErrorException extends Error {
    statusCode: number;
    message: string;
    error: string;

    constructor(message?: string, error?: string) {
        super(message);
        this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        this.message = message || 'Internal server error';
        this.error = error || 'Internal Server Error';
    }
}
