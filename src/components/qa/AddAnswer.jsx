import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'beige',
    width: 1000,
    height: 500,
  },
};
export default function App() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [newAnswer, setAnswer] = useState('');
  const [nickname, setNickname] = useState('');
  const [photos, setPhotos] = useState('');

  return (
    <span>
      <button type="button" onClick={setOpen} className="add-answer-button">Add Answer</button>
      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        style={customStyles}
      >
        <div>Add Answer</div>
        <form>
          <label> Your Answer </label>
          <label className="label-answer-modal">(mandatory)</label>
          <label>:</label><br></br>
          <input className="add-answer-input" value={newAnswer} placeholder="max:1000chars" /> <br></br>
          <label> Enter Nickname</label>
          <label className="label-answer-modal">(mandatory)</label>
          <label>:</label><br></br>
          <input className="add-answer-modal" value={nickname} placeholder="Example: jack1234" required/> <br></br>
          <label className="label-answer-modal">For privacy reasons, do not use your full name or email address</label> <br></br>
          <label>Enter Email</label>
          <label className="label-answer-modal">(mandatory)</label>
          <label>:</label><br></br>
          <input className="add-answer-modal" value={email} placeholder="jack@email.com" /><br></br>
          <label className="label-answer-modal"> For authentication reasons, you will not be emailed</label><br></br>
          <button type="button">Upload Images</button>
        </form>
        <button type="button" onClick={() => setOpen(false)}>Submit</button>
        <button type="button" onClick={() => setOpen(false)}> Close</button>
      </Modal>
    </span>
  );
}