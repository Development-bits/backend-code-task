import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UsersInterface } from 'src/interface/users/users.interface';
import { USERROLE } from 'src/enum/users/userrole.enum';

@Injectable()
export class AuthService {
    constructor (
        @InjectModel('users') private readonly _userModel: Model<UsersInterface>,
        private jwtService: JwtService
    ) {}

    private generateToken(payload) {
        return {
            access_token: `Bearer ${this.jwtService.sign(payload)}`
        };
    }

    async signupBuyer (signupDto: any) {
        try {
            let user: UsersInterface;

            if (signupDto.userName) {
                user = await this._userModel.findOne({
                    userName: signupDto.userName
                });
            }
            if (user) {
                throw new ForbiddenException('Username already exists!');
            }

            signupDto.role = USERROLE.buyer;

            let userData = await new this._userModel(signupDto).save();

            userData = JSON.parse(JSON.stringify(userData));
            delete userData.password;

            const token = await this.generateToken(userData);

            return {
                userData,
                ...token
            };
        } catch (error) {
            throw error;
        }
    }

    async signupSeller (signupDto: any): Promise<any> {
        try {
            let user: UsersInterface;

            if (signupDto.userName) {
                user = await this._userModel.findOne({
                    userName: signupDto.userName
                });
            }
            if (user) {
                throw new ForbiddenException('Username already exists!');
            }

            signupDto.role = USERROLE.seller;

            let userData = await new this._userModel(signupDto).save();

            userData = JSON.parse(JSON.stringify(userData));
            delete userData.password;

            const token = await this.generateToken(userData);

            return {
                userData,
                ...token
            };
        } catch (error) {
            throw error;
        }
    }
}
