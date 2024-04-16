// It seems like you're trying to use `client.cache.writeQuery` to manually write data to the cache. However, `client.cache.writeQuery` is typically used for reading data from the cache rather than writing to it. 

// To write data to the cache, you generally use mutations or Apollo Client's `cache.modify` method to update existing data in the cache. Here's how you can modify your code to write mutation data to the cache:

// javascript
import { useEffect, useState } from "react";
import DisplayData from "./DisplayData";
import {useQuery, useLazyQuery, gql, useMutation} from "@apollo/client";
import { v4 as uuidv4 } from 'uuid';

import DisplayMovieData from "./DisplayMovieData";

function App() {
  const [movieSearch, setMovieSearched] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState("");

  const {data, loading, refetch} = DisplayData();
  const {data: MovieData, loading: MovieLoading} = DisplayMovieData();

  const GET_USER_LIST = gql`
    query GetUserList {
      UserList {
        id
        name
        age
        username
      }
    }
  `;

  const GET_MOVIE_BY_NAME = gql`
    query Movie($name:String!){
        movie(name:$name){
            name
            yearOfPublication
        }
    }
  `;

  const CREATE_USER_MUTATION = gql`
    mutation CreateUser($user: userInputType!) {
      createUser(user: $user) {
        id
        name
        age
        username
      }
    }
  `;

  const DELETE_USER_MUTATION = gql`
    mutation deleteUser($id: ID!) {
      deleteUser(id: $id) {
        id
        name
      }
    }
  `;

  const [createUserPost, {loading: createUserPostLoading}] = useMutation(CREATE_USER_MUTATION);

  const [deleteUserPost, {loading: deleteUserLoading}] = useMutation(DELETE_USER_MUTATION);

  const [fetchMovie, {data: movieSearchData}] = useLazyQuery(GET_MOVIE_BY_NAME);

  const addUser = () => {
    createUserPost({
      variables: {
        user: {
          id: uuidv4(),
          name,
          username,
          age: Number(age),
          nationality
        }
      },
      update: (cache, {data: {createUser}}) => {
        const existingData = cache.readQuery({query: GET_USER_LIST});
        cache.writeQuery({
          query: GET_USER_LIST,
          data: {UserList: [...existingData.UserList, createUser]}
        });
      }
    });
    refetch();
  };

  const deleteUser = () => {
    deleteUserPost({
      variables: {
        id: deleteId
      },
      update: (cache) => {
        const existingData = cache.readQuery({query: GET_USER_LIST});
        const updatedData = existingData.UserList.filter(user => user.id !== deleteId);
        cache.writeQuery({
          query: GET_USER_LIST,
          data: {UserList: updatedData}
        });
      }
    });
  };

  return (
    <div className="App">
      {loading && <div>Loading...</div>}
      {MovieLoading && <div>Loading Movies...</div>}
      <div>
        {data?.UserList.map((val) => (
          <div key={val.id}>
            <p>{val.id}</p>
            <p>{val.name}</p>
            <p>{val.age}</p>
            <p>{val.username}</p>
          </div>
        ))}
        {MovieData?.MovieList.map((val) => (
          <div key={val.name}>
            <p>{val.name}</p>
          </div>
        ))}
        <input type="text" onChange={(e) => setMovieSearched(e.target.value)} />
        <button onClick={() => fetchMovie({variables: {name: movieSearch}})}>Fetch Movie</button>
        {movieSearchData && <p>{movieSearchData.movie.name}</p>}
        <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)} />
        <input type="text" placeholder="Nationality" onChange={(e) => setNationality(e.target.value.toUpperCase())} />
        <button onClick={addUser}>Add User</button>
        <input type="text" placeholder="Delete User ID" onChange={(e) => setDeleteId(e.target.value)} />
        <button onClick={deleteUser}>Delete User</button>
      </div>
    </div>
  );
}

export default App;


// In this code:

// - We define the mutation queries using `gql`.
// - Inside the `useMutation` hook for creating a user (`CREATE_USER_MUTATION`), we use the `update` option to modify the cache after the mutation is executed. We read the existing data from the cache, add the newly created user to it, and then write the updated data back to the cache.
// - Similarly, in the `useMutation` hook for deleting a user (`DELETE_USER_MUTATION`), we also use the `update` option to modify the cache. We filter out the deleted user from the existing data and then write the updated data back to the cache.