import './App.css';
import {useState, useEffect} from 'react'
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs'

const API = 'http://localhost:5000'

function App() {
  //variavel que vai mudar o nome da tarefa
  const [title, setTitle] = useState('')
  const [time, setTime]  = useState('')
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  // load todo 
  useEffect(()=>{

    const loadData = async () => {
      setLoading(true)

      const res = await fetch(API + '/lista')
      .then((res)=> res.json())
      .then((data) => data)
      .catch((err)=> console.log(err))

      setLoading(false)

      setTodos(res)
    }
    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    }
    //envio backend
    await fetch(API + '/lista', {method: 'POST', 
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json',
    }
  })

    setTodos((prevState) => [...prevState, todo])

    setTitle('')
    setTime('')
  }

  const handleDelete = async (id) => {

    await fetch(API + '/lista/' + id, {
    method: 'DELETE', 
  })
  setTodos((prevState) => prevState.filter((todo)=> todo.id !== id))
  }

  const handleEdit = async(todo) => {

      todo.done = !todo.done

    const data = await fetch(API + '/lista/' + todo.id, {
      method: 'DELETE',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
    },
  })
    setTodos((prevState) => prevState.map((t)=> (t.id === data.id? (t=data): t)))
  
  }

  if(loading){
    return <p> Carregando...</p>
  }

  return (
    <div className="App">
      <div className='todo-header'>
        <h1>Daily Scrum</h1>
      </div>

      <div className='form-todo'>
        <h2>Insira sua tarefa:</h2>

        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor='title'>Qual vai ser a tarefa?</label>
            <input type='text'name= 'title' placeholder='titulo da tarefa' onChange={(e) => setTitle(e.target.value)} value= {title || ''} required></input>
          </div>

          <div className='form-control'>
          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input
              type="text"
              placeholder="Tempo estimado (em horas)"
              onChange={(e) => setTime(e.target.value)}
              value={time}
              required
            />
          </div>
          <input type='submit' value='Criar Tarefa'/>
        </div>
        </form>


      </div>

     <div className='list-todo'>
      <h2>Lista de Tarefas:</h2>
      {todos.length === 0 && <p>Não há tarefas!</p>}
      {todos.map((todo)=> (
        <div className='todo' key={todo.id}>
          <h3 className= {todo.done ? 'todo-done': ''}>{todo.title}</h3>
          <p>Duração: {todo.time}h</p>
          <div className='actions'>
            <span onClick={() => handleEdit(todo)}>
              {!todo.done ?<BsBookmarkCheck /> : <BsBookmarkCheckFill />}
            </span>
            <BsTrash className= 'deletar' onClick = {() => {handleDelete(todo.id)}} />
          </div>
        </div>
      ))}
     </div>

    </div>
  );
}

export default App;
