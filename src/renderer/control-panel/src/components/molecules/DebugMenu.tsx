import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { Bug, Github, Trash } from 'react-bootstrap-icons'

const DebugMenu: React.FC = () => {
  return (
    <Dropdown align="end" drop="down" className="me-2">
      <Dropdown.Toggle id="debug-dropdown" size="sm">
        <Bug className="me-2" /> Debug
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          href="#"
          onClick={() => {
            localStorage.clear()
            window.location.reload()
          }}
        >
          <Trash className="me-2" /> Clear Local Storage
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#">
          <Github /> Submit Bug Report
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default DebugMenu
