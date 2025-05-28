import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import RefreshIcon from '@mui/icons-material/Refresh';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const res = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message); 
        setLoading(false);
        navigate('/signin');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setLoading(false);
      setMessage(err.message);
    }
  };
  

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100 text-black">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-semibold mb-4">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="space-y-4">
            <input
              type="username"
              placeholder="Username"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
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
              className=" flex justify-center w-full p-2 hover:cursor-pointer text-white rounded bg-gradient-to-r from-[#FD6A5E] to-[#FF8A7A]"
              disabled={loading}  
              onClick={handleSignup}
            >
              {loading ? (
                <RefreshIcon className="animate-spin"/> 
              ) : (
                "Sign Up"
              )}
            </div>
            already have an account? <Link className="text-blue-500 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-[#7d73e1] after:transition-all after:duration-300" to="/signin">Login </Link>
          </div>
        </form>
        <p className="mt-4 text-center text-red-500">{message}</p>
      </div>
    </div>
  );
};

export default Signup;
