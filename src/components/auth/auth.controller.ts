import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupBuyerDto, SignupSellerDto } from 'src/dto/users/users.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}
    
    @Post('signupBuyer')
    signupBuyer(@Body() signupDto: SignupBuyerDto) {
        return this._authService.signupBuyer(signupDto);
    }

    @Post('signupSeller')
    signupSeller(@Body() signupDto: SignupSellerDto) {
        return this._authService.signupSeller(signupDto);
    }
}
