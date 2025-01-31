import React from "react";
import DebugMenu from "./DebugMenu";
import Logo from "../atoms/logo";
import { Container, Navbar } from "react-bootstrap";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const Header: React.FC<{ isScreen: boolean }> = ({ isScreen }) => {
  const [currentTeam] = useLocalStorage("currentTeam", null); // Replace with actual current team value or state

  return (
    <Container fluid className="pb-1">
      <Navbar bg="dark" variant="dark" className="mb-1 px-3">
        <Logo />
        {isScreen ? (
          <>
            <h1
              style={{
                display: "flex",
                color: "#FFFFFF",
                flex: 1,
                justifyContent: "center",
              }}
            >
              Current Team: {currentTeam?.name}
            </h1>
          </>
        ) : null}
        {isScreen ? null : <DebugMenu />}
      </Navbar>
    </Container>
  );
};
export default Header;
