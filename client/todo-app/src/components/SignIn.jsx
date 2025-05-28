import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineLoading } from "react-icons/ai";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
       
        const res = await axios.post("https://todo-app-theta-azure.vercel.app/signin",{email, password});
        const token = res.data.token;
       if(token){
        localStorage.setItem('token', token);
        navigate('/todo');
        console.log(token);
        setMessage('Signin successful');
       }else{
        setMessage('Signin failed , no token found')
       }

       
    }catch(err){
        setMessage("Signin failed")
    }
     finally {
    setLoading(false); 
  }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-center text-2xl text-black font-semibold mb-4 ">Sign In</h2>
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
            <div
              type="submit"
              className="flex justify-center hover:cursor-pointer w-full p-2 text-white rounded bg-gradient-to-r from-[#FD6A5E] to-[#FF8A7A]"
              onClick={handleSignIn}
            >
              {loading ? (
                <AiOutlineLoading  className="animate-spin text-white text-xl mr-2"/> 
              ) : (
                "Sign In"
              )}
             
            </div>
            Don’t have an account?<Link className="text-blue-500 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-[#7d73e1] after:transition-all after:duration-300" to="/signup">register now </Link>
          </div>
        </form>
        <p className="mt-4 text-center text-red-500">{message}</p>
      </div>
    </div>
  );
};

export default Signin;
