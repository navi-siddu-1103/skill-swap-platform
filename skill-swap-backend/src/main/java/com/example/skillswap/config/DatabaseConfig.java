package com.example.skillswap.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:}")
    private String datasourceUsername;

    @Value("${spring.datasource.password:}")
    private String datasourcePassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = datasourceUrl;
        String username = datasourceUsername;
        String password = datasourcePassword;

        // Check environment variables directly (takes precedence on Render / Docker)
        String envUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (envUrl != null && !envUrl.trim().isEmpty()) {
            url = envUrl.trim();
        }
        String envUser = System.getenv("SPRING_DATASOURCE_USERNAME");
        if (envUser != null && !envUser.trim().isEmpty()) {
            username = envUser.trim();
        }
        String envPass = System.getenv("SPRING_DATASOURCE_PASSWORD");
        if (envPass != null && !envPass.trim().isEmpty()) {
            password = envPass.trim();
        }

        // Check if running in production mode (Docker / Render)
        String activeProfile = System.getenv("SPRING_PROFILES_ACTIVE");
        boolean isProd = "prod".equalsIgnoreCase(activeProfile);

        // If URL is missing, blank, or pointing to unreachable localhost in production:
        if (url == null || url.trim().isEmpty() || (isProd && url.contains("localhost:3306"))) {
            log.info("No remote MySQL URL configured for production. Falling back to embedded H2 database.");
            url = "jdbc:h2:mem:skill_swap_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL";
            username = "sa";
            password = "";
        }

        log.info("Configuring DataSource with URL: {}", sanitizeUrl(url));

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(url);
        config.setUsername(username != null ? username : "");
        config.setPassword(password != null ? password : "");

        if (url.startsWith("jdbc:h2:")) {
            config.setDriverClassName("org.h2.Driver");
        } else if (url.startsWith("jdbc:mysql:")) {
            config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        }

        return new HikariDataSource(config);
    }

    private String sanitizeUrl(String url) {
        if (url == null) return "null";
        return url.replaceAll(":[^/@]+@", ":****@");
    }
}
