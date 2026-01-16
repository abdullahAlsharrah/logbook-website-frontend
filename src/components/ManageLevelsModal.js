import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { TrendingUp } from "lucide-react";
import LevelBadge from "./LevelBadge";
import { useUpdateUserLevel } from "../hooks/useUsers";

const LEVELS = [
  { value: "", label: "No Level Set" },
  { value: "R1", label: "R1 - First Year Resident" },
  { value: "R2", label: "R2 - Second Year Resident" },
  { value: "R3", label: "R3 - Third Year Resident" },
  { value: "R4", label: "R4 - Fourth Year Resident" },
  { value: "R5", label: "R5 - Fifth Year Resident" },
];

const ManageLevelsModal = ({ show, onHide, user, institutionId }) => {
  const [newLevel, setNewLevel] = useState("");
  const updateLevelMutation = useUpdateUserLevel();

  // Initialize level when modal opens or user changes
  useEffect(() => {
    if (show && user) {
      setNewLevel(user.level || "");
    }
  }, [show, user]);

  const handleUpdateLevel = async () => {
    if (!institutionId) {
      alert("Institution ID is required");
      return;
    }

    try {
      await updateLevelMutation.mutateAsync({
        userId: user._id,
        levelData: {
          level: newLevel,
          institutionId: institutionId,
        },
      });
      alert("Level updated successfully!");
      onHide();
    } catch (error) {
      console.error("Error updating level:", error);
      alert(error.response?.data?.message || "Failed to update level");
    }
  };

  if (!user || user.role !== "resident") {
    return null;
  }

  return (
    <Modal show={show} onHide={onHide} size="md">
      <Modal.Header closeButton>
        <Modal.Title>
          <TrendingUp size={24} className="me-2" />
          Manage Resident Level - {user?.username}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info" className="mb-3">
          <strong>Current Level:</strong>{" "}
          <LevelBadge level={user.level || ""} />
        </Alert>

        <Form.Group className="mb-3">
          <Form.Label>New Level</Form.Label>
          <Form.Select
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
            size="lg">
            {LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </Form.Select>
          <Form.Text className="text-muted">
            This will affect which forms and options this resident can access in
            this institution.
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleUpdateLevel}
          disabled={updateLevelMutation.isPending || newLevel === user.level}>
          {updateLevelMutation.isPending ? "Updating..." : "Update Level"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ManageLevelsModal;
