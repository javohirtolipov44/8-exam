import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = request.cookies?.token;

        if (!token) {
            throw new UnauthorizedException('Token topilmadi!');
        }

        try {
            const decoded = await this.jwtService.verifyAsync(token);
            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException("Token yaroqsiz yoki muddati o'tgan!");
        }
    }
}