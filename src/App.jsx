/**
 * Application Entry Point
 * Conor Steward
 * 12/19/24
 * 1conorsteward@gmail.com
 * This file serves as the entry point for the cryptocurrency dashboard application.
 * It imports and renders the main Dashboard component, which houses all the core
 * features of the app.
 * 
 * Components:
 * - Dashboard: The main dashboard component displaying cryptocurrency information
 * 
 * Styling:
 * - The root element provides a container for the Dashboard component.
 */

import Dashboard from "./Dashboard"; // Import the main Dashboard component

/**
 * App Component
 * 
 * The top-level functional component for the application. It encapsulates the Dashboard
 * component within a parent <div>. This structure ensures the potential for future
 * expansion, such as adding additional global components or layouts.
 */
function App() {
  return (
    <div>
      {/* Render the Dashboard component */}
      <Dashboard />
    </div>
  );
}

export default App;