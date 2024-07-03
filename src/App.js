import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [splitFriend, setSplitFriend] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);

  function handleShowAddFriend() {
    setShowAddFriend((e) => !e);
  }

  function handleAddFriend(friend) {
    setFriends([...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelectSplitFriend(friend) {
    setSplitFriend(friend);
    setShowAddFriend(false);
  }

  function handleSplit({ friendExpense, payer }) {
    setFriends((prevFriends) => {
      const updatedSplitFriend = prevFriends.find(
        (friend) => friend.id === splitFriend?.id
      );

      let newBalance = 0;
      if (payer === "You")
        newBalance = updatedSplitFriend.balance + friendExpense;
      else newBalance = updatedSplitFriend.balance - friendExpense;

      return prevFriends.map((friend) =>
        friend.id === updatedSplitFriend?.id
          ? { ...friend, balance: newBalance }
          : friend
      );
    });
    setSplitFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectSplitFriend={handleSelectSplitFriend}
          splitFriend={splitFriend}
        />
        <AddFriendSection
          onAddFriend={handleAddFriend}
          showAddFriend={showAddFriend}
          onShowAddFriend={handleShowAddFriend}
        />
      </div>
      {splitFriend && (
        <FormSplitBill friend={splitFriend} onSplit={handleSplit} />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectSplitFriend, splitFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelectSplitFriend={onSelectSplitFriend}
          splitFriend={splitFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectSplitFriend, splitFriend }) {
  const isSelected = splitFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <h3>{friend.name}</h3>
      <img src={friend.image} alt={friend.name} />
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      {isSelected ? (
        <Button onClick={() => onSelectSplitFriend(null)}>Close</Button>
      ) : (
        <Button onClick={() => onSelectSplitFriend(friend)}>Select</Button>
      )}
    </li>
  );
}

function AddFriendSection({ onAddFriend, showAddFriend, onShowAddFriend }) {
  return (
    <>
      {showAddFriend && <FormAddFriend onAddFriend={onAddFriend} />}
      <Button onClick={onShowAddFriend}>
        {showAddFriend ? "Close" : "Add friend"}
      </Button>
    </>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(event) {
    event.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const friend = {
      id,
      balance: 0,
      name,
      image: `${image}?=${id}`,
    };

    onAddFriend(friend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  function handleChangeName(event) {
    setName(event.target.value);
  }

  function handleChangeImage(event) {
    setImage(event.target.value);
  }

  return (
    <form
      id="form-add-friend"
      className="form-add-friend"
      onSubmit={handleSubmit}
    >
      <label htmlFor="name-input">👭 Friend name</label>
      <input
        id="name-input"
        type="text"
        value={name}
        onChange={handleChangeName}
      />
      <label htmlFor="image-input">🌄 Image URL</label>
      <input
        id="image-input"
        type="url"
        value={image}
        onChange={handleChangeImage}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplit }) {
  const [billValue, setBillValue] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [payer, setPayer] = useState("You");
  const friendExpense = billValue - myExpense;

  function handleSubmit(e) {
    e.preventDefault();
    onSplit({ friendExpense, payer });
    setBillValue("");
    setMyExpense("");
    setPayer("You");
  }

  return (
    <form
      id="form-split-bill"
      className="form-split-bill"
      onSubmit={handleSubmit}
    >
      <h2>split a bill with {friend?.name}</h2>
      <label htmlFor="input-bill-value">💰 Bill value:</label>
      <input
        id="input-bill-value"
        type="number"
        value={billValue > 0 ? billValue : ""}
        min={1}
        onChange={(e) => setBillValue(+e.target.value)}
      />
      <label htmlFor="input-your-expense">🧍‍♀️ Your expense:</label>
      <input
        id="input-your-expense"
        type="number"
        value={myExpense > 0 ? myExpense : ""}
        min={1}
        max={billValue}
        onChange={(e) => setMyExpense(+e.target.value)}
      />
      <label htmlFor="friend-expense">👭 {friend?.name}'s expense:</label>
      <input id="friend-expense" type="number" value={friendExpense} disabled />
      <label htmlFor="who-is-paying-select-input">
        🤑 Who is paying the bill?
      </label>
      <select
        id="who-is-paying-select-input"
        value={payer}
        onChange={(e) => setPayer(e.target.value)}
      >
        <option key="select-you-to-pay" value="You">
          You
        </option>
        <option key="select-friend-to-pay" value={friend?.name}>
          {friend?.name}
        </option>
      </select>
      <button type="submit" className="button">
        Split bill
      </button>
    </form>
  );
}
