import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule,
  ],
  exports: [TasksService],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
})
// eslint-disable-next-line prettier/prettier
export class TasksModule { }
