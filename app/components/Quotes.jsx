import React from 'react';
import quotes from 'success-motivational-quotes';

const Quotes = () => {
  const successQuotes = quotes.getQuotesByCategory('Success'); // Returns an array of quotes
  const randomQuote =
    successQuotes[Math.floor(Math.random() * successQuotes.length)]; // Pick a random quote

  return (
    <div className="quoteDiv">
      <p>{randomQuote.body}</p> {/* Show the quote text */}
      <p>- {randomQuote.by}</p> {/* Show the author name */}
    </div>
  );
};

export default Quotes;
