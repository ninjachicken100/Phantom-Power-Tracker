"use client";

import "./globals.css";
import Navbar, {FooterComponent} from "../src/components/PageComponents";
import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    fetch('http://localhost:3000/api/monitorAppliance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to start monitoring');
      }
      return response.json();
    })
    .then(data => {
      console.log('Monitoring started:', data);
    })
    .catch(error => {
      console.error('Error starting monitoring:', error);
    });
  }, []); // Empty dependency array ensures this runs only once

  return (
    <html lang="en">
      <body>
        <div>
          <Navbar />
        </div>

        {children}

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