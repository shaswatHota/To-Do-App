import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import RefreshIcon from '@mui/icons-material/Refresh';

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For redirection

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
        setLoading(false);
        const res = await axios.post("http://localhost:3000/signin",{email, password});
        const token = res.data.token;
       if(token){
        localStorage.setItem('token', token);
        navigate('/todo');
        setMessage('Signin successful');
       }else{
        setMessage('Signin failed , no token found')
       }


    }catch(err){
        setMessage("Signin failed")
    }
    
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-semibold mb-4">SignIn</h2>
        <form onSubmit={handleSignIn}>
          <div className="space-y-4 text-black">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {loading ? (
                <RefreshIcon className="animate-spin"/> // Spinner icon while loading
              ) : (
                "SignIn"
              )}
             
            </button>
            Don’t have an account?<Link className="text-blue-500 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300" to="/signup">register now </Link>
          </div>
        </form>
        <p className="mt-4 text-center text-red-500">{message}</p>
      </div>
    </div>
  );
};

export default Signin;
