import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/common/modules/auth/auth.module';
import { UserModule } from '../user/user.module';
import { OrgModule } from '../org/org.module';

@Module({
  imports : [
    AuthModule,
    UserModule,
    OrgModule
  ],
  providers : [],
  controllers: [AdminController],
})
export class AdminModule {}
