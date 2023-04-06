import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { USERROLE } from 'src/enum/users/userrole.enum';

@Injectable()
export class JwtSellerAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean {
        const { user } = context.switchToHttp().getRequest();
        return USERROLE.seller == user.role;
      }
}
