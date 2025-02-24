import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin/admin.module';
import { ApprovalRequestModule } from './modules/approval-request/approval-request.module';

@Module({
  imports: [
    FirebaseModule,
    AuthModule,
    UsersModule,
    AdminModule,
    ApprovalRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
