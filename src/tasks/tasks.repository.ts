import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { NotFoundException } from '@nestjs/common';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
// eslint-disable-next-line prettier/prettier
export class TasksRepository extends Repository<Task> {
  constructor(private datasource: DataSource) {
    super(Task, datasource.createEntityManager());
  }

  async getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    const { status, search } = filterDTO;

    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}%` }
      );
    }

    const tasks = await query.getMany();

    return tasks;

  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });

    await this.save(task);
    return task;
  }
}
