import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { AddressDto, UserDto } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Retrieve current authenticated user profile' })
  async getProfile(@CurrentUser() user: any): Promise<UserDto> {
    const profile = await this.usersService.findById(user.id);
    return this.mapToDto(profile);
  }

  @Post('me/addresses')
  @ApiOperation({ summary: 'Save a new delivery address' })
  async addAddress(@CurrentUser() user: any, @Body() addressDto: AddressDto): Promise<UserDto> {
    const updatedUser = await this.usersService.addAddress(user.id, addressDto);
    return this.mapToDto(updatedUser);
  }

  @Delete('me/addresses/:index')
  @ApiOperation({ summary: 'Remove a saved delivery address by index' })
  async removeAddress(@CurrentUser() user: any, @Param('index', ParseIntPipe) index: number): Promise<UserDto> {
    const updatedUser = await this.usersService.removeAddress(user.id, index);
    return this.mapToDto(updatedUser);
  }

  private mapToDto(user: any): UserDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses.map((a: any) => ({
        street: a.street,
        zipCode: a.zipCode,
        city: a.city,
        note: a.note,
      })),
    };
  }
}
