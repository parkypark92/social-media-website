import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import styles from "./ViewUsersDashboard.module.css";

export default function ViewUsersDashboard() {
  const [usersPreview, setUsersPreview] = useState([]);
  const { user } = useOutletContext();
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("http://localhost:3000/users", {
        params: { id: user.id },
      });
      setUsersPreview(response.data.users);
    };
    fetchUsers();
  }, [user]);

  return (
    <div>
      <h2>Find some new friends!</h2>
      {usersPreview.map((user) => {
        return (
          <div key={user.id} className={styles.usersList}>
            <li>{user.username}</li>
            <button>Send request</button>
          </div>
        );
      })}
      <Link>View all</Link>
    </div>
  );
}
