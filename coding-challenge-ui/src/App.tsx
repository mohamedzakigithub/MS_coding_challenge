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
  flex-grow: 1;
`;

interface User {
  firstName: string;
  lastName: string;
  email: string;
  id: number;
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [salesData, setSalesData] = useState([]);

  React.useEffect(() => {
    fetch("http://localhost:8080/user")
      .then((results) => results.json())
      .then((data) => {
        setUser(data);
      });
  }, []);

  React.useEffect(() => {
    fetch("http://localhost:8080/sales")
      .then((results) => results.json())
      .then((data) => {
        setSalesData(data);
      });
  }, []);

  return (
    <AppWrapper>
      <AppHeader>
        <HeaderText>Analytics Dashboard</HeaderText>
        <Username>Welcome, {user ? user.firstName : "Guest"}!</Username>
      </AppHeader>
      {/** Dashboard - new widgets go here */}
      <Main>
        <SalesDashboard salesData={salesData ? salesData : []} />
      </Main>
    </AppWrapper>
  );
};

export default App;
