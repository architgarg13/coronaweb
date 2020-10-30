import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import Infobox from './Components/InfoBox'
import Map from './Components/Map'
import Table from './Components/Table'
import Linegraph from './Components/Linegraph'
import { sortData } from './util.js'

function App() {
  const [ countries, setCountries] = useState([]);
  const [ country, setCountry ] = useState('Worldwide');
  const [ countryInfo, setcountryInfo] = useState([]);
  const [ tableData, setTableData] = useState([]);
 
 useEffect(() => {
   fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setcountryInfo(data);

    });
 }, []);

 
 
  useEffect (() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));
        const SortedData = sortData(data);
        setTableData(SortedData);
       
        setCountries(countries);
      });
    }
    getCountriesData();
  }, []);
 
  const onCountryChange = (event) => {
    const countryCode = event.target.value ;
    setCountry(countryCode);

    var url = ""
    if(countryCode === "Worldwide") 
    {
       url = "https://disease.sh/v3/covid-19/all "
    }
    else
    {
        url = `https://disease.sh/v3/covid-19/countries/${countryCode }`
    }
    
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);
 
      setcountryInfo(data);
    
    });
}

  console.log(countryInfo)
  
  
    
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
          <Select varient="outlined" onChange={onCountryChange} value={country}>
          <MenuItem value="Worldwide">Worldwide</MenuItem>
          { countries.map((country) => (
              <MenuItem value={ country.value }>{ country.name }</MenuItem>
            ))
          }
           </Select>
          </FormControl>
       </div>
        <div className="app__stats">
          <Infobox title="Coronavirus Cases" cases={ countryInfo.todayCases} total={ countryInfo.cases }/>
          <Infobox title="Recovered" cases={ countryInfo.todayRecovered} total={ countryInfo.recovered} />
          <Infobox title="Deaths" cases={ countryInfo.todayDeaths} total={ countryInfo.deaths }/>
        </div>
      
        
           {/* Table*/}
            {/* Graph*/}
            <Map 
             />
     
      </div>
      <Card className="app__right">
          <CardContent>
            <h3>Live cases by country</h3>
            <Table countries={tableData} />
            <h2>worldwide new cases</h2>
            <Linegraph />
          </CardContent>
      </Card>
    </div>
  );
}

export default App;
