package com.system.project.service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    //secret key
    private static final String SECRET_KEY = "Secret Key";

    //extract the name from the jwt token
    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);

    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        //extract a specific claim from token
        return claimsResolver.apply(claims);

    }

    //generates a token for a given UserDetails object with default claims.
    public String generateToken(UserDetails userDetails){
        return generateToken(new HashMap<>(), userDetails);
    }

    //validates token if it is not expired and matches the user email
    public boolean isTokenValid(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);

    }

    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }



    private Claims extractAllClaims(String token){
        System.out.println(token);
        return Jwts.parserBuilder().
                setSigningKey(getSignInKey()).
                build().parseClaimsJws(token).getBody();
    }


    // generates a token with additional claims and a username,
    // issuing time, and expiration time, signed with the HS256 algorithm.
    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ){//token has an availability of 3 hours
        return Jwts.builder().setClaims(extraClaims).setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis())).setExpiration(new Date(System.currentTimeMillis() + 3600000 * 3))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256).compact();
    }

    //decodes the secret key from BASE64 and prepares it for signing the token.
    private Key getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
