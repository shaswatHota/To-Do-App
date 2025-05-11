import { useNavigate, useLocation } from 'react-router-dom';

const CLink = ({ to, children, className }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = location.pathname === to;

  const handleClick = () => {
    navigate(to);
  };

  return (
    <div
      onClick={handleClick}
      className={className({ isActive })}
    >
      {children}
    </div>
  );
};

export default CLink;
