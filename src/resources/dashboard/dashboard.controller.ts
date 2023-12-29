import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles, UserRoleDecorator } from 'src/middleware/decorators/rolse.decorator';
import { AuthGuard } from 'src/middleware/guards/auth.guard';

@Roles(UserRoleDecorator.ADMIN, UserRoleDecorator.STAFF)
@UseGuards(AuthGuard)
@Controller('api/dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { };
    //========================================
    @Get()
    getDashboardInfo() {
        return this.dashboardService.getDashboardInfo();;
    }
}
