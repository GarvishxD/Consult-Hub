import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ServiceLink({ to, className, children }) {
  const { isAuthenticated } = useAuth();

  const destination = isAuthenticated
    ? to
    : `/login?redirect=${encodeURIComponent(to)}`;

  return (
    <Link to={destination} className={className}>
      {children}
    </Link>
  );
}
