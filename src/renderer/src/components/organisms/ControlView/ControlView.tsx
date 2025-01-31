import React from "react";
import { Nav, Tab } from "react-bootstrap";
import ActionBar from "../ActionBar/ActionBar";
import { BuilderView } from "../BuilderView";
import { RunnerView } from "../RunnerView";

const ControlView: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>("builder");
  return (
    <div className="d-flex flex-column">
      <Tab.Container
        defaultActiveKey="builder"
        onSelect={(k) => setActiveTab(k as string)}
      >
        <Nav variant="tabs" className="mb-2">
          <Nav.Item>
            <Nav.Link eventKey="builder">
              <i className="bi bi-pencil-square me-2"></i>Builder
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="game-runner">
              <i className="bi bi-collection-play me-2"></i>Game Runner
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <ActionBar activeTab={activeTab} />
        <Tab.Content className="flex-grow-1">
          <Tab.Pane eventKey="builder" className="">
            <BuilderView />
          </Tab.Pane>
          <Tab.Pane eventKey="game-runner" className="">
            <RunnerView />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default ControlView;
