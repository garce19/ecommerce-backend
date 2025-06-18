import { Controller, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
}
