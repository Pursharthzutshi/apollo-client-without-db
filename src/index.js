import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApolloProvider,ApolloClient,InMemoryCache,gql  } from "@apollo/client"

const cache = new InMemoryCache({
  typePolicies:{
    Mutation:{
      fields:{
        createUser(existingData = [],incoming){
          console.log(existingData)
          return incoming
        }
      }
    }
  }
})
const client = new ApolloClient({
  uri:"http://localhost:3001/graphql",
  cache,
  connectToDevTools: true, // Enable Apollo DevTools extension

})



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
  <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
