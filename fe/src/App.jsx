import React from 'react';

// Import from components
import Button from 'components/button/Button';

// Import styles
import "./App.css";

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="container">
      <Button onClick={() => setCount(prevState => prevState + 1)}>
        Count is {count}
      </Button>
    </div>
  )
}

export default App
