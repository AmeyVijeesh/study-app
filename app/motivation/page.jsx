'use client';

import MotivationLooper from '../components/MotivationLooper';
import '@/styles/motivation.css';

const Motivation = () => {
  return (
    <>
      <div className="motivation-cont">
        <MotivationLooper />

        <div className="letter">
          <p className="letter-text"></p>
        </div>
      </div>
    </>
  );
};
export default Motivation;
