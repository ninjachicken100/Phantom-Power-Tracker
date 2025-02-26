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


export function ApplianceComponent({ applianceObject, onToggleSwitch}) {
  const { id, owner, appliance } = applianceObject;
  const [isSwitchOn, setIsSwitchOn] = useState(applianceObject.switch);
  // console.log('ApplianceComponent received id:', id); // Log the received id

  const toggleSwitch = async () => {
    const newSwitchState = !isSwitchOn;
    setIsSwitchOn(newSwitchState);
    console.log("newSwitchState", newSwitchState);

    const data = {
      id: id,
      owner: owner,
      appliance: appliance,
      switchState: newSwitchState,
      lastSwitchedOn: newSwitchState ? new Date() : applianceObject.lastSwitchedOn
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

      onToggleSwitch(data);
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


function sendEmail(owner, appliance) {
  console.log('sendEmail triggered for:', owner, appliance); // Log the triggered email

  const emailContent = `Hello ${owner},

  The ${appliance} has been on for more than 5 seconds.

  Please turn it off if not in use.`;



  fetch('/api/sendEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({owner, appliance, emailContent}),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    return response.json();
  })
  .then(data => {
    console.log('Email sent successfully:', data);
  })
  .catch(error => {
    console.error('Error sending email:', error);
  });
}

export function ApplianceMonitor({ applianceObject }) {
  const { owner, appliance, lastSwitchedOn } = applianceObject;
  const [isSwitchOn] = useState(applianceObject.switch);

  useEffect(() => {
    if (isSwitchOn) {
      console.log('switch is on for:', owner, appliance, isSwitchOn, lastSwitchedOn)

      const interval = setInterval(() => {
        const now = new Date();
        const timeDiff = now - new Date(lastSwitchedOn);
        const secondsDiff = timeDiff / 1000; // Calculate the difference in seconds
        console.log('secondsDiff:', secondsDiff)

        if (secondsDiff > 10) { // Check if the difference is more than 5 seconds
          console.log('triggering sendEmail for:', owner)
          sendEmail(owner, appliance);
          clearInterval(interval);
        }
      }, 10000); // , 1800000ms = 30mins, 10000ms = 10s

      return () => clearInterval(interval);
    }
  }, [isSwitchOn, lastSwitchedOn, owner, appliance]);

  return null;
}