// ================================================================>> Core Library
import { Module } from '@nestjs/common';

// ================================================================>> Costom Library
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

// Defining a NestJS module for the Dashboard feature
@Module({
    // No additional modules imported for this example ('imports' is left empty)
    imports: [],

    // Declaring the DashboardController as a controller in this module
    controllers: [DashboardController],

    // Declaring the DashboardService as a provider in this module
    providers: [DashboardService],
})
export class DashboardModule {}

