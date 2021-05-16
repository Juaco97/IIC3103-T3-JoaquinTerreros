import React, {useEffect, useState} from 'react';
import socket from './Socket';
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, Popup} from "react-leaflet";
import { Icon} from 'leaflet'
import imagen from './avion2.svg';


const icono = new Icon({
  iconUrl: imagen,
  iconSize: [50, 50]
});

const Info = () => {
      
    // Hooks de estado para los vuelos y posiciones
    const [vuelos, setVuelos] = useState([]);
    const [posiciones, setPosiciones] = useState([]);
    const [ultimaPosicion, setUltimaPosicion] = useState({});
    
    // Se consume los vuelos
    useEffect(() => {
      // Se gatilla el envio
      socket.emit('FLIGHTS'); 
      // Se recibe el envio del mensaje
      socket.on('FLIGHTS', mensaje => {
        setVuelos(mensaje);
      });
    }, []);
    
    // Se consumen las posiciones
    useEffect(() => {
      socket.on('POSITION', mensaje => {
        setPosiciones((prev) => ([...prev, mensaje]));
        setUltimaPosicion((prev) => ({...prev, [mensaje.code]: mensaje.position}));
      })
    }, []);
    
  
    return (
      <div>
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
          <MapContainer
            className="markercluster-map"
            center={[0, 0]}
            zoom={2}
            maxZoom={18}
          >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {
            vuelos.map(function(vuelo) {
              return (
                <Polyline
                  posiciones={[[vuelo.origin[0], vuelo.origin[1]], [vuelo.destination[0], vuelo.destination[1]]]}
                />
              )
            })
          }
          
          {
            vuelos.map(function(vuelo) {
              return (
                <Marker position={[vuelo.origin[0], vuelo.origin[1]]}/>
              )
            })
          }
          
          {
            vuelos.map(function(vuelo) {
              return (
                <Marker position={[vuelo.destination[0], vuelo.destination[1]]}/>
              )
            })
          }
          
          {
            posiciones.map(function(posicion) {
             
              return (
                  <CircleMarker
                      center={{lat:posicion.position[0], lng: posicion.position[1]}}
                      fillColor="red"
                      pathOptions={{ color: 'red' }}
                      radius={2}/>
              )
            })
          }
          
          {
            Object.entries(ultimaPosicion).map(([codigo, posicion]) => (
              <Marker key={codigo}  icon={icono} position={[posicion[0], posicion[1]]}>
                <Popup>{codigo}</Popup>
              </Marker>
              ))
          }
          </MapContainer>
        </div>
        <div className="" style={{textAlign: "left"}}>
          {
            vuelos.map(function(vuelo) {
              return (
                <div>
                  <h4>Codigo de vuelo: {vuelo.code}</h4>
                  <ul>
                    <li>Aerolinea: {vuelo.airline}</li>
                    <li>Pasajeros en el vuelo:</li>
                    {vuelo.passengers.map(function(pasajero) {
                      return (
                        <ol>
                          <li style={{listStyle: "square"}}>Nombre: {pasajero.name}</li>
                          <li style={{listStyle: "square"}}>Edad: {pasajero.age}</li>
                          <br></br>
                        </ol>
                      )
                    })}
                    <li>Avion: {vuelo.plane}</li>
                    <li>Asiento: {vuelo.seats}</li>
                  </ul>
                </div>
              )
            })
          }
        </div>
      </div>
    )
};

export default Info;
