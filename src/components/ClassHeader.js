import React from "react";
import styles from "@/styles/ClassHeader.module.css";

function ClassHeader({
  customization,
  title,
  day,
  start_time,
  end_time,
  date,
}) {
  // customization = {color: hex_color, photo: img_url} ()
  var color = customization?.color;
  var image_url = customization?.image_url;

  // mock
  color = "#4596F4";
  image_url =
    "https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg";

  return (
    <div
      className={styles["class-header"]}
      style={{ backgroundColor: `${color}` }}
    >
      <img className={styles["class-header__photo"]} src={image_url} />
      <section className={styles["class-header__content"]}>
        <span className={styles["class-header__content__title"]}> {title}</span>
        <span className={styles["class-header__content__schedule"]}>
          {day} | {start_time} - {end_time}
        </span>
        <span className={styles["class-header__content__date-today"]}>
          {date}
        </span>
      </section>
    </div>
  );
}

export default ClassHeader;
