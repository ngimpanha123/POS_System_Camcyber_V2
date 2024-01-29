// ================================================================>> Core Library
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch()
export class ExceptionFilterErrors implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        // If we one to Customize the error response for specific status codes
        if (exception.status === HttpStatus.FORBIDDEN) {
            response.status(HttpStatus.FORBIDDEN).json({
                status_code: HttpStatus.FORBIDDEN,
                message: 'Access forbidden for this role.',
                error: 'Forbidden',
            });
        }
        else {
            // console.log(exception)
            // For other status codes, use the default response
            response.status(exception.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                status_code: exception.status || HttpStatus.INTERNAL_SERVER_ERROR,
                message: typeof exception.response === 'string' ? exception.response : exception.response?.message || 'Internal server error',
                error: exception.response ? exception.response.error : HttpStatus[exception.status] || 'Unknown error',
            });
        }
    }
}
