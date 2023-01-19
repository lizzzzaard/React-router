import React, { useEffect, useState } from "react";
import { Switch, Route, Link, NavLink, useParams, useRouteMatch } from "react-router-dom";
import UserProfile from "./UserProfile";
import { fetchUserWithPosts } from "../api";
import PostList from "./PostList";
import PostsNav from "./PostsNav";
import ErrorMessage from "../common/ErrorMessage";

 export const User = () => {
  const [user, setUser] = useState({ posts: [], loaded:false});
  const [error, setError] = useState(undefined);
  const { userId } = useParams(); 
  const { path, url } = useRouteMatch();

  //console.log(userId)
  //console.log(useParams());
  //console.log(useRouteMatch)
  console.log("path:", useRouteMatch())

  useEffect(() => {
    const abortController = new AbortController();
    fetchUserWithPosts(userId, abortController.signal)
      .then(setUser)
      .catch((error) => {
        if (error.name !== "AbortError") {
          setError(error);
        }
      });

    return () => abortController.abort();
  }, [userId]);

  if (error) {
    return (
      <ErrorMessage error={error}>
        <p>
          <Link to="/">Return Home</Link>
        </p>
      </ErrorMessage>
    );
  }

  /*
    TODO: In the below section, update the links to work appropriately with React Router.(DONE)

    TODO: You'll need to add nested routes below.(DONE)

    The <PostList /> component should show on the following route:
    /users/:userId/posts (DONE)

    The <UserProfile /> component should show on the following route:
    /users/:userId (DONE)
  */

  return (
    <section className="container">
      <PostsNav />
      <div className="border p-4 h-100 d-flex flex-column">
        <h2 className="mb-3">{user.name}</h2>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <NavLink exact to={`${url}`} className="nav-link">Profile</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={`${url}/posts`} className="nav-link">Posts</NavLink>
          </li>
        </ul>

        {user.id ? (
          <div className="p-4 border border-top-0">
            <Switch>
              <Route path={`${path}/posts`}>
                <PostList posts={user.posts} />
              </Route>
              <Route path={path}>
                <UserProfile user={user} />
              </Route>
            </Switch>
          </div>
        ) : (
          <div className="p-4 border border-top-0">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default User;
