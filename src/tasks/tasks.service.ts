import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDTO, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id: id, user: user } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDTO, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const found = await this.getTaskById(id, user);
    found.status = status;

    await this.tasksRepository.save(found);
    return found;
  }
}