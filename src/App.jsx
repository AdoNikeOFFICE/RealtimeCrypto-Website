import React, { useState } from "react";
import "./styles.css";
import getSymbolFromCurrency from "currency-symbol-map";
import NoSleep from "nosleep.js";

const App = () => {
  window.onload = (event) => {
    new NoSleep().enable();
  };

  const [intervalId, setIntervalId] = useState(null);

  const [cryptocurrency, setCryptocurrency] = useState("hex");
  const [currency, setCurrency] = useState("usd");

  const [price, setPrice] = useState(null);
  const [changePercentage, setChangePercentage] = useState(null);

  const [error, setError] = useState(null);

  async function getPrice() {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${cryptocurrency.toLocaleLowerCase()}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );

    if (!response.ok) {
      setPrice(null);
      setChangePercentage(null);
      setError("Nepodarilo sa mi získať odpoveď z CoinGecko servera.");

      return;
    }

    const data = await response.json();

    setPrice(data.market_data.current_price[currency]);
    setChangePercentage(
      data.market_data.price_change_percentage_1h_in_currency[currency]
    );
    setError(null);
  }

  function updatePrice() {
    clearInterval(intervalId);
    setIntervalId(setInterval(getPrice, 1000));
  }

  function getChangePercentage(percentage) {
    let color = "";

    if (percentage.toString().startsWith("-")) color = "changePercentage red";
    else color = "changePercentage green";

    return (
      <p className={color}>
        {percentage}%{" "}
        <span className="bracket">
          ( 1H IN {getSymbolFromCurrency(currency.toUpperCase())} )
        </span>
      </p>
    );
  }

  return (
    <div>
      <div className="input">
        <form>
          <label>
            <p>Cryptocurrency</p>
            <input
              value={cryptocurrency}
              onChange={(e) => setCryptocurrency(e.target.value)}
            />
          </label>
          <br />
          <label>
            <p>Currency</p>
            <input
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </label>
        </form>
        <button onClick={updatePrice}>Get Price</button>

        {error && <p className="red">{error}</p>}
      </div>

      {price && currency && (
        <div className="show">
          <p className="price">
            {price}
            {getSymbolFromCurrency(currency.toUpperCase())}
          </p>

          {changePercentage && getChangePercentage(changePercentage)}
        </div>
      )}
    </div>
  );
};

export default App;
