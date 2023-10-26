import { Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsFillPersonFill } from 'react-icons/bs';
import { HiMiniUserGroup } from 'react-icons/hi2';

type Dm = {
  id: string;
  dmName: string;
};

type DmListSidebarProps = {
  activeDm: string;
  onDmClick: (id: string) => void;
  onNewDmClick: () => void;
  dms: Dm[];
};

export const DmListSidebar: React.FC<DmListSidebarProps> = ({ activeDm, onDmClick, onNewDmClick, dms }) => {
  const [userFullName, setUserFullName] = useState<string>('');
  const [userHandle, setUserHandle] = useState<string>('');

  // Use useEffect to ensure this runs on the client side after initial render
  useEffect(() => {
    setUserFullName(sessionStorage.getItem("userFullName") || '');
    setUserHandle(sessionStorage.getItem("userHandle") || '');
  }, []);

  return (
    <Card style={{ width: '20%', maxHeight: "calc(100vh - 80px)", backgroundColor: "#151515", overflowY: 'scroll', borderRadius: 0 }}>
      <div style={{ display: "flex", flexDirection: "row", backgroundColor: "#151515", border: 0, alignItems: "center", padding: "1.5rem", height: "50px", width: "100%", justifyContent: 'space-between', position: "sticky", top: 0, zIndex: 10 }}>
        <h3 style={{ color: "#787c82", fontSize: "0.9rem", fontWeight: "bolder" }}>DIRECT MESSAGES</h3>
        <Dropdown className="dark">
          <DropdownTrigger style={{ color: "whitesmoke" }}>
            <button style={{ color: "whitesmoke", height: "2rem", width: "2rem", padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <AiOutlinePlus style={{ fontSize: "1.7rem", color: "#787c82" }} />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem onClick={onNewDmClick} style={{ color: "whitesmoke" }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <BsFillPersonFill style={{ marginRight: '8px', fontSize: "1.4rem" }} />
                <span>New Direct Message</span>
              </div>
            </DropdownItem>
            <DropdownItem style={{ color: "whitesmoke" }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <HiMiniUserGroup style={{ marginRight: '8px', fontSize: "1.4rem" }} />
                <span>New Group</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div style={{ maxHeight: "calc(100vh - 210px)", overflowY: 'scroll', paddingLeft: "1rem", paddingRight: "1rem" }}>
        <ul style={{ position: "relative" }}>
          {dms?.map(dm => (
            <Card key={dm.id} shadow='none' isPressable onClick={() => onDmClick(dm.id)} style={{ width: '100%', borderRadius: 0, backgroundColor: dm.id === activeDm ? "#383838" : "#151515" }}>
              <CardBody style={{ fontSize: "1.2rem" }}>
                {dm.dmName}
              </CardBody>
            </Card>
          ))}
        </ul>
      </div>
      <div style={{ display: "flex", flexDirection: "row", padding: "1rem", backgroundColor: "#101010", height: "80px", width: "20%", margin: 0, bottom: 0, position: "fixed" }}>
        <User
          name={userFullName}
          description={`@${userHandle}`}
          avatarProps={{
            src: "https://kansai-resilience-forum.jp/wp-content/uploads/2019/02/IAFOR-Blank-Avatar-Image-1.jpg"
          }}
        />
      </div>
    </Card>
  );
};
