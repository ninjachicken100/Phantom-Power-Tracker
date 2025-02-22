import "./globals.css";
import Navbar, {RoomComponent, AddApplianceComponent, FooterComponent} from "../src/components/PageComponents";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div>
          <Navbar />
        </div>
        {children}

        <div className="room-component-padding">
          <FooterComponent />
          </div>

        
      </body>
    </html>
  );
}