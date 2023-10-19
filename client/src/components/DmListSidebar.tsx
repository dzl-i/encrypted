import { Card, CardBody } from '@nextui-org/react';
import { useState, useEffect } from 'react';

type Dm = {
  id: string;
  dmName: string;
};

type DmListSidebarProps = {
  activeDm: string;
  onDmClick: (id: string) => void;
};

export const DmListSidebar: React.FC<DmListSidebarProps> = ({ activeDm, onDmClick }) => {
  const [dms, setDms] = useState<Dm[]>([]);

  useEffect(() => {
    const fetchDms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dm/list`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setDms(prevDms => {
          if (JSON.stringify(prevDms) !== JSON.stringify(data.dms)) {
            return data.dms;
          }
          return prevDms;
        });
      } catch (error) {
        console.error("Error fetching DMs:", error);
      }
    };

    fetchDms();
  }, [dms]);

  return (
    <Card style={{ width: '20%', maxHeight: "calc(100vh - 80px)", padding: '1rem', backgroundColor: "#151515", textAlign: "left", overflowY: 'scroll' }}>
      <h3 style={{ color: "#787c82", fontSize: "0.9rem", fontWeight: "bolder" }}>DIRECT MESSAGES</h3>
      <ul>
        {dms?.map(dm => (
          <Card key={dm.id} isPressable onClick={() => onDmClick(dm.id)} style={{ width: '100%', borderRadius: 0, backgroundColor: dm.id === activeDm ? "#383838" : undefined }}>
            <CardBody style={{ fontSize: "1.2rem" }}>
              {dm.dmName}
            </CardBody>
          </Card>
        ))}
      </ul>
    </Card>
  );
};
