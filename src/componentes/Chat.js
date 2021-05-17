import React, { useState, useEffect } from 'react';
import socket from './Socket';


const Chat = ({ nombre }) => {
    const [mensaje, setMensaje] = useState("");
    const [mensajes, setMensajes] = useState([]);
   
    useEffect(() => {
        socket.on('CHAT', mensaje => {
            console.log(mensaje);
            setMensajes([...mensajes, mensaje]);
        })
        
        return () => {socket.off()}
    }, [mensajes])
   
    const enviar = (e) => {
        e.preventDefault();
        socket.emit("CHAT", {name: nombre, message: mensaje});
    }
    
    return (
        <div>
            <div>
                {mensajes.map((e, i) => <div key={i}>{`[${new Date(e.date).toTimeString().split(' ')[0]}] ${e.name}: ${e.message}`}</div>)}
            </div>
            <form onSubmit={enviar}>
                <label htmlFor="">Escriba su mensaje</label>
                <textarea name="" id="" cols="30" rows="1" value={mensaje} onChange={e => setMensaje(e.target.value)}>
        
                </textarea>
                <button>Enviar</button>
            </form>
        </div>
        
        
    )
}

export default Chat;