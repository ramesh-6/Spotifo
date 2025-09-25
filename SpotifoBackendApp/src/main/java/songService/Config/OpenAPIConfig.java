package songService.Config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SpotInfo API")
                        .version("1.0")
                        .description("API for managing songs and music data")
                        .contact(new Contact()
                                .name("Ramesh Kumar M K")
                                .email("mkrk.ramesh006@gmail.com")))
                .servers(Arrays.asList(
                        new Server().url("http://localhost:8085").description("Development server")
                ));
    }
}
