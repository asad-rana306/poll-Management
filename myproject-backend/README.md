### API Documentation Dependency
I got the Swagger UI dependency from official Maven Repository website and it url is https://mvnrepository.com/artifact/org.springdoc/springdoc-openapi-starter-webmvc-ui/2.8.5.

It Automatically make the UI to run on browser on this URL
http://localhost:8080/swagger-ui/index.html
<h3>The swagger UI dependency </h3>

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.8.5</version>
</dependency>
````
---

<h1>Created APIs</h1>

<h2>1. AuthenticationController</h2>
 
For Registering a user and save credentials in database, it will take username and password and automatically assign id. also it will encypt the password

    http://localhost:8080/api/auth/register

A register user can login by sending credentials (username and password)

    http://localhost:8080/api/auth/login

---

<h2>2. UserController</h2>

When user have to invite other user he needs a list of user so by this he will a list of users which are save in the database

    http://localhost:8080/api/users

---

<h2>3. PollController</h2>

A logged in user can create a poll by adding Tittle, Description and Due Date, and then he also have to add the question

    (POST)
    http://localhost:8080/api/poll/create-poll

After creating the poll, a user can see his created poll in the database after hitting this api
     
    (GET)
    http://localhost:8080/api/poll/created

A user after logged in can check who invited him. this api will fetch all his invition are not solved. if he reponsed then the invitation will be removed from the database

    (GET)
    http://localhost:8080/api/poll/pending

A user can delete the poll by hitting this api
   
     (DELETE)
    http://localhost:8080/api/poll/${id}

A user can invite other by this api
  
     (POST)
    http://localhost:8080/api/poll/${id}/invite

After solving the poll user can submit by this api

    (POST)
    http://localhost:8080/api/poll/${id}/submit

A user can open the poll and get the data to see the questions
     
    (GET)
    http://localhost:8080/api/poll/${id}

A User who created the poll and finish the poll before the due date

    (PUT)
    http://localhost:8080/api/poll/${id}/finish


A user can update the poll at any time

    (PUT)
    http://localhost:8080/api/poll/${id}

----

<h2>Use of AI</h2>
Due to the usage of lombok we added dependency from spring intializr but it was giving error of version so i use AI for that


```
        <lombok.version>1.18.46</lombok.version>


          <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>25</source>
                    <target>25</target>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>${lombok.version}</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>

```
