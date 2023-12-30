import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ReportTemplate {
    template: {
        name: string;
    };
    data: any;
}

@Injectable()
export class JsReportService {
    private jsUrl: string = process.env.JS_URL || '';
    private username: string = process.env.JS_USERNAME || 'admin';
    private password: string = process.env.JS_PASSWORD || 'CamCyberTeam';

    private getAxiosConfig(data: ReportTemplate): AxiosRequestConfig {
        return {
            url: `${this.jsUrl}/api/report`,
            method: 'post',
            responseType: 'arraybuffer',
            auth: {
                username: this.username,
                password: this.password,
            },
            data: data,
        };
    }

    async generateReport(reportTemplate: ReportTemplate): Promise<string> {
        try {
            const response: AxiosResponse<Buffer> = await axios(this.getAxiosConfig(reportTemplate));
            const base64Report = response.data.toString('base64');
            return base64Report;
        } catch (error) {
            console.error('Failed to generate the report:', error.message);
            throw new Error('Failed to generate the report');
        }
    }
}
