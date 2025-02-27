"use client";
import Image from 'next/image';
import Link from 'next/link';
import Add from './add.png';
import Logo from './logo.png';
import GIF from './turnoff.gif';
import { useState, useEffect } from 'react';

export default function NavbarComponent() {
    return (
      <div>
        <nav className="navbar-look">
          <div className="logo-container">
            <Image src={Logo} alt="Phantom Logo" width={500} height={200} />
          </div>
          
        </nav>
      </div>
    );
}

export function RoomComponent({ room, image }) {
    return (
      <Link href={`/appliances?room=${room}`} passHref>
        <div className="rounded-rectangle" role="button" tabIndex={0}>
          <Image src={image} alt={`${room} image`} layout="fill" objectFit="cover" />
          <div className="overlay"></div>
          <div className="room-content">
            {room}
          </div>
        </div>
      </Link>
    );
}

export function AddApplianceModal({ isOpen, onClose, onSubmit }) {
  const [owner, setOwner] = useState('parents');
  const [appliance, setAppliance] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ owner, appliance, switch: false });
    setOwner('');
    setAppliance('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Appliance</h2>
        </div>
        
        <form onSubmit={handleSubmit} >
          <label >
            Owner:
          </label>
          <select value={owner} onChange={(e) => setOwner(e.target.value)} required >
            <option value="parents">Parents</option>
            <option value="mom">Mom</option>
            <option value="dad">Dad</option>
            <option value="younger bro">younger brother</option>
            <option value="older bro">older brother</option>
          </select>
          
          <label >
            Appliance:
          </label>
          <input
            type="text"
            value={appliance}
            onChange={(e) => setAppliance(e.target.value)}
            required
            placeholder="e.g. lights, fans .."
            className="bg-gray-200 placeholder-gray-600"
          />
          
          <br />
          <div className="modal-buttons">
            <button type="submit">Add</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddApplianceComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddAppliance = async (applianceData) => {
    try {
      const res = await fetch('/api/addAppliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applianceData),
      });

      if (!res.ok) {
        throw new Error('Failed to add appliance');
      }

      const newAppliance = await res.json();
      console.log('New appliance added:', newAppliance);
    } catch (error) {
      console.error('Failed to add appliance:', error);
    }
  };

  return (
    <div className="add-room-container">
      <button onClick={handleOpenModal} style={{ background: 'none', border: 'none', padding: 0 }}>
        <Image src={Add} alt="Add Logo" />
      </button>
      <AddApplianceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddAppliance}
      />
    </div>
  );
}

export function FooterComponent() {
    return (
      <div className="footer-container">
        <Image src={GIF} alt="Call to ACTION" />
      </div>
    );
}


export function ApplianceComponent({ applianceObject, onToggleSwitch }) {
  const { id, owner, appliance } = applianceObject;
  const [isSwitchOn, setIsSwitchOn] = useState(applianceObject.switch);

  useEffect(() => {
    if (isSwitchOn) {
      // Call the monitoring API endpoint if the switch is already on
      const data = {
        id: id,
        owner: owner,
        appliance: appliance,
        switchState: isSwitchOn,
        lastSwitchedOn: applianceObject.lastSwitchedOn
      };
      console.log("Initial data", data);

      // fetch('/api/monitorAppliance', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // })
      // .then(response => {
      //   if (!response.ok) {
      //     throw new Error('Failed to start monitoring');
      //   }
      //   return response.json();
      // })
      // .then(data => {
      //   console.log('Monitoring started:', data);
      // })
      // .catch(error => {
      //   console.error('Error starting monitoring:', error);
      // });
    }
  }, 
  
  [isSwitchOn, id, owner, appliance, applianceObject.lastSwitchedOn]);

  const toggleSwitch = async () => {
    const newSwitchState = !isSwitchOn;
    setIsSwitchOn(newSwitchState);
    console.log("newSwitchState", newSwitchState);

    const data = {
      id: id,
      owner: owner,
      appliance: appliance,
      switchState: newSwitchState,
      lastSwitchedOn: newSwitchState ? new Date() : null
    };
    console.log("data", data);

    try {
      const res = await fetch('/api/updateDB', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to update switch');
      }

      onToggleSwitch(data); // Call the callback function with the updated data

      // if (newSwitchState) {
      //   // Call the monitoring API endpoint if the switch is turned on
      //   await fetch('/api/monitorAppliance', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(data),
      //   });
      // } 

    } catch (error) {
      console.error('Failed to update switch:', error);
      setIsSwitchOn(!newSwitchState); // Revert the switch state if the update fails
    }
  };

  return (
    <div className="appliance-container">
      <div className="appliance-info">
        <p>Owner: {owner}</p>
        <p>Appliance: {appliance}</p>
        <p>Switch: {isSwitchOn ? 'On' : 'Off'}</p>
      </div>
      <div className="appliance-switch">
        <label className="switch">
          <input 
            type="checkbox" 
            checked={isSwitchOn} 
            onChange={toggleSwitch} 
          />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
}