import React from 'react';
import styles from '@/styles/StudentCard.module.css';

const StudentCard = ({ imgPath, name, info }) => {


    return (
            <div className={styles.StudentCard}>
                <img src={imgPath} alt={"Student Thumbnail"}/>
                <div>
                    <strong><p>{name}</p></strong>
                    <p>{info}</p>
                </div>
            </div>
    );
};

export default StudentCard;

