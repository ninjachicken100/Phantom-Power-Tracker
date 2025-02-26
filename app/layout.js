"use client";

import "./globals.css";
import Navbar, {FooterComponent, ApplianceMonitor} from "../src/components/PageComponents";
import { useEffect, useState } from 'react';

export default function RootLayout({ children }) {
  const [appliances, setAppliances] = useState([]);

  useEffect(() => {
    const fetchAppliances = async () => {
      try {
        const res = await fetch('/api/getAllData');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setAppliances(data);
      } catch (error) {
        console.error('Failed to fetch appliances:', error);
      }
    };

    fetchAppliances();
  }, []);


  return (
    <html lang="en">
      <body>
        
        <div>
          <Navbar />
        </div>

        {children}
        
        <div>
        {appliances.map((applianceObject, index) => (
          <ApplianceMonitor key={index} applianceObject={applianceObject} />
        ))}
        </div>
        

        <div style={{ textAlign: "left", paddingLeft: "2rem", fontWeight: "bold", fontFamily: "Arial", fontSize: "2rem" }}>
          Remember to..
        </div>

        <div className="room-component-padding">
          <FooterComponent />
        </div>
      </body>
    </html>
  );
}