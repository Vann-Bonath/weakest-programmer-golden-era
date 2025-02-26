import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApprovalRequestService } from './approval-request.service';
import { CreateApprovalRequestDTO } from './approval-request';
import { AuthGuard } from '../auth/auth.guard';
import { GodGuard } from '../admin/admin.guard';

@Controller('approval-request')
export class ApprovalRequestController {
  constructor(
    private readonly approvalRequestService: ApprovalRequestService,
  ) {}

  @Post('request-update')
  @UseGuards(AuthGuard)
  async createRequest(
    @Body() createApprovalRequestDTO: CreateApprovalRequestDTO,
    @Req() req: any,
  ) {
    const firebaseUid = req.user.uid;
    return this.approvalRequestService.createRequest(
      firebaseUid,
      createApprovalRequestDTO,
    );
  }

  @Post('approve-request/:requestId')
  @UseGuards(AuthGuard, GodGuard)
  async approveRequest(@Param('requestId') requestId: string, @Req() req: any) {
    const firebaseUid = req.user.uid;
    return this.approvalRequestService.approveRequest(requestId, firebaseUid);
  }

  @Get()
  async getAllRequest() {
    return this.approvalRequestService.getAllRequest();
  }
}
