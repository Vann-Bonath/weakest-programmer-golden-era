import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './users.type';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createUser(@Body() createUserDTO: CreateUserDTO, @Req() req: any) {
    const firebaseUid = req.user.uid;
    return this.usersService.createUser(createUserDTO, firebaseUid);
  }

  @Get(':firebaseUid')
  async getUser(@Param('firebaesUid') firebaseUid: string) {
    return await this.usersService.getUser(firebaseUid);
  }

  @Get()
  async getAllUser() {
    return await this.usersService.getAllUser();
  }
}
