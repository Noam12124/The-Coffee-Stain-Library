import { Injectable } from '@nestjs/common';
import { MockDatabaseService } from '../mock-database.service'; 
import { User } from './user.entity';
 
@Injectable()
export class UserRepository {
    constructor(private readonly mockDb: MockDatabaseService) {}
    
