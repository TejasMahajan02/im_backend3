import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUtilService {
  constructor(private readonly jwtService: JwtService) {}

  async grantToken(payload: object): Promise<object> {
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateToken(token: string): Promise<object> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, payload: null };
    }
  }
}
