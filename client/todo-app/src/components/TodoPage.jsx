import { useEffect, useState, useRef } from 'react';
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import axios from 'axios';


function TodoPage() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [isError, setIsError] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({}); // hold multiple refs for each todo

  useEffect(() => {
    axios.get("http://localhost:3000/")
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


  const addTodo = () => {
    if (!text.trim()) {
      setIsError(true);
      setTimeout(() => setIsError(false), 1000);
      return;
    }

    axios.post("http://localhost:3000/", { text }, { headers: { "Content-Type": "application/json" } })
      .then(res => {
        setTodos(prev => [...prev, res.data]);
        setText('');
      })
      .catch(error => console.error("Error adding todo:", error));
  };

  const updateTodoList = (res) => {
    if (res && res.data) {
      setTodos(res.data);
    }
  };

  const toggleComplete = (id) => {
    axios.patch(`http://localhost:3000/complete/${id}`)
      .then(updateTodoList)
      .catch(err => console.error("Toggle complete error:", err));
  };

  const deleteFunc = (id) => {
    axios.delete(`http://localhost:3000/${id}`)
      .then(updateTodoList)
      .catch(err => console.error("Delete error:", err));
  };

  const toggleFavorite = (id) => {
    axios.patch(`http://localhost:3000/favorite/${id}`)
      .then(updateTodoList)
      .catch(err => console.error("Favorite toggle error:", err));
  };

  const toggleImportant = (id) => {
    axios.patch(`http://localhost:3000/important/${id}`)
      .then(updateTodoList)
      .catch(err => console.error("Important toggle error:", err));
  };

  const toggleOptional = (id) => {
    axios.patch(`http://localhost:3000/optional/${id}`)
      .then(updateTodoList)
      .catch(err => console.error("Optional toggle error:", err));
  };

  return (
    <div className='grid grid-cols-6 min-h-screen w-screen pb-16 bg-gray-50 text-gray-800 '>
      <div className='col-span-1'></div>

      <div className='col-span-4 flex flex-col items-center pt-10'>
        <h1 className='text-3xl text-gray-400 mb-6 font-[Nunito] font-extrabold'>Todo</h1>

        <div className='flex w-full max-w-xl p-4 rounded-2xl'>
          <input
            className={`w-full px-4 py-2 shadow-md border rounded-xl focus:outline-none bg-gray-100 ${isError ? "border-red-500" : "border-none"}`}
            value={text}
            placeholder="Add something..."
            onChange={(e) => setText(e.target.value)}
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
                key={todo.id}
                className='flex justify-between items-start py-2 border-b border-b-gray-400 last:border-b-0 relative group'
                ref={(el) => (dropdownRefs.current[todo.id] = el)}
              >
              <div className='flex items-center'>
                <div
                  onClick={() => toggleComplete(todo.id)}
                >
                  <div className='flex items-center flex-wrap gap-2 pr-5'>
                    {todo.completed?<CheckBoxOutlinedIcon/> :  <CheckBoxOutlineBlankOutlinedIcon className='text-gray-700'/>} 
                    
                  </div>
                </div>
              <div className={`cursor-pointer ${todo.completed ? "line-through text-gray-400" : "text-gray-800"} break-words whitespace-normal max-w-full`}>
                  <span className='pr-5'>{todo.text}</span>
                   <span className='pr-5'> {todo.favorite && <StarIcon className='text-yellow-400 ' />} </span>
                    {(todo.important && !todo.optional) && (
                      <span className='bg-red-500 px-2.5 py-1 rounded-full border text-white text-xs'>I</span>
                    )}
                    {todo.optional && (
                      <span className='bg-[#A0A0A0] px-2 py-1 rounded-full border text-white text-xs'>O</span>
                    )}
                </div>
                </div>

                <div className='flex items-center relative'>
                  <div className='p-2 relative group inline'>
                    <MoreHorizIcon
                      onClick={() => setOpenDropdownId(openDropdownId === todo.id ? null : todo.id)}
                      className='w-5 h-5 cursor-pointer text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity'
                    />
                  </div>

                  {openDropdownId === todo.id && (
                    <div className='absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-50'>
                      <ul className='text-gray-600 text-sm'>
                        <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2'>
                          <EditIcon fontSize="small" /> Edit
                        </li>
                        <li
                          className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2'
                          onClick={() => toggleFavorite(todo.id)}
                        >
                          {todo.favorite ? <StarIcon className='text-yellow-400' fontSize="small" /> : <StarOutlineIcon fontSize="small" />}
                          Favorite
                        </li>
                        <li
                          className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2'
                          onClick={() => toggleImportant(todo.id)}
                        >
                          <BookIcon className='text-red-400' fontSize="small" /> Important
                        </li>
                        <li
                          className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2'
                          onClick={() => toggleOptional(todo.id)}
                        >
                          <BookIcon className='text-gray-400' fontSize="small" /> Optional
                        </li>
                      </ul>
                    </div>
                  )}

                  <div
                    onClick={() => deleteFunc(todo.id)}
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

      <div className='col-span-1'></div>
    </div>
    
  );
}

export default TodoPage;
