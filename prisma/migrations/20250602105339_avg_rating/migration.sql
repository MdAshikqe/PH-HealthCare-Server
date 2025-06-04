/*
  Warnings:

  - A unique constraint covering the columns `[appointmentId]` on the table `doctorSchedules` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- CreateIndex
CREATE UNIQUE INDEX "doctorSchedules_appointmentId_key" ON "doctorSchedules"("appointmentId");

-- AddForeignKey
ALTER TABLE "doctorSchedules" ADD CONSTRAINT "doctorSchedules_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
