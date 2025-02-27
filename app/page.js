"use client";
import { useState, useEffect } from 'react';
import { AddApplianceComponent, ApplianceComponent } from '../src/components/PageComponents';

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/getAllData');
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      console.log('Fetched data:', data); // Log the fetched data

      // Preprocess the data to match the expected keys
      const processedData = data.map(item => ({
        id: item.id, 
        owner: item.owner,
        appliance: item.appliance,
        switch: item.switch,
        lastSwitchedOn: item.lastSwitchedOn
      }));

      console.log('Processed data:', processedData); // Log the processed data

      if (Array.isArray(processedData)) {
        setItems(processedData);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]);
    }
  };

  const handleToggleSwitch = (updatedAppliance) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedAppliance.id ? updatedAppliance : item
      )
    );
    console.log('Updated appliance:', updatedAppliance);
  };

  return (
    <div>
      <div className="page-title">
        <h1>Family Appliances</h1>
      </div>

      {items.map((item, index) => (
        <div key={index} className="room-component-padding">
          <ApplianceComponent
            applianceObject={item}
            onToggleSwitch={handleToggleSwitch}
          />
        </div>
      ))}
      
      <div className="room-component-padding">
        <AddApplianceComponent />
      </div>
    </div>
  );
}