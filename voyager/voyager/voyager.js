const introspectionProvider = (introspectionQuery) => fetch('http://localhost:4000', {
    method: 'post',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: introspectionQuery,
    }),
})
    .then((response) => response.json())

// Render <Voyager /> into the body.
GraphQLVoyager.init(document.getElementById('voyager'), {
    introspection: introspectionProvider,
    displayOptions: {
        rootType: 'Query',
        hideRoot: true
    }
});