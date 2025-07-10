'use client';

import MotivationLooper from '../components/MotivationLooper';
import '@/styles/motivation.css';
import { useSession } from 'next-auth/react';

const Motivation = () => {
  const { data: session, status } = useSession();

  const name = session?.user?.name;
  return (
    <>
      <div className="motivation-cont">
        <MotivationLooper />

        <div className="letter">
          <p className="letter-text">
            Dear {name}, <br />
            Over an year ago, you were motivated. You planned it all out,
            thought about getting into IIT, and imagined yourself, succeeding in
            life. You imagined achieving things your parents and grandparents
            couldn't dream of. You dreamt of making this world a better place
            for your future children and wife. You imagined buying expensive
            things, you imagined helping out the poor, you imagined living the
            lifestyle you've only seen from a distance. <br />
            <br />
            Remember that lady who smiled at you in her BMW 7 Series in Mumbai?
            Remember seeing posh cars and wondering if you could one day own
            them? Remember all those hours you've spent dreaming? All of that is
            a possiblilty. If you work hard. If you slack off now, it means
            giving up all those dreams. Think about it and please, don't
            dissapoint your future self.
          </p>
        </div>
      </div>
    </>
  );
};
export default Motivation;
