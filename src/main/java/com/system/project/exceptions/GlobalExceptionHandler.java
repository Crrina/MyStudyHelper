package com.system.project.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    //responds with 409  if the user already exists
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Object> handleUserAlreadyExistsException(UserAlreadyExistsException exception){
        String errorMessage =  exception.getMessage();
        return new ResponseEntity<>(errorMessage, HttpStatus.CONFLICT);
    }

    //responds with 400 if the user details were not indicated in the request
    @ExceptionHandler(MissingUserDetailsError.class)
    public ResponseEntity<Object> handleMissingUserDetails(MissingUserDetailsError exception){
        String errorMessage =  exception.getMessage();
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }


    //responds with 401 if the token is invalid
    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<Object> handleInvalidTokenException(InvalidTokenException exception){
        String errorMessage =  exception.getMessage();
        return new ResponseEntity<>(errorMessage, HttpStatus.UNAUTHORIZED);
    }

    //responds with 401 if the user does not exists
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Object> handleUserNameNotFound(UsernameNotFoundException exception){
        String errorMessage =  exception.getMessage();
        return new ResponseEntity<>(errorMessage, HttpStatus.UNAUTHORIZED);
    }

    //responds with 404, if the note does not exist
    @ExceptionHandler(NoteNotFoundException.class)
    public ResponseEntity<Object> handleNoteNotFoundException(NoteNotFoundException exception){
        return ResponseEntity.notFound().build();
    }




}
