import { useEffect, useState, useRef } from 'react';

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';


import api from '../services/api'





function TodoPage() {
  
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState([]);
  const [isError, setIsError] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({}); // hold multiple refs for each todo
 
  

  useEffect(() => {
    api.get("http://localhost:3000/todo")
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
      if (e.key === 'Enter') {
        addTodo();
      }
      };

  // Generic state updater (put this outside your component)
const updateTodoState = (currentTodos, operation, payload) => {
  switch(operation) {
    case 'UPDATE_SINGLE':
      return currentTodos.map(todo => 
        todo._id === payload._id ? payload : todo
      );
    
    case 'DELETE':
      return currentTodos.filter(todo => todo._id !== payload);
      
    case 'ADD':
      return [...currentTodos, payload];
      
    default:
      return currentTodos;
  }
};

  const addTodo = () => {
    if (!text.trim()) {
      setIsError(true);
      setTimeout(() => setIsError(false), 1000);
      return;
    }
   

    api.post("http://localhost:3000/todo", { text }, { headers: { "Content-Type": "application/json" } })
      .then(res => {
        setTodos(prev => updateTodoState(prev, 'ADD', res.data));
        setText('');
      })
      .catch(error => console.error("Error adding todo:", error));
  };

  const editTodo = (id,updatedText) =>{
    const updates = {text : updatedText}
    api.patch(`edit/${id}`,{updates, options : {new : true}})
    .then(res => {
     setTodos(prev => updateTodoState(prev, 'UPDATE_SINGLE', res.data));
      setEditId(null);
      setEditText("");


    })
    .catch(err => console.error("Complete error:", err));

  } 

  const toggleComplete = (id) => {
  api.patch(`/complete/${id}`)
    .then(res => {
      setTodos(prev => updateTodoState(prev, 'UPDATE_SINGLE', res.data));
    })
    .catch(err => console.error("Complete error:", err));
};

const toggleFavorite = (id) => {
  api.patch(`/favorite/${id}`)
    .then(res => {
      setTodos(prev => updateTodoState(prev, 'UPDATE_SINGLE', res.data));
    })
    .catch(err => console.error("Favorite error:", err));
};

const deleteFunc = (id) => {
  api.delete(`/delete/${id}`)
    .then(() => {
      setTodos(prev => updateTodoState(prev, 'DELETE', id));
    })
    .catch(err => console.error("Delete error:", err));
};
  const toggleImportant = (id) => {
    api.patch(`/important/${id}`)
    .then(res => {
      setTodos(prev => updateTodoState(prev, 'UPDATE_SINGLE', res.data));
    })
    .catch(err => console.error("Important error:", err));
  };

  const toggleOptional = (id) => {
    api.patch(`/optional/${id}`)
    .then(res => {
      setTodos(prev => updateTodoState(prev, 'UPDATE_SINGLE', res.data));
    })
    .catch(err => console.error("Optional error:", err));
  };

  return (
    <div className='min-h-screen w-full bg-[#c9cfdb] text-gray-800 '>
      
      
        {/* Main Content */}
      <div className=' flex flex-col items-center pt-10'>
        <h1 className='text-3xl text-gray-400 mb-6 font-[Nunito] font-extrabold'>Todo</h1>

        <div className='flex w-full max-w-xl p-4 rounded-2xl'>
          <input
            className={`w-full px-4 py-2 shadow-md border rounded-xl focus:outline-none bg-gray-100 ${isError ? "border-red-500" : "border-none"}`}
            value={text}
            placeholder="Add something..."
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleEnterKey}
          />
          <div
            onClick={addTodo} 
            className="w-14 h-12 rounded-full flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
          >
            <AddIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {todos.length > 0 && (
          <div className='w-full max-w-lg mt-6 p-4 bg-gray-100 shadow-md rounded-xl'>
            {todos.map((todo) => (
              <div
                key={todo._id}
                className='flex justify-between items-start py-2 border-b border-b-gray-400 last:border-b-0 relative group'
                ref={(el) => (dropdownRefs.current[todo._id] = el)}
              >
                
                <div className='flex items-center'>
                  <div
                    onClick={() => toggleComplete(todo._id)}
                  >
                    <div className='flex items-center flex-wrap gap-2 pr-5'>
                      {todo.completed?<CheckBoxOutlinedIcon/> :  <CheckBoxOutlineBlankOutlinedIcon className='text-gray-700'/>} 
                      
                    </div>
                  </div>
                  <div className="break-words whitespace-normal max-w-full">
                        {editId === todo._id && editText !== "" ? (
                        <div className="flex flex-col gap-1">
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                editTodo(todo._id,editText);
                                 setEditText("");
                                setEditId(null);
                              }
                              if (e.key === 'Escape') {
                                setEditText("");
                                setEditId(null);
                              }
                            }}
                            className='bg-white px-2 py-1 rounded-md border border-gray-300 text-sm w-full'
                            autoFocus
                          />

                         
                         
                         
                        </div>
                      ) : (
                        <div className={`cursor-pointer ${todo.completed ? "line-through text-gray-400" : "text-gray-800"} break-words whitespace-normal max-w-full`}>
                          <span className='pr-5'>{todo.text}</span>
                          <span className='pr-5'>{todo.favorite && <StarIcon className='text-yellow-400' />}</span>
                          {(todo.important && !todo.optional) && (
                            <span className='bg-red-500 px-2.5 py-1 rounded-full border text-white text-xs'>I</span>
                          )}
                          {todo.optional && (
                            <span className='bg-[#A0A0A0] px-2 py-1 rounded-full border text-white text-xs'>O</span>
                          )}
                        </div>
                      )}
                    </div>

                </div>

                <div className='flex items-center relative'>
                  <div className='p-2 relative group inline'>
                    <MoreHorizIcon
                      onClick={() => setOpenDropdownId(openDropdownId === todo._id ? null : todo._id)}
                      className='w-5 h-5 cursor-pointer text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity'
                    />
                  </div>

                  {openDropdownId === todo._id && (
                    <div className='absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-50'>
                      <ul className='text-gray-600 text-sm'>
                        <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2'
                            onClick={()=> {
                              setEditId(todo._id);
                              setEditText(todo.text);
                              setOpenDropdownId(null);
                            }}>
                          <EditIcon fontSize="small" /> Edit
                        </li>
                        <li
                          className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2'
                          onClick={() => toggleFavorite(todo._id)}
                        >
                          {todo.favorite ? <StarIcon className='text-yellow-400' fontSize="small" /> : <StarOutlineIcon fontSize="small" />}
                          Favorite
                        </li>
                        <li
                          className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2'
                          onClick={() => toggleImportant(todo._id)}
                        >
                          <BookIcon className='text-red-400' fontSize="small" /> Important
                        </li>
                        <li
                          className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2'
                          onClick={() => toggleOptional(todo._id)}
                        >
                          <BookIcon className='text-gray-400' fontSize="small" /> Optional
                        </li>
                      </ul>
                    </div>
                  )}

                  <div
                    onClick={() => deleteFunc(todo._id)}
                    className='p-2 rounded-full transition cursor-pointer relative'
                  >
                    <DeleteOutlineIcon className='w-5 h-5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
    
  );
}

export default TodoPage;
