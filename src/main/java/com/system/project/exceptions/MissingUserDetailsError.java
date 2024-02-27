package com.system.project.exceptions;

public class MissingUserDetailsError extends RuntimeException{

    public MissingUserDetailsError(String err){
        super(err);
    }

}
