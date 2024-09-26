import { Module } from '@nestjs/common';
import { CoursesService } from './services/courses.service';
import { CoursesController } from './controllers/courses.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Courses, CoursesSchema } from './schemas/courses.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Courses.name, schema: CoursesSchema },
        ]),
    ],
    providers: [CoursesService],
    controllers: [CoursesController],
})
export class CoursesModule {}