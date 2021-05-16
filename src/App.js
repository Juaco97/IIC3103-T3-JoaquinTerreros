import './App.css';

import React, {useState} from 'react';
import Chat from './componentes/Chat';
import Info from './componentes/Info';

function App() {
  const [nombre, setNombre] = useState("");
  const [registrado, setRegistrado] = useState(false);
  
  const registrar = (e) => {
    e.preventDefault();
    if (nombre !== "") {
      setRegistrado(true);
    } else {
      alert("Debes ingresar un nickname para chatear!");
    }
  }
  
  return (
    <div className="App">
      <div className="Chat">
        <h1>Chat</h1>
        {
          !registrado &&
          
          <form onSubmit={registrar}>
            <label htmlFor="">Introduce un nickname</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)}/>
            <button>Ir a la pagina!</button>
          </form>
        }
        
        {
          registrado &&
          <Chat nombre={nombre} resgitrado={registrado}/>
        }
      </div>
      <Info/>
    </div>
  )
}

export default App;
