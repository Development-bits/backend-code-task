import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.gurd';
import { UpdateBuyerDto, UpdateSellerDto } from 'src/dto/users/users.dto';
import { JwtBuyerAuthGuard } from '../auth/jwt-buyer-auth.guard';
import { JwtSellerAuthGuard } from '../auth/jwt-seller-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor (private readonly _userService: UsersService) {}

    @UseGuards(JwtBuyerAuthGuard)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put('updateBuyer')
    updateBuyer (@Body() upadteUserDto: UpdateBuyerDto) {
        return this._userService.updateBuyer(upadteUserDto);
    }

    @UseGuards(JwtSellerAuthGuard)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put('updateSeller')
    updateSeller (@Body() upadteUserDto: UpdateSellerDto) {
        return this._userService.updateSeller(upadteUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete('deleteUser/:id')
    deleteUser (@Param('id') id: string) {
        return this._userService.deleteUser(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('getUserById/:id')
    getUserById (@Param('id') id: string) {
        return this._userService.getUserById(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('getAllUsers')
    getAllUsers (
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 10
    ) {
        return this._userService.getAllUsers(offset, limit);
    }
}
