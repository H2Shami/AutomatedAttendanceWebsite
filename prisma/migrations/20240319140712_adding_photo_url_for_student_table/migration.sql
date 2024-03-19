-- CreateTable
CREATE TABLE "attendance" (
    "attendanceid" SERIAL NOT NULL,
    "classid" INTEGER,
    "studentid" INTEGER,
    "entry_timestamp" TIMESTAMP(6),

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("attendanceid")
);

-- CreateTable
CREATE TABLE "classes" (
    "classid" INTEGER NOT NULL,
    "class_name" VARCHAR(100) NOT NULL,
    "professorid" INTEGER,
    "semester" VARCHAR(20),
    "year" INTEGER,
    "days" VARCHAR(20),
    "start_time" TIME(6),

    CONSTRAINT "classes_pkey" PRIMARY KEY ("classid")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "studentid" INTEGER NOT NULL,
    "classid" INTEGER NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("studentid","classid")
);

-- CreateTable
CREATE TABLE "professors" (
    "professorid" INTEGER NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100),

    CONSTRAINT "professors_pkey" PRIMARY KEY ("professorid")
);

-- CreateTable
CREATE TABLE "students" (
    "studentid" INTEGER NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100),
    "photo_url" VARCHAR(200),

    CONSTRAINT "students_pkey" PRIMARY KEY ("studentid")
);

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_classid_fkey" FOREIGN KEY ("classid") REFERENCES "classes"("classid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_studentid_fkey" FOREIGN KEY ("studentid") REFERENCES "students"("studentid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_professorid_fkey" FOREIGN KEY ("professorid") REFERENCES "professors"("professorid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_classid_fkey" FOREIGN KEY ("classid") REFERENCES "classes"("classid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_studentid_fkey" FOREIGN KEY ("studentid") REFERENCES "students"("studentid") ON DELETE NO ACTION ON UPDATE NO ACTION;
