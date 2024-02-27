package com.system.project.controller;

import com.system.project.api.AuthenticationRequest;
import com.system.project.api.AuthenticationResponse;
import com.system.project.api.RegistrationRequest;
import com.system.project.model.User;
import com.system.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(path = "user")
public class UserController {



    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    //registers a new user, returns 200 and jwt
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> registerUser(@RequestBody RegistrationRequest registrationRequest){
         AuthenticationResponse result =  userService.registerUser(registrationRequest);
         return ResponseEntity.ok(result);
    }


    //logins a new user, returns 200 and jwt
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody AuthenticationRequest authenticationRequest){
        AuthenticationResponse  result =  userService.authUser(authenticationRequest);
        return ResponseEntity.ok(result);
    }



    @GetMapping("/getAll")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }


}
