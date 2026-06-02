## API Documentation Setup (Swagger UI)

This backend application implements **Springdoc OpenAPI 3** for automatic interactive endpoint documentation.

### Dependency Note
To prevent framework method mismatch loops and standard `500 Internal Server Errors` caused by bare annotation packages, the production runtime relies on the unified WebMVC UI starter package.

Add this declaration to your `pom.xml`:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.8.5</version>
</dependency>