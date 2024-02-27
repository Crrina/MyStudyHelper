package com.system.project.service;

import com.system.project.api.AuthenticationRequest;
import com.system.project.api.AuthenticationResponse;
import com.system.project.api.RegistrationRequest;
import com.system.project.exceptions.MissingUserDetailsError;
import com.system.project.exceptions.UserAlreadyExistsException;
import com.system.project.model.Role;
import com.system.project.model.User;
import com.system.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;





    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
                       AuthenticationManager authenticationManager){
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder =  passwordEncoder;
        this.authenticationManager = authenticationManager;
    }


    //Registers a new user in the database, if it does not exist (unique email), returns a jwt token
    public AuthenticationResponse registerUser(RegistrationRequest registrationRequest)  {
       Optional<User> existUser = userRepository.findUserByEmail(registrationRequest.getEmail());
       if(existUser.isPresent()){
           throw new UserAlreadyExistsException("User " + registrationRequest.getEmail() + " already exists!");
       }
        if(registrationRequest.getUserName() == null || registrationRequest.getEmail() == null ||
        registrationRequest.getPassword() == null){
            throw new MissingUserDetailsError("Missing used details");
        }
       User user = User.builder().userName(registrationRequest.getUserName()).
               email(registrationRequest.getEmail()).password(passwordEncoder.encode(registrationRequest.getPassword())).
               role(Role.User).build();
       userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);
       return AuthenticationResponse.builder().token(jwtToken).build();
    }


    //authenticates a user that already exists, checks if the password and email match and returns a jwt token
    public AuthenticationResponse authUser(AuthenticationRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()

                )
        );
        User user = userRepository.findUserByEmail(request.getEmail()).
                orElseThrow(() -> new UsernameNotFoundException("User does not exist"));
        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }




    //returns a list of users
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }




}
