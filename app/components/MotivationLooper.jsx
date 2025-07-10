import React, { useState, useEffect } from 'react';
import TextTransition, { presets } from 'react-text-transition';

import MotivationQuotes from './MotivationQuotes';

const MotivationLooper = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((prev) => (prev + 1) % MotivationQuotes.length),
      3000
    );
    return () => clearInterval(intervalId);
  }, []);

  return (
    <TextTransition
      springConfig={presets.wobbly}
      direction="up"
      className="motivational-text"
    >
      {MotivationQuotes[index]}
    </TextTransition>
  );
};

export default MotivationLooper;
