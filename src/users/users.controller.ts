import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { UsersService } from './users.service';
import { ValidateEmailPipe } from 'src/common/pipes/validate-email.pipe';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('search')
  async getUsersPage(@Body() pageRequest: PageRequest) {
    return await this.usersService.getUserPage(pageRequest);
  }

  @Get(':id')
  async getUser(@Param('id', ValidateObjectIdPipe) id: string) {
    const { password, ...user } = (
      await this.usersService.getUser(id)
    ).toJSON();
    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id', ValidateObjectIdPipe) id: string) {
    await this.usersService.deleteUser(id);
  }

  @Put('assign')
  async inviteToRoom(
    @Query('email', ValidateEmailPipe) email: string,
    @Query('room-id', ValidateObjectIdPipe) roomId: string,
  ) {
    const user = await this.usersService.getUserByEmail(email);
    await this.usersService.assignToRoom(user.id, roomId);
  }

  @Put('unassign')
  async unassignFromRoom(
    @Query('user-id', ValidateObjectIdPipe) userId: string,
    @Query('room-id', ValidateObjectIdPipe) roomId: string,
  ) {
    await this.usersService.unassignFromRoom(userId, roomId);
  }
}
