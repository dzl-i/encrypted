import { Button, Card, CardBody, Spinner } from "@nextui-org/react";

export const LogoutConfirmation = ({ onConfirm, onCancel, isLoadingLogout }) => {
  return (
    <div style={overlayStyle}>
      <Card>
        <CardBody className="flex flex-col gap-4 items-center">
          <h1 style={{ fontSize: "1.5rem", padding: "1rem" }}>Are you sure you want to log out?</h1>
          <div className="flex gap-8" style={{ padding: "1rem" }}>
            <Button onClick={onConfirm} color="success" variant="solid" disabled={isLoadingLogout}>
              {isLoadingLogout ? <Spinner size="md" color="default" /> : "Yes"}
            </Button>
            <Button onClick={onCancel} color="danger" variant="solid">No</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 1000, // Ensure the overlay is on top of other content
};
