import React, { useEffect } from "react";
import {useQuery,useLazyQuery,gql} from "@apollo/client"

const Query_all_Users = gql`
query queryName{
    UserList{
    id
    name
    age
}
}
`

function DisplayData(){
    const {data,loading,error,refetch} = useQuery(Query_all_Users);

    return{
        data,
        loading,
        error,
        refetch
    }
}

export default DisplayData