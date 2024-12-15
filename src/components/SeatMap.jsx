import React, { useState, useEffect } from 'react';
import './SeatMap.css';

const SeatMap = ({ flightId, onSeatSelect }) => {
    
    const [availableSeats, setAvailableSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [occupiedSeats, setOccupiedSeats] = useState([]);

useEffect(() => {
    const fetchSeats = async () => {
        try {
            const [occupiedResponse] = await Promise.all([
                fetch(`http://localhost:8080/tickets/flights/${flightId}/occupied-seats`)
            ]);
            
            const occupiedData = await occupiedResponse.json();
            setOccupiedSeats(Array.isArray(occupiedData) ? occupiedData : []);
        } catch (error) {
            console.error('Error fetching seats:', error);
            setOccupiedSeats([]);
        }
    };
    
    
    fetchSeats();
}, [flightId]);


    const handleSeatClick = (seatNumber) => {
        setSelectedSeat(seatNumber);
        onSeatSelect(seatNumber);
    };

    const rows = ['A', 'B', 'C', 'D', 'E'];
    const columns = [1, 2, 3, 4, 5, 6];

    return (
        <div className="seat-map">
            <div className="seat-grid">
                {rows.map(row => (
                    <div key={row} className="seat-row">
                        {columns.map(col => {
                            const seatNumber = `${row}${col}`;
                            return (
                                <button
                                    key={seatNumber}
                                    className={`seat ${
                                        occupiedSeats.includes(seatNumber) ? 'occupied' : ''
                                    } ${selectedSeat === seatNumber ? 'selected' : ''}`}
                                    onClick={() => handleSeatClick(seatNumber)}
                                    disabled={occupiedSeats.includes(seatNumber)}
                                >
                                    {seatNumber}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="legend">
                <div className="legend-item">
                    <span className="seat available"></span> Available
                </div>
                <div className="legend-item">
                    <span className="seat occupied"></span> Occupied
                </div>
                <div className="legend-item">
                    <span className="seat selected"></span> Selected
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
