import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getAttendanceForMeeting(req, res) {
  const classid = parseInt(req.query.classid);
  const meetingDate = req.query.meetingDate;
  const meetingStart = req.query.meetingStart;
  const meetingEnd = req.query.meetingEnd;
  const meetingDateTimeStart = new Date(`${meetingDate} ${meetingStart}`);
  const meetingDateTimeEnd = new Date(`${meetingDate} ${meetingEnd}`);

  // console.log("constructed query meeting time for DB: " + meetingDateTimeStart);

  const attendance = await prisma.attendance.findMany({
    where: {
      classid: { equals: classid },
      entry_timestamp: { gte: meetingDateTimeStart, lte: meetingDateTimeEnd },
    },
  });

  // console.log("received from DB to apis/js: " + attendance);
  // attendance.forEach((value) => {
  //   console.log(value);
  // });
  res.status(200).json(attendance);
}
