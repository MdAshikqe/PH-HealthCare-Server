-- AddForeignKey
ALTER TABLE "doctorSchedules" ADD CONSTRAINT "doctorSchedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctorSchedules" ADD CONSTRAINT "doctorSchedules_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
