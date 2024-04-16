import React from "react";
import {useQuery,useLazyQuery,gql} from "@apollo/client"

const Query_all_Movies = gql`
query queryName{
    MovieList{
    id
    name
    
}
}

`


function DisplayMovieData(){
    const {data,loading,error} = useQuery(Query_all_Movies);

    return{
        data,
        loading,
        error
    }
}

export default DisplayMovieData