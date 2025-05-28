import { useEffect, useState, useRef } from 'react';
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import api from '../services/api';
import { useOutletContext } from 'react-router-dom';

function TodoPage() {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState([]);
  const [editDescription, setEditDescription] = useState("");
  const [isError, setIsError] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const dropdownRefs = useRef({});
  const { isMobile } = useOutletContext ? useOutletContext() : { isMobile: false };

  useEffect(() => {
    api.get("/todo")
      .then(res => setTodos(res.data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutside = Object.values(dropdownRefs.current).every(
        ref => !ref?.contains(event.target)
      );
      if (isOutside) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEnterKey = (e) => {
    if (e.key === 'Enter') addTodo();
  };

  const updateTodoState = (currentTodos, operation, payload) => {
    switch(operation) {
      case 'UPDATE_SINGLE':
        return currentTodos.map(todo => todo._id === payload._id ? payload : todo);
      case 'DELETE':
        return currentTodos.filter(todo => todo._id !== payload);
      case 'ADD':
        return [payload,...currentTodos];
      default:
        return currentTodos;
    }
  };

  const addTodo = () => {
    if (!text.trim() || !priority) {
      setIsError(true);
      setTimeout(() => setIsError(false), 1000);
      return;
    }
    api.post("/todo", { text, description, priority }, { headers: { "Content-Type": "application/json" } })
      .then(res => {
        setTodos(prev => updateTodoState(prev, 'ADD', res.data));
        setText('');
        setDescription('');
        setPriority('');
        setShowInput(false);
      })
      .catch(error => console.error("Error adding todo:", error));
  };

  const editTodo = (id,updatedText, updatedDescription) =>{
    const updates = {text : updatedText, description: updatedDescription}
    api.patch(`edit/${id}`,{updates, options : {new : true}})
    .then(res => {
     setTodos(prev => updateTodoState(prev, 'UPDATE_SINGLE', res.data));
      setEditId(null);
      setEditText("");
      setEditDescription("");
    })
    .catch(err => console.error("Complete error:", err));
  } 

  const toggleComplete = (id) => {
    api.patch(`/complete/${id}`)
      .then(res => setTodos(prev => updateTodoState(prev, 'UPDATE_SINGLE', res.data)))
      .catch(err => console.error("Complete error:", err));
  };

  const deleteFunc = (id) => {
    api.delete(`/delete/${id}`)
      .then(() => setTodos(prev => updateTodoState(prev, 'DELETE', id)))
      .catch(err => console.error("Delete error:", err));
  };

  
  const today = new Date();
  const dateString = today.toLocaleDateString(undefined, {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  
  const completedTodos = todos.filter(t => t.completed);
  const uncompletedTodos = todos.filter(t => !t.completed);
  const completed = completedTodos.length;
  const inProgress = uncompletedTodos.filter(t => !t.notStarted).length;
  const total = todos.length || 1;

  
  const getPriorityClass = (priority) => {
    if (priority === 'Important') return 'text-[#ff6b6b] font-bold';
    if (priority === 'Moderate') return 'text-[#ffb347] font-bold';
    if (priority === 'Optional') return 'text-gray-400 font-bold';
    return 'text-black';
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f8fa] flex flex-col items-center pt-10">
      
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-3xl text-gray-700 font-extrabold">Welcome Back</h1>
        <div className="text-gray-400 text-right">
          {dateString}
        </div>
      </div>

      <div className={`w-full max-w-6xl ${isMobile ? 'flex flex-col gap-6' : 'flex flex-row gap-6'}`}>
        
        <section className={`${isMobile ? 'order-1 w-full' : 'w-1/2'} bg-white rounded-xl shadow p-6`}>
          <div className="flex justify-between items-center mb-4">
            <div className="font-bold text-lg text-[#ff6b6b]">To-Do</div>
            <div
              onClick={() => setShowInput(!showInput)}
              className={`${showInput ? "bg-[#c1bac2]" : "bg-gradient-to-r from-[#FD6A5E] to-[#FF8A7A]"} text-white px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer`}
            >
              <AddIcon /> Add task
            </div>
          </div>
          
          {showInput && (
            <div className="mb-4 flex flex-col gap-2">
              <input
                className={`w-full px-4 py-2 shadow-md border rounded-xl focus:outline-none bg-gray-100 ${isError && !text.trim() ? "border-red-500" : "border-none"}`}
                value={text}
                placeholder="Task title..."
                onChange={e => setText(e.target.value)}
                onKeyDown={handleEnterKey}
                autoFocus
              />
              <input
                className="w-full px-4 py-2 shadow-md border rounded-xl focus:outline-none bg-gray-100 text-sm text-gray-500"
                value={description}
                placeholder="Description..."
                onChange={e => setDescription(e.target.value)}
                onKeyDown={handleEnterKey}
              />

              <div className="flex gap-3 mt-2">
                {['Important', 'Moderate', 'Optional'].map((p) => (
                  <div
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`px-4 py-2 rounded-xl border cursor-pointer select-none font-semibold transition
                      ${priority === p ?
                        (p === 'Important' ? 'bg-[#ff6b6b] text-white border-[#ff6b6b]' :
                         p === 'Moderate' ? 'bg-[#ffb347] text-white border-[#ffb347]' :
                         'bg-gray-400 text-white border-gray-400')
                        : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}
                  >
                    {p}
                  </div>
                ))}
              </div>
              {isError && !priority && <div className="text-xs text-red-500">Please select a priority</div>}
              <div className="flex gap-2 mt-2">
                <div onClick={addTodo} className="bg-[#ff6b6b]  text-white px-4 py-2 rounded-xl flex items-center cursor-pointer ">Add</div>
                <div onClick={() => { setShowInput(false); setText(''); setDescription(''); setPriority(''); }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center cursor-pointer">Cancel</div>
              </div>
            </div>
          )}
          <div className="space-y-4">
                {uncompletedTodos.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">
                    No tasks yet. Click "Add task" to create one!
                  </div>
                ) : (
                  uncompletedTodos.map((todo) => (
                    <div key={todo._id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-start shadow relative" ref={el => dropdownRefs.current[todo._id] = el}>
                <div className="flex items-center gap-3">
                  <div onClick={() => toggleComplete(todo._id)} className="cursor-pointer">
                    {todo.completed ? <RadioButtonUncheckedIcon className="text-green-500" /> : <RadioButtonUncheckedIcon className="text-gray-400" />}
                  </div>
                  <div className="w-full">
                    <div className={`font-semibold break-words whitespace-normal w-full ${todo.completed ? "line-through text-gray-400" : ""}`}>
                      {editId === todo._id ? (
                        <input
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') editTodo(todo._id, editText, editDescription);
                            if (e.key === 'Escape') { setEditText(""); setEditId(null); setEditDescription(""); }
                          }}
                          className="bg-white px-2 py-1 rounded-md border border-gray-300 text-sm w-full"
                          autoFocus
                        />
                      ) : (
                        <span className="break-words whitespace-normal w-full block">{todo.text}</span>
                        
                      )}
                    </div>
                   
                    {editId === todo._id ? (
                      <input
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') editTodo(todo._id, editText, editDescription);
                          if (e.key === 'Escape') { setEditText(""); setEditId(null); setEditDescription(""); }
                        }}
                        className="bg-white px-2 py-1 rounded-md border border-gray-300 text-xs w-full mt-1 text-gray-500"
                      />
                    ) : (
                      todo.description && <div className="text-xs text-gray-500 mt-1 break-words whitespace-normal w-full">{todo.description}</div>
                    )}
                    
                    {todo.priority && (
                      <div className={`text-xs mt-1 ${getPriorityClass(todo.priority)}`}>{todo.priority}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 relative">
                  <MoreHorizIcon
                    onClick={() => setOpenDropdownId(openDropdownId === todo._id ? null : todo._id)}
                    className="w-6 h-6 text-gray-500 cursor-pointer"
                  />
                  {openDropdownId === todo._id && (
                    <div className="absolute right-0 top-7 w-36 bg-white rounded-md shadow-lg z-50">
                      <ul className="text-gray-600 text-sm">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onClick={() => { setEditId(todo._id); setEditText(todo.text); setEditDescription(todo.description || ""); setOpenDropdownId(null); }}>
                          <EditIcon fontSize="small" /> Edit
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onClick={() => { deleteFunc(todo._id); setOpenDropdownId(null); }}>
                          <DeleteOutlineIcon className="text-gray-500" fontSize="small" /> Delete
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
                  ))
                )}
              </div>

        </section>
        
        <div className={`${isMobile ? 'order-2 w-full' : 'w-1/2 flex flex-col gap-6'}`}>
          <section className={`${isMobile ? 'order-2' : ''} bg-white rounded-xl shadow p-6 flex flex-col items-center mb-6`}>
            <div className=" font-bold text-red-400 text-lg mb-4">Task Status</div>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                <span>Completed</span>
                <span className="ml-auto font-bold">{Math.round((completed/total)*100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                <span>In Progress</span>
                <span className="ml-auto font-bold">{Math.round((inProgress/total)*100)}%</span>
              </div>
            </div>
          </section>
          <section className={`${isMobile ? 'order-3' : ''} bg-white rounded-xl shadow p-6`}>
            <div className="font-bold text-lg mb-4 text-[#ff6b6b]">Completed Task</div>
            <div className="flex flex-col gap-4">
             {completedTodos.length === 0 ? (
                  <div className='text-gray-500'>
                    
                    No completed todos.
                  </div>
                ) : (
                  completedTodos.map(todo => (
                    <div key={todo._id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                      <RadioButtonUncheckedIcon
                        className="text-green-500 cursor-pointer"
                        onClick={() => toggleComplete(todo._id)}
                      />
                      <div className="flex-1">
                        <div className="font-semibold break-words whitespace-normal w-full">{todo.text}</div>
                        {todo.description && (
                          <div className="text-xs text-gray-500 mt-1 break-words whitespace-normal w-full">
                            {todo.description}
                          </div>
                        )}
                        {todo.priority && (
                          <div className={`text-xs mt-1 ${getPriorityClass(todo.priority)}`}>
                            {todo.priority}
                          </div>
                        )}
                        <div className="text-xs text-gray-400">Status: Completed</div>
                      </div>
                    </div>
                  ))
                )}

                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  );
                }

export default TodoPage;