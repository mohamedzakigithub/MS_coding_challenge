import React, { useState } from "react";
import SalesDashboard from "./SalesDashboard";

import styled from "styled-components";

const AppWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: #cccccc;
  display: flex;
  flex-direction: column;
`;

const AppHeader = styled.header`
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 2rem;
`;

const HeaderText = styled.h1`
  font-family: "Roboto", sans-serif;
`;

const Username = styled.span`
  font-family: "Roboto", sans-serif;
`;

const Main = styled.main`
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

const ErrorWrapper = styled.h1`
  color: red;
  text-align: middle;
`;

interface User {
  firstName: string;
  lastName: string;
  email: string;
  id: number;
}

interface sale {
  storeId: string,
  marketplace: string,
  country: string,
  shopName: string,
  Id: string,
  orderId: string,
  latest_ship_date: string,
  shipment_status: string,
  destination: string,
  items: string,
  orderValue: string
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [salesData, setSalesData] = useState<sale[]>([]);
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    fetch("http://localhost:8080/user")
      .then((results) => results.json())
      .then((data) => {
        setUser(data);
      });
  }, []);

  React.useEffect(() => {
    async function fetchSalesData() {
      try {
        const response = await fetch("http://localhost:8080/sales")
        if (response.ok) {
          const data = await response.json()
          setSalesData(data);
        } else {
          const data = await response.json()
          setError(data.error)
        }
      } catch (error: any) {
        setError(error)
      }
    }
    fetchSalesData()
  }, []);

  return (
    <AppWrapper>
      <AppHeader>
        <HeaderText>Analytics Dashboard</HeaderText>
        <Username>Welcome, {user ? user.firstName : "Guest"}!</Username>
      </AppHeader>
      {/** Dashboard - new widgets go here */}
      <Main>
        {error ? <ErrorWrapper>{error}</ErrorWrapper> : <SalesDashboard salesData={salesData} />}
      </Main>
    </AppWrapper>
  );
};

export default App;
