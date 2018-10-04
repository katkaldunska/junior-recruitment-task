# Scripts methods


## init

Basic state of application


## makeRow

add html with one todo

##### Parameters

-   `todo`  {Object} one todo


## updateFinishedTodo

##### Parameters

-   `id`  {string} id of todo note
-   `finished`  {string} state of todo note


## todosApi

Object for communication with API


### makeRequest

This function makes request to API

##### Parameters

-   `method`
-   `url`
-   `payload`

Returns **[Promise]** with api response


### getAllTodos

get all todo notes

Returns **[Promise]** with list of all todos


### getTodoById

get one todo note by id

##### Parameters

-   `id`  {string} - id of todo note

Returns **[Promise]** with one todo note


### createTodo

create todo note

##### Parameters

-   `todo`  {string} content of todo note

Returns **[Promise]** with id of todo note


### updateTodo

updates todo note

##### Parameters

-   `id`  {string} of todo note
-   `todo`  {Object} with data to update

Returns **[Promise]** with updated version of item


### deleteTodo

deletes todo note

##### Parameters

-   `id`  {string} - id of todo note

Returns **[Promise]** with deleted todo note
