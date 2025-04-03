import React from 'react';
import quotes from 'success-motivational-quotes';

const Quotes = () => {
  const successQuotes = quotes.getQuotesByCategory('Success');
  const randomQuote =
    successQuotes[Math.floor(Math.random() * successQuotes.length)];

  return (
    <div className="quoteDiv">
      <p>{randomQuote.body}</p>
      <p>- {randomQuote.by}</p>
    </div>
  );
};

export default Quotes;
