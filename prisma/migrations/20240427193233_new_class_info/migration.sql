-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_classid_fkey";

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_studentid_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_professorid_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_classid_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_studentid_fkey";

-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "color" VARCHAR(6);

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_classid_fkey" FOREIGN KEY ("classid") REFERENCES "classes"("classid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_studentid_fkey" FOREIGN KEY ("studentid") REFERENCES "students"("studentid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_professorid_fkey" FOREIGN KEY ("professorid") REFERENCES "professors"("professorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_classid_fkey" FOREIGN KEY ("classid") REFERENCES "classes"("classid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_studentid_fkey" FOREIGN KEY ("studentid") REFERENCES "students"("studentid") ON DELETE CASCADE ON UPDATE CASCADE;
