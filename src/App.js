import React, { useState } from "react";
import "./App.css";

const TO_AGE = 85;
const INFLATION = 1.02;

// Add commas: 1300 -> "1,300"
function format(num) {
  return Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function App() {
  const [age, setAge] = useState(30);
  const [rent, setRent] = useState(900);
  const [spendMonth, setSpendMonth] = useState(900);
  const [mortgageAge, setMortgageAge] = useState(35);
  const [mortgageYears, setMortgageYears] = useState(25);
  const [propertyValue, setPropertyValue] = useState(150 * 1000);
  const [savings, setSavings] = useState(5 * 1000);
  const [retireAge, setRetireAge] = useState(65);
  const [incomeYear, setIncomeYear] = useState(30000);
  const [interest, setInterest] = useState(4);
  function simulate(fromAge, toAge) {
    const chart = [];
    let current_value = savings;
    let currentRent = rent;
    const interest_factor = 1 + interest / 100;

    for (let age = fromAge; age <= toAge; age++) {
      let currentIncomeYear = incomeYear;
      currentRent = currentRent * INFLATION;
      currentIncomeYear = currentIncomeYear * INFLATION;

      // After retirement, no income
      if (age >= retireAge) {
        currentIncomeYear = 0;
      }

      // Paying rent
      if (age < mortgageAge) {
        const net_income = currentIncomeYear - (rent + spendMonth) * 12;
        current_value = current_value + net_income;
        current_value = current_value * interest_factor;
      }

      // Paying mortgage
      if (age >= mortgageAge && age <= mortgageAge + mortgageYears) {
        const mortgateMonth = (propertyValue * 1.3) / (mortgageYears * 12);
        const net_income =
          currentIncomeYear - (mortgateMonth + spendMonth) * 12;
        current_value = current_value + net_income;
        current_value = current_value * interest_factor;
      }

      // No rent, no mortgage
      if (age > mortgageAge + mortgageYears) {
        const net_income = currentIncomeYear - spendMonth * 12;
        current_value = current_value + net_income;
        current_value = current_value * interest_factor;
      }

      chart[age] = current_value;
    }
    return chart;
  }
  const chartData = simulate(age, TO_AGE);
  const lastValue = chartData[chartData.length - 1];
  return (
    <div className="app">
      <div className="topSection">
        <div class="sliders">
          <Slider name="Age" min={20} max={50} value={age} setter={setAge} />
          <Slider
            name="Savings"
            min={0}
            max={500 * 1000}
            value={savings}
            setter={setSavings}
            step={1000}
          />
          <Slider
            name="Interest %"
            min={1}
            max={10}
            step={0.5}
            value={interest}
            setter={setInterest}
            noFormat
          />
          <Slider
            name="Net income per year"
            min={20000}
            max={120000}
            value={incomeYear}
            setter={setIncomeYear}
            step={500}
          />
          <hr />
          <Slider
            name="Rent"
            min={600}
            max={4000}
            value={rent}
            setter={setRent}
            step={100}
          />
          <Slider
            name="Spending"
            min={600}
            max={4000}
            value={spendMonth}
            setter={setSpendMonth}
            step={100}
          />
          <hr />
          <Slider
            name="Mortgage starts at age"
            min={25}
            max={90}
            value={mortgageAge}
            setter={setMortgageAge}
          />
          <Slider
            name="Property value (my share)"
            min={100 * 1000}
            max={900 * 1000}
            value={propertyValue}
            setter={setPropertyValue}
            step={10000}
          />
          <Slider
            name="Mortgage years"
            min={15}
            max={35}
            value={mortgageYears}
            setter={setMortgageYears}
          />
          <hr />
          <Slider
            name="Retirement age"
            min={35}
            max={65}
            value={retireAge}
            setter={setRetireAge}
          />
        </div>
        <div className="summary">
          <div>{`Age: ${TO_AGE}`}</div>
          <div>{`Savings: ${format(lastValue)}`}</div>
          <div>{`In today's: ${format(
            lastValue / Math.pow(INFLATION, TO_AGE - age)
          )}`}</div>
        </div>
      </div>
      <Chart data={chartData} />
    </div>
  );
}

function Slider(props) {
  function onChange(e) {
    props.setter(Number(e.target.value));
  }
  return (
    <div className="sliderBox">
      <div className="sliderLabel">{props.name}</div>
      <input type="range" className="slider" {...props} onChange={onChange} />
      <div className="sliderValue">
        {props.noFormat ? props.value : format(props.value)}
      </div>
    </div>
  );
}

function Chart(props) {
  let maxCash = Math.max(...Object.values(props.data));
  return (
    <div className="chart">
      {props.data.map((cash, age) => (
        <div
          class="bar"
          style={{ height: `${Math.max(0, (cash / maxCash) * 300)}px` }}
        />
      ))}
    </div>
  );
}
