import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USERROLE } from 'src/enum/users/userrole.enum';
import { UsersInterface } from 'src/interface/users/users.interface';

@Injectable()
export class UsersService {
    constructor (
        @InjectModel('users') private readonly _userModel: Model<UsersInterface>
    ) {}

    async updateBuyer (upadteUserDto: any): Promise<any> {
        try {
            const user = await this._userModel.findOne({_id: upadteUserDto.id, role: USERROLE.buyer});
            if (!user) {
                throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
            }

            await this._userModel.updateOne({_id: upadteUserDto.id}, upadteUserDto);
            return {
                message: 'User has been updated successfully!'
            }
        } catch (error) {
            throw error;
        }
    }

    async updateSeller (upadteUserDto: any): Promise<any> {
        try {
            const user = await this._userModel.findOne({_id: upadteUserDto.id, role: USERROLE.seller});
            if (!user) {
                throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
            }

            await this._userModel.updateOne({_id: upadteUserDto.id}, upadteUserDto);
            return {
                message: 'User has been updated successfully!'
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteUser (id: string): Promise<any> {
        try {
            const user = await this._userModel.findById(id);
            if (!user) {
                throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
            }

            await this._userModel.deleteOne({_id: id});
            return {
                message: 'User has been deleted successfully!'
            }
        } catch (error) {
            throw error;
        }
    }

    async getUserById (id: string): Promise<any> {
        try {
            const user = await this._userModel.aggregate([
                {
                    $match: {
                        _id: id
                    }
                },
                {
                    $addFields: {
                        id: '$_id'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ]).then(items => items[0]);

            delete user.password;

            return user;
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers (offset: any, limit: any): Promise<any> {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;

            const totalCount = await this._userModel.countDocuments();

            let users = await this._userModel.aggregate([
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $addFields: {
                        id: '$_id'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ])
            .skip(parseInt(offset))
            .limit(parseInt(limit))

            return {
                totalCount: totalCount,
                data: users
            }
        } catch (error) {
            throw error;
        }
    }
}
