import React from "react";
import { Dropdown } from "react-bootstrap";
import { Building2 } from "lucide-react";
import { useInstitution } from "../context/InstitutionContext";
import "./InstitutionSelector.css";

const InstitutionSelector = () => {
  const {
    institutions,
    selectedInstitution,
    currentInstitution,
    setSelectedInstitution,
    clearInstitutionSelection,
    isLoading,
  } = useInstitution();

  if (isLoading) {
    return (
      <div className="institution-selector">
        <Dropdown>
          <Dropdown.Toggle
            variant="outline-primary"
            className="institution-dropdown">
            <Building2 size={16} />
            <span>Loading...</span>
          </Dropdown.Toggle>
        </Dropdown>
      </div>
    );
  }

  if (!institutions || institutions.length === 0) {
    return null;
  }

  const displayText = currentInstitution
    ? currentInstitution.name
    : "All Institutions";

  return (
    <div className="institution-selector">
      <Dropdown>
        <Dropdown.Toggle
          variant="outline-primary"
          className="institution-dropdown">
          <Building2 size={16} />
          <span className="institution-name">{displayText}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="institution-dropdown-menu">
          <Dropdown.Header>Select Institution</Dropdown.Header>
          <Dropdown.Item
            onClick={clearInstitutionSelection}
            active={!selectedInstitution}
            className="institution-item">
            All Institutions
          </Dropdown.Item>
          <Dropdown.Divider />
          {institutions.map((institution) => (
            <Dropdown.Item
              key={institution._id}
              onClick={() => setSelectedInstitution(institution._id)}
              active={selectedInstitution === institution._id}
              className="institution-item">
              <div className="institution-item-content">
                <div className="institution-item-name">{institution.name}</div>
                {institution.code && (
                  <div className="institution-item-code">
                    {institution.code}
                  </div>
                )}
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default InstitutionSelector;
