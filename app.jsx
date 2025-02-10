import React, { useState } from 'react';
import './App.css';

const App = () => {
  const maxSeats = 50; // Total number of available seats
  const [seatsLeft, setSeatsLeft] = useState(maxSeats); // Current available seats
  const [reservations, setReservations] = useState([]); // List of reservations
  const [name, setName] = useState(''); // Customer name input
  const [phone, setPhone] = useState(''); // Customer phone input
  const [guestCount, setGuestCount] = useState(''); // Guest count input
  const [alertMessage, setAlertMessage] = useState(''); // Alert message
  const [menuItems] = useState([
    { name: 'Pasta', price: 899 },  // Price in INR
    { name: 'Pizza', price: 1099 }, // Price in INR
    { name: 'Salad', price: 599 },  // Price in INR
    { name: 'Burger', price: 799 }, // Price in INR
    { name: 'Steak', price: 1699 }, // Price in INR
    { name: 'Soup', price: 399 },  // Price in INR
    { name: 'Dessert', price: 299 }, // Price in INR
    { name: 'Soft Drinks', price: 199 }, // Price in INR
  ]); // Sample menu items with prices in INR

  // Handle reservation submission
  const makeReservation = () => {
    if (!name || !phone || isNaN(guestCount) || guestCount <= 0) {
      setAlertMessage('Please fill out all fields correctly.');
      return;
    }

    // Duplicate name check
    if (reservations.some(reservation => reservation.name === name)) {
      setAlertMessage('Duplicate name found. Please enter a unique name.');
      return;
    }

    // Check if enough seats are available
    if (guestCount > seatsLeft) {
      setAlertMessage('Not enough seats available!');
      return;
    }

    const newReservation = {
      name,
      phone,
      guestCount: parseInt(guestCount),
      checkInTime: new Date().toLocaleString(),
      checkOutTime: null, // Initial checkout time
      status: 'Checked-in',
    };

    // Add reservation and update seats
    setReservations([...reservations, newReservation]);
    setSeatsLeft(seatsLeft - guestCount);

    // Reset form fields
    setName('');
    setPhone('');
    setGuestCount('');
    setAlertMessage('');
  };

  // Handle checkout
  const checkOut = (index) => {
    const updatedReservations = [...reservations];
    updatedReservations[index].status = 'Checked-out';
    updatedReservations[index].checkOutTime = new Date().toLocaleString();

    // Update seats and reservations
    setReservations(updatedReservations);
    setSeatsLeft(seatsLeft + updatedReservations[index].guestCount);
  };

  // Handle deletion of a reservation
  const deleteReservation = (index) => {
    const updatedReservations = [...reservations];
    setSeatsLeft(seatsLeft + updatedReservations[index].guestCount);
    updatedReservations.splice(index, 1); // Remove reservation
    setReservations(updatedReservations);
  };

  return (
    <div className="container">
      <h1>Restaurant Reservation System</h1>

      {/* Menu List with Prices in INR */}
      <div className="menu">
        <h3>Our Menu</h3>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.name} - ₹{item.price.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      {/* Reservation Form */}
      <div className="form-container">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Phone:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <label>Guest Count:</label>
        <input
          type="number"
          value={guestCount}
          onChange={(e) => setGuestCount(e.target.value)}
        />
        <button onClick={makeReservation}>Reserve</button>
      </div>

      {/* Alert Message */}
      {alertMessage && <div className="alert">{alertMessage}</div>}

      {/* Available Seats */}
      <div className="available-seats">
        <h3>Seats Available: {seatsLeft}</h3>
      </div>

      {/* Reservation Table */}
      <h3>Current Reservations</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Check-in Time</th>
            <th>Check-out Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <tr key={index}>
              <td>{reservation.name}</td>
              <td>{reservation.phone}</td>
              <td>{reservation.checkInTime}</td>
              <td>{reservation.checkOutTime ? reservation.checkOutTime : 'N/A'}</td>
              <td>{reservation.status}</td>
              <td>
                {reservation.status === 'Checked-in' ? (
                  <button onClick={() => checkOut(index)}>Click to Checkout</button>
                ) : (
                  <button onClick={() => deleteReservation(index)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
