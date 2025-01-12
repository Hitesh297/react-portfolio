import { Link } from 'react-router-dom';

function BlogApp() {
    return (
      <div>
        <h1>Contact Page</h1>
        <p>This is the contact page.</p>
        <Link to="/">Go to Home</Link>
      </div>
    );
  }

  export default BlogApp;