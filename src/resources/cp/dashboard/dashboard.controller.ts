// ================================================================>> Core Library
import { Controller, Get, UseGuards } from '@nestjs/common';

// ================================================================>> Costom Library
import { DashboardService } from './dashboard.service';
import { RolesDecorator, UserRoleDecorator } from 'src/decorators/roles.decorator';
import { RoleGuard } from 'src/guards/role.guard';

// Applying roles decorators to the class
@RolesDecorator(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF)
@UseGuards(RoleGuard)
@Controller('api/dashboard') // Setting the base route for the controller
export class DashboardController {

    // Constructor injecting the DashboardService
    constructor(private dashboardService: DashboardService) { };

    // Handling HTTP GET requests for the base route
    @Get()
    async getDashboardInfo(): Promise<{ data: { total_sale_today: number }}> {
        // Calling the getDashboardInfo method of the injected DashboardService
        return await this.dashboardService.getDashboardInfo();
    }
}
