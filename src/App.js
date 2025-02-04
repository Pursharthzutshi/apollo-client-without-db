
import { useEffect, useState } from "react";
import DisplayData from "./DisplayData";
import {useQuery,useLazyQuery,gql, useMutation} from "@apollo/client"
import { v4 as uuidv4 } from 'uuid';

import DisplayMovieData from "./DisplayMovieData";

function App({client}) {
//get by varaible
const getMovieByName = gql`
  query Movie($name:String!){
      movie(name:$name){
          name
          yearOfPublication
      }
  }
  `
  useEffect(()=>{
    console.log(client)
  })

  //create user mutation 

  const createUserMutation = gql`
  mutation CreateUser($user:userInputType!){
    createUser(user:$user){
      id
      name
      
    }
  }
  `
  const deleteUserMutation = gql`
  mutation deleteUser($id: ID!){
    deleteUser(id: $id) {
    id
    name
  }
}`


// client.cache.writeQuery({
//   query:createUserMutation
//   // data{cr}
// // fields:{
// // }   
// })

  
  const [movieSearch,setMovieSearched] = useState("")


  //delete

  const [deleteId,setDeleteId] = useState("");

  //create post states

  const [name,setName] = useState("")
  const [username,setUsername] = useState("")
  const [age,setAge] = useState(0)
  const [nationality,setNationality] = useState("")

  const {data,loading,refetch} = DisplayData()
  const {data:MovieData,loading:MovieLoading,error:MovieError} = DisplayMovieData()

  const [fetchMovie,{data:movieSearchData,error:movieError}] = useLazyQuery(getMovieByName)
  // const [fetchMovie,{data:movieSearchData,error:movieError}] = useLazyQuery(getMovieByName,{
  //   variables:movieSearch
  // })

  // const [createUserPost,{loading:createUserPostLoading}] = useMutation(createUserMutation);
  const [deleteUserPost,{data:deleteUserPostData,loading:deleteUserLoading,error:deleteUserError,refetch:deleteUserRefetch}] = useMutation(deleteUserMutation);

  const [createUserPost,{loading:createUserPostLoading}] = useMutation(createUserMutation);
  
  if(createUserPostLoading){
  console.log(deleteUserPostData)
}
useEffect(()=>{
  console.log(deleteUserPostData)

})
  // useEffect(()=>{
  //   console.log(fetchMovie)
  // })

  if(loading) return <div>spinner</div>
  if(MovieLoading) return <div>spinner</div>

  return (
    <div className="App">
      
      {
        data.UserList.map((val)=>{
          return(
            <div>
              <p>{val.id}</p>
              <p>{val.name}</p>
              <p>{val.age}</p>
              <p>{val.username}</p>

            </div>
          )
        })
      }

{
        MovieData.MovieList.map((val)=>{
          return(
            <div>
           
              <div>
                </div>
              <p>{val.name}</p>
            </div>
          )
        })
      }

<div>
<input type="text" onChange={(e)=>{setMovieSearched(e.target.value)}}/>

<div>Create</div>
{/* 
<input placeholder="name" type="text" onChange={(e)=>{setName(e.target.value)}}/> */}

<input placeholder="name" type="text" onChange={(e)=>{setName(e.target.value)}}/>
<input placeholder="username" type="text" onChange={(e)=>{setUsername(e.target.value)}}/>
<input placeholder="age" type="number" onChange={(e)=>{setAge(e.target.value)}}/>
<input placeholder="Nationality" type="text" onChange={(e)=>{setNationality(e.target.value.toUpperCase())}}/>

<button onClick={()=>{
  createUserPost({
    variables:{
      user:{id:uuidv4(), name,username,age:Number(age),nationality},
    },
  })
  refetch()
}}>add user post</button>

<button onClick={()=>{
  fetchMovie({variables:{
    name:movieSearch
  }})
}}>Fetch Data</button>
  {
    movieSearchData && <p>{movieSearchData.movie.name}</p>
  }
<input type="text" placeholder="select delete id" onChange={(e)=>{setDeleteId(e.target.value)}}/>
<button onClick={()=>{
  deleteUserPost({variables:{
    id:deleteId
  }
})
refetch()

}}>Delete</button>

</div>
    </div>
  );
}

export default App;
