import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserSchema } from 'src/schema/users/users.schema';

@Module({})
export class AuthModule {
    static forRoot(): DynamicModule {
        return {
            imports: [
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: '9999999999s'}
                }),
                MongooseModule.forFeature([
                    { name: 'users', schema: UserSchema }
                ]),
            ],
            controllers: [AuthController],
            providers: [AuthService, JwtStrategy],
            module: AuthModule
        }
    }
}
