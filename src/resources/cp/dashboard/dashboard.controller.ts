import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator';
import { AuthGuard } from 'src/middleware/guards/auth.guard';

@Roles(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF)
@UseGuards(AuthGuard)
@Controller('api/dashboard')
export class DashboardController {

    constructor(private dashboardService: DashboardService) { };

    @Get()
    async getDashboardInfo(): Promise<{ data: { total_sale_today: number }, message: string }> {
        return await this.dashboardService.getDashboardInfo();
    }
}
