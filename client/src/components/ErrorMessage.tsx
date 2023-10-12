import React from 'react';
import { Card } from '@nextui-org/react';

type ErrorMessageProps = {
  message: string | null;
  onClose: () => void;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <Card style={{ margin: "1rem", backgroundColor: "#f56565", position: "relative", padding: "10px 35px 10px 20px", display: "flex" }}>
      <p>
        {message}
      </p>
      <span
        onClick={onClose}
        style={{
          cursor: 'pointer',
          color: 'white',
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)"
        }}
      >
        ✖
      </span>
    </Card>
  );
}
