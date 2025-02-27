import fetch from 'node-fetch';

const runMonitorAppliance = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/monitorAppliance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to run monitorAppliance');
    }

    const data = await response.json();
    console.log('Monitor appliance task completed:', data);
  } catch (error) {
    console.error('Error running monitorAppliance:', error);
  }
};

// Run the monitorAppliance function every 3 hours
setInterval(runMonitorAppliance, 3 * 60 * 60 * 1000);

// Run the monitorAppliance function immediately on startup
runMonitorAppliance();