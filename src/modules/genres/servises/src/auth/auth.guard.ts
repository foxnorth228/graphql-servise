import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader =
            request.headers['authorization'] ||
            request.headers['Authorization'];
        console.log(authorizationHeader);
        try {
            const { data } = await this.authService.verifyToken(
                authorizationHeader,
            );
            request.user = data;
            console.log(data, request.user);
            return true;
        } catch (err) {
            return false;
        }
    }
}
