import express, { response } from 'express';
import db from './database/connection';
import convertHourToMinutes from './utils/convertHourToMinutes';

const routes = express.Router();

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

routes.post('/classes', async (req, res) => {
    const {name, avatar, whatsapp, bio, subject, cost, schedule} = req.body;

    const trx = await db.transaction();

   try {
        const insertedUsersIds = await trx('users').insert({name, avatar, whatsapp, bio});
        const user_id = insertedUsersIds[0];
        console.log(`${name} has been created with id ${user_id}`);
        
        const insertedClassesIds = await trx('classes').insert({subject, cost, user_id});
        const class_id = insertedClassesIds[0];
        console.log(`[${name}] ${subject} has been created with id ${class_id}`);

        const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
            return{
                class_id,
                week_day: scheduleItem.week_day,
                from: convertHourToMinutes(scheduleItem.from),
                to: convertHourToMinutes(scheduleItem.to),
            }
        })

        await trx('class_schedule').insert(classSchedule);

        await trx.commit();
        return res.status(201).send();

   } catch (err) {
       await trx.rollback();
       return response.status(400).json({
           error: 'Unexpected error while creating new class'
       })
   }
})

export default routes;