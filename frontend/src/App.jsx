import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const API_URL = 'http://localhost:8080/api/todos'

  // 백엔드에서 할 일 목록 가져오기
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Error fetching todos:", err))
  }, [])

  const addTodo = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    const newTodo = {
      text: inputValue,
      completed: false
    }

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    })
    .then(res => res.json())
    .then(savedTodo => {
      setTodos([...todos, savedTodo])
      setInputValue('')
    })
    .catch(err => console.error("Error adding todo:", err))
  }

  const toggleTodo = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'PUT'
    })
    .then(res => res.json())
    .then(updatedTodo => {
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ))
    })
    .catch(err => console.error("Error toggling todo:", err))
  }

  const deleteTodo = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      setTodos(todos.filter(todo => todo.id !== id))
    })
    .catch(err => console.error("Error deleting todo:", err))
  }

  return (
    <div className="todo-container">
      <h1>Fullstack Todo List</h1>
      
      <form onSubmit={addTodo} className="todo-form">
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="할 일을 입력하세요..."
          className="todo-input"
        />
        <button type="submit" className="add-button">추가</button>
      </form>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <span onClick={() => toggleTodo(todo.id)}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)} className="delete-button">삭제</button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="empty-message">할 일이 없습니다. 새로운 일을 추가해보세요!</p>}
    </div>
  )
}

export default App
