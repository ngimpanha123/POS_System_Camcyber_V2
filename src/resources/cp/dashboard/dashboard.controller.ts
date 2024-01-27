// ================================================================>> Core Library
import { Controller, Get, UseGuards } from '@nestjs/common';

// ================================================================>> Costom Library
import { DashboardService } from './dashboard.service';
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator'; // Typo correction: 'rolse' -> 'roles'
import { AuthGuard } from 'src/middleware/guards/auth.guard';

// Applying decorators to the class
@Roles(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF)
@UseGuards(AuthGuard)
@Controller('api/dashboard') // Setting the base route for the controller
export class DashboardController {

    // Constructor injecting the DashboardService
    constructor(private dashboardService: DashboardService) { };

    // Handling HTTP GET requests for the base route
    @Get()
    async getDashboardInfo(): Promise<{ data: { total_sale_today: number }, message: string }> {
        // Calling the getDashboardInfo method of the injected DashboardService
        return await this.dashboardService.getDashboardInfo();
    }
}
