import { useState, useEffect } from "react"

function App() {
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newQty, setNewQty] = useState(0)

  // fetch all items on page load
  useEffect(() => {
    fetch("http://localhost:3000/items")
      .then(r => r.json())
      .then(data => setItems(data))
  }, [])

  // login user
  async function handleLogin() {
    const username = prompt("username?")
    const password = prompt("password?")
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    }).then(r => r.json())
    if (res.error) alert(res.error)
    else setUser(res)
  }

  // register user
  async function handleRegister() {
    const first_name = prompt("first name (optional)")
    const last_name = prompt("last name (optional)")
    const username = prompt("choose username")
    const password = prompt("choose password")
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, username, password })
    }).then(r => r.json())

    if (res.error) alert(res.error)
    else setUser(res)
  }

  // create new item
  async function handleCreateItem() {
    if (!user) return alert("login first")
    if (newQty <= 0) return alert("quantity must be greater than 0")
    const res = await fetch("http://localhost:3000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc, quantity: newQty, user_id: user.id })
    }).then(r => r.json())
    if (res.error) alert(res.error)
    else setItems([...items, res])
    setNewName(""); setNewDesc(""); setNewQty(0)
  }


  // delete an item
  async function handleDelete(id) {
    await fetch(`http://localhost:3000/items/${id}`, { method: "DELETE" })
    setItems(items.filter(i => i.id !== id))
    if (selected && selected.id === id) setSelected(null)
  }

  // update an item
  async function handleUpdate() {
    if (!selected) return
    if (newQty <= 0) return alert("quantity must be greater than 0")
    const res = await fetch(`http://localhost:3000/items/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc, quantity: newQty })
    }).then(r => r.json())
    if (res.error) alert(res.error)
    else {
      setItems(items.map(i => (i.id === res.id ? res : i)))
      setSelected(res)
      setEditMode(false)
    }
  }

  // select item to view details
  function viewItem(item) {
    setSelected(item)
    setEditMode(false)
    setNewName(item.name)
    setNewDesc(item.description)
    setNewQty(item.quantity)
  }

  // go back to list
  function backToList() {
    setSelected(null)
    setEditMode(false)
  }


if (selected) {
  // single item view
  return (
    <div>
      <button onClick={backToList}>back</button>
      {editMode ? (
        <div>
          <input value={newName} onChange={e => setNewName(e.target.value)} />
          <input value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          <input type="number" value={newQty} onChange={e => setNewQty(Number(e.target.value))} />
          <button onClick={handleUpdate}>save</button>
          <button onClick={() => setEditMode(false)}>cancel</button>
        </div>
      ) : (
        <div>
          <h2>{selected.name}</h2>
          <p>{selected.description}</p>
          <p>quantity: {selected.quantity}</p>
          {user && selected.user_id === user.id && <button onClick={() => setEditMode(true)}>edit</button>}
          {user && selected.user_id === user.id && <button onClick={() => handleDelete(selected.id)}>delete</button>}
        </div>
      )}
    </div>
  )
}

  // main list view
  return (
    <div>
      <h1>inventory app</h1>

      {!user && <div>
        <button onClick={handleLogin}>login</button>
        <button onClick={handleRegister}>register</button>
      </div>}

      {user && <p>logged in as {user.username}</p>}

      <div className="container">
        <div className="add-item">
          <h2>add new item</h2>
          <input placeholder="name" value={newName} onChange={e => setNewName(e.target.value)} />
          <input placeholder="description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          <input type="number" placeholder="quantity" value={newQty} onChange={e => setNewQty(Number(e.target.value))} />
          <button onClick={handleCreateItem}>create</button>
        </div>

        <div className="item-list">
          <h2>all items</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Quantity</th>
                <th className="actions"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td><b>{item.name}</b></td>
                  <td>{item.description.slice(0, 100)}{item.description.length > 100 ? "..." : ""}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button onClick={() => viewItem(item)}>view</button>
                    {user && item.user_id === user.id && (
                      <>
                        <button onClick={() => { 
                          setSelected(item); 
                          setEditMode(true); 
                          setNewName(item.name); 
                          setNewDesc(item.description); 
                          setNewQty(item.quantity); 
                        }}>edit</button>
                        <button onClick={() => handleDelete(item.id)}>delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App
