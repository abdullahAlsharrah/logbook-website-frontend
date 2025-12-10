import React from "react";
import { Badge } from "react-bootstrap";

const LevelBadge = ({ level, size = "md" }) => {
  if (!level) {
    return (
      <Badge bg="secondary" className={`level-badge level-${size}`}>
        No Level
      </Badge>
    );
  }

  const getLevelColor = (level) => {
    const colors = {
      R1: "info", // Blue
      R2: "primary", // Dark Blue
      R3: "warning", // Yellow
      R4: "success", // Green
      R5: "danger", // Red (Senior)
    };
    return colors[level] || "secondary";
  };

  const getLevelDescription = (level) => {
    const descriptions = {
      R1: "First Year",
      R2: "Second Year",
      R3: "Third Year",
      R4: "Fourth Year",
      R5: "Fifth Year",
    };
    return descriptions[level] || "";
  };

  return (
    <Badge
      bg={getLevelColor(level)}
      className={`level-badge level-${size}`}
      title={getLevelDescription(level)}>
      {level}
    </Badge>
  );
};

export default LevelBadge;
