package com.system.project;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.security.Key;
import java.util.Base64;

@SpringBootTest
class ProjectApplicationTests {

    @Test
    void contextLoads() {
        Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Generate the key
        String base64Secret = Base64.getEncoder().encodeToString(key.getEncoded()); // Encode as base64
        System.out.println( base64Secret);
    }

}
